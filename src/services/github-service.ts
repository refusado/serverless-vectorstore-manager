const GITHUB_USER = 'refusado';
const GITHUB_REPO = 'api-planner';
const REPO_BRANCH = 'main';

export const githubService = {
  getFiles,
  getFileContent,
};

const baseUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;

async function getFiles(): Promise<{ fileName: string }[]> {
  const response = await fetch(`${baseUrl}/contents?ref=${REPO_BRANCH}`);
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

  const files = (await response.json()) as { name: string }[];

  return files.map(({ name }) => {
    if (!name) throw new Error('Invalid file name format');
    return {
      fileName: name,
    };
  });
}

async function getFileContent(fileName: string): Promise<{
  fileName: string;
  fileContent: string;
}> {
  const response = await fetch(
    `${baseUrl}/contents/${fileName}?ref=${REPO_BRANCH}`,
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
