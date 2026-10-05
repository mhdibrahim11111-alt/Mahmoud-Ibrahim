import {
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type OrderByDirection,
  type Query,
  type WhereFilterOp,
  FieldValue,
} from 'firebase-admin/firestore';

export type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  OrderByDirection,
  Query,
  WhereFilterOp,
};

export type QueryConstraint = (query: any) => any;

export function collection(db: Firestore, collectionName: string): CollectionReference {
  return db.collection(collectionName);
}

export function doc(dbOrCol: any, collectionOrId: string, documentId?: string): DocumentReference {
  if (documentId !== undefined) {
    return (dbOrCol as Firestore).collection(collectionOrId).doc(documentId);
  }
  return dbOrCol.doc(collectionOrId);
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
    ref: snap.ref,
  };
}

export async function getDoc(reference: DocumentReference) {
  const snap = await reference.get();
  return wrapSnapshot(snap);
}

export async function getDocs(reference: CollectionReference | Query) {
  const snap = await reference.get();
  const wrappedDocs = snap.docs.map((d: any) => wrapSnapshot(d));
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
  return reference.set(sanitized, options || {});
}

export async function updateDoc(reference: DocumentReference, data: DocumentData) {
  const sanitized = cleanUndefined(data);
  return reference.update(sanitized);
}

export async function deleteDoc(reference: DocumentReference) {
  return reference.delete();
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
  return db.runTransaction(async (txn) => {
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
  let q: any = reference;
  for (const constraint of constraints) {
    if (typeof constraint === 'function') {
      q = constraint(q);
    }
  }
  return q as Query;
}

export function where(field: string, operator: WhereFilterOp, value: unknown): QueryConstraint {
  return (q: any) => q.where(field, operator, value);
}

export function orderBy(field: string, direction?: OrderByDirection): QueryConstraint {
  return (q: any) => (direction ? q.orderBy(field, direction) : q.orderBy(field));
}

export function limit(count: number): QueryConstraint {
  return (q: any) => q.limit(count);
}

export function startAfter(...values: unknown[]): QueryConstraint {
  return (q: any) => q.startAfter(...values);
}

export function increment(value: number) {
  return FieldValue.increment(value);
}

export async function getCountFromServer(reference: CollectionReference | Query) {
  const countSnap = await (reference as any).count().get();
  return {
    data: () => ({
      count: countSnap.data().count,
    }),
  };
}
