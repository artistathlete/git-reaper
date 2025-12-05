import { DeadBranch } from '../types';

export interface AnalyzerOptions {
  repoUrl: string;
  timeout: number;
  onProgress?: (current: number, total: number, found: number, status?: string) => void;
  githubToken?: string;
  adaptiveTimeout?: boolean; // Enable adaptive timeout based on branch count
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
  const { repoUrl, timeout, onProgress, githubToken, adaptiveTimeout = true } = options;
  
  const controller = new AbortController();
  let currentTimeout = timeout;
  let timeoutId = setTimeout(() => controller.abort(), currentTimeout);
  
  // Callback to adjust timeout dynamically
  const adjustableProgress = adaptiveTimeout && onProgress 
    ? (current: number, total: number, found: number, status?: string) => {
        // When we first learn the total, adjust timeout
        if (total > 0 && current === 0) {
          clearTimeout(timeoutId);
          // Base 3 minutes + 1 second per branch
          currentTimeout = Math.max(timeout, 180000 + (total * 1000));
          timeoutId = setTimeout(() => controller.abort(), currentTimeout);
        }
        onProgress(current, total, found, status);
      }
    : onProgress;
  
  try {
    const result = await Promise.race([
      performAnalysis(repoUrl, controller.signal, adjustableProgress, githubToken),
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
          message: 'Repository analysis timed out. This repository may have too many branches to analyze quickly. Try using a GitHub token for faster API access.',
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
 * Perform analysis using GitHub API with parallel processing
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
  
  // Create a prioritized list of tokens
  const tokens = [
    githubToken, 
    process.env.GITHUB_TOKEN_1, 
    process.env.GITHUB_TOKEN_2
  ].filter(Boolean) as string[];
  
  let currentTokenIndex = 0;

  // Wrapper for fetch that handles token switching
  const fetchWithRetry = async (url: string) => {
    // If no tokens are available at all, make a single unauthenticated request
    if (tokens.length === 0) {
      return await fetch(url, { signal, headers: { 'Accept': 'application/vnd.github.v3+json' } });
    }

    let response = await fetch(url, {
      signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${tokens[currentTokenIndex]}`
      }
    });

    // Check for rate limit error
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      // If there's another token to try, switch to it
      if (currentTokenIndex < tokens.length - 1) {
        currentTokenIndex++;
        console.log(`GitHub rate limit hit. Switching to token #${currentTokenIndex + 1}`);
        // Retry the request with the new token
        response = await fetch(url, {
          signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${tokens[currentTokenIndex]}`
          }
        });
      }
    }
    return response;
  };
  
  // Get default branch
  if (onProgress) onProgress(0, 0, 0, 'Connecting to GitHub API...');
  const repoResponse = await fetchWithRetry(baseUrl);
  if (!repoResponse.ok) {
    if (repoResponse.status === 403) {
      // Even after retries, we are rate limited.
      throw new Error('GitHub API rate limit exceeded. Please provide a valid GitHub token or wait for the rate limit to reset.');
    }
    throw new Error(`Failed to fetch repository info: ${repoResponse.statusText}`);
  }
  const repoData = await repoResponse.json();
  const defaultBranch = repoData.default_branch;
  
  // Get all branches (handle pagination)
  if (onProgress) onProgress(0, 0, 0, `Fetching branches from ${owner}/${repo}...`);
  const branches: GitHubBranch[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const branchesResponse = await fetchWithRetry(`${baseUrl}/branches?per_page=100&page=${page}`);
    if (!branchesResponse.ok) {
      throw new Error(`Failed to fetch branches: ${branchesResponse.statusText}`);
    }
    const pageBranches: GitHubBranch[] = await branchesResponse.json();
    branches.push(...pageBranches);
    hasMore = pageBranches.length === 100;
    page++;
  }
  
  // Filter out the default branch
  const otherBranches = branches.filter(b => b.name !== defaultBranch);
  const totalBranches = otherBranches.length;
  
  if (onProgress) onProgress(0, totalBranches, 0, `Found ${totalBranches} branches to analyze...`);
  
  // Process branches in parallel batches for speed
  const BATCH_SIZE = 10; // Process 10 branches at a time
  const deadBranches: DeadBranch[] = [];
  let completed = 0;
  
  for (let i = 0; i < otherBranches.length; i += BATCH_SIZE) {
    const batch = otherBranches.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(async (branch) => {
        try {
          // Compare branch with default branch
          const compareResponse = await fetchWithRetry(
            `${baseUrl}/compare/${defaultBranch}...${branch.name}`
          );
          
          if (!compareResponse.ok) return null;
          
          const comparison: GitHubComparison = await compareResponse.json();
          
          // If ahead_by is 0, the branch is fully merged
          if (comparison.ahead_by === 0) {
            // Get commit details
            const commitResponse = await fetchWithRetry(
              `${baseUrl}/commits/${branch.commit.sha}`
            );
            
            if (commitResponse.ok) {
              const commitData: GitHubCommit = await commitResponse.json();
              // Ensure commit data has required structure
              if (commitData?.commit?.author?.date) {
                return {
                  name: branch.name,
                  lastCommitDate: commitData.commit.author.date,
                  lastCommitSha: commitData.sha
                };
              }
            }
          }
          return null;
        } catch (error) {
          // Silently skip branches that fail (likely due to timeout or network issues)
          if (error instanceof Error && error.name === 'AbortError') {
            // Timeout reached, skip this branch
            return null;
          }
          console.error(`Failed to check branch ${branch.name}:`, error);
          return null;
        }
      })
    );
    
    // Collect results from batch
    for (const result of batchResults) {
      completed++;
      if (result.status === 'fulfilled' && result.value) {
        deadBranches.push(result.value);
      }
      
      // Report progress after each branch completes
      if (onProgress) {
        onProgress(completed, totalBranches, deadBranches.length, `Analyzed ${completed}/${totalBranches} branches...`);
      }
    }
  }
  
  if (onProgress) {
    onProgress(totalBranches, totalBranches, deadBranches.length, 'Analysis complete!');
  }
  
  return deadBranches;
}
