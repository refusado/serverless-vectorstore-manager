import { useCallback } from 'react';
import { fetchFiles, fetchFileContent } from '@/services/github-service';

export function useGithub() {
  const getFiles = useCallback(() => fetchFiles(), []);
  const getFileContent = useCallback(
    (fileName: string) => fetchFileContent(fileName),
    [],
  );

  return { getFiles, getFileContent };
}
