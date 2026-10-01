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
}

export interface CodeRecord {
  id: string;
  code: string;
  studentName: string;
  createdAt: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
  usedCount: number;
  lastUsedAt: string | null;
  progress?: CodeProgress;
  draftCode?: string;
  savedSnippets?: StudentSnippet[];
}

export interface ActivationState {
  activated: boolean;
  role: 'admin' | 'student';
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
    const savedRole = (localStorage.getItem(ROLE_KEY) as 'admin' | 'student') || 'student';
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
    const res = await fetch('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      localStorage.setItem(ROLE_KEY, data.role);
      if (data.studentName) localStorage.setItem(STUDENT_NAME_KEY, data.studentName);
      return {
        activated: true,
        role: data.role,
        code: data.code,
        studentName: data.studentName,
      };
    }
  } catch {
    // Treat an unreachable server as signed out so stale credentials are not trusted.
  }
  lockPlatform();
  return { activated: false, role: 'student' };
}

/**
 * Verify code with the server
 */
export async function activateWithCode(inputCode: string): Promise<{
  success: boolean;
  role: 'admin' | 'student';
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
  } catch (e) {
    console.error(e);
  }
}

function sessionHeaders(json = false): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEY) || '';
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==========================================
// Admin APIs (Only called when role is admin)
// ==========================================

export async function fetchAdminCodes(_adminCode: string): Promise<{
  success: boolean;
  codes: CodeRecord[];
  message?: string;
}> {
  try {
    const res = await fetch('/api/admin/codes', {
      headers: sessionHeaders(),
    });
    if (!res.ok) {
      return { success: false, codes: [], message: 'غير مصرح للوصول' };
    }
    const data = await res.json();
    return { success: true, codes: data.codes || [] };
  } catch (err) {
    return { success: false, codes: [], message: 'فشل في جلب الأكواد من الخادم' };
  }
}

export async function adminGenerateCode(
  _adminCode: string,
  options: {
    studentName?: string;
    customCode?: string;
    durationDays?: number | null;
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
    completedChapters: number[];
    completedQuizzes: string[];
    lastChapterId: number;
    challengeCodes?: Record<string, string>;
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
