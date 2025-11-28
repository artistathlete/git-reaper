import * as fs from 'fs/promises';

/**
 * Recursively remove a temporary directory
 * @param dirPath - Path to the directory to remove
 */
export async function cleanupTempDirectory(dirPath: string): Promise<void> {
  try {
    // Check if the directory exists
    await fs.access(dirPath);
    
    // Recursively remove the directory and all its contents
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    // Handle cleanup errors gracefully - log but don't throw
    // This ensures cleanup failures don't break the main flow
    console.error(`Failed to cleanup directory ${dirPath}:`, error);
  }
}
