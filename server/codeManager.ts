import dotenv from 'dotenv';
import { randomInt, randomUUID, createHmac } from 'crypto';

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
} from './firestoreCompat.ts';
import type { QueryConstraint } from './firestoreCompat.ts';
import { db, testConnection, handleFirestoreError, OperationType } from './firebase.ts';

// ==========================================
// Environment & Secrets Security Validation
// ==========================================

export interface EnvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates the presence and security of required environment secrets.
 * In production mode, any missing or insecure secrets will immediately terminate the process.
 */
export function validateEnvironmentSecrets(options: { terminateOnError?: boolean } = {}): EnvValidationResult {
  const { terminateOnError = process.env.NODE_ENV === 'production' } = options;
  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  const rawAdminCodes = process.env.ADMIN_CODES?.trim() || '';
  const parsedAdminCodes = rawAdminCodes
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter((c) => c.length > 0);

  const insecurePlaceholders = ['REPLACE', 'DEFAULT', 'ADMIN', '123456', 'PASSWORD', 'SECRET', 'CHANGEME'];

  if (!rawAdminCodes) {
    if (isProd) {
      errors.push('CRITICAL: ADMIN_CODES environment variable is missing in production.');
    } else {
      warnings.push('ADMIN_CODES not set in development mode. Using ephemeral dev code.');
    }
  } else {
    const validCodes = parsedAdminCodes.filter((code) => {
      const isPlaceholder = insecurePlaceholders.some((p) => code.includes(p));
      return code.length >= 6 && !isPlaceholder;
    });

    if (validCodes.length === 0) {
      if (isProd) {
        errors.push('CRITICAL: ADMIN_CODES contains only weak or placeholder values (minimum 6 characters required, no placeholder words).');
      } else {
        warnings.push('ADMIN_CODES contains placeholder or short codes in development.');
      }
    }
  }

  const rawSessionSecret = process.env.SESSION_SECRET?.trim() || '';
  if (isProd) {
    if (!rawSessionSecret || rawSessionSecret.length < 32 || rawSessionSecret.includes('replace-with-a-random-secret')) {
      errors.push('CRITICAL: SESSION_SECRET must be configured with at least 32 high-entropy characters in production.');
    }
  }

  if (errors.length > 0) {
    console.error('====================================================');
    console.error('❌ FATAL SECURITY CONFIGURATION ERROR:');
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error('====================================================');
    if (terminateOnError) {
      console.error('🛑 Terminating process to protect application and student data.');
      process.exit(1);
    }
  }

  if (warnings.length > 0 && !isProd) {
    warnings.forEach((warn) => console.warn(`⚠️ [Security Warning] ${warn}`));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Run validation immediately on module load
validateEnvironmentSecrets();

// Dynamic admin codes set in-memory by authenticated admin rotation
const dynamicAdminCodes = new Set<string>();
// Persisted cryptographic hashes of dynamic admin codes (never stored in plaintext)
const persistedHashedAdminCodes = new Set<string>();

export function hashAdminSecret(code: string): string {
  const salt = process.env.SESSION_SECRET || 'platform-admin-credential-salt-secret';
  return createHmac('sha256', salt).update(code.trim().toUpperCase()).digest('hex');
}

// Admin credentials are kept securely on the server, never sent to the browser client.
export function getAdminCodes(): string[] {
  const envCodes = (process.env.ADMIN_CODES || '')
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter((code) => {
      const isPlaceholder = ['REPLACE', 'DEFAULT', 'CHANGEME'].some((p) => code.includes(p));
      return code && !isPlaceholder && code.length >= 6;
    });

  const combined = Array.from(new Set([...envCodes, ...dynamicAdminCodes]));
  if (combined.length > 0) {
    return combined;
  }
  // In non-production, if no admin code was configured in .env, issue an ephemeral dev code
  if (process.env.NODE_ENV !== 'production') {
    const devCode = (globalThis as any).__DEV_ADMIN_CODE || ((globalThis as any).__DEV_ADMIN_CODE = 'ADM-DEV-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    return [devCode];
  }
  return [];
}

export function isMasterAdminCode(code: string): boolean {
  const clean = code.trim().toUpperCase();
  if (!clean || clean.length < 6) return false;
  if (getAdminCodes().includes(clean)) return true;
  const hash = hashAdminSecret(clean);
  if (persistedHashedAdminCodes.has(hash)) {
    dynamicAdminCodes.add(clean);
    return true;
  }
  return false;
}

export async function addDynamicAdminCode(newAdminCode: string): Promise<boolean> {
  const clean = newAdminCode.trim().toUpperCase();
  if (clean.length < 6 || clean.length > 64 || !/^[A-Z0-9_-]+$/.test(clean)) {
    return false;
  }
  dynamicAdminCodes.add(clean);
  const hash = hashAdminSecret(clean);
  persistedHashedAdminCodes.add(hash);
  try {
    const configDoc = doc(db, 'system_config', 'admin_settings');
    // Store only HMAC-SHA256 hashes, NEVER plaintext admin codes
    await setDoc(configDoc, {
      hashedAdminCodes: Array.from(persistedHashedAdminCodes),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not persist hashed admin code to Firestore:', err);
  }
  return true;
}

export async function removeDynamicAdminCode(oldAdminCode: string): Promise<void> {
  const clean = oldAdminCode.trim().toUpperCase();
  dynamicAdminCodes.delete(clean);
  const hash = hashAdminSecret(clean);
  persistedHashedAdminCodes.delete(hash);
  try {
    const configDoc = doc(db, 'system_config', 'admin_settings');
    await setDoc(configDoc, {
      hashedAdminCodes: Array.from(persistedHashedAdminCodes),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not update hashed admin codes in Firestore:', err);
  }
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
  completedExamParts?: number[];
  bookmarkedChapterIds?: number[];
  chapterNotes?: Record<string, string>;
  stateEntries?: ProgressEntries;
}

export interface ProgressEntry {
  value: boolean | string;
  updatedAt: number;
}

export type ProgressEntries = Record<string, ProgressEntry>;

export interface AccessCodeRecord {
  id: string;
  code: string;
  role?: 'master' | 'admin' | 'teacher' | 'student';
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
  createdBy?: string;
  teacherCode?: string;
  maxStudentsLimit?: number;
}

export async function initCodesStorage(): Promise<void> {
  await testConnection();
  try {
    const configDoc = doc(db, 'system_config', 'admin_settings');
    const snap = await getDoc(configDoc);
    if (snap.exists) {
      const data = snap.data();
      let hadLegacyPlaintext = false;

      // If legacy plaintext dynamicCodes exists, migrate them to hashes and remove plaintext
      if (Array.isArray(data?.dynamicCodes)) {
        hadLegacyPlaintext = true;
        data.dynamicCodes.forEach((code: string) => {
          if (typeof code === 'string' && code.length >= 6) {
            const clean = code.trim().toUpperCase();
            dynamicAdminCodes.add(clean);
            persistedHashedAdminCodes.add(hashAdminSecret(clean));
          }
        });
      }

      if (Array.isArray(data?.hashedAdminCodes)) {
        data.hashedAdminCodes.forEach((h: string) => {
          if (typeof h === 'string' && h.length > 0) {
            persistedHashedAdminCodes.add(h);
          }
        });
      }

      // If legacy plaintext codes were stored, overwrite with hashed codes only
      if (hadLegacyPlaintext) {
        try {
          await setDoc(configDoc, {
            hashedAdminCodes: Array.from(persistedHashedAdminCodes),
            updatedAt: new Date().toISOString(),
          });
          console.log('🔒 Migrated legacy plaintext admin credentials to HMAC-SHA256 hashes in Firestore.');
        } catch (e) {
          console.warn('Could not sanitize legacy admin codes doc:', e);
        }
      }
    }

    // Clean up any master admin codes mistakenly saved in access_codes collection
    const adminCodesList = getAdminCodes();
    for (const code of adminCodesList) {
      try {
        const adminDoc = doc(db, 'access_codes', code.trim().toUpperCase());
        const snap = await getDoc(adminDoc);
        if (snap.exists) {
          await deleteDoc(adminDoc);
        }
      } catch {}
    }
  } catch (e) {
    console.warn('Could not load dynamic admin codes from Firestore:', e);
  }
}

export function sanitizeAccessCodeRecord(raw: any): AccessCodeRecord {
  let used = 0;
  if (typeof raw.usedCount === 'number' && Number.isFinite(raw.usedCount)) {
    used = raw.usedCount;
  } else if (raw.usedCount && typeof raw.usedCount._operand === 'number') {
    used = raw.usedCount._operand;
  }
  return {
    ...raw,
    usedCount: used,
    studentName: typeof raw.studentName === 'string' ? raw.studentName : 'طالب جديد',
    feedback: typeof raw.feedback === 'string' ? raw.feedback : '',
  };
}

export async function getStoredCodes(): Promise<AccessCodeRecord[]> {
  try {
    const colRef = collection(db, 'access_codes');
    const snap = await getDocs(colRef);
    const records: AccessCodeRecord[] = [];
    const adminCodes = getAdminCodes();
    snap.forEach((d) => {
      const rec = sanitizeAccessCodeRecord(d.data());
      if (rec.code && !adminCodes.includes(rec.code.toUpperCase()) && rec.role !== 'master' && rec.role !== 'admin') {
        records.push(rec);
      }
    });
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records;
  } catch (err: any) {
    console.warn('[Firestore] Notice fetching stored codes:', err?.message || err);
    return [];
  }
}

export interface GetCodesPaginatedOptions {
  page?: number;
  pageSize?: number;
  filter?: 'all' | 'active' | 'expired';
  roleFilter?: 'all' | 'teacher' | 'student';
  search?: string;
  cursor?: string | null;
  callerCode?: string;
  callerRole?: 'master' | 'admin' | 'teacher' | 'student';
}

export interface PaginatedCodesResult {
  codes: AccessCodeRecord[];
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  teachersCount?: number;
  studentsCount?: number;
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

export async function getCodesCounts(callerTeacherCode?: string): Promise<{ total: number; active: number; expired: number }> {
  const now = Date.now();
  if (!callerTeacherCode && cachedCounts && now - cachedCounts.cachedAt < 15000) {
    return cachedCounts;
  }
  try {
    const colRef = collection(db, 'access_codes');
    const baseConstraints: QueryConstraint[] = [];
    if (callerTeacherCode) {
      baseConstraints.push(where('teacherCode', '==', callerTeacherCode.trim().toUpperCase()));
    }
    const totalSnap = await getCountFromServer(query(colRef, ...baseConstraints));
    const activeSnap = await getCountFromServer(query(colRef, ...baseConstraints, where('status', '==', 'active')));
    const total = totalSnap.data().count;
    const active = activeSnap.data().count;
    const expired = Math.max(0, total - active);
    const result = { total, active, expired };
    if (!callerTeacherCode) {
      cachedCounts = { ...result, cachedAt: now };
    }
    return result;
  } catch (err) {
    console.warn('Failed to get counts from server, using fallback:', err);
    return cachedCounts || { total: 0, active: 0, expired: 0 };
  }
}

export function invalidateCodesCountCache(): void {
  cachedCounts = null;
}

/**
 * Server-side pagination query for student and teacher access codes.
 * Uses Firestore queries and cursors to fetch page items efficiently.
 */
export async function getStoredCodesPaginated(
  options: GetCodesPaginatedOptions = {}
): Promise<PaginatedCodesResult> {
  const page = Math.max(1, Number(options.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(options.pageSize) || 8));
  const filter = options.filter || 'all';
  const roleFilter = options.roleFilter || 'all';
  const search = (options.search || '').trim();
  const cursor = options.cursor || null;
  const isTeacher = options.callerRole === 'teacher';
  const callerTeacherCode = isTeacher && options.callerCode ? options.callerCode.trim().toUpperCase() : undefined;

  const counts = await getCodesCounts(callerTeacherCode);

  // 1. Search Query branch (Performs targeted server-side queries)
  if (search) {
    try {
      const colRef = collection(db, 'access_codes');
      const searchUpper = search.toUpperCase();
      const resultsMap = new Map<string, AccessCodeRecord>();

      // A. Try exact match by code
      try {
        const exactDoc = await getDoc(doc(db, 'access_codes', searchUpper));
        if (exactDoc.exists) {
          const rec = exactDoc.data() as AccessCodeRecord;
          const matchesTeacher = !callerTeacherCode || rec.teacherCode === callerTeacherCode || rec.createdBy === callerTeacherCode;
          const matchesFilter = filter === 'all' || rec.status === filter;
          const matchesRole = roleFilter === 'all' || (rec.role || 'student') === roleFilter;
          if (matchesTeacher && matchesFilter && matchesRole) {
            resultsMap.set(rec.code, rec);
          }
        }
      } catch (e) {
        // ignore
      }

      // B. Prefix search by code on Firestore
      if (resultsMap.size < pageSize) {
        try {
          const codeConstraints: QueryConstraint[] = [];
          if (callerTeacherCode) codeConstraints.push(where('teacherCode', '==', callerTeacherCode));
          if (filter === 'active') codeConstraints.push(where('status', '==', 'active'));
          else if (filter === 'expired') codeConstraints.push(where('status', '==', 'expired'));
          if (roleFilter !== 'all') codeConstraints.push(where('role', '==', roleFilter));

          codeConstraints.push(where('code', '>=', searchUpper));
          codeConstraints.push(where('code', '<=', searchUpper + '\uf8ff'));
          codeConstraints.push(limit(pageSize));

          const snapCode = await getDocs(query(colRef, ...codeConstraints));
          snapCode.forEach((d) => {
            const rec = sanitizeAccessCodeRecord(d.data());
            resultsMap.set(rec.code, rec);
          });
        } catch (e) {
          console.warn('Prefix code query warning:', e);
        }
      }

      // C. Prefix search by studentName on Firestore
      if (resultsMap.size < pageSize) {
        try {
          const nameConstraints: QueryConstraint[] = [];
          if (callerTeacherCode) nameConstraints.push(where('teacherCode', '==', callerTeacherCode));
          if (filter === 'active') nameConstraints.push(where('status', '==', 'active'));
          else if (filter === 'expired') nameConstraints.push(where('status', '==', 'expired'));
          if (roleFilter !== 'all') nameConstraints.push(where('role', '==', roleFilter));

          nameConstraints.push(where('studentName', '>=', search));
          nameConstraints.push(where('studentName', '<=', search + '\uf8ff'));
          nameConstraints.push(limit(pageSize - resultsMap.size));

          const snapName = await getDocs(query(colRef, ...nameConstraints));
          snapName.forEach((d) => {
            const rec = sanitizeAccessCodeRecord(d.data());
            resultsMap.set(rec.code, rec);
          });
        } catch (e) {
          console.warn('Prefix name query warning:', e);
        }
      }

      const adminCodes = getAdminCodes();
      const matchingRecords = Array.from(resultsMap.values()).filter(
        (r) => !adminCodes.includes(r.code.toUpperCase()) && r.role !== 'master' && r.role !== 'admin'
      );
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
    } catch (err: any) {
      console.warn('[Firestore] Notice fetching search codes:', err?.message || err);
    }
  }

  // 2. Direct Firestore Cursor Query
  try {
    const colRef = collection(db, 'access_codes');
    const constraints: QueryConstraint[] = [];

    if (callerTeacherCode) {
      constraints.push(where('teacherCode', '==', callerTeacherCode));
    }
    if (filter === 'active') {
      constraints.push(where('status', '==', 'active'));
    } else if (filter === 'expired') {
      constraints.push(where('status', '==', 'expired'));
    }
    if (roleFilter !== 'all') {
      constraints.push(where('role', '==', roleFilter));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (cursor) {
      constraints.push(startAfter(cursor));
    } else if (page > 1) {
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

    const adminCodes = getAdminCodes();
    const records: AccessCodeRecord[] = [];
    snap.forEach((d) => {
      const rec = sanitizeAccessCodeRecord(d.data());
      if (rec.code && !adminCodes.includes(rec.code.toUpperCase()) && rec.role !== 'master' && rec.role !== 'admin') {
        records.push(rec);
      }
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
  } catch (err: any) {
    console.warn('[Firestore] Notice fetching paginated codes:', err?.message || err);
    return {
      codes: [],
      totalCount: 0,
      activeCount: 0,
      expiredCount: 0,
      page: options.page || 1,
      pageSize: options.pageSize || 8,
      totalPages: 0,
      nextCursor: null,
      hasMore: false,
    };
  }
}

export async function getAccessCodeRecord(codeOrId: string): Promise<AccessCodeRecord | null> {
  const clean = codeOrId.trim().toUpperCase();
  if (!clean) return null;

  // Master admin codes are managed securely in memory and env, never stored in access_codes
  if (isMasterAdminCode(clean)) {
    return {
      id: clean,
      code: clean,
      role: 'master',
      studentName: 'مالك المنصة',
      status: 'active',
      usedCount: 1,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      lastUsedAt: new Date().toISOString(),
    };
  }

  try {
    // 1. Try direct lookup by code document ID
    const directDoc = doc(db, 'access_codes', clean);
    const snap = await getDoc(directDoc);
    if (snap.exists) {
      return sanitizeAccessCodeRecord(snap.data());
    }

    // 2. Fallback query by ID
    const q = query(collection(db, 'access_codes'), where('id', '==', codeOrId.trim()));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return sanitizeAccessCodeRecord(querySnap.docs[0].data());
    }

    return null;
  } catch (err: any) {
    if (err?.code === 7 || err?.message?.includes('PERMISSION_DENIED') || err?.message?.includes('Missing or insufficient permissions')) {
      console.warn(`[Firestore] IAM permission notice reading access_codes/${clean}.`);
      return null;
    }
    console.warn(`[Firestore] Notice reading access_codes/${clean}:`, err?.message || err);
    return null;
  }
}

export async function verifyCode(inputCode: string): Promise<{
  valid: boolean;
  role: 'master' | 'admin' | 'teacher' | 'student';
  code: string;
  studentName?: string;
  expiresAt?: string | null;
  message: string;
}> {
  const clean = inputCode.trim().toUpperCase();
  if (!clean) {
    return { valid: false, role: 'student', code: '', message: 'من فضلك اكتب الكود أولاً.' };
  }

  // 1. Check if it's a Master Admin Code
  if (isMasterAdminCode(clean)) {
    return {
      valid: true,
      role: 'master',
      code: clean,
      message: 'أهلاً بك يا مالك المنصة 👑',
    };
  }

  // 2. Check codes in Firestore (Teachers & Students)
  try {
    const docRef = doc(db, 'access_codes', clean);
    const snap = await getDoc(docRef);

    if (!snap.exists) {
      return {
        valid: false,
        role: 'student',
        code: clean,
        message: 'كود التفعيل غير صحيح أو غير مسجل في النظام ❌',
      };
    }

    const record = sanitizeAccessCodeRecord(snap.data());
    const userRole = record.role === 'teacher' ? 'teacher' : 'student';

    // Check if status is revoked or expired
    if (record.status === 'revoked') {
      return {
        valid: false,
        role: userRole,
        code: clean,
        message: 'عذراً، هذا الحساب تم إلغاء تفعيله من قبل الإدارة.',
      };
    }

    if (record.status === 'expired') {
      return {
        valid: false,
        role: userRole,
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
        role: userRole,
        code: clean,
        message: 'عذراً، انتهت فترة صلاحية هذا الكود.',
      };
    }

    // Mark usage safely with clean numeric count
    const now = new Date().toISOString();
    try {
      const currentCount = typeof record.usedCount === 'number' ? record.usedCount : 0;
      await updateDoc(docRef, {
        usedCount: currentCount + 1,
        lastUsedAt: now,
      });
    } catch (e) {
      console.warn('Failed to update usedCount:', e);
    }

    const welcomeMessage = userRole === 'teacher'
      ? `أهلاً بك يا أستاذ ${record.studentName || ''} 👨‍🏫! تم فتح بوابة المعلم بنجاح.`
      : `أهلاً بك يا بطل ${record.studentName || ''}! تم التفعيل بنجاح 🎉`;

    return {
      valid: true,
      role: userRole,
      code: record.code,
      studentName: record.studentName,
      expiresAt: record.expiresAt,
      message: welcomeMessage,
    };
  } catch (err: any) {
    if (err?.code === 7 || err?.message?.includes('PERMISSION_DENIED') || err?.message?.includes('Missing or insufficient permissions')) {
      return {
        valid: false,
        role: 'student',
        code: clean,
        message: 'كود غير صحيح، أو أن قاعدة البيانات تتطلب ضبط صلاحية IAM (roles/datastore.user) في Google Cloud.',
      };
    }
    return {
      valid: false,
      role: 'student',
      code: clean,
      message: 'كود التفعيل غير صحيح أو غير مسجل في النظام ❌',
    };
  }
}

export async function generateCode(
  callerCode: string,
  callerRole: 'master' | 'admin' | 'teacher' | 'student',
  options: {
    studentName?: string;
    role?: 'teacher' | 'student';
    customCode?: string;
    durationDays?: number | null; // null or 0 for forever
    maxStudentsLimit?: number;
  }
): Promise<{ success: boolean; code?: AccessCodeRecord; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = callerRole === 'master' || callerRole === 'admin' || getAdminCodes().includes(cleanCaller);
  const isTeacher = callerRole === 'teacher';

  if (!isMaster && !isTeacher) {
    return { success: false, message: 'غير مصرح لك بتوليد الأكواد (يتطلب صلاحية المعلم أو المالك).' };
  }

  // Teachers can only generate Student accounts
  const targetRole: 'teacher' | 'student' = isTeacher ? 'student' : (options.role === 'teacher' ? 'teacher' : 'student');
  const teacherCode = isTeacher ? cleanCaller : undefined;

  // If teacher, check quota limit
  if (isTeacher) {
    const teacherDoc = await getAccessCodeRecord(cleanCaller);
    if (teacherDoc?.maxStudentsLimit && teacherDoc.maxStudentsLimit > 0) {
      const currentCount = await getCodesCounts(cleanCaller);
      if (currentCount.total >= teacherDoc.maxStudentsLimit) {
        return { success: false, message: `لقد بلغت الحد الأقصى المسموح لطلابك (${teacherDoc.maxStudentsLimit} طالب). تواصل مع مالك المنصة لزيادة الحد.` };
      }
    }
  }

  const durationDays = options.durationDays ?? 0;
  if (!Number.isInteger(durationDays) || durationDays < 0 || durationDays > 3650) {
    return { success: false, message: 'مدة الصلاحية يجب أن تكون من 0 إلى 3650 يوماً.' };
  }

  const cleanName = options.studentName?.trim() || (targetRole === 'teacher' ? 'معلم جديد' : 'طالب جديد');
  if (cleanName.length > 100) {
    return { success: false, message: 'الاسم يجب ألا يتجاوز 100 حرف.' };
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
        if (docSnap.exists) {
          return { success: false, message: 'هذا الكود مستخدم بالفعل، اختر كوداً آخر.' };
        }

        const newRecord: AccessCodeRecord = {
          id: `code-${randomUUID()}`,
          code: codeStr,
          role: targetRole,
          studentName: cleanName,
          createdBy: cleanCaller,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt || null,
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

        if (teacherCode) {
          newRecord.teacherCode = teacherCode;
        }
        if (targetRole === 'teacher') {
          newRecord.maxStudentsLimit = options.maxStudentsLimit || 50;
        }

        transaction.set(docRef, newRecord);
        invalidateCodesCountCache();
        return { success: true, code: newRecord, message: `تم إنشاء كود ${targetRole === 'teacher' ? 'المعلم' : 'الطالب'} وحفظه بنجاح.` };
      });
    } catch (err) {
      console.error('Failed to create custom code:', err);
      return { success: false, message: 'لم يتم حفظ الكود بسبب خطأ في الخادم. حاول مرة أخرى.' };
    }
  }

  // Auto-generate unique code with prefix (TCH- for Teacher, STD- for Student)
  const prefix = targetRole === 'teacher' ? 'TCH' : 'STD';
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let attempt = 0; attempt < 20; attempt++) {
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars[randomInt(chars.length)];
    }
    const codeStr = `${prefix}-${rand}`;
    if (getAdminCodes().includes(codeStr)) continue;

    try {
      const res = await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'access_codes', codeStr);
        const docSnap = await transaction.get(docRef);
        if (docSnap.exists) {
          return null; // collision, try again
        }

        const newRecord: AccessCodeRecord = {
          id: `code-${randomUUID()}`,
          code: codeStr,
          role: targetRole,
          studentName: cleanName,
          createdBy: cleanCaller,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt || null,
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

        if (teacherCode) {
          newRecord.teacherCode = teacherCode;
        }
        if (targetRole === 'teacher') {
          newRecord.maxStudentsLimit = options.maxStudentsLimit || 50;
        }

        transaction.set(docRef, newRecord);
        invalidateCodesCountCache();
        return newRecord;
      });

      if (res) {
        return { success: true, code: res, message: `تم إنشاء كود ${targetRole === 'teacher' ? 'المعلم' : 'الطالب'} وحفظه بنجاح.` };
      }
    } catch (err) {
      console.error('Error generating code in transaction:', err);
    }
  }

  return { success: false, message: 'تعذر إنشاء كود فريد الآن. حاول مرة أخرى.' };
}

export async function expireCode(
  callerCode: string,
  callerRole: 'master' | 'admin' | 'teacher' | 'student',
  codeId: string
): Promise<{ success: boolean; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = callerRole === 'master' || callerRole === 'admin' || getAdminCodes().includes(cleanCaller);
  const isTeacher = callerRole === 'teacher';

  if (!isMaster && !isTeacher) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  if (isTeacher && record.teacherCode !== cleanCaller && record.createdBy !== cleanCaller) {
    return { success: false, message: 'غير مصرح لك بتعديل كود طالب لا يتبع فصلك.' };
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
  callerCode: string,
  callerRole: 'master' | 'admin' | 'teacher' | 'student',
  codeId: string,
  extraDays?: number
): Promise<{ success: boolean; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = callerRole === 'master' || callerRole === 'admin' || getAdminCodes().includes(cleanCaller);
  const isTeacher = callerRole === 'teacher';

  if (!isMaster && !isTeacher) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  if (isTeacher && record.teacherCode !== cleanCaller && record.createdBy !== cleanCaller) {
    return { success: false, message: 'غير مصرح لك بتعديل كود طالب لا يتبع فصلك.' };
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
  callerCode: string,
  callerRole: 'master' | 'admin' | 'teacher' | 'student',
  codeId: string
): Promise<{ success: boolean; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = callerRole === 'master' || callerRole === 'admin' || getAdminCodes().includes(cleanCaller);
  const isTeacher = callerRole === 'teacher';

  if (!isMaster && !isTeacher) {
    return { success: false, message: 'غير مصرح لك بهذا الإجراء.' };
  }

  const record = await getAccessCodeRecord(codeId);
  if (!record) {
    return { success: false, message: 'الكود غير موجود.' };
  }

  if (isTeacher && record.teacherCode !== cleanCaller && record.createdBy !== cleanCaller) {
    return { success: false, message: 'غير مصرح لك بحذف كود طالب لا يتبع فصلك.' };
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

export async function updateCodeRecord(
  callerCode: string,
  callerRole: 'master' | 'admin' | 'teacher' | 'student',
  currentCodeOrId: string,
  updates: {
    newCode?: string;
    studentName?: string;
    role?: 'teacher' | 'student';
    status?: 'active' | 'expired' | 'revoked';
    expiresAt?: string | null;
    maxStudentsLimit?: number;
  }
): Promise<{ success: boolean; code?: AccessCodeRecord; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = callerRole === 'master' || callerRole === 'admin' || getAdminCodes().includes(cleanCaller);
  const isTeacher = callerRole === 'teacher';

  if (!isMaster && !isTeacher) {
    return { success: false, message: 'غير مصرح لك بتعديل بيانات هذا الكود.' };
  }

  const record = await getAccessCodeRecord(currentCodeOrId);
  if (!record) {
    return { success: false, message: 'الكود المراد تعديله غير موجود في النظام.' };
  }

  // Teacher permission check: can only edit students belonging to their classroom
  if (isTeacher) {
    if (record.teacherCode !== cleanCaller && record.createdBy !== cleanCaller) {
      return { success: false, message: 'غير مصرح لك بتعديل كود لا يتبع فصلك الدراسي.' };
    }
    if (updates.role && updates.role !== 'student') {
      return { success: false, message: 'المعلم لا يمكنه تغيير رتبة الكود إلى معلم.' };
    }
    if (updates.maxStudentsLimit !== undefined) {
      return { success: false, message: 'تغيير حد الطلاب متاح فقط لمالك المنصة.' };
    }
  }

  const oldCode = record.code.toUpperCase();
  const targetRole = (isMaster && updates.role) ? updates.role : (record.role || 'student');
  const targetName = updates.studentName !== undefined ? updates.studentName.trim() : record.studentName;
  const targetStatus = updates.status !== undefined ? updates.status : record.status;
  const targetExpiresAt = updates.expiresAt !== undefined ? updates.expiresAt : record.expiresAt;
  const targetLimit = (targetRole === 'teacher' && updates.maxStudentsLimit !== undefined)
    ? updates.maxStudentsLimit
    : record.maxStudentsLimit;

  // Case 1: Code string is changing
  if (updates.newCode && updates.newCode.trim().toUpperCase() !== oldCode) {
    const newCode = updates.newCode.trim().toUpperCase();
    if (newCode.length < 3 || newCode.length > 32 || !/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(newCode)) {
      return { success: false, message: 'صيغة الكود الجديد غير صالحة. استخدم من 3 إلى 32 حرفاً أو رقماً وبدون مسافات.' };
    }
    if (getAdminCodes().includes(newCode)) {
      return { success: false, message: 'هذا الكود محجوز لمالك المنصة، اختر كوداً آخر.' };
    }

    try {
      const updated = await runTransaction(db, async (transaction) => {
        const newDocRef = doc(db, 'access_codes', newCode);
        const newSnap = await transaction.get(newDocRef);
        if (newSnap.exists) {
          throw new Error('COLLISION');
        }

        const oldDocRef = doc(db, 'access_codes', oldCode);
        const oldSnap = await transaction.get(oldDocRef);
        const existingData = oldSnap.exists ? oldSnap.data() : record;

        const updatedData: AccessCodeRecord = {
          ...existingData,
          code: newCode,
          studentName: targetName,
          role: targetRole,
          status: targetStatus,
          expiresAt: targetExpiresAt,
          maxStudentsLimit: targetLimit,
        };

        transaction.set(newDocRef, updatedData);
        transaction.delete(oldDocRef);
        return updatedData;
      });

      // If this was a teacher code that changed, update all student records that reference this teacherCode
      if (record.role === 'teacher') {
        try {
          const studentQuery = query(collection(db, 'access_codes'), where('teacherCode', '==', oldCode));
          const studentSnap = await getDocs(studentQuery);
          for (const sDoc of studentSnap.docs) {
            await updateDoc(sDoc.ref, { teacherCode: newCode });
          }
        } catch (e) {
          console.warn('Could not cascade update student teacherCode:', e);
        }
      }

      invalidateCodesCountCache();
      return { success: true, code: updated, message: 'تم تحديث الكود وتغيير رمزه بنجاح.' };
    } catch (err: any) {
      if (err?.message === 'COLLISION') {
        return { success: false, message: 'الكود الجديد مستخدم بالفعل في النظام، يرجى اختيار كود آخر.' };
      }
      console.error('Error renaming code:', err);
      return { success: false, message: 'تعذر تعديل الكود بسبب خطأ في الخادم.' };
    }
  }

  // Case 2: Code string is unchanged, only metadata updated
  try {
    const docRef = doc(db, 'access_codes', oldCode);
    const patch: Partial<AccessCodeRecord> = {
      studentName: targetName,
      role: targetRole,
      status: targetStatus,
      expiresAt: targetExpiresAt,
    };
    if (targetRole === 'teacher' && targetLimit !== undefined) {
      patch.maxStudentsLimit = targetLimit;
    }

    await updateDoc(docRef, patch);
    invalidateCodesCountCache();
    const updatedRecord: AccessCodeRecord = {
      ...record,
      ...patch,
    };
    return { success: true, code: updatedRecord, message: 'تم حفظ التعديلات على الكود بنجاح.' };
  } catch (err) {
    console.error('Error updating code record:', err);
    return { success: false, message: 'تعذر حفظ التعديلات. يرجى المحاولة لاحقاً.' };
  }
}

export async function updateMasterCode(
  callerCode: string,
  newMasterCode: string
): Promise<{ success: boolean; newCode?: string; message: string }> {
  const cleanCaller = callerCode.trim().toUpperCase();
  const isMaster = getAdminCodes().includes(cleanCaller) || cleanCaller === 'MASTER';

  if (!isMaster) {
    return { success: false, message: 'غير مصرح لك بتعديل كود المالك.' };
  }

  const cleanNew = newMasterCode.trim().toUpperCase();
  if (cleanNew.length < 6 || cleanNew.length > 64 || !/^[A-Z0-9_-]+$/.test(cleanNew)) {
    return { success: false, message: 'كود المالك الجديد يجب أن يحتوي على 6 أحرف/أرقام على الأقل، وبدون مسافات.' };
  }

  const added = await addDynamicAdminCode(cleanNew);
  if (!added) {
    return { success: false, message: 'تعذر حفظ كود المالك الجديد.' };
  }

  return {
    success: true,
    newCode: cleanNew,
    message: 'تم تعيين وحفظ كود المالك الجديد بنجاح في النظام 👑',
  };
}

export async function getCodeProgress(code: string): Promise<CodeProgress> {
  const clean = code.trim().toUpperCase();
  if (isMasterAdminCode(clean)) {
    try {
      const adminSnap = await getDoc(doc(db, 'admin_progress', clean));
      if (adminSnap.exists && adminSnap.data()?.progress) {
        return adminSnap.data().progress as CodeProgress;
      }
    } catch {}
    return {
      completedChapters: [],
      completedQuizzes: [],
      lastChapterId: 1,
      challengeCodes: {},
      lastUpdated: new Date().toISOString(),
    };
  }

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

function legacyProgressEntries(progress: Partial<CodeProgress>): ProgressEntries {
  const entries: ProgressEntries = {};
  const stamp = 0;
  const addCompleted = (prefix: string, values: unknown) => {
    if (!Array.isArray(values)) return;
    values.forEach((value) => {
      if (typeof value === 'number' || typeof value === 'string') {
        entries[`${prefix}:${value}`] = { value: true, updatedAt: stamp };
      }
    });
  };
  addCompleted('completedChapter', progress.completedChapters);
  addCompleted('completedQuiz', progress.completedQuizzes);
  addCompleted('completedExam', progress.completedExamParts);
  addCompleted('completedChallenge', progress.completedChallenges);
  addCompleted('bookmarkedChapter', progress.bookmarkedChapterIds);
  for (const [id, value] of Object.entries(progress.chapterNotes || {})) {
    if (typeof value === 'string') entries[`chapterNote:${id}`] = { value, updatedAt: stamp };
  }
  for (const [id, value] of Object.entries(progress.challengeCodes || {})) {
    if (typeof value === 'string') entries[`chapterChallengeCode:${id}`] = { value, updatedAt: stamp };
  }
  return entries;
}

function progressIds(entries: ProgressEntries, prefix: string): string[] {
  const keyPrefix = `${prefix}:`;
  return Object.entries(entries)
    .filter(([key, entry]) => key.startsWith(keyPrefix) && entry.value === true)
    .map(([key]) => key.slice(keyPrefix.length));
}

function progressStringMap(entries: ProgressEntries, prefix: string): Record<string, string> {
  const keyPrefix = `${prefix}:`;
  const values: Record<string, string> = {};
  for (const [key, entry] of Object.entries(entries)) {
    if (key.startsWith(keyPrefix) && typeof entry.value === 'string' && entry.value !== '') {
      values[key.slice(keyPrefix.length)] = entry.value;
    }
  }
  return values;
}

export async function updateCodeProgress(
  code: string,
  progress: Partial<CodeProgress>
): Promise<boolean> {
  const clean = code.trim().toUpperCase();
  const isAdmin = getAdminCodes().includes(clean);
  const targetCollection = isAdmin ? 'admin_progress' : 'access_codes';
  const docRef = doc(db, targetCollection, clean);
  try {
    return await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      const record = snap.exists ? snap.data() : null;
      const existing = (record?.progress || {}) as Partial<CodeProgress>;
      const existingEntries = existing.stateEntries && Object.keys(existing.stateEntries).length
        ? existing.stateEntries
        : legacyProgressEntries(existing);
      const incomingEntries: ProgressEntries = {
        ...legacyProgressEntries(progress),
        ...(progress.stateEntries || {}),
      };
      const mergedEntries: ProgressEntries = { ...existingEntries };
      for (const [key, incoming] of Object.entries(incomingEntries)) {
        const current = mergedEntries[key];
        if (!current || incoming.updatedAt >= current.updatedAt) mergedEntries[key] = incoming;
      }

      const now = new Date().toISOString();
      const updated: CodeProgress = {
        completedChapters: progressIds(mergedEntries, 'completedChapter').map(Number),
        completedQuizzes: progressIds(mergedEntries, 'completedQuiz'),
        completedExamParts: progressIds(mergedEntries, 'completedExam').map(Number),
        completedChallenges: progressIds(mergedEntries, 'completedChallenge'),
        bookmarkedChapterIds: progressIds(mergedEntries, 'bookmarkedChapter').map(Number),
        chapterNotes: progressStringMap(mergedEntries, 'chapterNote'),
        challengeCodes: progressStringMap(mergedEntries, 'chapterChallengeCode'),
        stateEntries: mergedEntries,
        lastChapterId: progress.lastChapterId ?? existing.lastChapterId ?? 1,
        lastUpdated: now,
      };

      const recordBase = snap.exists ? {} : {
        id: randomUUID(),
        code: clean,
        role: isAdmin ? 'master' : 'student',
        studentName: isAdmin ? 'مالك المنصة' : 'طالب كود بالمصري',
        createdAt: now,
        expiresAt: null,
        status: 'active',
        usedCount: 1,
        lastUsedAt: now,
      };
      transaction.set(docRef, { ...recordBase, progress: updated }, { merge: true });
      return true;
    });
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
  const isAdmin = getAdminCodes().includes(clean);
  const targetCollection = isAdmin ? 'admin_progress' : 'access_codes';
  const docRef = doc(db, targetCollection, clean);
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
  if (snap.exists) {
    const docData = snap.data();
    if (docData?.progress) {
      existingProgress = docData.progress as CodeProgress;
    }
  } else {
    recordBase = {
      id: randomUUID(),
      code: clean,
      role: isAdmin ? 'master' : 'student',
      studentName: isAdmin ? 'مالك المنصة' : 'طالب كود بالمصري',
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
  if (snap.exists) {
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
  if (!snap.exists) {
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

/**
 * Restores student access codes and progress from a verified backup.
 * Supports merging with existing records or replacing/upserting them.
 */
export async function restoreCodesBackup(
  adminCode: string,
  incomingCodes: AccessCodeRecord[],
  strategy: 'merge' | 'overwrite' = 'merge'
): Promise<{ success: boolean; restoredCount: number; message: string }> {
  const cleanAdmin = adminCode.trim().toUpperCase();
  if (!getAdminCodes().includes(cleanAdmin)) {
    return { success: false, restoredCount: 0, message: 'غير مصرح لك باستعادة النسخ الاحتياطية (يتطلب صلاحية المدير).' };
  }

  if (!Array.isArray(incomingCodes) || incomingCodes.length === 0) {
    return { success: false, restoredCount: 0, message: 'ملف النسخة الاحتياطية لا يحتوي على أي أكواد صالحة.' };
  }

  let successCount = 0;
  const errors: string[] = [];

  for (const item of incomingCodes) {
    if (!item.code || typeof item.code !== 'string') continue;
    const cleanCode = item.code.trim().toUpperCase();
    if (cleanCode.length < 3 || cleanCode.length > 64) continue;

    const docRef = doc(db, 'access_codes', cleanCode);
    const now = new Date().toISOString();

    const sanitizedRecord: AccessCodeRecord = {
      id: item.id || `code-${randomUUID()}`,
      code: cleanCode,
      studentName: (item.studentName || 'طالب كود بالمصري').slice(0, 120),
      createdAt: item.createdAt || now,
      expiresAt: item.expiresAt || null,
      status: ['active', 'expired', 'revoked'].includes(item.status) ? item.status : 'active',
      usedCount: Number.isInteger(item.usedCount) && item.usedCount >= 0 ? item.usedCount : 0,
      lastUsedAt: item.lastUsedAt || null,
      draftCode: typeof item.draftCode === 'string' ? item.draftCode.slice(0, 100000) : '',
      feedback: typeof item.feedback === 'string' ? item.feedback.slice(0, 2000) : '',
      progress: item.progress || {
        completedChapters: [],
        completedQuizzes: [],
        lastChapterId: 1,
        lastUpdated: now,
        challengeCodes: {},
      },
      savedSnippets: Array.isArray(item.savedSnippets) ? item.savedSnippets.slice(0, 100) : [],
    };

    try {
      if (strategy === 'merge') {
        await setDoc(docRef, sanitizedRecord, { merge: true });
      } else {
        await setDoc(docRef, sanitizedRecord);
      }
      successCount++;
    } catch (err) {
      errors.push(`فشل حفظ الكود ${cleanCode}`);
    }
  }

  invalidateCodesCountCache();

  if (successCount === 0) {
    return { success: false, restoredCount: 0, message: 'تعذر استعادة أي كود من النسخة الاحتياطية.' };
  }

  return {
    success: true,
    restoredCount: successCount,
    message: `تمت استعادة ${successCount} كود طالب بنجاح ومزامنتها في قاعدة البيانات! 🎉`,
  };
}

