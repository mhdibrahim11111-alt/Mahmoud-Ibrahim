import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const CODES_FILE = path.join(DATA_DIR, 'access_codes.json');

// Exactly 2 Admin Codes for the owner / platform admin
export const ADMIN_CODES = [
  'ADMIN-MASR-2026',
  'OWNER-MASR-77',
];

export interface StudentSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodeProgress {
  completedChapters: number[];
  completedQuizzes: string[];
  lastChapterId: number;
  lastUpdated: string;
  challengeCodes?: Record<string, string>;
}

export interface AccessCodeRecord {
  id: string;
  code: string;
  studentName: string;
  createdAt: string;
  expiresAt: string | null; // ISO string or null
  status: 'active' | 'expired' | 'revoked';
  usedCount: number;
  lastUsedAt: string | null;
  progress?: CodeProgress;
  draftCode?: string;
  savedSnippets?: StudentSnippet[];
}

// Ensure data folder and file exist with initial seed codes
export function initCodesStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(CODES_FILE)) {
      const initialCodes: AccessCodeRecord[] = [
        {
          id: 'seed-std-01',
          code: 'MASR-VIP',
          studentName: 'مشترك مميز تجريبي',
          createdAt: new Date().toISOString(),
          expiresAt: null,
          status: 'active',
          usedCount: 0,
          lastUsedAt: null,
        },
        {
          id: 'seed-std-02',
          code: 'STUDENT-2026',
          studentName: 'دفعة 2026',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          usedCount: 0,
          lastUsedAt: null,
        },
      ];
      fs.writeFileSync(CODES_FILE, JSON.stringify(initialCodes, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Failed to init codes storage:', err);
  }
}

export function getStoredCodes(): AccessCodeRecord[] {
  try {
    initCodesStorage();
    const raw = fs.readFileSync(CODES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading access codes file:', err);
    return [];
  }
}

export function saveStoredCodes(codes: AccessCodeRecord[]): boolean {
  try {
    initCodesStorage();
    fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing access codes file:', err);
    return false;
  }
}

export function verifyCode(inputCode: string): {
  valid: boolean;
  role: 'admin' | 'student';
  code: string;
  studentName?: string;
  expiresAt?: string | null;
  message: string;
} {
  const clean = inputCode.trim().toUpperCase();
  if (!clean) {
    return { valid: false, role: 'student', code: '', message: 'من فضلك اكتب الكود أولاً.' };
  }

  // 1. Check if it's one of the 2 Admin Codes
  if (ADMIN_CODES.includes(clean)) {
    return {
      valid: true,
      role: 'admin',
      code: clean,
      message: 'أهلاً بك يا مدير المنصة 👑',
    };
  }

  // 2. Check student codes
  const codes = getStoredCodes();
  const foundIndex = codes.findIndex((c) => c.code.toUpperCase() === clean);

  if (foundIndex === -1) {
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'كود التفعيل غير صحيح أو غير مسجل في النظام ❌',
    };
  }

  const record = codes[foundIndex];

  // Check if status is revoked or expired
  if (record.status === 'revoked') {
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'عذراً، هذا الكود تم إلغاء تفعيله من قبل الإدارة.',
    };
  }

  if (record.status === 'expired') {
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'عذراً، هذا الكود منتهي الصلاحية.',
    };
  }

  // Check expiration date
  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
    // Auto-update status to expired
    record.status = 'expired';
    codes[foundIndex] = record;
    saveStoredCodes(codes);
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'عذراً، انتهت فترة صلاحية هذا الكود.',
    };
  }

  // Mark usage
  record.usedCount = (record.usedCount || 0) + 1;
  record.lastUsedAt = new Date().toISOString();
  codes[foundIndex] = record;
  saveStoredCodes(codes);

  return {
    valid: true,
    role: 'student',
    code: record.code,
    studentName: record.studentName,
    expiresAt: record.expiresAt,
    message: `أهلاً بك ${record.studentName || ''}! تم التفعيل بنجاح 🎉`,
  };
}

export function generateCode(
  adminCode: string,
  options: {
    studentName?: string;
    customCode?: string;
    durationDays?: number | null; // null or 0 for forever
  }
): { success: boolean; code?: AccessCodeRecord; message: string } {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!ADMIN_CODES.includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بتوليد الأكواد (يتطلب صلاحية المدير).' };
  }

  const codes = getStoredCodes();
  let codeStr = '';

  if (options.customCode && options.customCode.trim()) {
    codeStr = options.customCode.trim().toUpperCase();
    if (codeStr.length < 3) {
      return { success: false, message: 'يجب أن يكون الكود 3 أحرف على الأقل.' };
    }
    if (ADMIN_CODES.includes(codeStr) || codes.some((c) => c.code.toUpperCase() === codeStr)) {
      return { success: false, message: 'هذا الكود مستخدم بالفعل، اختر كوداً آخر.' };
    }
  } else {
    // Generate random code
    const prefix = 'STD';
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codeStr = `${prefix}-${rand}`;
  }

  let expiresAt: string | null = null;
  if (options.durationDays && options.durationDays > 0) {
    expiresAt = new Date(Date.now() + options.durationDays * 24 * 60 * 60 * 1000).toISOString();
  }

  const newRecord: AccessCodeRecord = {
    id: `code-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: codeStr,
    studentName: options.studentName?.trim() || 'طالب جديد',
    createdAt: new Date().toISOString(),
    expiresAt,
    status: 'active',
    usedCount: 0,
    lastUsedAt: null,
  };

  codes.unshift(newRecord);
  saveStoredCodes(codes);

  return { success: true, code: newRecord, message: 'تم توليد الكود بنجاح!' };
}

export function expireCode(
  adminCode: string,
  codeId: string
): { success: boolean; message: string } {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!ADMIN_CODES.includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const codes = getStoredCodes();
  const target = codes.find((c) => c.id === codeId || c.code.toUpperCase() === codeId.toUpperCase());
  if (!target) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  target.status = 'expired';
  saveStoredCodes(codes);
  return { success: true, message: `تم إنهاء صلاحية الكود ${target.code} بنجاح.` };
}

export function reactivateCode(
  adminCode: string,
  codeId: string,
  extraDays?: number
): { success: boolean; message: string } {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!ADMIN_CODES.includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const codes = getStoredCodes();
  const target = codes.find((c) => c.id === codeId || c.code.toUpperCase() === codeId.toUpperCase());
  if (!target) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  target.status = 'active';
  if (extraDays && extraDays > 0) {
    target.expiresAt = new Date(Date.now() + extraDays * 24 * 60 * 60 * 1000).toISOString();
  } else if (extraDays === 0) {
    target.expiresAt = null;
  }
  saveStoredCodes(codes);
  return { success: true, message: `تمت إعادة تفعيل الكود ${target.code} بنجاح.` };
}

export function deleteCode(
  adminCode: string,
  codeId: string
): { success: boolean; message: string } {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!ADMIN_CODES.includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const codes = getStoredCodes();
  const filtered = codes.filter((c) => c.id !== codeId && c.code.toUpperCase() !== codeId.toUpperCase());
  if (filtered.length === codes.length) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  saveStoredCodes(filtered);
  return { success: true, message: 'تم حذف الكود نهائياً من قاعدة البيانات.' };
}

export function getCodeProgress(code: string): CodeProgress {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const found = codes.find((c) => c.code.toUpperCase() === clean);
  if (found && found.progress) {
    return {
      ...found.progress,
      challengeCodes: found.progress.challengeCodes || {},
    };
  }
  return {
    completedChapters: [],
    completedQuizzes: [],
    lastChapterId: 1,
    challengeCodes: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function updateCodeProgress(
  code: string,
  progress: Partial<CodeProgress>
): boolean {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const foundIndex = codes.findIndex((c) => c.code.toUpperCase() === clean);
  if (foundIndex === -1) {
    return false;
  }

  const existing = codes[foundIndex].progress || {
    completedChapters: [],
    completedQuizzes: [],
    lastChapterId: 1,
    challengeCodes: {},
    lastUpdated: new Date().toISOString(),
  };

  codes[foundIndex].progress = {
    completedChapters: progress.completedChapters ?? existing.completedChapters,
    completedQuizzes: progress.completedQuizzes ?? existing.completedQuizzes,
    lastChapterId: progress.lastChapterId ?? existing.lastChapterId,
    challengeCodes: progress.challengeCodes ?? existing.challengeCodes ?? {},
    lastUpdated: new Date().toISOString(),
  };

  return saveStoredCodes(codes);
}

export function getStudentWork(code: string): {
  draftCode: string;
  snippets: StudentSnippet[];
} {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const found = codes.find((c) => c.code.toUpperCase() === clean);
  if (!found) {
    return { draftCode: '', snippets: [] };
  }
  return {
    draftCode: found.draftCode || '',
    snippets: found.savedSnippets || [],
  };
}

export function saveStudentDraft(code: string, draftCode: string): boolean {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const foundIndex = codes.findIndex((c) => c.code.toUpperCase() === clean);
  if (foundIndex === -1) {
    return false;
  }
  codes[foundIndex].draftCode = draftCode;
  return saveStoredCodes(codes);
}

export function saveStudentSnippet(
  code: string,
  title: string,
  snippetCode: string,
  language: string = 'javascript',
  snippetId?: string
): { success: boolean; snippet?: StudentSnippet; message: string } {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const foundIndex = codes.findIndex((c) => c.code.toUpperCase() === clean);
  if (foundIndex === -1) {
    return { success: false, message: 'الكود غير مسجل' };
  }

  const existingList = codes[foundIndex].savedSnippets || [];
  const now = new Date().toISOString();

  if (snippetId) {
    const existingIndex = existingList.findIndex((s) => s.id === snippetId);
    if (existingIndex !== -1) {
      existingList[existingIndex].title = title;
      existingList[existingIndex].code = snippetCode;
      existingList[existingIndex].language = language;
      existingList[existingIndex].updatedAt = now;
      codes[foundIndex].savedSnippets = existingList;
      saveStoredCodes(codes);
      return { success: true, snippet: existingList[existingIndex], message: 'تم تحديث الكود بنجاح!' };
    }
  }

  const newSnippet: StudentSnippet = {
    id: 'snip-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    title: title.trim() || 'كود بدون عنوان',
    code: snippetCode,
    language,
    createdAt: now,
    updatedAt: now,
  };

  existingList.unshift(newSnippet);
  codes[foundIndex].savedSnippets = existingList;
  saveStoredCodes(codes);
  return { success: true, snippet: newSnippet, message: 'تم حفظ الكود في حسابك بنجاح! 💾' };
}

export function deleteStudentSnippet(
  code: string,
  snippetId: string
): { success: boolean; message: string } {
  const clean = code.trim().toUpperCase();
  const codes = getStoredCodes();
  const foundIndex = codes.findIndex((c) => c.code.toUpperCase() === clean);
  if (foundIndex === -1) {
    return { success: false, message: 'الكود غير مسجل' };
  }

  const existingList = codes[foundIndex].savedSnippets || [];
  const filtered = existingList.filter((s) => s.id !== snippetId);
  codes[foundIndex].savedSnippets = filtered;
  saveStoredCodes(codes);
  return { success: true, message: 'تم حذف الكود بنجاح.' };
}


