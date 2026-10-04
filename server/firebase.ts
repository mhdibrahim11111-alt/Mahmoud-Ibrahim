import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
export const firebaseConfig = JSON.parse(rawConfig) as {
  projectId: string;
  firestoreDatabaseId: string;
};

// On Google Cloud, ADC uses the service identity attached to the server runtime.
// For local development, configure ADC with gcloud or GOOGLE_APPLICATION_CREDENTIALS.
export const app = getApps()[0] || initializeApp({
  credential: applicationDefault(),
  projectId: firebaseConfig.projectId,
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

export async function testConnection(): Promise<boolean> {
  try {
    await db.doc('test/connection').get();
    console.log('✅ Connected to Firestore with the server identity.');
    return true;
  } catch (error) {
    console.error('Firestore server identity could not read the configured database:', error);
    return false;
  }
}
