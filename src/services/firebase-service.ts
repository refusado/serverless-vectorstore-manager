import type { EmbeddingDoc } from '../types';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection as firebaseCollection,
  getDocs,
  query,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  projectId: '',
  apiKey: '',
  appId: '',
  authDomain: '',
};

const DATABASE_NAME = '';
const COLLECTION_NAME = '';

const application = initializeApp(firebaseConfig);
const vectorStore = getFirestore(application, DATABASE_NAME);
const vectorCollection = firebaseCollection(vectorStore, COLLECTION_NAME);

export async function saveDocument(document: EmbeddingDoc): Promise<boolean> {
  try {
    const findDocument = await readDocument(document.sourceName);
    if (findDocument) throw new Error(`Document ${document.sourceName} found`);

    await setDoc(
      doc(vectorStore, COLLECTION_NAME, document.sourceName),
      document,
    );
    console.log('Document created successfully');
    return true;
  } catch (error) {
    console.log('Error adding document: ', error);
    return false;
  }
}

export async function readDocuments(): Promise<EmbeddingDoc[] | null> {
  try {
    const q = query(vectorCollection);
    const qSnapshot = await getDocs(q);
    const documents = qSnapshot.docs.map((doc) => doc.data()) as EmbeddingDoc[];

    return documents;
  } catch (error) {
    console.log(`Error reading documents`, error);
    return null;
  }
}

export async function readDocument(
  documentName: string,
): Promise<EmbeddingDoc | null> {
  try {
    const docRef = doc(vectorStore, COLLECTION_NAME, documentName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Document with id '${documentName}' doesn't exist`);
    }

    return docSnap.data() as EmbeddingDoc;
  } catch (error) {
    console.log(`Error reading document ${documentName}: `, error);
    return null;
  }
}

export async function removeDocument(documentName: string): Promise<boolean> {
  try {
    const findDocument = await readDocument(documentName);
    if (!findDocument) throw new Error(`Document ${documentName} not found`);

    await deleteDoc(doc(vectorStore, COLLECTION_NAME, documentName));
    return true;
  } catch (error) {
    console.log(`Error deleting document ${documentName}`, error);
    return false;
  }
}

export async function updateDocument(
  documentName: string,
  newData: {
    embedding: number[];
  },
): Promise<boolean> {
  try {
    const findDocument = await readDocument(documentName);
    if (!findDocument) throw new Error(`Document ${documentName} not found`);

    const newDocument: EmbeddingDoc = {
      embedding: newData.embedding,
      sourceName: documentName,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await setDoc(doc(vectorStore, COLLECTION_NAME, documentName), newDocument);
    console.log(`Document ${documentName} updated successfully`);
    return true;
  } catch (error) {
    console.log('Error updating document: ', error);
    return false;
  }
}
