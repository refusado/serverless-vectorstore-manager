import { useCallback } from 'react';
import { fetchFiles, fetchFileContent } from '@/services/github-service';

export function useFiles() {
  return {
    getFiles: useCallback(() => fetchFiles(), []),
    getFileContent: useCallback(
      (fileName: string) => fetchFileContent(fileName),
      [],
    ),
  };
}
