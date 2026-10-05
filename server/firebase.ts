import { initializeApp, getApps, getApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
export const firebaseConfig = JSON.parse(rawConfig);

function initAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const options: {
    projectId: string;
    credential?: any;
  } = {
    projectId: firebaseConfig.projectId,
  };

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && fs.existsSync(credPath)) {
    try {
      const sa = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      options.credential = cert(sa);
    } catch (e) {
      console.warn('⚠️ Could not parse GOOGLE_APPLICATION_CREDENTIALS file, falling back to applicationDefault:', e);
      try {
        options.credential = applicationDefault();
      } catch {}
    }
  } else {
    try {
      options.credential = applicationDefault();
    } catch {
      // In local dev without ADC, initialize with project ID
    }
  }

  return initializeApp(options);
}

export const adminApp = initAdminApp();
export const db: Firestore = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);

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
    const docRef = db.collection('test').doc('connection');
    const getPromise = docRef.get();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout (2s)')), 2000)
    );
    await Promise.race([getPromise, timeoutPromise]);
    console.log('✅ Connected to Firebase Firestore via Firebase Admin SDK successfully.');
    connectionVerified = true;
    return true;
  } catch (error: any) {
    const isPermissionError =
      error?.code === 7 ||
      error?.message?.includes('PERMISSION_DENIED') ||
      error?.message?.includes('Missing or insufficient permissions');

    if (isPermissionError) {
      console.warn('⚠️ [Firestore Admin SDK] Cloud IAM Permission Notice:');
      console.warn(`   The deployment runtime identity needs the "roles/datastore.user" IAM role`);
      console.warn(`   on Google Cloud project: ${firebaseConfig.projectId}.`);
      console.warn(`   Firestore database ID: ${firebaseConfig.firestoreDatabaseId}`);
    } else {
      console.warn('⚠️ [Firestore Admin SDK] Connection check notice:', error?.message || error);
    }
    return false;
  }
}

export function isConnectionVerified(): boolean {
  return connectionVerified;
}
