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
  type QueryConstraint,
  type WhereFilterOp,
} from 'firebase/firestore';

export type { QueryConstraint };

export function collection(db: Firestore, collectionName: string): CollectionReference {
  return firestoreCollection(db, collectionName);
}

export function doc(db: Firestore, collectionName: string, documentId: string): DocumentReference {
  return firestoreDoc(db, collectionName, documentId);
}

function wrapSnapshot(snap: any) {
  const isExisting = typeof snap.exists === 'function' ? snap.exists() : Boolean(snap.exists);
  return {
    ...snap,
    get exists() {
      return isExisting;
    },
    data: () => snap.data(),
    id: snap.id,
  };
}

export async function getDoc(reference: DocumentReference) {
  const snap = await firestoreGetDoc(reference);
  return wrapSnapshot(snap);
}

export async function getDocs(reference: CollectionReference | Query) {
  return firestoreGetDocs(reference);
}

export async function setDoc(
  reference: DocumentReference,
  data: DocumentData,
  options?: { merge?: boolean },
) {
  return options ? firestoreSetDoc(reference, data, options) : firestoreSetDoc(reference, data);
}

export async function updateDoc(reference: DocumentReference, data: DocumentData) {
  return firestoreUpdateDoc(reference, data);
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
        if (options) txn.set(docRef, data, options);
        else txn.set(docRef, data);
      },
      update: (docRef: DocumentReference, data: any) => txn.update(docRef, data),
      delete: (docRef: DocumentReference) => txn.delete(docRef),
    });
  });
}

export function query(reference: CollectionReference | Query, ...constraints: QueryConstraint[]): Query {
  return firestoreQuery(reference, ...constraints);
}

export function where(field: string, operator: WhereFilterOp, value: unknown): QueryConstraint {
  return firestoreWhere(field, operator, value);
}

export function orderBy(field: string, direction?: OrderByDirection): QueryConstraint {
  return direction ? firestoreOrderBy(field, direction) : firestoreOrderBy(field);
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
  return firestoreGetCountFromServer(reference);
}
