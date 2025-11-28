export async function preAnalysisHook(githubUrl: string): Promise<{ isArchived: boolean; error?: string | null }> {
  try {
    // Extract owner and repo from GitHub URL
    const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
    const match = githubUrl.match(urlPattern);
    
    if (!match) {
      return { isArchived: false, error: 'Invalid GitHub URL format.' };
    }
    
    const [, owner, repo] = match;
    
    // Construct GitHub API URL
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    // Make GET request to GitHub API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return { isArchived: false, error: 'Could not fetch repository data.' };
    }
    
    const data = await response.json();
    
    return { isArchived: data.archived, error: null };
  } catch (error) {
    return { isArchived: false, error: 'Could not fetch repository data.' };
  }
}
