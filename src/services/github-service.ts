import { FileContent, FileInfo } from '@/types';

const GITHUB_USER = 'refusado';
const GITHUB_REPO = 'serverless-vectorstore-manager';
const REPO_BRANCH = 'master';
const PATH = 'data';

const baseUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;

export async function fetchFiles(): Promise<FileInfo[]> {
  const response = await fetch(
    `${baseUrl}/contents/${PATH}?ref=${REPO_BRANCH}`,
  );
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const files = (await response.json()) as { name: string }[];

  return files.map(({ name }) => {
    if (!name) throw new Error('Invalid file name format');
    return {
      fileName: name,
    };
  });
}

export async function fetchFileContent(fileName: string): Promise<FileContent> {
  const response = await fetch(
    `${baseUrl}/contents/${PATH}/${fileName}?ref=${REPO_BRANCH}`,
  );
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const file = await response.json();
  if (!file.content) throw new Error('Invalid file content format');

  const content = atob(file.content);
  const parsedContent = JSON.parse(content) as FileContent;

  return parsedContent;
}
