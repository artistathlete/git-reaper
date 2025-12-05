import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import Home from './page';
import fc from 'fast-check';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create a mock response with headers
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
    cleanup();
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

        render(<Home />);
        const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
        const button = screen.getByTestId('pill-reap-button') as HTMLButtonElement;

        fireEvent.change(input, { target: { value: githubUrl } });
        
        await waitFor(() => {
          expect(button.disabled).toBe(false);
        });

        fireEvent.click(button);

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalled();
        });

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('/api/reap');
        expect(options.method).toBe('POST');
        const body = JSON.parse(options.body);
        expect(body.githubUrl).toBe(githubUrl);
        
        cleanup();
      }),
      { numRuns: 10 } // Reduced runs for CI speed
    );
  });
});

describe('Home Page - Loading State Management', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
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

          render(<Home />);
          const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
          const button = screen.getByTestId('pill-reap-button') as HTMLButtonElement;

          fireEvent.change(input, { target: { value: githubUrl } });

          await waitFor(() => expect(button.disabled).toBe(false));

          fireEvent.click(button);

          await waitFor(() => expect(button.disabled).toBe(true));

          await waitFor(() => expect(mockFetch).toHaveBeenCalled());

          await waitFor(() => expect(button.disabled).toBe(false), { timeout: 5000 });

          cleanup();
        }
      ),
      { numRuns: 10 } // Reduced runs
    );
  });
});

describe('Home Page - Success Result Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  // Feature: git-reaper, Property 6: Success Result Display
  it('displays graveyard interface with returned data on successful API response', async () => {
    const githubUrl = 'https://github.com/test-owner/test-repo';
    const deadBranches = [
      {
        name: 'feature/old-branch',
        lastCommitDate: '2023-01-01',
        lastCommitSha: 'abc123def456abc123def456abc123def456abc1',
      },
      {
        name: 'bugfix/another-old-one',
        lastCommitDate: '2022-11-15',
        lastCommitSha: 'def456abc123def456abc123def456abc123def',
      },
    ];

    mockFetch.mockResolvedValueOnce(createMockResponse({
      deadBranches: deadBranches,
      repositoryUrl: githubUrl,
      analyzedAt: new Date().toISOString(),
    }));

    render(<Home />);
    const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
    const button = screen.getByTestId('pill-reap-button') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: githubUrl } });
    
    await waitFor(() => {
      expect(button.disabled).toBe(false);
    });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/reap',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ githubUrl, githubToken: undefined }),
        })
      );
    });

    await waitFor(() => {
      const graveyardElement = screen.getByTestId('graveyard');
      expect(graveyardElement).toBeTruthy();
    }, { timeout: 5000 });

    const tombstones = screen.getAllByTestId('tombstone');
    expect(tombstones.length).toBe(deadBranches.length);
  });
});

describe('Home Page - Error Message Display', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  // Feature: git-reaper, Property 7: Error Message Display
  it('displays error message on failed API response', async () => {
    const githubUrl = 'https://github.com/invalid/repo';
    const errorMessage = 'Repository not found or invalid URL.';

    mockFetch.mockResolvedValueOnce(createMockResponse({ error: errorMessage, code: 'INVALID_URL' }, false));

    render(<Home />);
    const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
    const button = screen.getByTestId('pill-reap-button') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: githubUrl } });
    
    await waitFor(() => {
      expect(button.disabled).toBe(false);
    });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/reap',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ githubUrl, githubToken: undefined }),
        })
      );
    });

    await waitFor(() => {
      const errorElement = screen.getByText(errorMessage, { exact: false });
      expect(errorElement).toBeTruthy();
    }, { timeout: 5000 });
  });
});

describe('Home Page - Component Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders all landing page components on initial load', () => {
    const { container } = render(<Home />);
    
    // Check for Header with About link
    const aboutLink = screen.getByTestId('about-link');
    expect(aboutLink).toBeTruthy();
    
    // Check for Hero Section elements
    const ghostLogo = screen.getByTestId('ghost-logo');
    expect(ghostLogo).toBeTruthy();
    
    const heroTitle = container.querySelector('.hero-title');
    expect(heroTitle?.textContent).toBe('GIT REAPER');
    
    const heroTagline = container.querySelector('.hero-tagline');
    expect(heroTagline?.textContent).toContain('cozy place where dead branches rest in peace');
    
    // Check for PillInput
    const pillInput = screen.getByTestId('pill-input-field');
    expect(pillInput).toBeTruthy();
    
    const reapButton = screen.getByTestId('pill-reap-button');
    expect(reapButton).toBeTruthy();
    
    // Check for FAQ button in header
    const faqLink = screen.getByTestId('faq-link');
    expect(faqLink).toBeTruthy();
    
    // Check for PopularReposGrid
    const popularReposGrid = screen.getByTestId('popular-repos-grid');
    expect(popularReposGrid).toBeTruthy();
  });

  // Requirements 2.1: FAQ button should be in header (no longer in page body)
  it('FAQ button is in header, not in page body', () => {
    render(<Home />);
    
    // FAQ button should be in header
    const faqLink = screen.getByTestId('faq-link');
    expect(faqLink).toBeTruthy();
    
    // FAQ modal should not be visible initially
    const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
    expect(faqModalOverlay).toBeNull();
  });

  it('hides PopularReposGrid during loading state', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Home />);
    
    // Initially visible
    let popularReposSection = screen.queryByTestId('popular-repos-section');
    expect(popularReposSection).toBeTruthy();
    
    // Enter a valid URL and submit
    const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
    const button = screen.getByTestId('pill-reap-button');
    
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    fireEvent.click(button);
    
    // Should be hidden during loading
    await waitFor(() => {
      popularReposSection = screen.queryByTestId('popular-repos-section');
      expect(popularReposSection).toBeNull();
    });
  });

  it('shows results view when analysis completes', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({
      deadBranches: [
        {
          name: 'feature/old-branch',
          lastCommitDate: '2023-01-01',
          lastCommitSha: 'abc123def456abc123def456abc123def456abc1',
        }
      ],
      repositoryUrl: 'https://github.com/facebook/react',
      analyzedAt: new Date().toISOString(),
    }));
    
    const { container } = render(<Home />);
    
    const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
    const button = screen.getByTestId('pill-reap-button');
    
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      const graveyard = container.querySelector('.graveyard');
      expect(graveyard).toBeTruthy();
    });
    
    // Check that back button is present
    const backButton = screen.getByTestId('back-to-landing-button');
    expect(backButton).toBeTruthy();
  });

  it('returns to landing state when back button is clicked', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({
      deadBranches: [
        {
          name: 'feature/old-branch',
          lastCommitDate: '2023-01-01',
          lastCommitSha: 'abc123def456abc123def456abc123def456abc1',
        }
      ],
      repositoryUrl: 'https://github.com/facebook/react',
      analyzedAt: new Date().toISOString(),
    }));
    
    const { container } = render(<Home />);
    
    const input = screen.getByTestId('pill-input-field') as HTMLInputElement;
    const button = screen.getByTestId('pill-reap-button');
    
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    fireEvent.click(button);
    
    // Wait for results
    await waitFor(() => {
      const graveyard = container.querySelector('.graveyard');
      expect(graveyard).toBeTruthy();
    });
    
    // Click back button
    const backButton = screen.getByTestId('back-to-landing-button');
    fireEvent.click(backButton);
    
    // Should return to landing state
    await waitFor(() => {
      const popularReposSection = screen.queryByTestId('popular-repos-section');
      expect(popularReposSection).toBeTruthy();
      
      const graveyard = container.querySelector('.graveyard');
      expect(graveyard).toBeNull();
    });
    
    // Input should be cleared
    expect(input.value).toBe('');
  });
});

describe('Home Page - About Modal Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('opens About modal when About link is clicked', async () => {
    render(<Home />);
    
    // Modal should not be visible initially
    let modalOverlay = screen.queryByTestId('modal-overlay');
    expect(modalOverlay).toBeNull();
    
    // Click About link
    const aboutLink = screen.getByTestId('about-link');
    fireEvent.click(aboutLink);
    
    // Modal should be visible
    await waitFor(() => {
      modalOverlay = screen.queryByTestId('modal-overlay');
      expect(modalOverlay).toBeTruthy();
    });
    
    const modalContent = screen.getByTestId('modal-content');
    expect(modalContent).toBeTruthy();
  });

  it('closes About modal when close button is clicked', async () => {
    render(<Home />);
    
    // Open modal
    const aboutLink = screen.getByTestId('about-link');
    fireEvent.click(aboutLink);
    
    await waitFor(() => {
      const modalOverlay = screen.queryByTestId('modal-overlay');
      expect(modalOverlay).toBeTruthy();
    });
    
    // Close modal
    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);
    
    // Modal should be hidden
    await waitFor(() => {
      const modalOverlay = screen.queryByTestId('modal-overlay');
      expect(modalOverlay).toBeNull();
    });
  });

  it('closes About modal when backdrop is clicked', async () => {
    render(<Home />);
    
    // Open modal
    const aboutLink = screen.getByTestId('about-link');
    fireEvent.click(aboutLink);
    
    await waitFor(() => {
      const modalOverlay = screen.queryByTestId('modal-overlay');
      expect(modalOverlay).toBeTruthy();
    });
    
    // Click backdrop
    const modalOverlay = screen.getByTestId('modal-overlay');
    fireEvent.click(modalOverlay);
    
    // Modal should be hidden
    await waitFor(() => {
      const modalOverlay = screen.queryByTestId('modal-overlay');
      expect(modalOverlay).toBeNull();
    });
  });
});

describe('Home Page - FAQ Modal Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  // **Feature: landing-page-redesign, Property 1: FAQ button click opens modal**
  // **Validates: Requirements 2.2**
  it('property test: clicking FAQ button opens FAQ modal', async () => {
    // Property: For any initial state where the FAQ modal is closed,
    // clicking the FAQ button should result in the FAQ modal becoming visible
    
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // No random input needed - testing deterministic UI behavior
        async () => {
          render(<Home />);
          
          // Verify initial state: FAQ modal should not be visible
          let faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
          expect(faqModalOverlay).toBeNull();
          
          // Find and click the FAQ button
          const faqButton = screen.getByTestId('faq-link');
          fireEvent.click(faqButton);
          
          // Verify post-click state: FAQ modal should be visible
          await waitFor(() => {
            faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
            expect(faqModalOverlay).toBeTruthy();
          });
          
          // Verify modal content is present
          const faqModalContent = screen.getByTestId('faq-modal-content');
          expect(faqModalContent).toBeTruthy();
          
          cleanup();
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design doc
    );
  });

  // Integration test: clicking FAQ button opens modal
  // Requirements: 2.2
  it('integration: clicking FAQ button opens modal', async () => {
    render(<Home />);
    
    // Modal should not be visible initially
    let faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
    expect(faqModalOverlay).toBeNull();
    
    // Click FAQ button
    const faqButton = screen.getByTestId('faq-link');
    fireEvent.click(faqButton);
    
    // Modal should be visible
    await waitFor(() => {
      faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeTruthy();
    });
    
    const faqModalContent = screen.getByTestId('faq-modal-content');
    expect(faqModalContent).toBeTruthy();
  });

  // Integration test: FAQ modal contains expected content
  // Requirements: 2.3
  it('integration: FAQ modal contains expected content', async () => {
    render(<Home />);
    
    // Open FAQ modal
    const faqButton = screen.getByTestId('faq-link');
    fireEvent.click(faqButton);
    
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeTruthy();
    });
    
    // Verify FAQ heading
    expect(screen.getByText(/FAQ & Guide/i)).toBeTruthy();
    
    // Verify all FAQ questions are present (same content as original accordion)
    expect(screen.getByText(/How does this work\?/i)).toBeTruthy();
    expect(screen.getByText(/Is my data stored\?/i)).toBeTruthy();
    expect(screen.getByText(/Is this safe\?/i)).toBeTruthy();
    expect(screen.getByText(/Why need a token\?/i)).toBeTruthy();
    expect(screen.getByText(/How to create token\?/i)).toBeTruthy();
    expect(screen.getByText(/What happens to branches\?/i)).toBeTruthy();
    
    // Verify key FAQ answers
    expect(screen.getByText(/Uses GitHub API to check which branches are merged/i)).toBeTruthy();
    expect(screen.getByText(/Nothing is stored/i)).toBeTruthy();
    expect(screen.getByText(/Read-only access/i)).toBeTruthy();
    expect(screen.getByText(/60 free requests\/hour/i)).toBeTruthy();
    expect(screen.getByText(/You decide what to delete/i)).toBeTruthy();
  });

  // Integration test: closing modal returns to landing page
  // Requirements: 2.4
  it('integration: closing modal via close button returns to landing page', async () => {
    render(<Home />);
    
    // Open FAQ modal
    const faqButton = screen.getByTestId('faq-link');
    fireEvent.click(faqButton);
    
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeTruthy();
    });
    
    // Close modal via close button
    const closeButton = screen.getByTestId('faq-modal-close-button');
    fireEvent.click(closeButton);
    
    // Modal should be hidden
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeNull();
    });
    
    // Landing page elements should still be visible
    const heroTitle = screen.getByText('GIT REAPER');
    expect(heroTitle).toBeTruthy();
    
    const pillInput = screen.getByTestId('pill-input-field');
    expect(pillInput).toBeTruthy();
  });

  // Integration test: closing modal via backdrop returns to landing page
  // Requirements: 2.4
  it('integration: closing modal via backdrop click returns to landing page', async () => {
    render(<Home />);
    
    // Open FAQ modal
    const faqButton = screen.getByTestId('faq-link');
    fireEvent.click(faqButton);
    
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeTruthy();
    });
    
    // Close modal via backdrop click
    const faqModalOverlay = screen.getByTestId('faq-modal-overlay');
    fireEvent.click(faqModalOverlay);
    
    // Modal should be hidden
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeNull();
    });
    
    // Landing page elements should still be visible
    const heroTitle = screen.getByText('GIT REAPER');
    expect(heroTitle).toBeTruthy();
    
    const pillInput = screen.getByTestId('pill-input-field');
    expect(pillInput).toBeTruthy();
  });

  // Integration test: closing modal via Escape key returns to landing page
  // Requirements: 2.4
  it('integration: closing modal via Escape key returns to landing page', async () => {
    render(<Home />);
    
    // Open FAQ modal
    const faqButton = screen.getByTestId('faq-link');
    fireEvent.click(faqButton);
    
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeTruthy();
    });
    
    // Close modal via Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Modal should be hidden
    await waitFor(() => {
      const faqModalOverlay = screen.queryByTestId('faq-modal-overlay');
      expect(faqModalOverlay).toBeNull();
    });
    
    // Landing page elements should still be visible
    const heroTitle = screen.getByText('GIT REAPER');
    expect(heroTitle).toBeTruthy();
    
    const pillInput = screen.getByTestId('pill-input-field');
    expect(pillInput).toBeTruthy();
  });
});