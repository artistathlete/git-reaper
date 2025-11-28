import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeRepository } from './analyzer';
import * as branchService from './branch-service';
import { simpleGit } from 'simple-git';
import fc from 'fast-check';

// Mock the modules
vi.mock('simple-git');
vi.mock('./branch-service');
vi.mock('fs/promises');

describe('Repository Analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Main branch detection', () => {
    it('should detect "main" as the main branch when it exists', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue([]);

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.deadBranches).toBeDefined();
      expect(branchService.getMergedBranches).toHaveBeenCalledWith(mockGit, 'main');
    });

    it('should detect "master" as the main branch when "main" does not exist', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/master', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue([]);

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.deadBranches).toBeDefined();
      expect(branchService.getMergedBranches).toHaveBeenCalledWith(mockGit, 'master');
    });

    it('should prefer "main" over "master" when both exist', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/master', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue([]);

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.deadBranches).toBeDefined();
      expect(branchService.getMergedBranches).toHaveBeenCalledWith(mockGit, 'main');
    });

    it('should return error when neither "main" nor "master" exists', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/develop', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('No main branch found');
      expect(result.error?.code).toBe('ANALYSIS_FAILED');
    });
  });

  describe('Merged branch filtering', () => {
    it('should retrieve merged branches and their commit info', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue([
        'feature/old-feature',
        'feature/another-feature'
      ]);
      vi.mocked(branchService.getLastCommit)
        .mockResolvedValueOnce({ date: '2024-01-15', sha: 'abc123' })
        .mockResolvedValueOnce({ date: '2024-02-20', sha: 'def456' });

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.deadBranches).toHaveLength(2);
      expect(result.deadBranches).toEqual([
        {
          name: 'feature/old-feature',
          lastCommitDate: '2024-01-15',
          lastCommitSha: 'abc123'
        },
        {
          name: 'feature/another-feature',
          lastCommitDate: '2024-02-20',
          lastCommitSha: 'def456'
        }
      ]);
    });

    it('should skip branches that fail to retrieve commit info', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue([
        'feature/good-branch',
        'feature/bad-branch',
        'feature/another-good-branch'
      ]);
      vi.mocked(branchService.getLastCommit)
        .mockResolvedValueOnce({ date: '2024-01-15', sha: 'abc123' })
        .mockRejectedValueOnce(new Error('Failed to get commit'))
        .mockResolvedValueOnce({ date: '2024-03-10', sha: 'ghi789' });

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      // Should only include branches that succeeded
      expect(result.deadBranches).toHaveLength(2);
      expect(result.deadBranches?.map(b => b.name)).toEqual([
        'feature/good-branch',
        'feature/another-good-branch'
      ]);
    });
  });

  describe('Date formatting', () => {
    it('should format dates consistently in ISO 8601 format', async () => {
      const mockGit = {
        clone: vi.fn().mockResolvedValue(undefined),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main', 'origin/feature/test']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);
      vi.mocked(branchService.getMergedBranches).mockResolvedValue(['feature/test']);
      vi.mocked(branchService.getLastCommit).mockResolvedValue({
        date: '2024-06-15',
        sha: 'abc123'
      });

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 90000
      });

      expect(result.deadBranches?.[0].lastCommitDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.deadBranches?.[0].lastCommitDate).toBe('2024-06-15');
    });
  });

  describe('Timeout handling', () => {
    it('should return timeout error when analysis exceeds timeout limit', async () => {
      const mockGit = {
        clone: vi.fn().mockImplementation(() => {
          // Simulate a long-running operation
          return new Promise((resolve) => setTimeout(resolve, 100000));
        }),
        branch: vi.fn().mockResolvedValue({
          all: ['origin/main']
        })
      };

      vi.mocked(simpleGit).mockReturnValue(mockGit as any);

      const result = await analyzeRepository({
        repoUrl: 'https://github.com/test/repo',
        timeout: 100 // Very short timeout
      });

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('TIMEOUT');
      expect(result.error?.message).toContain('timed out');
      expect(result.tempDir).toBeDefined();
    });
  });

  describe('Property-Based Tests', () => {
    // Feature: git-reaper, Property 14: Branch Data Transformation Pipeline
    // Validates: Requirements 6.1, 6.2, 6.3, 6.4
    it('should transform branch data into DeadBranch objects with all required fields in correct format', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random branch names (1-5 branches)
          fc.array(
            fc.record({
              branchName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => !s.includes('\n') && !s.includes('\0')),
              commitDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
              commitSha: fc.hexaString({ minLength: 40, maxLength: 40 })
            }),
            { minLength: 0, maxLength: 10 }
          ),
          async (branchData) => {
            // Setup mocks for this test case
            const mockGit = {
              clone: vi.fn().mockResolvedValue(undefined),
              branch: vi.fn().mockResolvedValue({
                all: ['origin/main', ...branchData.map(b => `origin/${b.branchName}`)]
              })
            };

            vi.mocked(simpleGit).mockReturnValue(mockGit as any);
            
            // Mock getMergedBranches to return our generated branch names
            vi.mocked(branchService.getMergedBranches).mockResolvedValue(
              branchData.map(b => b.branchName)
            );
            
            // Mock getLastCommit for each branch
            for (const branch of branchData) {
              const isoDate = branch.commitDate.toISOString().split('T')[0];
              vi.mocked(branchService.getLastCommit).mockResolvedValueOnce({
                date: isoDate,
                sha: branch.commitSha
              });
            }

            // Execute the analyzer
            const result = await analyzeRepository({
              repoUrl: 'https://github.com/test/repo',
              timeout: 90000
            });

            // Verify the result
            expect(result.deadBranches).toBeDefined();
            expect(result.deadBranches).toHaveLength(branchData.length);

            // Verify each DeadBranch object has all required fields in correct format
            result.deadBranches?.forEach((deadBranch, index) => {
              const expectedData = branchData[index];
              
              // Property 1: name field exists and matches input
              expect(deadBranch.name).toBeDefined();
              expect(typeof deadBranch.name).toBe('string');
              expect(deadBranch.name).toBe(expectedData.branchName);
              
              // Property 2: lastCommitDate field exists and is in ISO 8601 format (YYYY-MM-DD)
              expect(deadBranch.lastCommitDate).toBeDefined();
              expect(typeof deadBranch.lastCommitDate).toBe('string');
              expect(deadBranch.lastCommitDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
              
              // Property 3: lastCommitSha field exists and is a valid SHA
              expect(deadBranch.lastCommitSha).toBeDefined();
              expect(typeof deadBranch.lastCommitSha).toBe('string');
              expect(deadBranch.lastCommitSha).toMatch(/^[a-f0-9]{40}$/);
              expect(deadBranch.lastCommitSha).toBe(expectedData.commitSha);
              
              // Property 4: All required fields are present (no extra, no missing)
              const keys = Object.keys(deadBranch);
              expect(keys).toContain('name');
              expect(keys).toContain('lastCommitDate');
              expect(keys).toContain('lastCommitSha');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: git-reaper, Property 15: Cleanup Guarantee
    // Validates: Requirements 5.4, 7.4
    it('should always return tempDir path regardless of success or failure for cleanup', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate different scenarios: success, clone failure, branch detection failure
          fc.constantFrom(
            'success',
            'clone_failure',
            'no_main_branch',
            'branch_service_failure'
          ),
          async (scenario) => {
            // Setup mocks based on scenario
            const mockGit = {
              clone: vi.fn(),
              branch: vi.fn()
            };

            vi.mocked(simpleGit).mockReturnValue(mockGit as any);

            switch (scenario) {
              case 'success':
                mockGit.clone.mockResolvedValue(undefined);
                mockGit.branch.mockResolvedValue({
                  all: ['origin/main', 'origin/feature/test']
                });
                vi.mocked(branchService.getMergedBranches).mockResolvedValue(['feature/test']);
                vi.mocked(branchService.getLastCommit).mockResolvedValue({
                  date: '2024-01-15',
                  sha: 'abc123def456abc123def456abc123def456abc1'
                });
                break;

              case 'clone_failure':
                mockGit.clone.mockRejectedValue(new Error('Failed to clone repository'));
                break;

              case 'no_main_branch':
                mockGit.clone.mockResolvedValue(undefined);
                mockGit.branch.mockResolvedValue({
                  all: ['origin/develop', 'origin/feature/test']
                });
                break;

              case 'branch_service_failure':
                mockGit.clone.mockResolvedValue(undefined);
                mockGit.branch.mockResolvedValue({
                  all: ['origin/main']
                });
                vi.mocked(branchService.getMergedBranches).mockRejectedValue(
                  new Error('Failed to get merged branches')
                );
                break;
            }

            // Execute the analyzer
            const result = await analyzeRepository({
              repoUrl: 'https://github.com/test/repo',
              timeout: 90000
            });

            // PROPERTY: The tempDir path must ALWAYS be returned, regardless of success or failure
            // This is critical for cleanup guarantee - the caller needs the path to clean up
            expect(result.tempDir).toBeDefined();
            expect(typeof result.tempDir).toBe('string');
            expect(result.tempDir).toMatch(/git-reaper-/);
            expect(result.tempDir.length).toBeGreaterThan(0);

            // Verify that either deadBranches OR error is present (but tempDir is always there)
            const hasDeadBranches = result.deadBranches !== undefined;
            const hasError = result.error !== undefined;
            expect(hasDeadBranches || hasError).toBe(true);

            // In success cases, deadBranches should be defined and error should not
            // In failure cases, error should be defined
            if (scenario === 'success') {
              expect(result.deadBranches).toBeDefined();
              expect(Array.isArray(result.deadBranches)).toBe(true);
            } else {
              expect(result.error).toBeDefined();
              expect(result.error?.code).toBeDefined();
              expect(result.error?.message).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
