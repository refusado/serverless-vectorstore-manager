'use client';

import { githubService } from '@/services/github-service';

export default function Home() {
  const test = async () => {
    const files = await githubService.getFiles();
    console.log(files);
    const fileContent = await githubService.getFileContent(files[4].fileName);
    console.log(fileContent);
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
