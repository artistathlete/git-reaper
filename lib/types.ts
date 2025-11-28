// Core data types for Git Reaper

/**
 * Represents a dead branch (merged but not deleted)
 */
export interface DeadBranch {
  name: string;           // Branch name (e.g., "feature/user-auth")
  lastCommitDate: string; // ISO 8601 date string (e.g., "2024-01-15")
  lastCommitSha: string;  // Commit SHA for generating GitHub URL
}

/**
 * Request body for the /api/reap endpoint
 */
export interface ReapRequest {
  githubUrl: string; // Full GitHub repository URL
}

/**
 * Success response from the /api/reap endpoint
 */
export interface ReapSuccessResponse {
  deadBranches: DeadBranch[];
  repositoryUrl: string;
  analyzedAt: string; // ISO 8601 timestamp
}

/**
 * Error response from the /api/reap endpoint
 */
export interface ReapErrorResponse {
  error: string;        // Human-readable error message
  code: string;         // Error code (e.g., "INVALID_URL", "CLONE_FAILED")
  details?: string;     // Additional error details
}

/**
 * Result of URL validation
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  owner?: string;  // Extracted repository owner
  repo?: string;   // Extracted repository name
}
