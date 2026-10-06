import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore, doc, getDoc } from 'firebase/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
export const firebaseConfig = JSON.parse(rawConfig);

function initFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const firebaseApp = initFirebaseApp();
export const db: Firestore = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

export type OperationType = typeof OperationType[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, pathStr: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path: pathStr,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionVerified = false;

export async function testConnection(): Promise<boolean> {
  try {
    const docRef = doc(db, 'test', 'connection');
    const getPromise = getDoc(docRef);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout (4s)')), 4000)
    );
    await Promise.race([getPromise, timeoutPromise]);
    console.log('✅ Connected to Firebase Firestore successfully.');
    connectionVerified = true;
    return true;
  } catch (error: any) {
    console.warn('⚠️ [Firestore] Connection check notice:', error?.message || error);
    return false;
  }
}

export function isConnectionVerified(): boolean {
  return connectionVerified;
}
