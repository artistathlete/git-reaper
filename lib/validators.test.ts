import { describe, it, expect } from 'vitest';
import { validateGitHubUrl } from './validators';
import fc from 'fast-check';

describe('validateGitHubUrl', () => {
  it('should validate a valid HTTPS GitHub URL', () => {
    const result = validateGitHubUrl('https://github.com/owner/repo');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('owner');
    expect(result.repo).toBe('repo');
    expect(result.error).toBeUndefined();
  });

  it('should validate a valid HTTP GitHub URL', () => {
    const result = validateGitHubUrl('http://github.com/owner/repo');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('owner');
    expect(result.repo).toBe('repo');
  });

  it('should validate URL with trailing slash', () => {
    const result = validateGitHubUrl('https://github.com/owner/repo/');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('owner');
    expect(result.repo).toBe('repo');
  });

  it('should validate URL with hyphens and underscores in owner', () => {
    const result = validateGitHubUrl('https://github.com/my-owner_123/repo');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('my-owner_123');
  });

  it('should validate URL with dots, hyphens, and underscores in repo', () => {
    const result = validateGitHubUrl('https://github.com/owner/my-repo_name.js');
    expect(result.isValid).toBe(true);
    expect(result.repo).toBe('my-repo_name.js');
  });

  it('should reject empty string', () => {
    const result = validateGitHubUrl('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject URL with wrong domain', () => {
    const result = validateGitHubUrl('https://gitlab.com/owner/repo');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject URL missing owner', () => {
    const result = validateGitHubUrl('https://github.com/repo');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject URL with extra path segments', () => {
    const result = validateGitHubUrl('https://github.com/owner/repo/issues');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject URL with special characters in owner', () => {
    const result = validateGitHubUrl('https://github.com/owner@123/repo');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject non-string input', () => {
    const result = validateGitHubUrl(null as any);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle whitespace by trimming', () => {
    const result = validateGitHubUrl('  https://github.com/owner/repo  ');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('owner');
    expect(result.repo).toBe('repo');
  });

  // Feature: git-reaper, Property 1: URL Validation Consistency
  // Validates: Requirements 1.2, 4.2
  it('property test: validates GitHub URLs consistently across random inputs', () => {
    // Generator for valid GitHub URLs
    const validGitHubUrlArbitrary = fc.record({
      protocol: fc.constantFrom('http', 'https'),
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]+$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]+$/),
      trailingSlash: fc.boolean(),
    }).map(({ protocol, owner, repo, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    // Generator for invalid URLs (random strings)
    const invalidUrlArbitrary = fc.oneof(
      fc.string(), // Random strings
      fc.webUrl(), // Valid URLs but not GitHub
      fc.constant(''), // Empty string
      fc.constant('https://gitlab.com/owner/repo'), // Wrong domain
      fc.constant('https://github.com/owner'), // Missing repo
      fc.constant('https://github.com/owner/repo/issues'), // Extra path
      fc.record({
        owner: fc.string(),
        repo: fc.string(),
      }).map(({ owner, repo }) => `https://github.com/${owner}/${repo}`) // Potentially invalid characters
    );

    // Property 1: Valid GitHub URLs should always be validated as valid
    fc.assert(
      fc.property(validGitHubUrlArbitrary, (url) => {
        const result = validateGitHubUrl(url);
        // Valid URLs should return isValid: true
        expect(result.isValid).toBe(true);
        // Should extract owner and repo
        expect(result.owner).toBeDefined();
        expect(result.repo).toBeDefined();
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 100 }
    );

    // Property 2: Validation should be consistent - calling twice returns same result
    fc.assert(
      fc.property(fc.oneof(validGitHubUrlArbitrary, invalidUrlArbitrary), (url) => {
        const result1 = validateGitHubUrl(url);
        const result2 = validateGitHubUrl(url);
        
        // Consistency check: same input should produce same output
        expect(result1.isValid).toBe(result2.isValid);
        expect(result1.error).toBe(result2.error);
        expect(result1.owner).toBe(result2.owner);
        expect(result1.repo).toBe(result2.repo);
      }),
      { numRuns: 100 }
    );

    // Property 3: Invalid URLs should always return isValid: false
    fc.assert(
      fc.property(invalidUrlArbitrary, (url) => {
        const result = validateGitHubUrl(url);
        // If it's not a valid GitHub URL format, should return false
        // We need to check if it actually matches the pattern first
        const githubUrlPattern = /^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
        const shouldBeValid = githubUrlPattern.test(url);
        
        if (!shouldBeValid) {
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      }),
      { numRuns: 100 }
    );
  });
});
