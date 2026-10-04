import dotenv from 'dotenv';
import { randomInt, randomUUID } from 'crypto';

dotenv.config({ override: true });
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
  increment,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  QueryConstraint,
} from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from './firebase.ts';

const DEFAULT_CONFIGURED_ADMINS = [
  'ADM-453B831445A0F634',
  'ADM-7C81E920A3B54DF6',
];

// Admin credentials are kept securely on the server, never sent to the browser client.
export function getAdminCodes(): string[] {
  const envCodes = (process.env.ADMIN_CODES || '')
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter((code) => code && code !== 'REPLACE_WITH_A_NEW_PRIVATE_ADMIN_CODE');

  if (envCodes.length > 0) {
    return envCodes;
  }
  return DEFAULT_CONFIGURED_ADMINS;
}

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
  completedChallenges?: string[];
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
  feedback?: string;
}

export async function initCodesStorage(): Promise<void> {
  await testConnection();
}

export async function getStoredCodes(): Promise<AccessCodeRecord[]> {
  try {
    const colRef = collection(db, 'access_codes');
    const snap = await getDocs(colRef);
    const records: AccessCodeRecord[] = [];
    snap.forEach((d) => {
      records.push(d.data() as AccessCodeRecord);
    });
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'access_codes');
  }
}

export interface GetCodesPaginatedOptions {
  page?: number;
  pageSize?: number;
  filter?: 'all' | 'active' | 'expired';
  search?: string;
  cursor?: string | null;
}

export interface PaginatedCodesResult {
  codes: AccessCodeRecord[];
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  nextCursor: string | null;
  hasMore: boolean;
}

// In-memory cache for count aggregations (15s TTL)
let cachedCounts: {
  total: number;
  active: number;
  expired: number;
  cachedAt: number;
} | null = null;

export async function getCodesCounts(): Promise<{ total: number; active: number; expired: number }> {
  const now = Date.now();
  if (cachedCounts && now - cachedCounts.cachedAt < 15000) {
    return cachedCounts;
  }
  try {
    const colRef = collection(db, 'access_codes');
    const totalSnap = await getCountFromServer(colRef);
    const activeSnap = await getCountFromServer(query(colRef, where('status', '==', 'active')));
    const total = totalSnap.data().count;
    const active = activeSnap.data().count;
    const expired = Math.max(0, total - active);
    cachedCounts = { total, active, expired, cachedAt: now };
    return cachedCounts;
  } catch (err) {
    console.warn('Failed to get counts from server, using fallback:', err);
    return cachedCounts || { total: 0, active: 0, expired: 0 };
  }
}

export function invalidateCodesCountCache(): void {
  cachedCounts = null;
}

/**
 * Server-side pagination query for student access codes.
 * Uses Firestore `limit(pageSize)` and `startAfter` cursor to fetch only the requested page of 8 codes.
 * Never reads the entire collection, preventing expensive scans when there are hundreds of students.
 */
export async function getStoredCodesPaginated(
  options: GetCodesPaginatedOptions = {}
): Promise<PaginatedCodesResult> {
  const page = Math.max(1, Number(options.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(options.pageSize) || 8));
  const filter = options.filter || 'all';
  const search = (options.search || '').trim();
  const cursor = options.cursor || null;

  const counts = await getCodesCounts();

  // 1. Search Query branch (Performs targeted server-side prefix queries with strict limit)
  if (search) {
    try {
      const colRef = collection(db, 'access_codes');
      const searchUpper = search.toUpperCase();
      const resultsMap = new Map<string, AccessCodeRecord>();

      // A. Try exact match by code (1 document read)
      try {
        const exactDoc = await getDoc(doc(db, 'access_codes', searchUpper));
        if (exactDoc.exists()) {
          const rec = exactDoc.data() as AccessCodeRecord;
          if (filter === 'all' || rec.status === filter) {
            resultsMap.set(rec.code, rec);
          }
        }
      } catch (e) {
        // ignore
      }

      // B. Prefix search by code on Firestore (reads at most pageSize documents)
      if (resultsMap.size < pageSize) {
        try {
          const codeConstraints: QueryConstraint[] = [];
          if (filter === 'active') {
            codeConstraints.push(where('status', '==', 'active'));
          } else if (filter === 'expired') {
            codeConstraints.push(where('status', '==', 'expired'));
          }
          codeConstraints.push(where('code', '>=', searchUpper));
          codeConstraints.push(where('code', '<=', searchUpper + '\uf8ff'));
          codeConstraints.push(limit(pageSize));

          const snapCode = await getDocs(query(colRef, ...codeConstraints));
          snapCode.forEach((d) => {
            const rec = d.data() as AccessCodeRecord;
            resultsMap.set(rec.code, rec);
          });
        } catch (e) {
          console.warn('Prefix code query warning:', e);
        }
      }

      // C. Prefix search by studentName on Firestore (reads at most remaining pageSize documents)
      if (resultsMap.size < pageSize) {
        try {
          const nameConstraints: QueryConstraint[] = [];
          if (filter === 'active') {
            nameConstraints.push(where('status', '==', 'active'));
          } else if (filter === 'expired') {
            nameConstraints.push(where('status', '==', 'expired'));
          }
          nameConstraints.push(where('studentName', '>=', search));
          nameConstraints.push(where('studentName', '<=', search + '\uf8ff'));
          nameConstraints.push(limit(pageSize - resultsMap.size));

          const snapName = await getDocs(query(colRef, ...nameConstraints));
          snapName.forEach((d) => {
            const rec = d.data() as AccessCodeRecord;
            resultsMap.set(rec.code, rec);
          });
        } catch (e) {
          console.warn('Prefix name query warning:', e);
        }
      }

      const matchingRecords = Array.from(resultsMap.values());
      const totalMatching = matchingRecords.length;

      return {
        codes: matchingRecords,
        totalCount: totalMatching,
        activeCount: counts.active,
        expiredCount: counts.expired,
        page,
        pageSize,
        totalPages: 1,
        nextCursor: null,
        hasMore: false,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'access_codes');
    }
  }

  // 2. Direct Firestore Cursor Query (EXACTLY pageSize document reads!)
  try {
    const colRef = collection(db, 'access_codes');
    const constraints: QueryConstraint[] = [];

    if (filter === 'active') {
      constraints.push(where('status', '==', 'active'));
    } else if (filter === 'expired') {
      constraints.push(where('status', '==', 'expired'));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (cursor) {
      constraints.push(startAfter(cursor));
    } else if (page > 1) {
      // If cursor not passed by client for page > 1, obtain cursor with minimal query
      try {
        const offsetSnap = await getDocs(
          query(colRef, ...constraints, limit((page - 1) * pageSize))
        );
        if (!offsetSnap.empty) {
          const lastDoc = offsetSnap.docs[offsetSnap.docs.length - 1];
          constraints.push(startAfter(lastDoc.data().createdAt));
        }
      } catch (e) {
        console.warn('Offset scan warning:', e);
      }
    }

    constraints.push(limit(pageSize));

    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);

    const records: AccessCodeRecord[] = [];
    snap.forEach((d) => {
      records.push(d.data() as AccessCodeRecord);
    });

    const relevantTotal =
      filter === 'active' ? counts.active : filter === 'expired' ? counts.expired : counts.total;
    const totalPages = Math.max(1, Math.ceil(relevantTotal / pageSize));
    const nextCursor =
      records.length === pageSize ? records[records.length - 1].createdAt : null;

    return {
      codes: records,
      totalCount: relevantTotal,
      activeCount: counts.active,
      expiredCount: counts.expired,
      page,
      pageSize,
      totalPages,
      nextCursor,
      hasMore: Boolean(nextCursor) && (page * pageSize < relevantTotal),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'access_codes');
  }
}

export async function getAccessCodeRecord(codeOrId: string): Promise<AccessCodeRecord | null> {
  const clean = codeOrId.trim().toUpperCase();
  try {
    // 1. Try direct lookup by code document ID
    const directDoc = doc(db, 'access_codes', clean);
    const snap = await getDoc(directDoc);
    if (snap.exists()) {
      return snap.data() as AccessCodeRecord;
    }

    // 2. Fallback query by ID
    const q = query(collection(db, 'access_codes'), where('id', '==', codeOrId.trim()));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as AccessCodeRecord;
    }

    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `access_codes/${clean}`);
  }
}

export async function verifyCode(inputCode: string): Promise<{
  valid: boolean;
  role: 'admin' | 'student';
  code: string;
  studentName?: string;
  expiresAt?: string | null;
  message: string;
}> {
  const clean = inputCode.trim().toUpperCase();
  if (!clean) {
    return { valid: false, role: 'student', code: '', message: 'من فضلك اكتب الكود أولاً.' };
  }

  // 1. Check if it's an Admin Code
  if (getAdminCodes().includes(clean)) {
    return {
      valid: true,
      role: 'admin',
      code: clean,
      message: 'أهلاً بك يا مدير المنصة 👑',
    };
  }

  // 2. Check student codes directly in Firestore
  const docRef = doc(db, 'access_codes', clean);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'كود التفعيل غير صحيح أو غير مسجل في النظام ❌',
    };
  }

  const record = snap.data() as AccessCodeRecord;

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
    try {
      await updateDoc(docRef, { status: 'expired' });
    } catch (e) {
      console.warn('Failed to update status to expired:', e);
    }
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'عذراً، انتهت فترة صلاحية هذا الكود.',
    };
  }

  // Mark usage safely with atomic increment
  const now = new Date().toISOString();
  try {
    await updateDoc(docRef, {
      usedCount: increment(1),
      lastUsedAt: now,
    });
  } catch (e) {
    console.warn('Failed to update usedCount:', e);
  }

  return {
    valid: true,
    role: 'student',
    code: record.code,
    studentName: record.studentName,
    expiresAt: record.expiresAt,
    message: `أهلاً بك ${record.studentName || ''}! تم التفعيل بنجاح 🎉`,
  };
}

export async function generateCode(
  adminCode: string,
  options: {
    studentName?: string;
    customCode?: string;
    durationDays?: number | null; // null or 0 for forever
  }
): Promise<{ success: boolean; code?: AccessCodeRecord; message: string }> {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!getAdminCodes().includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بتوليد الأكواد (يتطلب صلاحية المدير).' };
  }

  const durationDays = options.durationDays ?? 0;
  if (!Number.isInteger(durationDays) || durationDays < 0 || durationDays > 3650) {
    return { success: false, message: 'مدة الصلاحية يجب أن تكون من 0 إلى 3650 يوماً.' };
  }

  const cleanStudentName = options.studentName?.trim() || 'طالب جديد';
  if (cleanStudentName.length > 100) {
    return { success: false, message: 'اسم الطالب يجب ألا يتجاوز 100 حرف.' };
  }

  let expiresAt: string | null = null;
  if (durationDays > 0) {
    expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  }

  // Handle Custom Code
  if (options.customCode && options.customCode.trim()) {
    const codeStr = options.customCode.trim().toUpperCase();
    if (codeStr.length < 3 || codeStr.length > 32 || !/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(codeStr)) {
      return { success: false, message: 'استخدم من 3 إلى 32 حرفاً أو رقماً، ويمكن الفصل بشرطة واحدة.' };
    }
    if (getAdminCodes().includes(codeStr)) {
      return { success: false, message: 'هذا الكود مستخدم بالفعل، اختر كوداً آخر.' };
    }

    try {
      return await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'access_codes', codeStr);
        const docSnap = await transaction.get(docRef);
        if (docSnap.exists()) {
          return { success: false, message: 'هذا الكود مستخدم بالفعل، اختر كوداً آخر.' };
        }

        const newRecord: AccessCodeRecord = {
          id: `code-${randomUUID()}`,
          code: codeStr,
          studentName: cleanStudentName,
          createdAt: new Date().toISOString(),
          expiresAt,
          status: 'active',
          usedCount: 0,
          lastUsedAt: null,
          draftCode: '',
          progress: {
            completedChapters: [],
            completedQuizzes: [],
            lastChapterId: 1,
            lastUpdated: new Date().toISOString(),
            challengeCodes: {},
          },
          savedSnippets: [],
        };

        transaction.set(docRef, newRecord);
        invalidateCodesCountCache();
        return { success: true, code: newRecord, message: 'تم إنشاء كود الطالب وحفظه بنجاح.' };
      });
    } catch (err) {
      console.error('Failed to create custom code:', err);
      return { success: false, message: 'لم يتم حفظ الكود بسبب خطأ في الخادم. حاول مرة أخرى.' };
    }
  }

  // Auto-generate unique code using cryptographically secure random values and atomic transactions
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let attempt = 0; attempt < 20; attempt++) {
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars[randomInt(chars.length)];
    }
    const codeStr = `STD-${rand}`;
    if (getAdminCodes().includes(codeStr)) continue;

    try {
      const res = await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'access_codes', codeStr);
        const docSnap = await transaction.get(docRef);
        if (docSnap.exists()) {
          return null; // collision, try again
        }

        const newRecord: AccessCodeRecord = {
          id: `code-${randomUUID()}`,
          code: codeStr,
          studentName: cleanStudentName,
          createdAt: new Date().toISOString(),
          expiresAt,
          status: 'active',
          usedCount: 0,
          lastUsedAt: null,
          draftCode: '',
          progress: {
            completedChapters: [],
            completedQuizzes: [],
            lastChapterId: 1,
            lastUpdated: new Date().toISOString(),
            challengeCodes: {},
          },
          savedSnippets: [],
        };

        transaction.set(docRef, newRecord);
        invalidateCodesCountCache();
        return newRecord;
      });

      if (res) {
        return { success: true, code: res, message: 'تم إنشاء كود الطالب وحفظه بنجاح.' };
      }
    } catch (err) {
      console.error('Error generating code in transaction:', err);
    }
  }

  return { success: false, message: 'تعذر إنشاء كود فريد الآن. حاول مرة أخرى.' };
}

export async function expireCode(
  adminCode: string,
  codeId: string
): Promise<{ success: boolean; message: string }> {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!getAdminCodes().includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  try {
    const docRef = doc(db, 'access_codes', record.code.toUpperCase());
    await updateDoc(docRef, { status: 'expired' });
    invalidateCodesCountCache();
    return { success: true, message: `تم إنهاء صلاحية الكود ${record.code} بنجاح.` };
  } catch (err) {
    console.error('Error expiring code:', err);
    return { success: false, message: 'تعذر حفظ التغيير. حاول مرة أخرى.' };
  }
}

export async function reactivateCode(
  adminCode: string,
  codeId: string,
  extraDays?: number
): Promise<{ success: boolean; message: string }> {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!getAdminCodes().includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  let expiresAt: string | null = record.expiresAt;
  if (extraDays && extraDays > 0) {
    expiresAt = new Date(Date.now() + extraDays * 24 * 60 * 60 * 1000).toISOString();
  } else if (extraDays === 0) {
    expiresAt = null;
  }

  try {
    const docRef = doc(db, 'access_codes', record.code.toUpperCase());
    await updateDoc(docRef, { status: 'active', expiresAt });
    invalidateCodesCountCache();
    return { success: true, message: `تمت إعادة تفعيل الكود ${record.code} بنجاح.` };
  } catch (err) {
    console.error('Error reactivating code:', err);
    return { success: false, message: 'تعذر حفظ التغيير. حاول مرة أخرى.' };
  }
}

export async function deleteCode(
  adminCode: string,
  codeId: string
): Promise<{ success: boolean; message: string }> {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!getAdminCodes().includes(cleanAdmin)) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  try {
    const docRef = doc(db, 'access_codes', record.code.toUpperCase());
    await deleteDoc(docRef);
    invalidateCodesCountCache();
    return { success: true, message: 'تم حذف الكود نهائياً من قاعدة البيانات.' };
  } catch (err) {
    console.error('Error deleting code:', err);
    return { success: false, message: 'تعذر حذف الكود بسبب مشكلة في التخزين.' };
  }
}

export async function getCodeProgress(code: string): Promise<CodeProgress> {
  const record = await getAccessCodeRecord(code);
  if (record && record.progress) {
    return {
      ...record.progress,
      challengeCodes: record.progress.challengeCodes || {},
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

export async function updateCodeProgress(
  code: string,
  progress: Partial<CodeProgress>
): Promise<boolean> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  const snap = await getDoc(docRef);

  let existing: CodeProgress = {
    completedChapters: [],
    completedQuizzes: [],
    completedChallenges: [],
    lastChapterId: 1,
    challengeCodes: {},
    lastUpdated: new Date().toISOString(),
  };

  let recordBase: Record<string, any> = {};
  if (snap.exists()) {
    const data = snap.data();
    if (data.progress) {
      existing = data.progress as CodeProgress;
    }
  } else {
    const isAdmin = getAdminCodes().includes(clean);
    recordBase = {
      id: randomUUID(),
      code: clean,
      studentName: isAdmin ? 'مدير المنصة' : 'طالب كود بالمصري',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      status: 'active',
      usedCount: 1,
      lastUsedAt: new Date().toISOString(),
    };
  }

  const updated: CodeProgress = {
    completedChapters: progress.completedChapters ?? existing.completedChapters ?? [],
    completedQuizzes: progress.completedQuizzes ?? existing.completedQuizzes ?? [],
    completedChallenges: progress.completedChallenges ?? existing.completedChallenges ?? [],
    lastChapterId: progress.lastChapterId ?? existing.lastChapterId ?? 1,
    challengeCodes: {
      ...(existing.challengeCodes || {}),
      ...(progress.challengeCodes || {}),
    },
    lastUpdated: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, { ...recordBase, progress: updated }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error updating progress:', err);
    return false;
  }
}

/**
 * Unified synchronization of student challenge solutions and completion status in Firestore.
 * Ensures solutions are never lost across refreshes or account switching.
 */
export async function syncStudentChallenges(
  code: string,
  data: {
    challengeId?: string;
    code?: string;
    completed?: boolean;
    challengeCodes?: Record<string, string>;
    completedChallenges?: string[];
  }
): Promise<{
  success: boolean;
  completedChallenges: string[];
  challengeCodes: Record<string, string>;
}> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  const snap = await getDoc(docRef);

  let existingProgress: CodeProgress = {
    completedChapters: [],
    completedQuizzes: [],
    completedChallenges: [],
    lastChapterId: 1,
    challengeCodes: {},
    lastUpdated: new Date().toISOString(),
  };

  let recordBase: Record<string, any> = {};
  if (snap.exists()) {
    const docData = snap.data();
    if (docData.progress) {
      existingProgress = docData.progress as CodeProgress;
    }
  } else {
    const isAdmin = getAdminCodes().includes(clean);
    recordBase = {
      id: randomUUID(),
      code: clean,
      studentName: isAdmin ? 'مدير المنصة' : 'طالب كود بالمصري',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      status: 'active',
      usedCount: 1,
      lastUsedAt: new Date().toISOString(),
    };
  }

  const existingCompleted = Array.isArray(existingProgress.completedChallenges)
    ? [...existingProgress.completedChallenges]
    : [];
  const existingCodes: Record<string, string> = { ...(existingProgress.challengeCodes || {}) };

  // Merge individual challenge code or bulk map
  if (data.challengeId && data.code !== undefined) {
    existingCodes[data.challengeId] = data.code;
  }
  if (data.challengeCodes && typeof data.challengeCodes === 'object') {
    Object.assign(existingCodes, data.challengeCodes);
  }

  // Handle completed status
  if (data.challengeId && data.completed === true) {
    if (!existingCompleted.includes(data.challengeId)) {
      existingCompleted.push(data.challengeId);
    }
  } else if (data.challengeId && data.completed === false) {
    const idx = existingCompleted.indexOf(data.challengeId);
    if (idx > -1) existingCompleted.splice(idx, 1);
  }
  if (Array.isArray(data.completedChallenges)) {
    data.completedChallenges.forEach((id) => {
      if (!existingCompleted.includes(id)) existingCompleted.push(id);
    });
  }

  const updatedProgress: CodeProgress = {
    ...existingProgress,
    completedChallenges: existingCompleted,
    challengeCodes: existingCodes,
    lastUpdated: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, { ...recordBase, progress: updatedProgress }, { merge: true });
    return {
      success: true,
      completedChallenges: existingCompleted,
      challengeCodes: existingCodes,
    };
  } catch (err) {
    console.error('Error in syncStudentChallenges:', err);
    return {
      success: false,
      completedChallenges: existingCompleted,
      challengeCodes: existingCodes,
    };
  }
}

export async function setStudentFeedback(code: string, feedback: string): Promise<boolean> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  try {
    await updateDoc(docRef, { feedback: feedback.trim() });
    return true;
  } catch (err) {
    console.error('Error setting student feedback:', err);
    return false;
  }
}

export async function getStudentWork(code: string): Promise<{
  draftCode: string;
  snippets: StudentSnippet[];
}> {
  const record = await getAccessCodeRecord(code);
  if (!record) {
    return { draftCode: '', snippets: [] };
  }
  return {
    draftCode: record.draftCode || '',
    snippets: record.savedSnippets || [],
  };
}

export async function saveStudentDraft(code: string, draftCode: string): Promise<boolean> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  try {
    await setDoc(docRef, { draftCode: draftCode || '' }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving student draft:', err);
    return false;
  }
}

export async function saveStudentSnippet(
  code: string,
  title: string,
  snippetCode: string,
  language: string = 'javascript',
  snippetId?: string
): Promise<{ success: boolean; snippet?: StudentSnippet; message: string }> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  const snap = await getDoc(docRef);

  let existingList: StudentSnippet[] = [];
  if (snap.exists()) {
    const record = snap.data() as AccessCodeRecord;
    existingList = Array.isArray(record.savedSnippets) ? [...record.savedSnippets] : [];
  }
  const now = new Date().toISOString();

  if (snippetId) {
    const existingIndex = existingList.findIndex((s) => s.id === snippetId);
    if (existingIndex !== -1) {
      existingList[existingIndex].title = title;
      existingList[existingIndex].code = snippetCode;
      existingList[existingIndex].language = language;
      existingList[existingIndex].updatedAt = now;
      await setDoc(docRef, { savedSnippets: existingList }, { merge: true });
      return { success: true, snippet: existingList[existingIndex], message: 'تم تحديث الكود بنجاح!' };
    }
  }

  const newSnippet: StudentSnippet = {
    id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim() || 'كود بدون عنوان',
    code: snippetCode,
    language,
    createdAt: now,
    updatedAt: now,
  };

  existingList.unshift(newSnippet);
  await setDoc(docRef, { savedSnippets: existingList }, { merge: true });
  return { success: true, snippet: newSnippet, message: 'تم حفظ الكود في حسابك بنجاح! 💾' };
}

export async function deleteStudentSnippet(
  code: string,
  snippetId: string
): Promise<{ success: boolean; message: string }> {
  const clean = code.trim().toUpperCase();
  const docRef = doc(db, 'access_codes', clean);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return { success: false, message: 'الكود غير مسجل' };
  }

  const record = snap.data() as AccessCodeRecord;
  const existingList = record.savedSnippets || [];
  const filtered = existingList.filter((s) => s.id !== snippetId);
  try {
    await updateDoc(docRef, { savedSnippets: filtered });
    return { success: true, message: 'تم حذف الكود بنجاح.' };
  } catch (err) {
    console.error('Error deleting student snippet:', err);
    return { success: false, message: 'تعذر حذف الكود.' };
  }
}
