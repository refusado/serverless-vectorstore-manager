'use client';

import { useFiles } from '@/hooks/useFiles';
import { useVectorStore } from '@/hooks/useVectorStore';
import { EmbeddingDoc, FileInfo, KnowledgeDocInfo } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useVectorSearch } from '@/hooks/useVectorSearch';
import { Timestamp } from 'firebase/firestore';
import { ContentCard } from '@/components/content-card';
import { DataTable, TableData } from '@/components/data-table';
import { toast } from 'sonner';

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
        toast.success('Files and documents loaded successfully');
      } catch (error) {
        console.error('Error fetching files or documents:', error);
        toast.error('An error occurred while fetching files or documents.');
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

      console.log(`File "${fileName}" vectorized successfully`);
      toast.success(`File "${fileName}" vectorized successfully`);
    } catch (error) {
      console.error(`Error vectorizing file ${fileName}:`, error);
      toast.error('An error occurred while vectorizing the file.');
    }
  }

  async function handleDetail(fileName: string) {
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
      toast.error(`Error displaying content for file ${fileName}`);
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

      console.log(`Vectors for file "${fileName}" deleted successfully`);
      toast.success(`Vectors for file "${fileName}" deleted successfully`);
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred while deleting "${fileName}" vectors.`);
    }
  }

  return (
    <main className="flex justify-center">
      <div className="container mx-auto my-12 max-w-6xl px-4">
        <DataTable
          data={files.map(({ fileName }): TableData => {
            const doc = docs[fileName];
            const isVectorized = !!doc;
            const updatedAt = isVectorized
              ? format(new Date(doc.updatedAt.toDate()), 'MM/dd/yyyy HH:mm:ss')
              : null;

            return {
              fileName,
              isVectorized,
              updatedAt,
              actions: {
                onVectorize: handleVectorize,
                onDetail: handleDetail,
                onDeleteVectors: handleDeleteVectors,
              },
            };
          })}
        />
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
