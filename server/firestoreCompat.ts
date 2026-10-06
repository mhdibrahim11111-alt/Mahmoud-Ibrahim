import {
  collection as firestoreCollection,
  doc as firestoreDoc,
  getDoc as firestoreGetDoc,
  getDocs as firestoreGetDocs,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  runTransaction as firestoreRunTransaction,
  query as firestoreQuery,
  where as firestoreWhere,
  orderBy as firestoreOrderBy,
  limit as firestoreLimit,
  startAfter as firestoreStartAfter,
  increment as firestoreIncrement,
  getCountFromServer as firestoreGetCountFromServer,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type OrderByDirection,
  type Query,
  type WhereFilterOp,
  type QueryConstraint,
  type DocumentSnapshot,
} from 'firebase/firestore';

export type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  OrderByDirection,
  Query,
  WhereFilterOp,
  QueryConstraint,
};

export function collection(dbOrCol: any, collectionName: string): CollectionReference {
  return firestoreCollection(dbOrCol, collectionName);
}

export function doc(dbOrCol: any, collectionOrId: string, documentId?: string): DocumentReference {
  if (documentId !== undefined) {
    return firestoreDoc(dbOrCol, collectionOrId, documentId);
  }
  return firestoreDoc(dbOrCol, collectionOrId);
}

function wrapSnapshot(snap: any) {
  const isExisting = typeof snap.exists === 'function' ? snap.exists() : Boolean(snap.exists);
  return {
    ...snap,
    get exists() {
      return isExisting;
    },
    data: () => (typeof snap.data === 'function' ? snap.data() : undefined),
    id: snap.id,
    ref: snap.ref,
  };
}

export async function getDoc(reference: DocumentReference) {
  const snap = await firestoreGetDoc(reference);
  return wrapSnapshot(snap);
}

export async function getDocs(reference: CollectionReference | Query) {
  const snap = await firestoreGetDocs(reference as any);
  const wrappedDocs = snap.docs.map((d) => wrapSnapshot(d));
  return {
    docs: wrappedDocs,
    empty: snap.empty,
    size: snap.size,
    forEach: (callback: (doc: any) => void) => {
      wrappedDocs.forEach(callback);
    },
  };
}

function cleanUndefined(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanUndefined);
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = cleanUndefined(value);
    }
  }
  return result;
}

export async function setDoc(
  reference: DocumentReference,
  data: DocumentData,
  options?: { merge?: boolean },
) {
  const sanitized = cleanUndefined(data);
  return firestoreSetDoc(reference, sanitized, options || {});
}

export async function updateDoc(reference: DocumentReference, data: DocumentData) {
  const sanitized = cleanUndefined(data);
  return firestoreUpdateDoc(reference, sanitized);
}

export async function deleteDoc(reference: DocumentReference) {
  return firestoreDeleteDoc(reference);
}

export function runTransaction<T>(
  db: Firestore,
  updateFunction: (transaction: {
    get: (docRef: DocumentReference) => Promise<any>;
    set: (docRef: DocumentReference, data: any, options?: any) => void;
    update: (docRef: DocumentReference, data: any) => void;
    delete: (docRef: DocumentReference) => void;
  }) => Promise<T>,
): Promise<T> {
  return firestoreRunTransaction(db, async (txn) => {
    return updateFunction({
      get: async (docRef: DocumentReference) => {
        const s = await txn.get(docRef);
        return wrapSnapshot(s);
      },
      set: (docRef: DocumentReference, data: any, options?: any) => {
        const sanitized = cleanUndefined(data);
        if (options) txn.set(docRef, sanitized, options);
        else txn.set(docRef, sanitized);
      },
      update: (docRef: DocumentReference, data: any) => {
        const sanitized = cleanUndefined(data);
        txn.update(docRef, sanitized);
      },
      delete: (docRef: DocumentReference) => {
        txn.delete(docRef);
      },
    });
  });
}

export function query(reference: CollectionReference | Query, ...constraints: QueryConstraint[]): Query {
  return firestoreQuery(reference as any, ...constraints);
}

export function where(field: string, operator: WhereFilterOp, value: unknown): QueryConstraint {
  return firestoreWhere(field, operator, value);
}

export function orderBy(field: string, direction?: OrderByDirection): QueryConstraint {
  return firestoreOrderBy(field, direction);
}

export function limit(count: number): QueryConstraint {
  return firestoreLimit(count);
}

export function startAfter(...values: unknown[]): QueryConstraint {
  return firestoreStartAfter(...values);
}

export function increment(value: number) {
  return firestoreIncrement(value);
}

export async function getCountFromServer(reference: CollectionReference | Query) {
  const countSnap = await firestoreGetCountFromServer(reference as any);
  return {
    data: () => ({
      count: countSnap.data().count,
    }),
  };
}
