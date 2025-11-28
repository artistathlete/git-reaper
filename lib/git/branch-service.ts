import { simpleGit, SimpleGit } from 'simple-git';

/**
 * Get all branches that have been merged into the main branch
 * @param git - SimpleGit instance
 * @param mainBranch - Name of the main branch (e.g., "main" or "master")
 * @returns Array of merged branch names
 */
export async function getMergedBranches(
  git: SimpleGit,
  mainBranch: string
): Promise<string[]> {
  try {
    // Get all remote branches that have been merged into the main branch
    // The --merged flag shows branches that are reachable from the specified branch
    const result = await git.branch(['--remote', '--merged', mainBranch]);
    
    // Filter out the main branch itself and extract branch names
    const mergedBranches = result.all
      .filter(branch => {
        // Remove 'origin/' prefix for comparison
        const branchName = branch.replace('origin/', '');
        // Exclude the main branch itself and HEAD pointer
        return branchName !== mainBranch && !branch.includes('HEAD');
      })
      .map(branch => branch.replace('origin/', '')); // Remove origin/ prefix
    
    return mergedBranches;
  } catch (error) {
    throw new Error(`Failed to get merged branches: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get the last commit information for a specific branch
 * @param git - SimpleGit instance
 * @param branch - Branch name
 * @returns Object containing the commit date (ISO 8601 format) and SHA
 */
export async function getLastCommit(
  git: SimpleGit,
  branch: string
): Promise<{ date: string; sha: string }> {
  try {
    // Get the last commit for the branch
    // Format: %H = commit hash, %cI = committer date in ISO 8601 format
    const log = await git.log({
      maxCount: 1,
      format: { hash: '%H', date: '%cI' },
      [`origin/${branch}`]: null
    });
    
    if (!log.latest) {
      throw new Error(`No commits found for branch: ${branch}`);
    }
    
    // Extract date and SHA from the log
    const commitDate = log.latest.date;
    const commitSha = log.latest.hash;
    
    // Convert to ISO 8601 date format (YYYY-MM-DD)
    const isoDate = new Date(commitDate).toISOString().split('T')[0];
    
    return {
      date: isoDate,
      sha: commitSha
    };
  } catch (error) {
    throw new Error(`Failed to get last commit for branch ${branch}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
