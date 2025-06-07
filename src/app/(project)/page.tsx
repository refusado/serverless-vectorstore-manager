'use client';

import { useFirebase } from '@/hooks/useFirebase';
import { Timestamp } from 'firebase/firestore';

export default function Home() {
  const {
    saveDocument,
    readDocuments,
    removeDocument,
    readDocument,
    updateDocument,
  } = useFirebase();

  const test = async () => {
    const testName = 'cool-data';

    const savedDocument = await saveDocument({
      sourceName: testName,
      updatedAt: Timestamp.fromDate(new Date()),
      embedding: [
        0.333, -0.444, 0.873, -0.231, 0.005, 0.621, -0.412, 0.394, 0.027,
      ],
    });
    console.log('savedDocument', savedDocument);

    const allDocuments = await readDocuments();
    console.log('allDocuments', allDocuments);

    const updatedDocument = await updateDocument(testName, {
      embedding: [
        0.111, -0.222, 0.873, -0.231, 0.005, 0.621, -0.412, 0.394, 0.027,
      ],
    });
    console.log('updatedDocument', updatedDocument);

    const foundDocument = await readDocument(testName);
    console.log('foundDocument', foundDocument);

    const removedDocument = await removeDocument(testName);
    console.log('removedDocument', removedDocument);

    const foundDocument2 = await readDocument(testName);
    console.log('foundDocument2', foundDocument2);
  };

  return (
    <main className="flex justify-center">
      <div className="container bg-red-500/40 p-2">
        <h1 className="text-lg">
          Initial setup - Serverless vector store manager
        </h1>
      </div>
      <button className="rounded bg-blue-500 p-2 text-white" onClick={test}>
        Test Function
      </button>
    </main>
  );
}
