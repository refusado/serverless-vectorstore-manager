'use client';

import { useVectorSearch } from '@/hooks/useVectorSearch';

export default function Home() {
  const { vectorizeText } = useVectorSearch();

  const test = async () => {
    const vector = await vectorizeText('Test text for vectorization');
    console.log('Generated vector:', vector);
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
