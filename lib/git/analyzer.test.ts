import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeRepository } from './analyzer';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Repository Analyzer (GitHub API)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockRepoInfo = {
    default_branch: 'main',
    full_name: 'owner/repo',
  };

  const mockBranches = [
    { name: 'main', commit: { sha: 'sha-main' } },
    { name: 'feature/dead', commit: { sha: 'sha-dead' } },
    { name: 'feature/active', commit: { sha: 'sha-active' } },
  ];

  it('should identify merged branches correctly', async () => {
    // 1. Repo Info Response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepoInfo,
    });

    // 2. Branches Response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBranches,
    });

    // 3. Compare feature/dead (merged)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'identical', ahead_by: 0, behind_by: 5 }),
    });

    // 4. Get commit info for feature/dead
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sha: 'sha-dead', commit: { author: { date: '2023-01-01T00:00:00Z' } } }),
    });

    // 5. Compare feature/active (not merged)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ahead', ahead_by: 2, behind_by: 0 }),
    });

    const result = await analyzeRepository({
      repoUrl: 'https://github.com/owner/repo',
      timeout: 5000
    });

    expect(result.deadBranches).toHaveLength(1);
    expect(result.deadBranches![0].name).toBe('feature/dead');
    expect(result.deadBranches![0].lastCommitDate).toBe('2023-01-01T00:00:00Z');
  });

  it('should handle timeouts gracefully', async () => {
    // Mock a request that hangs
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const analysisPromise = analyzeRepository({
      repoUrl: 'https://github.com/owner/repo',
      timeout: 1000
    });

    // Fast-forward time
    vi.advanceTimersByTime(2000);

    const result = await analysisPromise;

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('TIMEOUT');
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    const result = await analyzeRepository({
      repoUrl: 'https://github.com/owner/repo',
      timeout: 5000
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Failed to fetch repository info');
  });
});
