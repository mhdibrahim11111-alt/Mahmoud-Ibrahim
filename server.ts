import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateSmartLocalHint } from './src/utils/smartHints.ts';
import {
  getAdminCodes,
  verifyCode,
  getStoredCodes,
  getStoredCodesPaginated,
  getCodesCounts,
  getAccessCodeRecord,
  generateCode,
  expireCode,
  reactivateCode,
  deleteCode,
  initCodesStorage,
  getCodeProgress,
  updateCodeProgress,
  getStudentWork,
  saveStudentDraft,
  saveStudentSnippet,
  deleteStudentSnippet,
  setStudentFeedback,
} from './server/codeManager.ts';
import type { AccessCodeRecord } from './server/codeManager.ts';

dotenv.config({ override: true });

const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

interface SessionClaims {
  subject: string;
  code?: string;
  role: 'admin' | 'student';
  exp: number;
}

type SessionRequest = express.Request & { session?: SessionClaims; sessionCode?: string };

function rateLimit(maxAttempts: number, windowMs: number, bySession = false) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const sessionSubject = bySession ? (req as SessionRequest).session?.subject : undefined;
    const key = `${sessionSubject ? `session:${sessionSubject}` : `ip:${req.ip}`}:${req.path}`;
    let record = attempts.get(key);
    if (!record || record.resetAt <= now) {
      record = { count: 0, resetAt: now + windowMs };
      attempts.set(key, record);
    }
    if (record.count >= maxAttempts) {
      res.setHeader('Retry-After', Math.ceil((record.resetAt - now) / 1000));
      return res.status(429).json({ success: false, message: 'محاولات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.' });
    }
    record.count += 1;
    next();
  };
}

function sessionSubject(code: string, role: SessionClaims['role']): string {
  return createHmac('sha256', sessionSecret).update(`${role}:${code.trim().toUpperCase()}`).digest('base64url');
}

function createSessionToken(code: string, role: SessionClaims['role']): string {
  const payload = Buffer.from(JSON.stringify({
    subject: sessionSubject(code, role),
    code: role === 'student' ? code.trim().toUpperCase() : undefined,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  } satisfies SessionClaims)).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function readSessionToken(token: string): SessionClaims | null {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  const expected = createHmac('sha256', sessionSecret).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionClaims;
    if (!claims.subject || !['admin', 'student'].includes(claims.role) || claims.exp <= Date.now() / 1000) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await initCodesStorage();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '1mb' }));

  const requireSession = (roles?: SessionClaims['role'][]) => async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const rawToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : '';
    const claims = readSessionToken(rawToken);
    if (!claims || (roles && !roles.includes(claims.role))) {
      return res.status(401).json({ success: false, message: 'انتهت الجلسة أو يلزم تسجيل الدخول.' });
    }

    let sessionCode: string | undefined;
    if (claims.role === 'admin') {
      sessionCode = getAdminCodes().find((code) => sessionSubject(code, 'admin') === claims.subject);
      if (!sessionCode) {
        return res.status(401).json({ success: false, message: 'جلسة المدير لم تعد صالحة.' });
      }
    } else {
      let record: AccessCodeRecord | null = null;
      if (claims.code) {
        record = await getAccessCodeRecord(claims.code);
      }
      if (!record || record.status !== 'active' || (record.expiresAt && Date.parse(record.expiresAt) < Date.now())) {
        return res.status(401).json({ success: false, message: 'كود الاشتراك لم يعد فعالاً.' });
      }
      sessionCode = record.code;
    }

    (req as SessionRequest).session = claims;
    (req as SessionRequest).sessionCode = sessionCode;
    next();
  };

  const requireAdmin = requireSession(['admin']);
  const requireStudent = requireSession(['student']);

  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    console.warn('[Security Notice] SESSION_SECRET is not explicitly configured in environment variables. Using auto-generated secret.');
  }

  const limitCodeAttempts = rateLimit(10, 15 * 60 * 1000);
  const limitHintRequests = rateLimit(60, 60 * 1000);
  const limitHintRequestsPerSession = rateLimit(12, 60 * 1000, true);

  // API endpoint for Smart Hints (التلميحات الذكية)
  app.post('/api/smart-hint', requireSession(), limitHintRequests, limitHintRequestsPerSession, async (req, res) => {
    const { code, error, mode } = req.body;
    if (typeof code !== 'string' || code.length > 30000 || (error !== undefined && (typeof error !== 'string' || error.length > 2000))) {
      return res.status(400).json({ success: false, message: 'حجم الكود أو رسالة الخطأ غير صالح.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const localFallback = generateSmartLocalHint(code, error, mode);
      return res.json({
        success: true,
        ...localFallback,
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `الكود البرمجي المكتوب في المحرر:
\`\`\`${mode || 'javascript'}
${code}
\`\`\`

رسالة الخطأ الظاهرة في المنصة:
${error || 'المستخدم يطلب فحص الكود وتقديم توجيه ذكي لتحسينه أو إصلاحه'}

المطلوب:
قدم تحليلاً ذكياً بالعامية المصرية الودودة جداً بأسلوب كتاب "زكي كود".
- diagnosis: اشرح للدارس سبب الخطأ أو إيه اللي زعل الكمبيوتر ببساطة ومرح.
- hint: تلميح للحل خطوة بخطوة من غير ما تديه الحل الكامل الجاهز مباشرة عشان يفكر.
- proTip: نصيحة ذكية وسريعة للمبرمجين المحترفين عشان يتجنب الخطأ ده.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: `أنت "مدرب البرمجة الذكي" التفاعلي لكتاب ومنصة "زكي كود".
تساعد الطلاب المبتدئين في فهم أخطاء الكود البرمجي (جافاسكريبت، HTML، CSS) بأسلوب العامية المصرية المريح واللطيف والمشجع، بدون تعقيد ولا مصطلحات جافة.
قواعد الرد:
1. استخدم مصطلحات الكتاب المصرية المبهجة: "ماتتخضش! 👻"، "الصندوق والخزنة (let vs const)"، "عصير الدوال"، "الكمبيوتر بينفذ بالملي".
2. لا تعطِ الكود المصحح كاملاً وجاهزاً من أول لحظة حتى لا تحرم الطالب من متعة المحاولة، بل وجهه للسطر والمشكلة خطوة بخطوة.`,          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: {
                type: Type.STRING,
                description: 'إيه اللي زعل الكمبيوتر؟ شرح سبب المشكلة ببساطة وبالمصري',
              },
              hint: {
                type: Type.STRING,
                description: 'تلميح للحل خطوة بخطوة للتوجيه للتفكير والتصحيح',
              },
              proTip: {
                type: Type.STRING,
                description: 'تفصيلة صغيرة.. بس حوار! نصيحة المحترفين لتجنب الخطأ مستقبلاً',
              },
            },
            required: ['diagnosis', 'hint'],
          },
        },
      });

      const rawJson = response.text?.trim() || '';
      let parsed: { diagnosis?: string; hint?: string; proTip?: string } = {};
      try {
        parsed = JSON.parse(rawJson);
      } catch {
        parsed = {};
      }

      if (parsed.diagnosis && parsed.hint) {
        return res.json({
          success: true,
          source: 'gemini',
          diagnosis: parsed.diagnosis,
          hint: parsed.hint,
          proTip: parsed.proTip || 'طريقة المحترفين: دايماً راجع الـ Console خطوة بخطوة.',
          rawText: '',
          isAi: true,
        });
      }

      // If json parsing was empty but text exists
      if (rawJson) {
        return res.json({
          success: true,
          source: 'gemini',
          diagnosis: 'الكمبيوتر محتاج مراجعة سريعة للكود ده',
          hint: rawJson,
          proTip: 'طريقة المحترفين: دايماً اقرأ رسالة الخطأ بهدوء.',
          rawText: rawJson,
          isAi: true,
        });
      }

      const localFallback = generateSmartLocalHint(code, error, mode);
      return res.json({
        success: true,
        ...localFallback,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Gemini API call failed, falling back to local hint:', errorMsg);
      const localFallback = generateSmartLocalHint(code, error, mode);
      return res.json({
        success: true,
        ...localFallback,
      });
    }
  });

  // ==========================================
  // Authentication & Access Code Endpoints
  // ==========================================

  // 1. Verify access code (for both Admin & Students)
  app.post('/api/auth/verify', limitCodeAttempts, async (req, res) => {
    const { code } = req.body;
    if (typeof code !== 'string' || !code.trim() || code.length > 128) {
      return res.status(400).json({ valid: false, message: 'كود التفعيل مطلوب' });
    }
    const result = await verifyCode(code);
    if (!result.valid) return res.json(result);
    return res.json({
      ...result,
      sessionToken: createSessionToken(result.code, result.role),
      code: result.role === 'admin' ? 'ADMIN' : result.code,
    });
  });

  app.get('/api/auth/session', requireSession(), async (req, res) => {
    const session = (req as SessionRequest).session!;
    const student = session.role === 'student' && session.code
      ? await getAccessCodeRecord(session.code)
      : undefined;
    return res.json({
      valid: true,
      role: session.role,
      code: student?.code || 'ADMIN',
      studentName: student?.studentName,
    });
  });

  // 2. Get codes with server-side pagination & filtering (Admin only)
  app.get('/api/admin/codes', requireAdmin, async (req, res) => {
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const pageSize = req.query.pageSize ? Math.max(1, Number(req.query.pageSize)) : 8;
    const filter = (req.query.filter as 'all' | 'active' | 'expired') || 'all';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const cursor = typeof req.query.cursor === 'string' && req.query.cursor ? req.query.cursor : null;

    // Backward-compatibility: if client requests full list explicitly
    if (req.query.all === 'true') {
      const allCodes = await getStoredCodes();
      const counts = await getCodesCounts();
      return res.json({
        success: true,
        adminCodesCount: getAdminCodes().length,
        codes: allCodes,
        totalCount: counts.total,
        activeCount: counts.active,
        expiredCount: counts.expired,
      });
    }

    const paginated = await getStoredCodesPaginated({
      page,
      pageSize,
      filter,
      search,
      cursor,
    });

    return res.json({
      success: true,
      adminCodesCount: getAdminCodes().length,
      ...paginated,
    });
  });

  // 3. Generate a new code (Admin only)
  app.post('/api/admin/codes/generate', requireAdmin, async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { studentName, customCode, durationDays } = req.body;
    if (studentName !== undefined && typeof studentName !== 'string') {
      return res.status(400).json({ success: false, message: 'اسم الطالب غير صالح.' });
    }
    if (customCode !== undefined && customCode !== null && typeof customCode !== 'string') {
      return res.status(400).json({ success: false, message: 'الكود المخصص غير صالح.' });
    }
    const parsedDuration = durationDays === undefined || durationDays === null || durationDays === ''
      ? 0
      : Number(durationDays);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 0 || parsedDuration > 3650) {
      return res.status(400).json({ success: false, message: 'مدة الصلاحية يجب أن تكون من 0 إلى 3650 يوماً.' });
    }
    const result = await generateCode(adminCode, {
      studentName,
      customCode,
      durationDays: parsedDuration,
    });
    return res.status(result.success ? 200 : 400).json(result);
  });

  // 4. Expire a code (Admin only)
  app.post('/api/admin/codes/expire', requireAdmin, async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = await expireCode(adminCode, codeId);
    return res.json(result);
  });

  // 5. Reactivate an expired code (Admin only)
  app.post('/api/admin/codes/reactivate', requireAdmin, async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId, extraDays } = req.body;
    const result = await reactivateCode(adminCode, codeId, extraDays ? Number(extraDays) : undefined);
    return res.json(result);
  });

  // 6. Delete a code permanently (Admin only)
  app.post('/api/admin/codes/delete', requireAdmin, async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = await deleteCode(adminCode, codeId);
    return res.json(result);
  });

  // 6.b Get all student activity and submissions feed with pagination (Admin only)
  app.get('/api/admin/student-activity', requireAdmin, async (req, res) => {
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const pageSize = req.query.pageSize ? Math.max(1, Number(req.query.pageSize)) : 8;
    const filter = (req.query.filter as 'all' | 'active' | 'expired') || 'all';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const cursor = typeof req.query.cursor === 'string' && req.query.cursor ? req.query.cursor : null;

    if (req.query.all === 'true') {
      const allCodes = await getStoredCodes();
      const students = allCodes.map((c) => ({
        id: c.id,
        code: c.code,
        studentName: c.studentName,
        status: c.status,
        usedCount: c.usedCount,
        lastUsedAt: c.lastUsedAt,
        createdAt: c.createdAt,
        feedback: c.feedback || '',
        draftCode: c.draftCode || '',
        savedSnippets: c.savedSnippets || [],
        completedChallenges: c.progress?.completedChallenges || [],
        completedChapters: c.progress?.completedChapters || [],
        completedQuizzes: c.progress?.completedQuizzes || [],
        lastChapterId: c.progress?.lastChapterId || 1,
      }));
      return res.json({ success: true, students, totalCount: students.length });
    }

    const paginated = await getStoredCodesPaginated({
      page,
      pageSize,
      filter,
      search,
      cursor,
    });

    const students = paginated.codes.map((c) => ({
      id: c.id,
      code: c.code,
      studentName: c.studentName,
      status: c.status,
      usedCount: c.usedCount,
      lastUsedAt: c.lastUsedAt,
      createdAt: c.createdAt,
      feedback: c.feedback || '',
      draftCode: c.draftCode || '',
      savedSnippets: c.savedSnippets || [],
      completedChallenges: c.progress?.completedChallenges || [],
      completedChapters: c.progress?.completedChapters || [],
      completedQuizzes: c.progress?.completedQuizzes || [],
      lastChapterId: c.progress?.lastChapterId || 1,
    }));

    return res.json({
      success: true,
      students,
      totalCount: paginated.totalCount,
      activeCount: paginated.activeCount,
      expiredCount: paginated.expiredCount,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
      nextCursor: paginated.nextCursor,
      hasMore: paginated.hasMore,
    });
  });

  // 6.c Send encouragement feedback to student (Admin only)
  app.post('/api/admin/student-feedback', requireAdmin, async (req, res) => {
    const { code, feedback } = req.body;
    if (!code || typeof feedback !== 'string') {
      return res.status(400).json({ success: false, message: 'كود الطالب والرسالة مطلوبان.' });
    }
    const ok = await setStudentFeedback(code, feedback);
    return res.json({
      success: ok,
      message: ok ? 'تم إرسال رسالة التشجيع بنجاح وستظهر للطالب في حسابه! 💌' : 'تعذر حفظ الرسالة.',
    });
  });

  // 7. Get Progress for a specific code
  app.get('/api/progress', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const progress = await getCodeProgress(code);
    const student = await getAccessCodeRecord(code);
    return res.json({
      success: true,
      progress,
      feedback: student?.feedback || '',
    });
  });

  // 8. Update Progress for a specific code
  app.post('/api/progress', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { completedChapters, completedQuizzes, completedChallenges, lastChapterId, challengeCodes } = req.body;
    await updateCodeProgress(code, {
      completedChapters,
      completedQuizzes,
      completedChallenges,
      lastChapterId,
      challengeCodes,
    });
    return res.json({ success: true });
  });

  // 8.b Complete a coding challenge
  app.post('/api/challenge/complete', requireSession(), async (req, res) => {
    const session = (req as SessionRequest).session!;
    const userCode = (req as SessionRequest).sessionCode || session.code;
    const { challengeId } = req.body;
    if (!challengeId || typeof challengeId !== 'string') {
      return res.status(400).json({ success: false, message: 'معرف التحدي مطلوب.' });
    }
    if (!userCode) {
      return res.status(400).json({ success: false, message: 'كود المستخدم غير موجود في الجلسة.' });
    }
    const currentProgress = await getCodeProgress(userCode);
    const existing = Array.isArray(currentProgress.completedChallenges)
      ? [...currentProgress.completedChallenges]
      : [];
    if (!existing.includes(challengeId)) {
      existing.push(challengeId);
      await updateCodeProgress(userCode, { completedChallenges: existing });
    }
    return res.json({ success: true, completedChallenges: existing });
  });

  // 9. Get student saved work (draft + snippets)
  app.get('/api/student-work', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const data = await getStudentWork(code);
    return res.json({ success: true, ...data });
  });

  // 10. Auto-save student playground draft code
  app.post('/api/student-work/draft', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { draftCode } = req.body;
    await saveStudentDraft(code, draftCode || '');
    return res.json({ success: true });
  });

  // 11. Save or update a student snippet
  app.post('/api/student-work/snippet', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { title, code: snippetCode, language, snippetId } = req.body;
    const result = await saveStudentSnippet(code, title || 'مشروع جديد', snippetCode || '', language || 'javascript', snippetId);
    return res.json(result);
  });

  // 12. Delete a student snippet
  app.delete('/api/student-work/snippet/:id', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const snippetId = req.params.id;
    const result = await deleteStudentSnippet(code, snippetId);
    return res.json(result);
  });

  // Serve public assets (manifest, sw.js, icons)
  app.use(express.static(path.resolve(__dirname, 'public')));

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
