import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { secureLog } from './security.ts';

/**
 * Validation options interface specifying optional Zod schemas for body, query, and params.
 */
export interface RequestSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Express middleware factory that validates incoming HTTP requests using Zod schemas.
 * Replaces req.body, req.query, or req.params with sanitized and validated data.
 * Blocks malformed or malicious payloads before they can reach the database or business logic.
 */
export function validateRequest(schemas: RequestSchemas) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        }));

        secureLog.warn(`Request validation failed on ${req.method} ${req.path}:`, JSON.stringify(issues));

        return res.status(400).json({
          success: false,
          message: 'البيانات المرسلة غير صالحة أو غير متوافقة مع متطلبات النظام.',
          errors: issues,
        });
      }

      secureLog.error(`Unexpected error during schema validation on ${req.path}:`, error);
      return res.status(400).json({
        success: false,
        message: 'فشل التحقق من صحة البيانات.',
      });
    }
  };
}

// =========================================================================
// Strict Zod Schemas for Application API Endpoints & Firestore Protection
// =========================================================================

export const verifyCodeSchema = {
  body: z.object({
    code: z
      .string()
      .trim()
      .min(3, 'الكود يجب أن يتكون من 3 أحرف على الأقل')
      .max(64, 'الكود طويل جداً')
      .regex(/^[A-Za-z0-9_-]+$/, 'صيغة كود التفعيل غير صالحة'),
  }),
};

export const smartHintSchema = {
  body: z.object({
    code: z
      .string()
      .max(30000, 'حجم الكود يتجاوز 30 كيلوبايت'),
    error: z
      .string()
      .max(2000, 'نص رسالة الخطأ طويل جداً')
      .optional(),
    mode: z
      .enum(['javascript', 'html', 'css', 'json', 'typescript'])
      .optional()
      .default('javascript'),
  }),
};

export const generateCodeSchema = {
  body: z.object({
    studentName: z
      .string()
      .trim()
      .max(120, 'اسم الطالب يجب ألا يتجاوز 120 حرفاً')
      .optional(),
    customCode: z
      .string()
      .trim()
      .max(64, 'الكود المخصص يجب ألا يتجاوز 64 حرفاً')
      .regex(/^[A-Za-z0-9_-]*$/, 'الكود المخصص يجب أن يحتوي فقط على حروف وأرقام وشرطات')
      .optional()
      .nullable(),
    durationDays: z
      .coerce
      .number()
      .int('مدة الصلاحية يجب أن تكون عدداً صحيحاً')
      .min(0, 'مدة الصلاحية لا يمكن أن تكون سالبة')
      .max(3650, 'الحد الأقصى للصلاحية هو 3650 يوماً')
      .optional()
      .default(0),
  }),
};

export const codeIdBodySchema = {
  body: z.object({
    codeId: z
      .string()
      .trim()
      .min(1, 'معرف الكود لا يمكن أن يكون فارغاً')
      .max(128, 'معرف الكود طويل جداً'),
  }),
};

export const reactivateCodeSchema = {
  body: z.object({
    codeId: z
      .string()
      .trim()
      .min(1, 'معرف الكود لا يمكن أن يكون فارغاً')
      .max(128, 'معرف الكود طويل جداً'),
    extraDays: z
      .coerce
      .number()
      .int('الأيام الإضافية يجب أن تكون عدداً صحيحاً')
      .min(1, 'الأيام الإضافية يجب أن تكون يوماً واحداً على الأقل')
      .max(3650, 'الحد الأقصى هو 3650 يوماً')
      .optional(),
  }),
};

export const rotateAdminCodeSchema = {
  body: z.object({
    newAdminCode: z
      .string()
      .trim()
      .min(8, 'كود المدير الجديد يجب أن يتكون من 8 أحرف على الأقل')
      .max(64, 'كود المدير الجديد يجب ألا يتجاوز 64 حرفاً')
      .regex(/^[A-Za-z0-9_-]+$/, 'كود المدير يجب أن يحتوي فقط على حروف وأرقام إنجليزية وشرطات'),
    revokeOldSessions: z.boolean().optional().default(false),
  }),
};

export const adminPaginationQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(8),
    filter: z.enum(['all', 'active', 'expired']).optional().default('all'),
    search: z.string().trim().max(100).optional(),
    cursor: z.string().trim().max(128).nullable().optional(),
    all: z.enum(['true', 'false']).optional(),
  }),
};

export const studentFeedbackSchema = {
  body: z.object({
    code: z
      .string()
      .trim()
      .min(3, 'كود الطالب غير صحيح')
      .max(64, 'كود الطالب طويل جداً'),
    feedback: z
      .string()
      .trim()
      .min(1, 'رسالة التشجيع لا يمكن أن تكون فارغة')
      .max(2000, 'رسالة التشجيع يجب ألا تتجاوز 2000 حرف'),
  }),
};

const progressKeyRegex = /^(completedChapter|completedQuiz|completedExam|completedChallenge|bookmarkedChapter|chapterNote|chapterChallengeCode|challengeSolution|bookChallengeSolution):[\w.-]{1,128}$/;

export const progressEntrySchema = z.object({
  value: z.union([
    z.boolean(),
    z.string().max(30000, 'حجم القيمة النصية يتجاوز الحد المسموح'),
  ]),
  updatedAt: z
    .number()
    .int()
    .min(0, 'تاريخ التحديث غير صالح'),
});

export const updateProgressSchema = {
  body: z.object({
    lastChapterId: z
      .number()
      .int()
      .min(1, 'معرف الفصل يجب أن يكون 1 على الأقل')
      .max(500, 'معرف الفصل غير صالح')
      .optional(),
    stateEntries: z
      .record(
        z.string().max(128).regex(progressKeyRegex, 'مفتاح حالة التقدم غير صالح'),
        progressEntrySchema
      )
      .refine(
        (entries) => Object.keys(entries).length <= 2500,
        'عدد عناصر التقدم يتجاوز الحد الأقصى المسموح (2500 عنصر)'
      ),
  }),
};

export const completeChallengeSchema = {
  body: z.object({
    challengeId: z
      .string()
      .trim()
      .min(1, 'معرف التحدي لا يمكن أن يكون فارغاً')
      .max(128, 'معرف التحدي طويل جداً')
      .regex(/^[\w.-]+$/, 'صيغة معرف التحدي غير صالحة'),
  }),
};

export const studentDraftSchema = {
  body: z.object({
    draftCode: z
      .string()
      .max(100000, 'حجم المسودة يتجاوز 100 كيلوبايت')
      .optional()
      .default(''),
  }),
};

export const studentSnippetSchema = {
  body: z.object({
    title: z
      .string()
      .trim()
      .max(120, 'عنوان المشروع يجب ألا يتجاوز 120 حرفاً')
      .optional()
      .default('مشروع جديد'),
    code: z
      .string()
      .max(100000, 'حجم الكود يتجاوز 100 كيلوبايت')
      .optional()
      .default(''),
    language: z
      .string()
      .trim()
      .max(32, 'نوع لغة البرمجة غير صالح')
      .optional()
      .default('javascript'),
    snippetId: z
      .string()
      .trim()
      .max(128, 'معرف المشروع غير صالح')
      .optional()
      .nullable(),
  }),
};

export const snippetParamsSchema = {
  params: z.object({
    id: z
      .string()
      .trim()
      .min(1, 'معرف المشروع لا يمكن أن يكون فارغاً')
      .max(128, 'معرف المشروع طويل جداً'),
  }),
};

