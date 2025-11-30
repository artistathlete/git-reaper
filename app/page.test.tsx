import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Home from './page';
import fc from 'fast-check';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Home Page - API Request Formation', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 4: API Request Formation
  // Validates: Requirements 2.1
  it('property test: form submission results in POST request with correct payload', async () => {
    // Generator for valid GitHub URLs
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
        // Clear mock before each iteration
        mockFetch.mockClear();
        
        // Mock successful API response
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            deadBranches: [],
            repositoryUrl: githubUrl,
            analyzedAt: new Date().toISOString(),
          }),
        });

        // Render the component
        const { container, unmount } = render(<Home />);

        // Find the input field and button
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        const button = container.querySelector('button') as HTMLButtonElement;

        expect(input).toBeTruthy();
        expect(button).toBeTruthy();

        // Enter the GitHub URL
        fireEvent.change(input, { target: { value: githubUrl } });

        // Click the submit button
        fireEvent.click(button);

        // Wait for the fetch call to be made
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalled();
        });

        // Verify the fetch call was made correctly
        expect(mockFetch).toHaveBeenCalledTimes(1);
        
        // Get the fetch call arguments
        const [url, options] = mockFetch.mock.calls[0];

        // Verify the URL
        expect(url).toBe('/api/reap');

        // Verify the method
        expect(options.method).toBe('POST');

        // Verify the headers
        expect(options.headers).toHaveProperty('Content-Type', 'application/json');

        // Verify the body contains the correct payload
        const body = JSON.parse(options.body);
        expect(body).toHaveProperty('githubUrl');
        expect(body.githubUrl).toBe(githubUrl);
        
        // Clean up after each iteration
        unmount();
      }),
      { numRuns: 100 }
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
  // Validates: Requirements 2.2
  it('property test: loading state is set when analysis starts and cleared when it completes', async () => {
    // Generator for valid GitHub URLs
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    // Generator for API response outcomes (success or failure)
    const apiResponseArbitrary = fc.oneof(
      // Success response
      fc.record({
        type: fc.constant('success' as const),
        deadBranches: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            lastCommitDate: fc.date().map(d => d.toISOString().split('T')[0]),
            lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
          }),
          { maxLength: 10 }
        ),
      }),
      // Error response
      fc.record({
        type: fc.constant('error' as const),
        error: fc.string({ minLength: 1 }),
        code: fc.constantFrom('INVALID_URL', 'CLONE_FAILED', 'TIMEOUT', 'NO_MAIN_BRANCH'),
      })
    );

    await fc.assert(
      fc.asyncProperty(
        validGitHubUrlArbitrary,
        apiResponseArbitrary,
        async (githubUrl, apiResponse) => {
          // Clear mock before each iteration
          mockFetch.mockClear();

          // Mock API response based on the generated response type
          if (apiResponse.type === 'success') {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({
                deadBranches: apiResponse.deadBranches,
                repositoryUrl: githubUrl,
                analyzedAt: new Date().toISOString(),
              }),
            });
          } else {
            mockFetch.mockResolvedValueOnce({
              ok: false,
              json: async () => ({
                error: apiResponse.error,
                code: apiResponse.code,
              }),
            });
          }

          // Render the component
          const { container, unmount } = render(<Home />);

          // Find the input field and button
          const input = container.querySelector('input[type="text"]') as HTMLInputElement;
          const button = container.querySelector('button') as HTMLButtonElement;

          expect(input).toBeTruthy();
          expect(button).toBeTruthy();

          // Initially, button is disabled because URL is empty (invalid)
          expect(button.disabled).toBe(true);

          // Enter the GitHub URL
          fireEvent.change(input, { target: { value: githubUrl } });

          // After entering valid URL, button should be enabled
          await waitFor(() => {
            expect(button.disabled).toBe(false);
          });

          // Click the submit button
          fireEvent.click(button);

          // Immediately after clicking, the button should be disabled (loading state active)
          await waitFor(() => {
            expect(button.disabled).toBe(true);
          }, { timeout: 100 });

          // Wait for the API call to complete
          await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
          });

          // After completion, the button should be enabled again (loading state cleared)
          await waitFor(() => {
            expect(button.disabled).toBe(false);
          }, { timeout: 3000 });

          // Clean up after each iteration
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 10000); // Increase test timeout to 10 seconds
});

describe('Home Page - Success Result Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 6: Success Result Display
  // Validates: Requirements 2.3, 3.1
  it('property test: successful API response renders graveyard interface with returned data', async () => {
    // Generator for valid GitHub URLs
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    // Generator for dead branches with realistic branch names
    const deadBranchArbitrary = fc.record({
      name: fc.stringMatching(/^[a-zA-Z0-9_\/-]{1,100}$/),
      lastCommitDate: fc.date().map(d => d.toISOString().split('T')[0]),
      lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
    });

    // Generator for successful API responses with dead branches
    const successResponseArbitrary = fc.record({
      githubUrl: validGitHubUrlArbitrary,
      deadBranches: fc.array(deadBranchArbitrary, { minLength: 1, maxLength: 20 }),
    });

    await fc.assert(
      fc.asyncProperty(successResponseArbitrary, async ({ githubUrl, deadBranches }) => {
        // Clear mock before each iteration
        mockFetch.mockClear();

        // Mock successful API response with dead branches
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            deadBranches: deadBranches,
            repositoryUrl: githubUrl,
            analyzedAt: new Date().toISOString(),
          }),
        });

        // Render the component
        const { container, unmount } = render(<Home />);

        // Find the input field and button
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        const button = container.querySelector('button') as HTMLButtonElement;

        expect(input).toBeTruthy();
        expect(button).toBeTruthy();

        // Enter the GitHub URL
        fireEvent.change(input, { target: { value: githubUrl } });

        // Click the submit button
        fireEvent.click(button);

        // Wait for the API call to complete
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalled();
        });

        // Wait for the graveyard component to be rendered
        await waitFor(() => {
          const graveyardElement = container.querySelector('.graveyard');
          expect(graveyardElement).toBeTruthy();
        }, { timeout: 3000 });

        // Verify the graveyard is rendered (not the empty state)
        const graveyardElement = container.querySelector('.graveyard');
        expect(graveyardElement).toBeTruthy();
        
        // Verify it's not showing the empty state
        const emptyState = container.querySelector('.empty-state');
        expect(emptyState).toBeFalsy();

        // Verify tombstones are rendered
        const tombstones = container.querySelectorAll('.tombstone');
        expect(tombstones.length).toBe(deadBranches.length);

        // Verify each dead branch is displayed by checking the container text content
        const containerText = container.textContent || '';
        deadBranches.forEach((branch) => {
          // Check that the branch name appears somewhere in the rendered output
          expect(containerText).toContain(branch.name);
        });

        // Clean up after each iteration
        unmount();
      }),
      { numRuns: 100 }
    );
  }, 15000); // Increase test timeout to 15 seconds
});

describe('Home Page - Error Message Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Feature: git-reaper, Property 7: Error Message Display
  // Validates: Requirements 2.4, 7.2
  it('property test: failed API response displays error message with failure reason', async () => {
    // Generator for valid GitHub URLs
    const validGitHubUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
      protocol: fc.constantFrom('https', 'http'),
      trailingSlash: fc.boolean(),
    }).map(({ owner, repo, protocol, trailingSlash }) => 
      `${protocol}://github.com/${owner}/${repo}${trailingSlash ? '/' : ''}`
    );

    // Generator for error responses with various error codes and messages
    const errorResponseArbitrary = fc.record({
      error: fc.oneof(
        fc.constant('Repository not found or is private'),
        fc.constant('Invalid GitHub URL format'),
        fc.constant('Failed to clone repository'),
        fc.constant('Repository has no main branch'),
        fc.constant('Analysis timeout exceeded'),
        fc.string({ minLength: 10, maxLength: 100 })
      ),
      code: fc.constantFrom('INVALID_URL', 'CLONE_FAILED', 'TIMEOUT', 'NO_MAIN_BRANCH', 'NOT_FOUND'),
      details: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(
        validGitHubUrlArbitrary,
        errorResponseArbitrary,
        async (githubUrl, errorResponse) => {
          // Clear mock before each iteration
          mockFetch.mockClear();

          // Mock failed API response
          mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => errorResponse,
          });

          // Render the component
          const { container, unmount } = render(<Home />);

          // Find the input field and button
          const input = container.querySelector('input[type="text"]') as HTMLInputElement;
          const button = container.querySelector('button') as HTMLButtonElement;

          expect(input).toBeTruthy();
          expect(button).toBeTruthy();

          // Enter the GitHub URL
          fireEvent.change(input, { target: { value: githubUrl } });

          // Click the submit button
          fireEvent.click(button);

          // Wait for the API call to complete
          await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
          });

          // Wait for the error message to be displayed
          await waitFor(() => {
            const errorElement = container.querySelector('.error-message');
            expect(errorElement).toBeTruthy();
          }, { timeout: 3000 });

          // Verify the error message contains the failure reason
          const errorElement = container.querySelector('.error-message');
          expect(errorElement).toBeTruthy();
          
          // The error message should contain the error text from the response
          const errorText = errorElement?.textContent || '';
          expect(errorText).toContain(errorResponse.error);

          // Verify that the graveyard is NOT displayed when there's an error
          const graveyardElement = container.querySelector('.graveyard');
          expect(graveyardElement).toBeFalsy();

          // Clean up after each iteration
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 15000); // Increase test timeout to 15 seconds
});
