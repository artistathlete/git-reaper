import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMergedBranches, getLastCommit } from './branch-service';
import { SimpleGit } from 'simple-git';

describe('Git Branch Service', () => {
  describe('getMergedBranches', () => {
    it('should filter out main branch from merged branches', async () => {
      // Mock SimpleGit instance
      const mockGit = {
        branch: vi.fn().mockResolvedValue({
          all: [
            'origin/main',
            'origin/feature/user-auth',
            'origin/feature/payment',
            'origin/HEAD -> origin/main'
          ]
        })
      } as unknown as SimpleGit;

      const result = await getMergedBranches(mockGit, 'main');

      expect(result).toEqual(['feature/user-auth', 'feature/payment']);
      expect(result).not.toContain('main');
      expect(mockGit.branch).toHaveBeenCalledWith(['--remote', '--merged', 'main']);
    });

    it('should filter out master branch from merged branches', async () => {
      const mockGit = {
        branch: vi.fn().mockResolvedValue({
          all: [
            'origin/master',
            'origin/feature/old-feature',
            'origin/HEAD -> origin/master'
          ]
        })
      } as unknown as SimpleGit;

      const result = await getMergedBranches(mockGit, 'master');

      expect(result).toEqual(['feature/old-feature']);
      expect(result).not.toContain('master');
      expect(mockGit.branch).toHaveBeenCalledWith(['--remote', '--merged', 'master']);
    });

    it('should remove origin/ prefix from branch names', async () => {
      const mockGit = {
        branch: vi.fn().mockResolvedValue({
          all: [
            'origin/main',
            'origin/feature/test-branch'
          ]
        })
      } as unknown as SimpleGit;

      const result = await getMergedBranches(mockGit, 'main');

      expect(result).toEqual(['feature/test-branch']);
      expect(result[0]).not.toContain('origin/');
    });

    it('should filter out HEAD pointer', async () => {
      const mockGit = {
        branch: vi.fn().mockResolvedValue({
          all: [
            'origin/main',
            'origin/HEAD -> origin/main',
            'origin/feature/test'
          ]
        })
      } as unknown as SimpleGit;

      const result = await getMergedBranches(mockGit, 'main');

      expect(result).toEqual(['feature/test']);
      expect(result.some(b => b.includes('HEAD'))).toBe(false);
    });

    it('should return empty array when no merged branches exist', async () => {
      const mockGit = {
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/HEAD -> origin/main']
        })
      } as unknown as SimpleGit;

      const result = await getMergedBranches(mockGit, 'main');

      expect(result).toEqual([]);
    });

    it('should throw error when git command fails', async () => {
      const mockGit = {
        branch: vi.fn().mockRejectedValue(new Error('Git command failed'))
      } as unknown as SimpleGit;

      await expect(getMergedBranches(mockGit, 'main')).rejects.toThrow(
        'Failed to get merged branches'
      );
    });
  });

  describe('getLastCommit', () => {
    it('should retrieve commit date and SHA for a branch', async () => {
      const mockGit = {
        log: vi.fn().mockResolvedValue({
          latest: {
            hash: 'abc123def456',
            date: '2024-01-15T10:30:00Z'
          }
        })
      } as unknown as SimpleGit;

      const result = await getLastCommit(mockGit, 'feature/test');

      expect(result.sha).toBe('abc123def456');
      expect(result.date).toBe('2024-01-15');
    });

    it('should format date consistently in ISO 8601 format (YYYY-MM-DD)', async () => {
      const mockGit = {
        log: vi.fn().mockResolvedValue({
          latest: {
            hash: 'abc123',
            date: '2024-03-25T14:45:30+01:00'
          }
        })
      } as unknown as SimpleGit;

      const result = await getLastCommit(mockGit, 'feature/test');

      // Should be in YYYY-MM-DD format
      expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.date).toBe('2024-03-25');
    });

    it('should handle different date formats consistently', async () => {
      const testDates = [
        { input: '2024-01-01T00:00:00Z', expected: '2024-01-01' },
        { input: '2024-12-31T23:59:59Z', expected: '2024-12-31' },
        { input: '2024-06-15T12:30:45+05:30', expected: '2024-06-15' }
      ];

      for (const { input, expected } of testDates) {
        const mockGit = {
          log: vi.fn().mockResolvedValue({
            latest: {
              hash: 'abc123',
              date: input
            }
          })
        } as unknown as SimpleGit;

        const result = await getLastCommit(mockGit, 'test-branch');
        expect(result.date).toBe(expected);
      }
    });

    it('should throw error when no commits found for branch', async () => {
      const mockGit = {
        log: vi.fn().mockResolvedValue({
          latest: null
        })
      } as unknown as SimpleGit;

      await expect(getLastCommit(mockGit, 'nonexistent-branch')).rejects.toThrow(
        'No commits found for branch: nonexistent-branch'
      );
    });

    it('should throw error when git log fails', async () => {
      const mockGit = {
        log: vi.fn().mockRejectedValue(new Error('Git log failed'))
      } as unknown as SimpleGit;

      await expect(getLastCommit(mockGit, 'feature/test')).rejects.toThrow(
        'Failed to get last commit for branch feature/test'
      );
    });

    it('should call git log with correct parameters', async () => {
      const mockGit = {
        log: vi.fn().mockResolvedValue({
          latest: {
            hash: 'abc123',
            date: '2024-01-15T10:30:00Z'
          }
        })
      } as unknown as SimpleGit;

      await getLastCommit(mockGit, 'feature/test-branch');

      expect(mockGit.log).toHaveBeenCalledWith({
        maxCount: 1,
        format: { hash: '%H', date: '%cI' },
        'origin/feature/test-branch': null
      });
    });
  });
});
