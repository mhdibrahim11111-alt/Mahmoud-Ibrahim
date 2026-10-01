import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateSmartLocalHint } from './src/utils/smartHints.ts';
import {
  getAdminCodes,
  verifyCode,
  getStoredCodes,
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
} from './server/codeManager.ts';

dotenv.config();

const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

interface SessionClaims {
  subject: string;
  role: 'admin' | 'student';
  exp: number;
}

type SessionRequest = express.Request & { session?: SessionClaims; sessionCode?: string };

function rateLimit(maxAttempts: number, windowMs: number) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
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
  initCodesStorage();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '1mb' }));

  const requireSession = (roles?: SessionClaims['role'][]) => (
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
      const record = getStoredCodes().find((item) => sessionSubject(item.code.toUpperCase(), 'student') === claims.subject);
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
    throw new Error('SESSION_SECRET must be configured in production.');
  }

  const limitCodeAttempts = rateLimit(10, 15 * 60 * 1000);
  const limitHintRequests = rateLimit(30, 60 * 1000);

  // API endpoint for Smart Hints (التلميحات الذكية)
  app.post('/api/smart-hint', limitHintRequests, async (req, res) => {
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
      const ai = new GoogleGenAI();
      const prompt = `الكود المكتوب:
\`\`\`${mode || 'javascript'}
${code}
\`\`\`

رسالة الخطأ الظاهرة:
${error || 'المستخدم يطلب تلميحاً ذكياً لفهم أو تحسين الكود الخاص به'}

المطلوب:
قدم تحليلاً وتلميحاً ذكياً بالعامية المصرية الودودة والبسيطة، متماشياً مع روح كتاب "كود بالمصري".
لا تعطِ الكود الكامل النهائي مباشرة، بل ساعد المتعلم على التفكير واكتشاف المشكلة وتصحيحها بنفسه.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `أنت المساعد الذكي التفاعلي لمنصة وكتاب "كود بالمصري".
وظيفتك مساعدة المبتدئين في فهم أخطاء الكود البرمجي (جافاسكريبت، HTML، CSS) بأسلوب العامية المصرية المريح واللطيف والمشجع، بدون تعقيد ولا مصطلحات جافة.
قواعد الرد:
1. اتكلم بمصطلحات الكتاب المصرية الشهيرة مثل: "ماتتخضش! 👻"، "تفصيلة صغيرة.. بس حوار! 🔍"، "الصندوق والخزنة (let vs const)"، "عصير الدوال".
2. لا تعطِ الكود المصحح كاملاً وجاهزاً من أول لحظة حتى لا تحرم الطالب من متعة المحاولة، بل وجهه للسطر والمشكلة خطوة بخطوة.
3. نسق الرد في 3 فقرات واضحة:
- 👻 إيه اللي زعل الكمبيوتر؟ (شرح سبب الخطأ ببساطة شديدة)
- 💡 تلميح للحل خطوة بخطوة (إيه اللي محتاج يعمله)
- 🔍 تفصيلة صغيرة بس حوار! (نصيحة سريعة لتجنب الخطأ ده دايماً)
4. اجعل الإجابة مركزة ومختصرة ومبهجة.`,
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      });

      return res.json({
        success: true,
        hint: response.text || 'جرب تبص على السطر وتراجع كتابة المتغيرات بدقة يا بطل!',
        isAi: true,
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
  app.post('/api/auth/verify', limitCodeAttempts, (req, res) => {
    const { code } = req.body;
    if (typeof code !== 'string' || !code.trim() || code.length > 128) {
      return res.status(400).json({ valid: false, message: 'كود التفعيل مطلوب' });
    }
    const result = verifyCode(code);
    if (!result.valid) return res.json(result);
    return res.json({
      ...result,
      sessionToken: createSessionToken(result.code, result.role),
      code: result.role === 'admin' ? 'ADMIN' : result.code,
    });
  });

  app.get('/api/auth/session', requireSession(), (req, res) => {
    const session = (req as SessionRequest).session!;
    const student = session.role === 'student'
      ? getStoredCodes().find((record) => sessionSubject(record.code.toUpperCase(), 'student') === session.subject)
      : undefined;
    return res.json({
      valid: true,
      role: session.role,
      code: student?.code || 'ADMIN',
      studentName: student?.studentName,
    });
  });

  // 2. Get all codes (Admin only)
  app.get('/api/admin/codes', requireAdmin, (_req, res) => {
    const codes = getStoredCodes();
    return res.json({
      success: true,
      adminCodesCount: getAdminCodes().length,
      codes,
    });
  });

  // 3. Generate a new code (Admin only)
  app.post('/api/admin/codes/generate', requireAdmin, (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { studentName, customCode, durationDays } = req.body;
    const result = generateCode(adminCode, {
      studentName,
      customCode,
      durationDays: durationDays !== undefined ? Number(durationDays) : null,
    });
    return res.json(result);
  });

  // 4. Expire a code (Admin only)
  app.post('/api/admin/codes/expire', requireAdmin, (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = expireCode(adminCode, codeId);
    return res.json(result);
  });

  // 5. Reactivate an expired code (Admin only)
  app.post('/api/admin/codes/reactivate', requireAdmin, (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId, extraDays } = req.body;
    const result = reactivateCode(adminCode, codeId, extraDays ? Number(extraDays) : undefined);
    return res.json(result);
  });

  // 6. Delete a code permanently (Admin only)
  app.post('/api/admin/codes/delete', requireAdmin, (req, res) => {
    const adminCode = (req as SessionRequest).sessionCode!;
    const { codeId } = req.body;
    const result = deleteCode(adminCode, codeId);
    return res.json(result);
  });

  // 7. Get Progress for a specific code
  app.get('/api/progress', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const progress = getCodeProgress(code);
    return res.json({ success: true, progress });
  });

  // 8. Update Progress for a specific code
  app.post('/api/progress', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { completedChapters, completedQuizzes, lastChapterId, challengeCodes } = req.body;
    updateCodeProgress(code, { completedChapters, completedQuizzes, lastChapterId, challengeCodes });
    return res.json({ success: true });
  });

  // 9. Get student saved work (draft + snippets)
  app.get('/api/student-work', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const data = getStudentWork(code);
    return res.json({ success: true, ...data });
  });

  // 10. Auto-save student playground draft code
  app.post('/api/student-work/draft', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { draftCode } = req.body;
    saveStudentDraft(code, draftCode || '');
    return res.json({ success: true });
  });

  // 11. Save or update a student snippet
  app.post('/api/student-work/snippet', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const { title, code: snippetCode, language, snippetId } = req.body;
    const result = saveStudentSnippet(code, title || 'مشروع جديد', snippetCode || '', language || 'javascript', snippetId);
    return res.json(result);
  });

  // 12. Delete a student snippet
  app.delete('/api/student-work/snippet/:id', requireStudent, (req, res) => {
    const code = (req as SessionRequest).sessionCode!;
    const snippetId = req.params.id;
    const result = deleteStudentSnippet(code, snippetId);
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
