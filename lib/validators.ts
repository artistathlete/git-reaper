// URL validation utilities for Git Reaper
import { ValidationResult } from './types';

/**
 * Validates a GitHub repository URL and extracts owner and repo information
 * @param url - The URL to validate
 * @returns ValidationResult with validation status and extracted information
 */
export function validateGitHubUrl(url: string): ValidationResult {
  // Check if URL is empty or not a string
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL is required and must be a string',
    };
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  if (trimmedUrl === '') {
    return {
      isValid: false,
      error: 'URL cannot be empty',
    };
  }

  // GitHub URL regex pattern as specified in requirements
  const githubUrlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
  
  const match = trimmedUrl.match(githubUrlPattern);

  if (!match) {
    return {
      isValid: false,
      error: 'Invalid GitHub repository URL format. Expected: https://github.com/owner/repo',
    };
  }

  // Extract owner and repo from the regex capture groups
  const [, owner, repo] = match;

  return {
    isValid: true,
    owner,
    repo,
  };
}
