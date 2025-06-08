import { generateEmbedding } from '@/services/client-vector-search-service';
import { useCallback } from 'react';

export function useVectorSearch() {
  return {
    vectorizeText: useCallback((text: string) => generateEmbedding(text), []),
  };
}
