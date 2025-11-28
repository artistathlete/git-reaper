import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import fc from 'fast-check';

// Mock the dependencies
vi.mock('@/lib/validators', () => ({
  validateGitHubUrl: vi.fn((url: string) => {
    // Simple validation logic for testing
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required and must be a string' };
    }
    const trimmedUrl = url.trim();
    if (trimmedUrl === '') {
      return { isValid: false, error: 'URL cannot be empty' };
    }
    const githubUrlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
    const match = trimmedUrl.match(githubUrlPattern);
    if (!match) {
      return { isValid: false, error: 'Invalid GitHub repository URL format' };
    }
    return { isValid: true, owner: match[1], repo: match[2] };
  }),
}));

vi.mock('@/lib/git/analyzer', () => ({
  analyzeRepository: vi.fn(),
}));

vi.mock('@/lib/git/cleanup', () => ({
  cleanupTempDirectory: vi.fn(),
}));

describe('POST /api/reap - Unit Tests for Error Handling', () => {
  // Unit tests for specific error scenarios
  // Requirements: 4.1, 4.3, 7.2

  it('should return 400 when githubUrl field is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('code');
    expect(data.code).toBe('MISSING_FIELD');
    expect(data.error).toContain('githubUrl');
  });

  it('should return 400 with error message when URL is invalid', async () => {
    const request = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: JSON.stringify({ githubUrl: 'https://gitlab.com/owner/repo' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('code');
    expect(data.code).toBe('INVALID_URL');
    expect(typeof data.error).toBe('string');
    expect(data.error.length).toBeGreaterThan(0);
  });

  it('should match ReapErrorResponse format for all error responses', async () => {
    // Test with missing field
    const request1 = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: JSON.stringify({ wrongField: 'value' }),
    });

    const response1 = await POST(request1);
    const data1 = await response1.json();

    // Verify ReapErrorResponse structure
    expect(data1).toHaveProperty('error');
    expect(data1).toHaveProperty('code');
    expect(typeof data1.error).toBe('string');
    expect(typeof data1.code).toBe('string');
    // details is optional
    if ('details' in data1) {
      expect(typeof data1.details).toBe('string');
    }

    // Test with invalid URL
    const request2 = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: JSON.stringify({ githubUrl: 'not-a-url' }),
    });

    const response2 = await POST(request2);
    const data2 = await response2.json();

    // Verify ReapErrorResponse structure
    expect(data2).toHaveProperty('error');
    expect(data2).toHaveProperty('code');
    expect(typeof data2.error).toBe('string');
    expect(typeof data2.code).toBe('string');
    if ('details' in data2) {
      expect(typeof data2.details).toBe('string');
    }

    // Test with invalid JSON
    const request3 = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: 'invalid json{',
    });

    const response3 = await POST(request3);
    const data3 = await response3.json();

    // Verify ReapErrorResponse structure
    expect(data3).toHaveProperty('error');
    expect(data3).toHaveProperty('code');
    expect(typeof data3.error).toBe('string');
    expect(typeof data3.code).toBe('string');
    if ('details' in data3) {
      expect(typeof data3.details).toBe('string');
    }
  });
});

describe('POST /api/reap - Invalid Input Rejection', () => {
  // Feature: git-reaper, Property 2: Invalid Input Rejection
  // Validates: Requirements 1.3, 4.1, 4.3
  it('property test: rejects all invalid inputs with 400 status', async () => {
    // Generator for empty strings
    const emptyStringArbitrary = fc.constantFrom('', '   ', '\t', '\n');

    // Generator for malformed URLs
    const malformedUrlArbitrary = fc.oneof(
      fc.string().filter(s => !s.includes('github.com')), // Random strings without github.com
      fc.constant('https://gitlab.com/owner/repo'), // Wrong domain
      fc.constant('https://github.com/owner'), // Missing repo
      fc.constant('https://github.com/'), // Missing owner and repo
      fc.constant('github.com/owner/repo'), // Missing protocol
      fc.constant('https://github.com/owner/repo/issues'), // Extra path segments
      fc.constant('https://github.com/owner@invalid/repo'), // Invalid characters
      fc.constant('not-a-url-at-all'), // Not a URL
      fc.webUrl().filter(url => !url.includes('github.com')), // Valid URLs but not GitHub
    );

    // Generator for incomplete request bodies
    const incompleteBodyArbitrary = fc.oneof(
      fc.constant({}), // Empty object
      fc.constant({ wrongField: 'value' }), // Wrong field name
      fc.constant({ githubUrl: undefined }), // Undefined value
      fc.constant({ githubUrl: null }), // Null value
      fc.constant({ githubUrl: 123 }), // Wrong type (number)
      fc.constant({ githubUrl: {} }), // Wrong type (object)
      fc.constant({ githubUrl: [] }), // Wrong type (array)
    );

    // Test 1: Empty strings should be rejected with 400
    await fc.assert(
      fc.asyncProperty(emptyStringArbitrary, async (emptyUrl) => {
        const request = new NextRequest('http://localhost:3000/api/reap', {
          method: 'POST',
          body: JSON.stringify({ githubUrl: emptyUrl }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty('error');
        expect(data).toHaveProperty('code');
      }),
      { numRuns: 100 }
    );

    // Test 2: Malformed URLs should be rejected with 400
    await fc.assert(
      fc.asyncProperty(malformedUrlArbitrary, async (malformedUrl) => {
        const request = new NextRequest('http://localhost:3000/api/reap', {
          method: 'POST',
          body: JSON.stringify({ githubUrl: malformedUrl }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty('error');
        expect(data).toHaveProperty('code');
        expect(data.code).toBe('INVALID_URL');
      }),
      { numRuns: 100 }
    );

    // Test 3: Incomplete request bodies should be rejected with 400
    await fc.assert(
      fc.asyncProperty(incompleteBodyArbitrary, async (incompleteBody) => {
        const request = new NextRequest('http://localhost:3000/api/reap', {
          method: 'POST',
          body: JSON.stringify(incompleteBody),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty('error');
        expect(data).toHaveProperty('code');
      }),
      { numRuns: 100 }
    );

    // Test 4: Invalid JSON should be rejected with 400
    const invalidJsonRequest = new NextRequest('http://localhost:3000/api/reap', {
      method: 'POST',
      body: 'not valid json{',
    });

    const invalidJsonResponse = await POST(invalidJsonRequest);
    const invalidJsonData = await invalidJsonResponse.json();

    expect(invalidJsonResponse.status).toBe(400);
    expect(invalidJsonData).toHaveProperty('error');
    expect(invalidJsonData.code).toBe('INVALID_JSON');
  });
});
