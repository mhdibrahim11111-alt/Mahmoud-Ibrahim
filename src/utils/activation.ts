import { saveLocalProgressEntry } from './progressSync';
import type { ProgressEntries } from './progressSync';

/**
 * Client-side Access & Activation Service.
 * Connects to the backend server to verify codes, check expiration, and manage codes.
 */

const STORAGE_KEY = 'codemasr_session_token';
const CODE_KEY = 'codemasr_active_code';
const ROLE_KEY = 'codemasr_user_role';
const STUDENT_NAME_KEY = 'codemasr_student_name';

export interface CodeProgress {
  completedChapters: number[];
  completedQuizzes: string[];
  lastChapterId: number;
  lastUpdated?: string;
  challengeCodes?: Record<string, string>;
  completedChallenges?: string[];
  completedExamParts?: number[];
  bookmarkedChapterIds?: number[];
  chapterNotes?: Record<string, string>;
  stateEntries?: ProgressEntries;
}

export interface CodeRecord {
  id: string;
  code: string;
  role?: 'master' | 'admin' | 'teacher' | 'student';
  studentName: string;
  createdAt: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
  usedCount: number;
  lastUsedAt: string | null;
  teacherCode?: string;
  maxStudentsLimit?: number;
  progress?: CodeProgress;
  draftCode?: string;
  savedSnippets?: StudentSnippet[];
  feedback?: string;
}

export interface ActivationState {
  activated: boolean;
  role: 'master' | 'admin' | 'teacher' | 'student';
  code?: string;
  studentName?: string;
}

/**
 * Check if the device already has an activated session
 */
export function isDeviceActivated(): ActivationState {
  try {
    // Remove the legacy value, which stored the raw activation code as a token.
    localStorage.removeItem('codemasr_activation_token');
    const savedToken = localStorage.getItem(STORAGE_KEY);
    const savedCode = localStorage.getItem(CODE_KEY);
    const savedRole = (localStorage.getItem(ROLE_KEY) as 'master' | 'admin' | 'teacher' | 'student') || 'student';
    const studentName = localStorage.getItem(STUDENT_NAME_KEY) || undefined;

    if (!savedToken || !savedCode) {
      return { activated: false, role: 'student' };
    }

    return {
      activated: true,
      role: savedRole,
      code: savedCode.trim().toUpperCase(),
      studentName,
    };
  } catch {
    return { activated: false, role: 'student' };
  }
}

export async function validateSavedSession(): Promise<ActivationState> {
  const saved = isDeviceActivated();
  if (!saved.activated) return saved;
  try {
    const token = localStorage.getItem(STORAGE_KEY) || '';
    if (!token) {
      lockPlatform();
      return { activated: false, role: 'student' };
    }

    const res = await fetch('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      lockPlatform();
      return { activated: false, role: 'student' };
    }

    const data = await res.json();
    if (res.ok && data.valid) {
      const resolvedRole: 'master' | 'admin' | 'teacher' | 'student' =
        data.role || saved.role || 'student';
      const resolvedCode: string = (data.code || saved.code || '').trim().toUpperCase();
      const resolvedStudentName: string | undefined = data.studentName || saved.studentName || undefined;

      localStorage.setItem(ROLE_KEY, resolvedRole);
      if (resolvedCode) {
        localStorage.setItem(CODE_KEY, resolvedCode);
      }
      if (resolvedStudentName) {
        localStorage.setItem(STUDENT_NAME_KEY, resolvedStudentName);
      }

      return {
        activated: true,
        role: resolvedRole,
        code: resolvedCode,
        studentName: resolvedStudentName,
      };
    }

    if (data && data.valid === false) {
      lockPlatform();
      return { activated: false, role: 'student' };
    }
  } catch (err) {
    // On transient network failure, preserve the existing saved credentials so the user is not abruptly logged out
    console.warn('Session validation network error, falling back to cached session:', err);
    return saved;
  }

  return saved;
}

/**
 * Verify code with the server
 */
export async function activateWithCode(inputCode: string): Promise<{
  success: boolean;
  role: 'master' | 'admin' | 'teacher' | 'student';
  code?: string;
  message: string;
  studentName?: string;
}> {
  const clean = inputCode.trim().toUpperCase();
  if (!clean) {
    return { success: false, role: 'student', message: 'من فضلك اكتب كود التفعيل أولاً.' };
  }

  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: clean }),
    });

    const data = await res.json();

    if (data.valid && data.sessionToken) {
      localStorage.setItem(STORAGE_KEY, data.sessionToken);
      const sessionCode = data.code || clean;
      localStorage.setItem(CODE_KEY, sessionCode);
      localStorage.setItem(ROLE_KEY, data.role);
      if (data.studentName) {
        localStorage.setItem(STUDENT_NAME_KEY, data.studentName);
      } else {
        localStorage.removeItem(STUDENT_NAME_KEY);
      }

      return {
        success: true,
        role: data.role,
        code: sessionCode,
        message: data.message,
        studentName: data.studentName,
      };
    }

    return {
      success: false,
      role: 'student',
      message: data.message || 'كود غير صحيح أو منتهي الصلاحية ❌',
    };
  } catch (err) {
    console.error('Network verification failed:', err);
    return {
      success: false,
      role: 'student',
      message: 'تعذر الاتصال بالخادم للتحقق من الكود. تأكد من اتصال الإنترنت.',
    };
  }
}

/**
 * Lock platform / Logout
 */
export function lockPlatform(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CODE_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(STUDENT_NAME_KEY);
    localStorage.removeItem('codemasr_completed_chapters');
    localStorage.removeItem('codemasr_completed_quizzes');
    localStorage.removeItem('codemasr_access_code');

    // Clean up any guest keys or unassociated challenge data to prevent leaking across accounts
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.includes('_GUEST') || k.includes('codemasr_access_code'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error(e);
  }
}

export function sessionHeaders(json = false): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEY) || '';
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==========================================
// Admin APIs (Only called when role is admin)
// ==========================================

export interface FetchCodesOptions {
  page?: number;
  pageSize?: number;
  filter?: 'all' | 'active' | 'expired';
  roleFilter?: 'all' | 'teacher' | 'student';
  search?: string;
  cursor?: string | null;
  all?: boolean;
}

export interface FetchCodesResponse {
  success: boolean;
  codes: CodeRecord[];
  totalCount?: number;
  activeCount?: number;
  expiredCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
  message?: string;
}

export async function fetchAdminCodes(
  _adminCode: string,
  options?: FetchCodesOptions
): Promise<FetchCodesResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', String(options.page));
    if (options?.pageSize) params.set('pageSize', String(options.pageSize));
    if (options?.filter) params.set('filter', options.filter);
    if (options?.roleFilter) params.set('roleFilter', options.roleFilter);
    if (options?.search) params.set('search', options.search);
    if (options?.cursor) params.set('cursor', options.cursor);
    if (options?.all) params.set('all', 'true');

    const qs = params.toString();
    const res = await fetch(`/api/admin/codes${qs ? `?${qs}` : ''}`, {
      headers: sessionHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        codes: [],
        message: data.message || (res.status === 401 ? 'انتهت صلاحية الجلسة أو تم تغيير كود المدير. يرجى تسجيل الخروج والدخول مجدداً.' : 'غير مصرح للوصول'),
      };
    }
    return {
      success: true,
      codes: data.codes || [],
      totalCount: data.totalCount ?? data.codes?.length ?? 0,
      activeCount: data.activeCount ?? 0,
      expiredCount: data.expiredCount ?? 0,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? 8,
      totalPages: data.totalPages ?? 1,
      nextCursor: data.nextCursor ?? null,
      hasMore: data.hasMore ?? false,
    };
  } catch (err) {
    return { success: false, codes: [], message: 'فشل في جلب الأكواد من الخادم' };
  }
}

export async function fetchAdminBackup(): Promise<{
  success: boolean;
  backup?: { schemaVersion: number; createdAt: string; codes: CodeRecord[] };
  message?: string;
}> {
  try {
    const res = await fetch('/api/admin/backup', {
      headers: sessionHeaders(),
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.codes)) {
      return { success: false, message: data.message || 'تعذر إنشاء النسخة الاحتياطية.' };
    }
    return {
      success: true,
      backup: {
        schemaVersion: Number(data.schemaVersion) || 1,
        createdAt: String(data.createdAt || new Date().toISOString()),
        codes: data.codes,
      },
    };
  } catch {
    return { success: false, message: 'تعذر الاتصال بالخادم لإنشاء النسخة الاحتياطية.' };
  }
}

export async function restoreAdminBackup(
  backup: { schemaVersion?: number; createdAt?: string; codes: CodeRecord[] },
  strategy: 'merge' | 'overwrite' = 'merge'
): Promise<{ success: boolean; restoredCount?: number; message: string }> {
  try {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ backup, strategy }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || (res.status === 401 ? 'انتهت الجلسة. يرجى تسجيل الدخول مجدداً.' : 'تعذر استعادة النسخة الاحتياطية.'),
      };
    }
    return {
      success: true,
      restoredCount: data.restoredCount,
      message: data.message || 'تمت استعادة النسخة الاحتياطية بنجاح!',
    };
  } catch {
    return { success: false, message: 'تعذر الاتصال بالخادم لاستعادة النسخة الاحتياطية.' };
  }
}


export async function adminGenerateCode(
  _adminCode: string,
  options: {
    studentName?: string;
    role?: 'teacher' | 'student';
    customCode?: string;
    durationDays?: number | null;
    maxStudentsLimit?: number;
  }
): Promise<{ success: boolean; code?: CodeRecord; message: string }> {
  try {
    const res = await fetch('/api/admin/codes/generate', {
      method: 'POST',
      headers: {
        ...sessionHeaders(true),
      },
      body: JSON.stringify(options),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم' };
  }
}

export async function adminExpireCode(
  _adminCode: string,
  codeId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/codes/expire', {
      method: 'POST',
      headers: {
        ...sessionHeaders(true),
      },
      body: JSON.stringify({ codeId }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم' };
  }
}

export async function adminReactivateCode(
  _adminCode: string,
  codeId: string,
  extraDays?: number
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/codes/reactivate', {
      method: 'POST',
      headers: {
        ...sessionHeaders(true),
      },
      body: JSON.stringify({ codeId, extraDays }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم' };
  }
}

export async function adminDeleteCode(
  _adminCode: string,
  codeId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/codes/delete', {
      method: 'POST',
      headers: {
        ...sessionHeaders(true),
      },
      body: JSON.stringify({ codeId }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم' };
  }
}

export async function adminEditCode(
  _adminCode: string,
  payload: {
    code: string;
    newCode?: string;
    studentName?: string;
    role?: 'teacher' | 'student';
    status?: 'active' | 'expired' | 'revoked';
    expiresAt?: string | null;
    maxStudentsLimit?: number;
  }
): Promise<{ success: boolean; code?: CodeRecord; message: string }> {
  try {
    const res = await fetch('/api/admin/codes/edit', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم لحفظ التعديلات' };
  }
}

export async function adminUpdateMasterCode(
  newMasterCode: string
): Promise<{ success: boolean; newCode?: string; message: string }> {
  try {
    const res = await fetch('/api/admin/update-master-code', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ newCode: newMasterCode }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.sessionToken) {
      localStorage.setItem(STORAGE_KEY, data.sessionToken);
      if (data.newCode) {
        localStorage.setItem(CODE_KEY, data.newCode);
      }
      return { success: true, newCode: data.newCode, message: data.message };
    }
    return { success: false, message: data.message || 'تعذر تحديث كود المالك.' };
  } catch (err) {
    return { success: false, message: 'فشل في الاتصال بالخادم لتحديث كود المالك' };
  }
}

// ==========================================
// Code-Specific Progress Sync
// ==========================================

export async function fetchCodeProgress(_code: string): Promise<CodeProgress | null> {
  try {
    const res = await fetch('/api/progress', { headers: sessionHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.progress;
    }
    return null;
  } catch {
    return null;
  }
}

export async function syncCodeProgress(
  _code: string,
  progress: {
    lastChapterId: number;
    stateEntries: ProgressEntries;
  }
): Promise<boolean> {
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify(progress),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveProgressEntry(
  _code: string,
  key: string,
  value: boolean | string,
): Promise<boolean> {
  try {
    const entry = saveLocalProgressEntry(_code.trim().toUpperCase(), key, value);
    window.dispatchEvent(new CustomEvent('codemasr:progress-entry', {
      detail: { codeKey: _code.trim().toUpperCase(), key, entry },
    }));
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// Student Code Snippets & Workspace Sync
// ==========================================

export interface StudentSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchStudentWork(
  _code: string
): Promise<{ draftCode: string; snippets: StudentSnippet[] }> {
  try {
    const res = await fetch('/api/student-work', { headers: sessionHeaders() });
    if (res.ok) {
      const data = await res.json();
      return {
        draftCode: data.draftCode || '',
        snippets: Array.isArray(data.snippets) ? data.snippets : [],
      };
    }
  } catch (err) {
    console.error('Error fetching student work:', err);
  }
  return { draftCode: '', snippets: [] };
}

export async function saveStudentDraftToServer(_code: string, draftCode: string): Promise<void> {
  try {
    await fetch('/api/student-work/draft', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ draftCode }),
    });
  } catch (err) {
    console.error('Error saving draft:', err);
  }
}

export async function saveStudentSnippetToServer(
  _code: string,
  title: string,
  snippetCode: string,
  language: string = 'javascript',
  snippetId?: string
): Promise<{ success: boolean; snippet?: StudentSnippet; message: string }> {
  try {
    const res = await fetch('/api/student-work/snippet', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ title, code: snippetCode, language, snippetId }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'فشل في الاتصال بالخادم' };
  }
}

export async function deleteStudentSnippetFromServer(
  _code: string,
  snippetId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/student-work/snippet/${encodeURIComponent(snippetId)}`,
      {
        method: 'DELETE',
        headers: sessionHeaders(),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminRevokeAllSessions(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/revoke-all-sessions', {
      method: 'POST',
      headers: sessionHeaders(true),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'تعذر الاتصال بالخادم لإبطال الجلسات.' };
  }
}

export async function adminRotateAdminCode(
  newAdminCode: string,
  revokeOldSessions: boolean = true
): Promise<{ success: boolean; message: string; sessionToken?: string }> {
  try {
    const res = await fetch('/api/admin/rotate-admin-code', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ newAdminCode, revokeOldSessions }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      if (data.sessionToken) {
        localStorage.setItem(STORAGE_KEY, data.sessionToken);
      }
      if (data.adminCode) {
        localStorage.setItem(CODE_KEY, data.adminCode);
      }
      return {
        success: true,
        sessionToken: data.sessionToken,
        message: data.message || 'تم تحديث كود المدير بنجاح وتحديث جلستك الحالية.',
      };
    }
    return {
      success: false,
      message: data.message || 'تعذر تحديث كود المدير.',
    };
  } catch {
    return { success: false, message: 'تعذر الاتصال بالخادم لتحديث كود المدير.' };
  }
}



