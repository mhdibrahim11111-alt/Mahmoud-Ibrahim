import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateSmartLocalHint } from './src/utils/smartHints.ts';
import {
  getAdminCodes,
  addDynamicAdminCode,
  removeDynamicAdminCode,
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
import {
  getSessionSecret,
  createSessionToken,
  readSessionToken,
  revokeAllSessions,
  sessionSubject,
  createRateLimiter,
  enforceRequestIntegrity,
  secureLog,
  SessionClaims,
} from './server/security.ts';
import {
  validateRequest,
  verifyCodeSchema,
  smartHintSchema,
  generateCodeSchema,
  codeIdBodySchema,
  reactivateCodeSchema,
  rotateAdminCodeSchema,
  adminPaginationQuerySchema,
  studentFeedbackSchema,
  updateProgressSchema,
  completeChallengeSchema,
  studentDraftSchema,
  studentSnippetSchema,
  snippetParamsSchema,
} from './server/validation.ts';

dotenv.config({ override: true });

// Production Secrets Verification
if (process.env.NODE_ENV === 'production') {
  try {
    getSessionSecret();
    if (getAdminCodes().length === 0) {
      throw new Error('FATAL: Production requires ADMIN_CODES to be configured as a secret in environment variables.');
    }
  } catch (err: any) {
    secureLog.error('Production Secrets Configuration Error:', err.message);
    throw err;
  }
}

type SessionRequest = express.Request & { session?: SessionClaims; sessionCode?: string };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await initCodesStorage();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Cloud Run / Reverse Proxy Trust Configuration
  app.set('trust proxy', 1);

  // Security Middleware: Content limits, CSRF and Request Integrity
  app.use(express.json({ limit: '1mb' }));
  app.use(enforceRequestIntegrity);

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
        return res.status(401).json({ success: false, message: 'جلسة المدير لم تعد صالحة أو تم تدوير الكود.' });
      }
    } else {
      let record: AccessCodeRecord | null = null;
      if (claims.code) {
        record = await getAccessCodeRecord(claims.code);
      }
      if (!record || record.status !== 'active' || (record.expiresAt && Date.parse(record.expiresAt) < Date.now())) {
        return res.status(401).json({ success: false, message: 'كود الاشتراك لم يعد فعالاً أو انتهت صلاحيته.' });
      }
      sessionCode = record.code;
    }

    (req as SessionRequest).session = claims;
    (req as SessionRequest).sessionCode = sessionCode;
    next();
  };

  const requireAdmin = requireSession(['admin']);
  const requireStudent = requireSession(['student']);

  // Multi-tier Rate limiters
  const limitCodeAttempts = createRateLimiter({
    maxAttempts: 10,
    windowMs: 15 * 60 * 1000,
    prefix: 'auth_verify',
    errorMessage: 'محاولات كثيرة لتأكيد الكود. الرجاء الانتظار 15 دقيقة.',
  });

  const limitHintRequests = createRateLimiter({
    maxAttempts: 60,
    windowMs: 60 * 1000,
    prefix: 'hint_ip',
  });

  const limitHintRequestsPerSession = createRateLimiter({
    maxAttempts: 15,
    windowMs: 60 * 1000,
    bySession: true,
    prefix: 'hint_sess',
    errorMessage: 'طلب تلميحات كثيرة في دقيقة واحدة. تمهل قليلاً لتجربة الحل.',
  });

  const limitProgressSync = createRateLimiter({
    maxAttempts: 120,
    windowMs: 60 * 1000,
    bySession: true,
    prefix: 'progress_sync',
  });

  const isProgressEntryMap = (value: unknown): value is Record<string, { value: boolean | string; updatedAt: number }> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const entries = Object.entries(value);
    if (entries.length > 2500) return false;
    const allowedKey = /^(completedChapter|completedQuiz|completedExam|completedChallenge|bookmarkedChapter|chapterNote|chapterChallengeCode|challengeSolution|bookChallengeSolution):[\w.-]{1,128}$/;
    return entries.every(([key, raw]) => {
      if (!allowedKey.test(key) || !raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
      const [kind, id] = key.split(':', 2);
      if (['completedChapter', 'completedExam', 'bookmarkedChapter'].includes(kind) && !/^\d{1,5}$/.test(id)) return false;
      const entry = raw as { value?: unknown; updatedAt?: unknown };
      return (typeof entry.value === 'boolean' || (typeof entry.value === 'string' && entry.value.length <= 30000)) &&
        typeof entry.updatedAt === 'number' && Number.isFinite(entry.updatedAt) &&
        entry.updatedAt >= 0 && entry.updatedAt <= Date.now() + 5 * 60 * 1000;
    });
  };

  // ==========================================
  // Smart Hints AI Endpoint
  // ==========================================
  app.post(
    '/api/smart-hint',
    requireSession(),
    limitHintRequests,
    limitHintRequestsPerSession,
    validateRequest(smartHintSchema),
    async (req, res) => {
      const { code, error, mode } = req.body;
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
2. لا تعطِ الكود المصحح كاملاً وجاهزاً من أول لحظة حتى لا تحرم الطالب من متعة المحاولة، بل وجهه للسطر والمشكلة خطوة بخطوة.`,
            temperature: 0.4,
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
        secureLog.warn('Gemini API call failed, falling back to local hint:', err instanceof Error ? err.message : String(err));
        const localFallback = generateSmartLocalHint(code, error, mode);
        return res.json({
          success: true,
          ...localFallback,
        });
      }
    }
  );

  // ==========================================
  // Authentication & Access Code Endpoints
  // ==========================================

  // 1. Verify access code (for both Admin & Students)
  app.post('/api/auth/verify', limitCodeAttempts, validateRequest(verifyCodeSchema), async (req, res) => {
    const { code } = req.body;
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

  // ==========================================
  // Admin Endpoints
  // ==========================================

  // 2. Get codes with server-side pagination & filtering (Admin only)
  app.get('/api/admin/codes', requireAdmin, validateRequest(adminPaginationQuerySchema), async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 8;
    const filter = (req.query.filter as 'all' | 'active' | 'expired') || 'all';
    const search = req.query.search as string | undefined;
    const cursor = (req.query.cursor as string) || null;

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

  // Free-tier manual backup (Admin only)
  app.get('/api/admin/backup', requireAdmin, async (_req, res) => {
    const codes = await getStoredCodes();
    res.setHeader('Cache-Control', 'no-store');
    return res.json({
      success: true,
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      codes,
    });
  });

  // 3. Generate a new code (Admin only)
  app.post('/api/admin/codes/generate', requireAdmin, validateRequest(generateCodeSchema), async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { studentName, customCode, durationDays } = req.body;
    const result = await generateCode(adminCode, {
      studentName: studentName ? studentName.trim() : undefined,
      customCode: customCode ? customCode.trim() : undefined,
      durationDays,
    });
    return res.status(result.success ? 200 : 400).json(result);
  });

  // 4. Expire a code (Admin only)
  app.post('/api/admin/codes/expire', requireAdmin, validateRequest(codeIdBodySchema), async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = await expireCode(adminCode, codeId);
    return res.json(result);
  });

  // 5. Reactivate an expired code (Admin only)
  app.post('/api/admin/codes/reactivate', requireAdmin, validateRequest(reactivateCodeSchema), async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId, extraDays } = req.body;
    const result = await reactivateCode(adminCode, codeId, extraDays);
    return res.json(result);
  });

  // 6. Delete a code permanently (Admin only)
  app.post('/api/admin/codes/delete', requireAdmin, validateRequest(codeIdBodySchema), async (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = await deleteCode(adminCode, codeId);
    return res.json(result);
  });

  // 7. Security: Revoke All Active Sessions (Admin only)
  app.post('/api/admin/revoke-all-sessions', requireAdmin, async (_req, res) => {
    revokeAllSessions();
    secureLog.warn('All active sessions were globally revoked by an administrator.');
    return res.json({
      success: true,
      message: 'تم إبطال جميع الجلسات النشطة بنجاح. سيتعين على جميع المستخدمين تسجيل الدخول مجدداً.',
    });
  });

  // 8. Security: Rotate / Add Admin Code (Admin only)
  app.post('/api/admin/rotate-admin-code', requireAdmin, validateRequest(rotateAdminCodeSchema), async (req, res) => {
    const { newAdminCode, revokeOldSessions } = req.body;
    const ok = addDynamicAdminCode(newAdminCode);
    if (!ok) {
      return res.status(400).json({ success: false, message: 'تعذر إضافة كود المدير الجديد.' });
    }
    if (revokeOldSessions === true) {
      revokeAllSessions();
    }
    secureLog.warn('Admin credentials rotated.');
    return res.json({
      success: true,
      message: 'تم تحديث كود المدير بنجاح. احتفظ بالكود الجديد في مكان آمن.',
    });
  });

  // 9. Get student activity feed (Admin only)
  app.get('/api/admin/student-activity', requireAdmin, validateRequest(adminPaginationQuerySchema), async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 8;
    const filter = (req.query.filter as 'all' | 'active' | 'expired') || 'all';
    const search = req.query.search as string | undefined;
    const cursor = (req.query.cursor as string) || null;

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

  // 10. Send encouragement feedback (Admin only)
  app.post('/api/admin/student-feedback', requireAdmin, validateRequest(studentFeedbackSchema), async (req, res) => {
    const { code, feedback } = req.body;
    const ok = await setStudentFeedback(code, feedback);
    return res.json({
      success: ok,
      message: ok ? 'تم إرسال رسالة التشجيع بنجاح وستظهر للطالب في حسابه! 💌' : 'تعذر حفظ الرسالة.',
    });
  });

  // ==========================================
  // Student Data & Progress Endpoints
  // ==========================================

  // 11. Get Progress for a specific code
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

  // 12. Update Progress for a specific code
  app.post('/api/progress', requireSession(), limitProgressSync, validateRequest(updateProgressSchema), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { lastChapterId, stateEntries } = req.body;
    const saved = await updateCodeProgress(code, { lastChapterId, stateEntries });
    return res.status(saved ? 200 : 503).json({ success: saved, message: saved ? undefined : 'تعذر حفظ التقدم الآن.' });
  });

  // 13. Complete a coding challenge
  app.post('/api/challenge/complete', requireSession(), validateRequest(completeChallengeSchema), async (req, res) => {
    const session = (req as SessionRequest).session!;
    const userCode = (req as SessionRequest).sessionCode || session.code;
    const { challengeId } = req.body;
    if (!userCode) {
      return res.status(400).json({ success: false, message: 'كود المستخدم غير موجود في الجلسة.' });
    }
    const saved = await updateCodeProgress(userCode, {
      stateEntries: {
        [`completedChallenge:${challengeId}`]: { value: true, updatedAt: Date.now() },
      },
    });
    if (!saved) return res.status(503).json({ success: false, message: 'تعذر حفظ التحدي الآن.' });
    const progress = await getCodeProgress(userCode);
    return res.json({ success: true, completedChallenges: progress.completedChallenges || [] });
  });

  // 14. Get student saved work (draft + snippets)
  app.get('/api/student-work', requireSession(), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const data = await getStudentWork(code);
    return res.json({ success: true, ...data });
  });

  // 15. Auto-save student playground draft code
  app.post('/api/student-work/draft', requireSession(), validateRequest(studentDraftSchema), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { draftCode } = req.body;
    await saveStudentDraft(code, draftCode || '');
    return res.json({ success: true });
  });

  // 16. Save or update a student snippet
  app.post('/api/student-work/snippet', requireSession(), validateRequest(studentSnippetSchema), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { title, code: snippetCode, language, snippetId } = req.body;
    const result = await saveStudentSnippet(code, title || 'مشروع جديد', snippetCode || '', language || 'javascript', snippetId);
    return res.json(result);
  });

  // 17. Delete a student snippet
  app.delete('/api/student-work/snippet/:id', requireSession(), validateRequest(snippetParamsSchema), async (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const snippetId = req.params.id;
    const result = await deleteStudentSnippet(code, snippetId);
    return res.json(result);
  });

  // Global Error Handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    secureLog.error('Unhandled server error:', err?.message || String(err));
    res.status(500).json({
      success: false,
      message: 'حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    });
  });

  // Serve public assets
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
    secureLog.info(`Server successfully started on port ${PORT}`);
  });
}

startServer();
