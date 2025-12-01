import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Home from './page';
import fc from 'fast-check';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create a mock response with headers
// This fixes the "TypeError: response.headers.get is not a function" error
const createMockResponse = (data: any, ok = true) => ({
  ok,
  headers: {
    get: (key: string) => key.toLowerCase() === 'content-type' ? 'application/json' : null
  },
  json: async () => data,
});

describe('Home Page - API Request Formation', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 4: API Request Formation
  it('property test: form submission results in POST request with correct payload', async () => {
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    await fc.assert(
      fc.asyncProperty(validGitHubUrlArbitrary, async (githubUrl) => {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(createMockResponse({
          deadBranches: [],
          repositoryUrl: githubUrl,
          analyzedAt: new Date().toISOString(),
        }));

        const { container, unmount } = render(<Home />);
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        const button = container.querySelector('button') as HTMLButtonElement;

        fireEvent.change(input, { target: { value: githubUrl } });
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalled();
        });

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('/api/reap');
        expect(options.method).toBe('POST');
        const body = JSON.parse(options.body);
        expect(body.githubUrl).toBe(githubUrl);
        
        unmount();
      }),
      { numRuns: 50 } // Reduced runs slightly for speed
    );
  });
});

describe('Home Page - Loading State Management', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 5: Loading State Management
  it('property test: loading state is set when analysis starts and cleared when it completes', async () => {
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    const apiResponseArbitrary = fc.oneof(
      fc.record({
        type: fc.constant('success' as const),
        deadBranches: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            lastCommitDate: fc.date().map(d => d.toISOString().split('T')[0]),
            lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
          }),
          { maxLength: 5 }
        ),
      }),
      fc.record({
        type: fc.constant('error' as const),
        error: fc.string({ minLength: 1 }),
        code: fc.constantFrom('INVALID_URL', 'CLONE_FAILED', 'TIMEOUT'),
      })
    );

    await fc.assert(
      fc.asyncProperty(
        validGitHubUrlArbitrary,
        apiResponseArbitrary,
        async (githubUrl, apiResponse) => {
          mockFetch.mockClear();

          if (apiResponse.type === 'success') {
            mockFetch.mockResolvedValueOnce(createMockResponse({
              deadBranches: apiResponse.deadBranches,
              repositoryUrl: githubUrl,
              analyzedAt: new Date().toISOString(),
            }));
          } else {
            mockFetch.mockResolvedValueOnce(createMockResponse({
              error: apiResponse.error,
              code: apiResponse.code,
            }, false));
          }

          const { container, unmount } = render(<Home />);
          const input = container.querySelector('input[type="text"]') as HTMLInputElement;
          const button = container.querySelector('button') as HTMLButtonElement;

          fireEvent.change(input, { target: { value: githubUrl } });

          // Wait for button to be enabled
          await waitFor(() => expect(button.disabled).toBe(false));

          fireEvent.click(button);

          // Wait for loading state
          await waitFor(() => expect(button.disabled).toBe(true), { timeout: 200 });

          await waitFor(() => expect(mockFetch).toHaveBeenCalled());

          // Wait for completion
          await waitFor(() => expect(button.disabled).toBe(false), { timeout: 5000 });

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Home Page - Success Result Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 6: Success Result Display
  it('property test: successful API response renders graveyard interface with returned data', async () => {
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    const deadBranchArbitrary = fc.record({
      name: fc.stringMatching(/^[a-zA-Z0-9_\/-]{1,100}$/),
      lastCommitDate: fc.date().map(d => d.toISOString().split('T')[0]),
      lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
    });

    const successResponseArbitrary = fc.record({
      githubUrl: validGitHubUrlArbitrary,
      deadBranches: fc.array(deadBranchArbitrary, { minLength: 1, maxLength: 5 }),
    });

    await fc.assert(
      fc.asyncProperty(successResponseArbitrary, async ({ githubUrl, deadBranches }) => {
        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce(createMockResponse({
          deadBranches: deadBranches,
          repositoryUrl: githubUrl,
          analyzedAt: new Date().toISOString(),
        }));

        const { container, unmount } = render(<Home />);
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        const button = container.querySelector('button') as HTMLButtonElement;

        fireEvent.change(input, { target: { value: githubUrl } });
        fireEvent.click(button);

        await waitFor(() => expect(mockFetch).toHaveBeenCalled());

        await waitFor(() => {
          const graveyardElement = container.querySelector('.graveyard');
          expect(graveyardElement).toBeTruthy();
        }, { timeout: 5000 });

        const tombstones = container.querySelectorAll('[data-testid="tombstone"]');
        expect(tombstones.length).toBe(deadBranches.length);

        unmount();
      }),
      { numRuns: 50 }
    );
  });
});

describe('Home Page - Error Message Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 7: Error Message Display
  it('property test: failed API response displays error message with failure reason', async () => {
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    const errorResponseArbitrary = fc.record({
      error: fc.string({ minLength: 10, maxLength: 100 }),
      code: fc.constantFrom('INVALID_URL', 'CLONE_FAILED', 'TIMEOUT'),
    });

    await fc.assert(
      fc.asyncProperty(
        validGitHubUrlArbitrary,
        errorResponseArbitrary,
        async (githubUrl, errorResponse) => {
          mockFetch.mockClear();
          mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, false));

          const { container, unmount } = render(<Home />);
          const input = container.querySelector('input[type="text"]') as HTMLInputElement;
          const button = container.querySelector('button') as HTMLButtonElement;

          fireEvent.change(input, { target: { value: githubUrl } });
          fireEvent.click(button);

          await waitFor(() => expect(mockFetch).toHaveBeenCalled());

          await waitFor(() => {
            const errorElement = container.querySelector('.error-message');
            expect(errorElement).toBeTruthy();
          }, { timeout: 5000 });

          const errorElement = container.querySelector('.error-message');
          const errorText = errorElement?.textContent || '';
          expect(errorText).toContain(errorResponse.error);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
