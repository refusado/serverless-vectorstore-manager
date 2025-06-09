'use client';

import { useFiles } from '@/hooks/useFiles';
import { useVectorStore } from '@/hooks/useVectorStore';
import { EmbeddingDoc, FileInfo, KnowledgeDocInfo } from '@/types';
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
  const [docInfo, setDocInfo] = useState<KnowledgeDocInfo | null>(null);

  useEffect(() => {
    (async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching files or documents:', error);
        alert('An error occurred while fetching files or documents.');
      }
    })();
  }, [getFiles, readDocuments]);

  async function handleVectorize(fileName: string) {
    try {
      const fileData = await getFileContent(fileName);
      if (!fileData) throw Error(`File content for ${fileName} not found`);

      const embedding = await vectorizeText(fileData.content);
      if (!embedding) throw Error(`Failed to vectorize file ${fileName}`);

      const savedDoc = await saveDocument({
        sourceName: fileName,
        embedding: embedding,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      console.log('savedDoc', savedDoc);
      if (!savedDoc) throw Error(`Failed to save vector for file ${fileName}`);

      setDocs((prevDocs) => ({
        ...prevDocs,
        [fileName]: {
          sourceName: fileName,
          embedding: embedding,
          updatedAt: Timestamp.fromDate(new Date()),
        },
      }));

      console.log(`File ${fileName} vectorized successfully`);
    } catch (error) {
      console.error(`Error vectorizing file ${fileName}:`, error);
      alert('An error occurred while vectorizing the file.');
    }
  }

  async function handleDetails(fileName: string) {
    try {
      const content = await getFileContent(fileName);
      if (!content) throw new Error(`Content for file ${fileName} not found`);

      const { updatedAt } = docs[fileName];

      setDocInfo({
        ...content,
        embeddedAt: format(updatedAt.toDate(), 'MM/dd/yyyy HH:mm:ss'),
      });

      console.log(`Content for file ${fileName} displayed successfully`);
    } catch (error) {
      console.error(`Error displaying content for file ${fileName}:`, error);
      alert('An error occurred while fetching the content.');
    }
  }

  async function handleDeleteVectors(fileName: string) {
    try {
      const deleted = await removeDocument(fileName);
      if (!deleted) throw new Error(`Failed to delete vectors for ${fileName}`);

      setDocs((prevDocs) => {
        const newDocs = { ...prevDocs };
        delete newDocs[fileName];
        return newDocs;
      });

      console.log(`Vectors for file ${fileName} deleted successfully`);
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the vectors.');
    }
  }

  return (
    <main className="flex justify-center">
      <div className="container my-12 rounded-lg p-4">
        <table className="min-w-full rounded-md bg-purple-400/10">
          <thead>
            <tr className="border-b border-neutral-200/20 text-left">
              <th className="p-3">File Name</th>
              <th className="p-3">Vectorized?</th>
              <th className="p-3">Updated At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(({ fileName }) => {
              const doc = docs[fileName];
              const isVectorized = !!doc;
              const updatedAt = isVectorized
                ? format(
                    new Date(doc.updatedAt.toDate()),
                    'MM/dd/yyyy HH:mm:ss',
                  )
                : '-';

              return (
                <tr
                  key={fileName}
                  className="border-b border-neutral-200/20 hover:bg-neutral-300/5"
                >
                  <td className="p-3">{fileName}</td>
                  <td className="p-3">{isVectorized ? 'Yes' : 'No'}</td>
                  <td className="p-3">{updatedAt}</td>
                  <td className="space-x-2 text-sm">
                    {!isVectorized ? (
                      <button
                        onClick={() => handleVectorize(fileName)}
                        className="btn bg-blue-500 hover:bg-blue-600"
                      >
                        Vectorize
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDetails(fileName)}
                          className="btn bg-green-600/70"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDeleteVectors(fileName)}
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
      {docInfo && (
        <ContentCard
          key={docInfo.name}
          title={docInfo.title}
          data={[
            ['file', docInfo.name],
            ['updated at', docInfo.embeddedAt],
            ['description', docInfo.description],
            ['content', docInfo.content],
          ]}
          onClose={() => setDocInfo(null)}
        />
      )}
    </main>
  );
}
