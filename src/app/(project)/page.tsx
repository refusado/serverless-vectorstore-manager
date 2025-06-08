'use client';

import { useFiles } from '@/hooks/useFiles';
import { useVectorStore } from '@/hooks/useVectorStore';
import { EmbeddingDoc, FileContent, FileInfo } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useVectorSearch } from '@/hooks/useVectorSearch';
import { Timestamp } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';

export default function Home() {
  const { getFiles, getFileContent } = useFiles();
  const { readDocuments, saveDocument, removeDocument } = useVectorStore();
  const { vectorizeText } = useVectorSearch();

  const [files, setFiles] = useState<FileInfo[]>([]);
  const [docs, setDocs] = useState<Record<string, EmbeddingDoc>>({});
  const [contentDisplay, setContantDisplay] = useState<
    (FileContent & { embeddings: number[]; updatedAt: string }) | null
  >(null);

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

  async function handleVectorize(fileName: string) {
    const fileData = await getFileContent(fileName);
    if (!fileData) {
      console.error(`File content for ${fileName} not found`);
      return;
    }
    console.log(fileData);
    const embedding = await vectorizeText(fileData.content);

    if (embedding) {
      console.log(`File ${fileName} vectorized successfully`);

      const savedDocument = await saveDocument({
        sourceName: fileName,
        embedding: embedding,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('savedDocument', savedDocument);

      if (savedDocument) {
        setDocs((prevDocs) => ({
          ...prevDocs,
          [fileName]: {
            sourceName: fileName,
            embedding: embedding,
            updatedAt: Timestamp.fromDate(new Date()),
          },
        }));
      } else {
        console.error(`Failed to save vector for file ${fileName}`);
      }
    } else {
      console.error(`Failed to vectorize file ${fileName}`);
    }
  }

  async function handleSeeMore(fileName: string) {
    const document = docs[fileName];
    if (!document) {
      console.error(`Document for file ${fileName} not found in vector store`);
      return;
    }

    const content = await getFileContent(fileName);
    if (!content) {
      console.error(`Content for file ${fileName} not found`);
      return;
    }

    setContantDisplay({
      ...content,
      embeddings: document.embedding,
      updatedAt: format(document.updatedAt.toDate(), 'MM/dd/yyyy HH:mm:ss'),
    });
  }

  async function handleDeleteVectors(fileName: string) {
    const isDeleted = await removeDocument(fileName);
    if (isDeleted) {
      setDocs((prevDocs) => {
        const newDocs = { ...prevDocs };
        delete newDocs[fileName];
        return newDocs;
      });
      console.log(`Vectors for file ${fileName} deleted successfully`);
    } else {
      console.error(`Failed to delete vectors for file ${fileName}`);
    }
  }

  return (
    <main className="flex justify-center">
      <div className="container my-12 rounded-lg p-4">
        <table className="min-w-full rounded-md bg-purple-400/10">
          <thead>
            <tr className="border-b border-neutral-200/20 text-left">
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
                ? format(
                    new Date(doc.updatedAt.toDate()),
                    'MM/dd/yyyy HH:mm:ss',
                  )
                : '-';

              return (
                <tr
                  key={file.fileName}
                  className="border-b border-neutral-200/20 hover:bg-neutral-300/5"
                >
                  <td className="p-3">{file.fileName}</td>
                  <td className="p-3">{isVectorized ? 'Yes' : 'No'}</td>
                  <td className="p-3">{updatedAt}</td>
                  <td className="space-x-2 text-sm">
                    {!isVectorized ? (
                      <button
                        onClick={() => handleVectorize(file.fileName)}
                        className="btn bg-blue-500 hover:bg-blue-600"
                      >
                        Vectorize
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSeeMore(file.fileName)}
                          className="btn bg-green-600/70"
                        >
                          See More
                        </button>
                        {/* <button className="btn bg-yellow-600/70">
                          Update Vectors
                        </button> */}
                        <button
                          onClick={() => handleDeleteVectors(file.fileName)}
                          className="btn bg-red-600/70"
                        >
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
      {contentDisplay && (
        <ContentCard
          key={contentDisplay.name}
          title={contentDisplay.title}
          data={[
            ['file', contentDisplay.name],
            ['updated at', contentDisplay.updatedAt],
            ['description', contentDisplay.description],
            ['content', contentDisplay.content],
            ['embeddings', contentDisplay.embeddings.join(', ')],
          ]}
          onClose={() => setContantDisplay(null)}
        />
      )}
    </main>
  );
}
