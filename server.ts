import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateSmartLocalHint } from './src/utils/smartHints.ts';
import {
  ADMIN_CODES,
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  initCodesStorage();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API endpoint for Smart Hints (التلميحات الذكية)
  app.post('/api/smart-hint', async (req, res) => {
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
  app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'كود التفعيل مطلوب' });
    }
    const result = verifyCode(code);
    return res.json(result);
  });

  // Admin middleware helper
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const adminCode = (req.headers['x-admin-code'] || req.body?.adminCode || '') as string;
    const clean = adminCode.trim().toUpperCase();
    if (!ADMIN_CODES.includes(clean)) {
      return res.status(403).json({ success: false, message: 'غير مصرح: يتطلب صلاحية المدير.' });
    }
    next();
  };

  // 2. Get all codes (Admin only)
  app.get('/api/admin/codes', requireAdmin, (_req, res) => {
    const codes = getStoredCodes();
    return res.json({
      success: true,
      adminCodesCount: ADMIN_CODES.length,
      codes,
    });
  });

  // 3. Generate a new code (Admin only)
  app.post('/api/admin/codes/generate', requireAdmin, (req, res) => {
    const adminCode = (req.headers['x-admin-code'] || req.body?.adminCode) as string;
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
    const adminCode = (req.headers['x-admin-code'] || req.body?.adminCode) as string;
    const { codeId } = req.body;
    const result = expireCode(adminCode, codeId);
    return res.json(result);
  });

  // 5. Reactivate an expired code (Admin only)
  app.post('/api/admin/codes/reactivate', requireAdmin, (req, res) => {
    const adminCode = (req.headers['x-admin-code'] || req.body?.adminCode) as string;
    const { codeId, extraDays } = req.body;
    const result = reactivateCode(adminCode, codeId, extraDays ? Number(extraDays) : undefined);
    return res.json(result);
  });

  // 6. Delete a code permanently (Admin only)
  app.post('/api/admin/codes/delete', requireAdmin, (req, res) => {
    const adminCode = (req.headers['x-admin-code'] || req.body?.adminCode) as string;
    const { codeId } = req.body;
    const result = deleteCode(adminCode, codeId);
    return res.json(result);
  });

  // 7. Get Progress for a specific code
  app.get('/api/progress/:code', (req, res) => {
    const code = req.params.code;
    const progress = getCodeProgress(code);
    return res.json({ success: true, progress });
  });

  // 8. Update Progress for a specific code
  app.post('/api/progress/:code', (req, res) => {
    const code = req.params.code;
    const { completedChapters, completedQuizzes, lastChapterId, challengeCodes } = req.body;
    updateCodeProgress(code, { completedChapters, completedQuizzes, lastChapterId, challengeCodes });
    return res.json({ success: true });
  });

  // 9. Get student saved work (draft + snippets)
  app.get('/api/student-work/:code', (req, res) => {
    const code = req.params.code;
    const data = getStudentWork(code);
    return res.json({ success: true, ...data });
  });

  // 10. Auto-save student playground draft code
  app.post('/api/student-work/:code/draft', (req, res) => {
    const code = req.params.code;
    const { draftCode } = req.body;
    saveStudentDraft(code, draftCode || '');
    return res.json({ success: true });
  });

  // 11. Save or update a student snippet
  app.post('/api/student-work/:code/snippet', (req, res) => {
    const code = req.params.code;
    const { title, code: snippetCode, language, snippetId } = req.body;
    const result = saveStudentSnippet(code, title || 'مشروع جديد', snippetCode || '', language || 'javascript', snippetId);
    return res.json(result);
  });

  // 12. Delete a student snippet
  app.delete('/api/student-work/:code/snippet/:id', (req, res) => {
    const code = req.params.code;
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
