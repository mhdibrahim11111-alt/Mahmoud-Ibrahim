import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

// ==========================================
// 1. Production Secrets & Session Config
// ==========================================

let dynamicRevocationEpoch = 0;
const revokedSubjects = new Set<string>();

let _fallbackSecret: string | null = null;

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32 && !secret.includes('replace-with-a-random-secret')) {
    return secret;
  }
  if (!_fallbackSecret) {
    _fallbackSecret = randomBytes(32).toString('hex');
  }
  return _fallbackSecret;
}

export const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60; // 14 days

export type UserRole = 'master' | 'admin' | 'teacher' | 'student';

export interface SessionClaims {
  subject: string;
  code?: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export function sessionSubject(code: string, role: SessionClaims['role']): string {
  return createHmac('sha256', getSessionSecret())
    .update(`${role}:${code.trim().toUpperCase()}`)
    .digest('base64url');
}

export function createSessionToken(code: string, role: SessionClaims['role']): string {
  const now = Math.floor(Date.now() / 1000);
  const normalizedRole: UserRole = role === 'admin' ? 'master' : role;
  const claims: SessionClaims = {
    subject: sessionSubject(code, normalizedRole),
    code: normalizedRole !== 'master' ? code.trim().toUpperCase() : undefined,
    role: normalizedRole,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function readSessionToken(token: string): SessionClaims | null {
  if (!token || typeof token !== 'string') return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  const expected = createHmac('sha256', getSessionSecret()).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionClaims;
    const now = Math.floor(Date.now() / 1000);
    if (!claims.subject || !['master', 'admin', 'teacher', 'student'].includes(claims.role) || claims.exp <= now) {
      return null;
    }
    // Check global revocation epoch
    if (claims.iat < dynamicRevocationEpoch) {
      return null;
    }
    // Check specific revoked subject
    if (revokedSubjects.has(claims.subject)) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export function setDynamicRevocationEpoch(epoch: number): void {
  if (typeof epoch === 'number' && Number.isFinite(epoch)) {
    dynamicRevocationEpoch = Math.max(dynamicRevocationEpoch, epoch);
  }
}

export function getDynamicRevocationEpoch(): number {
  return dynamicRevocationEpoch;
}

export function revokeAllSessions(): number {
  dynamicRevocationEpoch = Math.floor(Date.now() / 1000);
  revokedSubjects.clear();
  return dynamicRevocationEpoch;
}

export function revokeSubjectSessions(subject: string): void {
  revokedSubjects.add(subject);
}

// ==========================================
// 2. Real Client IP Resolution Behind Proxy
// ==========================================

export function getRealClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim();
    if (first) return first;
  }
  return req.socket.remoteAddress || req.ip || '127.0.0.1';
}

// ==========================================
// 3. Resilient Multi-Level Rate Limiter
// ==========================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired rate limit keys every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
  // Safety guard against memory exhaustion (max 10,000 keys)
  if (rateLimitStore.size > 10000) {
    rateLimitStore.clear();
  }
}, 60000).unref();

export function createRateLimiter(options: {
  maxAttempts: number;
  windowMs: number;
  bySession?: boolean;
  prefix?: string;
  errorMessage?: string;
}) {
  const { maxAttempts, windowMs, bySession = false, prefix = 'rl', errorMessage } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = getRealClientIp(req);
    const sessionClaim = bySession ? (req as any).session?.subject : undefined;
    const identifier = sessionClaim ? `sess:${sessionClaim}` : `ip:${ip}`;
    const key = `${prefix}:${identifier}:${req.path}`;

    let record = rateLimitStore.get(key);
    if (!record || record.resetAt <= now) {
      record = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, record);
    }

    if (record.count >= maxAttempts) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        success: false,
        message: errorMessage || `تجاوزت الحد المسموح من المحاولات. الرجاء الانتظار ${retryAfterSec} ثانية.`,
      });
    }

    record.count += 1;
    next();
  };
}

// ==========================================
// 4. Request Integrity & CSRF Protection
// ==========================================

export function enforceRequestIntegrity(req: Request, res: Response, next: NextFunction) {
  // Allow safe idempotent read methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Ensure JSON requests have correct Content-Type if payload exists
  if (req.body && Object.keys(req.body).length > 0 && !req.is('application/json')) {
    return res.status(415).json({ success: false, message: 'نوع المحتوى غير مدعوم (يجب أن يكون application/json)' });
  }

  // Verify Origin / Sec-Fetch-Site for mutation requests if headers present
  const origin = req.headers.origin || req.headers.referer;
  const host = req.headers.host;
  const secFetchSite = req.headers['sec-fetch-site'];

  if (secFetchSite && secFetchSite === 'cross-site') {
    return res.status(403).json({ success: false, message: 'طلب مرفوض: مصدر غير مصرح به (Cross-Site Request Blocked)' });
  }

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host && !originUrl.host.includes('run.app') && !originUrl.host.includes('localhost')) {
        return res.status(403).json({ success: false, message: 'طلب مرفوض: المصدر لا يطابق النطاق' });
      }
    } catch {
      // Ignore invalid referer URL parse, continue
    }
  }

  next();
}

// ==========================================
// 5. Sanitized Security Logger (Redacts Secrets & PII)
// ==========================================

function sanitizeForLog(data: any): string {
  if (typeof data !== 'string') {
    try {
      data = JSON.stringify(data);
    } catch {
      data = String(data);
    }
  }
  return data
    .replace(/Bearer\s+[A-Za-z0-9-_.]+/gi, 'Bearer [REDACTED_TOKEN]')
    .replace(/(?:ADM|STU|CODE)-[A-Za-z0-9-_]{4,32}/gi, '[REDACTED_CODE]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]')
    .replace(/(?:password|secret|token|apiKey|customCode)\s*["':=]\s*["'][^"']+["']/gi, '$1="[REDACTED]"');
}

export const secureLog = {
  info: (msg: string, ...args: any[]) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${sanitizeForLog(msg)}`, ...args.map(sanitizeForLog));
  },
  warn: (msg: string, ...args: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${sanitizeForLog(msg)}`, ...args.map(sanitizeForLog));
  },
  error: (msg: string, ...args: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${sanitizeForLog(msg)}`, ...args.map(sanitizeForLog));
  },
};
