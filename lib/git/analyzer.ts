import { simpleGit } from 'simple-git';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import { DeadBranch } from '../types';
import { getMergedBranches, getLastCommit } from './branch-service';
import { cleanupTempDirectory } from './cleanup';

export interface AnalyzerOptions {
  repoUrl: string;
  timeout: number;
}

export interface AnalyzerResult {
  deadBranches?: DeadBranch[];
  tempDir: string;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Analyze a GitHub repository to find dead branches (merged but not deleted)
 * @param options - Configuration options including repo URL and timeout
 * @returns Result object containing dead branches, temp directory path, and any errors
 */
export async function analyzeRepository(
  options: AnalyzerOptions
): Promise<AnalyzerResult> {
  const { repoUrl, timeout } = options;
  
  // Create a unique temporary directory for this analysis
  const tempDir = path.join(
    os.tmpdir(),
    `git-reaper-${Date.now()}-${Math.random().toString(36).substring(7)}`
  );
  
  // Set up timeout mechanism
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  try {
    // Wrap the analysis in a promise that can be aborted
    const analysisPromise = performAnalysis(repoUrl, tempDir);
    
    // Race between the analysis and the abort signal
    const result = await Promise.race([
      analysisPromise,
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error('Analysis timeout exceeded'));
        });
      })
    ]);
    
    clearTimeout(timeoutId);
    return { deadBranches: result, tempDir };
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Check if it's a timeout error
    if (error instanceof Error && error.message === 'Analysis timeout exceeded') {
      return {
        tempDir,
        error: {
          message: 'Repository analysis timed out after 90 seconds',
          code: 'TIMEOUT'
        }
      };
    }
    
    // Return other errors
    return {
      tempDir,
      error: {
        message: error instanceof Error ? error.message : String(error),
        code: 'ANALYSIS_FAILED'
      }
    };
  }
}

/**
 * Perform the actual repository analysis
 * @param repoUrl - Repository URL
 * @param tempDir - Temporary directory path
 * @returns Array of dead branches
 */
async function performAnalysis(
  repoUrl: string,
  tempDir: string
): Promise<DeadBranch[]> {
  // Create the temporary directory
  await fs.mkdir(tempDir, { recursive: true });
  
  // Initialize simple-git with the temp directory
  const git = simpleGit(tempDir);
  
  // Clone the repository with bare option for efficiency
  await git.clone(repoUrl, tempDir, ['--bare']);
  
  // Detect the main branch (check for "main" first, then "master")
  const branches = await git.branch(['--remote']);
  let mainBranch: string | null = null;
  
  if (branches.all.some(b => b.includes('origin/main'))) {
    mainBranch = 'main';
  } else if (branches.all.some(b => b.includes('origin/master'))) {
    mainBranch = 'master';
  }
  
  if (!mainBranch) {
    throw new Error('No main branch found. Repository must have either "main" or "master" branch.');
  }
  
  // Get all merged branches
  const mergedBranches = await getMergedBranches(git, mainBranch);
  
  // Get commit information for each merged branch
  const deadBranches: DeadBranch[] = [];
  
  for (const branch of mergedBranches) {
    try {
      const commitInfo = await getLastCommit(git, branch);
      deadBranches.push({
        name: branch,
        lastCommitDate: commitInfo.date,
        lastCommitSha: commitInfo.sha
      });
    } catch (error) {
      // Skip branches that fail to retrieve commit info
      console.error(`Failed to get commit info for branch ${branch}:`, error);
    }
  }
  
  return deadBranches;
}
