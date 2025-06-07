import { useCallback } from 'react';

const GITHUB_USER = 'refusado';
const GITHUB_REPO = 'api-planner';
const REPO_BRANCH = 'main';
const BASE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;

export function useGithub() {
  const getFiles = useCallback(() => fetchFiles(), []);
  const getFileContent = useCallback(
    (fileName: string) => fetchFileContent(fileName),
    [],
  );

  return { getFiles, getFileContent };
}

async function fetchFiles(): Promise<{ fileName: string }[]> {
  const response = await fetch(`${BASE_URL}/contents?ref=${REPO_BRANCH}`);
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const files = (await response.json()) as { name: string }[];

  return files.map(({ name }) => {
    if (!name) throw new Error('Invalid file name format');
    return {
      fileName: name,
    };
  });
}

async function fetchFileContent(fileName: string): Promise<{
  fileName: string;
  fileContent: string;
}> {
  const response = await fetch(
    `${BASE_URL}/contents/${fileName}?ref=${REPO_BRANCH}`,
  );
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const file = await response.json();
  if (!file.content) throw new Error('Invalid file content format');

  const content = atob(file.content);
  const parsedContent = JSON.parse(content);

  return {
    fileName: fileName,
    fileContent: parsedContent,
  };
}
