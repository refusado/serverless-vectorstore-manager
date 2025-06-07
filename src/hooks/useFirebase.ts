import { useCallback } from 'react';
import {
  saveDocument,
  readDocuments,
  readDocument,
  removeDocument,
  updateDocument,
} from '@/services/firebase-service';

export function useFirebase() {
  return {
    saveDocument: useCallback(saveDocument, []),
    readDocuments: useCallback(readDocuments, []),
    readDocument: useCallback(readDocument, []),
    removeDocument: useCallback(removeDocument, []),
    updateDocument: useCallback(updateDocument, []),
  };
}
