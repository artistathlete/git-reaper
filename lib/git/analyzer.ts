import { DeadBranch } from '../types';

export interface AnalyzerOptions {
  repoUrl: string;
  timeout: number;
  onProgress?: (current: number, total: number, found: number, status?: string) => void;
  githubToken?: string;
}

export interface AnalyzerResult {
  deadBranches?: DeadBranch[];
  tempDir: string;
  error?: {
    message: string;
    code: string;
  };
}

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
  };
}

interface GitHubComparison {
  status: string;
  ahead_by: number;
  behind_by: number;
}

/**
 * Analyze a GitHub repository to find dead branches (merged but not deleted)
 * Uses GitHub API instead of cloning - much faster and no downloads!
 */
export async function analyzeRepository(
  options: AnalyzerOptions
): Promise<AnalyzerResult> {
  const { repoUrl, timeout, onProgress, githubToken } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const result = await Promise.race([
      performAnalysis(repoUrl, controller.signal, onProgress, githubToken),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error('Analysis timeout exceeded'));
        });
      })
    ]);
    
    clearTimeout(timeoutId);
    return { deadBranches: result, tempDir: '' };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.message === 'Analysis timeout exceeded') {
      return {
        tempDir: '',
        error: {
          message: 'Repository analysis timed out after 90 seconds',
          code: 'TIMEOUT'
        }
      };
    }
    
    return {
      tempDir: '',
      error: {
        message: error instanceof Error ? error.message : String(error),
        code: 'ANALYSIS_FAILED'
      }
    };
  }
}

/**
 * Perform analysis using GitHub API
 */
async function performAnalysis(
  repoUrl: string,
  signal: AbortSignal,
  onProgress?: (current: number, total: number, found: number, status?: string) => void,
  githubToken?: string
): Promise<DeadBranch[]> {
  // Extract owner and repo from URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }
  
  const [, owner, repo] = match;
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  
  // Setup headers with optional token
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }
  
  // Get default branch
  if (onProgress) onProgress(0, 0, 0, 'Connecting to GitHub API...');
  const repoResponse = await fetch(baseUrl, { signal, headers });
  if (!repoResponse.ok) {
    throw new Error(`Failed to fetch repository info: ${repoResponse.statusText}`);
  }
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;
  
  // Get all branches
  if (onProgress) onProgress(0, 0, 0, `Fetching branches from ${owner}/${repo}...`);
  const branchesResponse = await fetch(`${baseUrl}/branches?per_page=100`, { signal, headers });
  if (!branchesResponse.ok) {
    throw new Error(`Failed to fetch branches: ${branchesResponse.statusText}`);
  }
  const branches: GitHubBranch[] = await branchesResponse.json();
  
  // Filter out the default branch
  const otherBranches = branches.filter(b => b.name !== defaultBranch);
  const totalBranches = otherBranches.length;
  
  if (onProgress) onProgress(0, totalBranches, 0, `Found ${totalBranches} branches to analyze...`);
  
  // Check each branch to see if it's merged
  const deadBranches: DeadBranch[] = [];
  let currentBranch = 0;
  
  for (const branch of otherBranches) {
    currentBranch++;
    
    // Report progress with detailed status
    if (onProgress) {
      onProgress(currentBranch, totalBranches, deadBranches.length, `Analyzing "${branch.name}"...`);
    }
    
    try {
      // Compare branch with default branch
      const compareResponse = await fetch(
        `${baseUrl}/compare/${defaultBranch}...${branch.name}`,
        { signal, headers }
      );
      
      if (!compareResponse.ok) continue;
      
      const comparison: GitHubComparison = await compareResponse.json();
      
      // If ahead_by is 0, the branch is fully merged
      if (comparison.ahead_by === 0) {
        if (onProgress) {
          onProgress(currentBranch, totalBranches, deadBranches.length, `"${branch.name}" is merged! Getting commit details...`);
        }
        
        // Get commit details
        const commitResponse = await fetch(
          `${baseUrl}/commits/${branch.commit.sha}`,
          { signal, headers }
        );
        
        if (commitResponse.ok) {
          const commitData: GitHubCommit = await commitResponse.json();
          deadBranches.push({
            name: branch.name,
            lastCommitDate: commitData.commit.author.date,
            lastCommitSha: commitData.sha
          });
        }
      }
    } catch (error) {
      // Skip branches that fail
      console.error(`Failed to check branch ${branch.name}:`, error);
    }
  }
  
  if (onProgress) {
    onProgress(totalBranches, totalBranches, deadBranches.length, 'Analysis complete!');
  }
  
  return deadBranches;
}
