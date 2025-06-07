// where the knowledge docs are stored
export interface KnowledgeDocDirectory {
  files: {
    name: string;
  }[];
}

// knowledge doc file
export interface KnowledgeDoc {
  name: string; // referenced as sourceName, used as ID
  title: string;
  description: string;
  content: string;
}

// key information of a knowledge doc concatenated
export interface KnowledgeKeyContent {
  sourceName: string;
  content: string;
}

// part of a knowledge key content, used for vectorization
export interface KnowledgeKeyContentPart {
  sourceName: string;
  contentPart: string;
  partNumber: number;
}

// vectorization information of a part of a key content
// stored in the database
export interface VectorDoc {
  sourceName: string;
  partNumber: number;
  vectors: number[];
  updatedAt: Date;
}

// information of a knowledge doc for display
export interface KnowledgeDocInfo {
  sourceName: string;
  sourceUrl: string;
  title: string;
  description: string;
  isVectorized: boolean;
  vectorizedAt?: Date;
}

// repository file information for listing
export interface FileInfo {
  fileName: string;
}

// repository file information with content for specific file
export interface FileContent {
  fileName: string;
  fileContent: unknown;
}
