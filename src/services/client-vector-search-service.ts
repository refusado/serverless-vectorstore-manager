import { getEmbedding } from 'client-vector-search';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!text || typeof text != 'string') throw new Error('Invalid text input');

    const embedding = await getEmbedding(text);

    if (!Array.isArray(embedding)) throw new Error('Invalid embedding result');

    return embedding;
  } catch (error) {
    console.error(`Error generating embedding for "${text}":`, error);
    throw error;
  }
}
