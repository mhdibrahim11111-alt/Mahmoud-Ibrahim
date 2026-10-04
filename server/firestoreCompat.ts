import {
  FieldValue,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type OrderByDirection,
  type Query,
  type Transaction,
} from 'firebase-admin/firestore';

export type QueryConstraint = (query: Query) => Query;

export function collection(db: Firestore, collectionName: string): CollectionReference {
  return db.collection(collectionName);
}

export function doc(db: Firestore, collectionName: string, documentId: string): DocumentReference {
  return db.collection(collectionName).doc(documentId);
}

export async function getDoc(reference: DocumentReference) {
  return reference.get();
}

export async function getDocs(reference: CollectionReference | Query) {
  return reference.get();
}

export async function setDoc(
  reference: DocumentReference,
  data: DocumentData,
  options?: { merge?: boolean },
) {
  return options ? reference.set(data, options) : reference.set(data);
}

export async function updateDoc(reference: DocumentReference, data: DocumentData) {
  return reference.update(data);
}

export async function deleteDoc(reference: DocumentReference) {
  return reference.delete();
}

export function runTransaction<T>(
  db: Firestore,
  updateFunction: (transaction: Transaction) => Promise<T>,
): Promise<T> {
  return db.runTransaction(updateFunction);
}

export function query(reference: CollectionReference | Query, ...constraints: QueryConstraint[]): Query {
  return constraints.reduce((current, apply) => apply(current), reference);
}

export function where(field: string, operator: FirebaseFirestore.WhereFilterOp, value: unknown): QueryConstraint {
  return (current) => current.where(field, operator, value);
}

export function orderBy(field: string, direction?: OrderByDirection): QueryConstraint {
  return (current) => current.orderBy(field, direction);
}

export function limit(count: number): QueryConstraint {
  return (current) => current.limit(count);
}

export function startAfter(...values: unknown[]): QueryConstraint {
  return (current) => current.startAfter(...values);
}

export function increment(value: number) {
  return FieldValue.increment(value);
}

export async function getCountFromServer(reference: CollectionReference | Query) {
  const snapshot = await reference.count().get();
  return { data: () => snapshot.data() };
}
