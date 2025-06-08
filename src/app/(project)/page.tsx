'use client';

import { useFiles } from '@/hooks/useFiles';
import { useVectorStore } from '@/hooks/useVectorStore';
import { EmbeddingDoc, FileInfo } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function Home() {
  const { getFiles } = useFiles();
  const { readDocuments } = useVectorStore();

  const [files, setFiles] = useState<FileInfo[]>([]);
  const [docs, setDocs] = useState<Record<string, EmbeddingDoc>>({});

  useEffect(() => {
    async function fetchData() {
      const fetchedFiles = await getFiles();
      const fetchedDocs = await readDocuments();

      const docsMap: Record<string, EmbeddingDoc> = {};
      if (fetchedDocs) {
        for (const doc of fetchedDocs) {
          docsMap[doc.sourceName] = doc;
        }
      }

      setFiles(fetchedFiles);
      setDocs(docsMap);
    }

    fetchData();
  }, [getFiles, readDocuments]);

  return (
    <main className="flex justify-center">
      <div className="container my-12 rounded-lg p-4">
        <table className="min-w-full rounded-md bg-emerald-700/50">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">File Name</th>
              <th className="p-3">Is Vectorized</th>
              <th className="p-3">Updated At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const doc = docs[file.fileName];
              const isVectorized = !!doc;
              const updatedAt = isVectorized
                ? format(new Date(doc.updatedAt.toDate()), 'MM/dd/yyyy')
                : '-';

              return (
                <tr
                  key={file.fileName}
                  className="border-b hover:bg-gray-100/20"
                >
                  <td className="p-3 font-medium">{file.fileName}</td>
                  <td className="p-3">{isVectorized ? 'Yes' : 'No'}</td>
                  <td className="p-3">{updatedAt}</td>
                  <td className="space-x-2 p-3">
                    {!isVectorized ? (
                      <button className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                        Vectorize
                      </button>
                    ) : (
                      <>
                        <button className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                          See More
                        </button>
                        <button className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                          Vectorize Again
                        </button>
                        <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                          Delete Vectors
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
