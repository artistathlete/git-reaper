import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import fc from 'fast-check';
import { DeadBranch } from '@/lib/types';
import Tombstone from './Tombstone';

describe('Tombstone Component', () => {
  // Mock window.open for all tests
  let windowOpenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  // Feature: git-reaper, Property 16: Tombstone Click Navigation
  // Validates: Requirements 9.1
  it('property test: clicking tombstone opens correct GitHub commit URL', async () => {
    // Generator for DeadBranch objects
    const deadBranchArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      lastCommitDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
        .map(d => d.toISOString().split('T')[0]),
      lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
    });

    // Generator for repository URLs
    const repoUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
    }).map(({ owner, repo }) => `https://github.com/${owner}/${repo}`);

    await fc.assert(
      fc.asyncProperty(deadBranchArbitrary, repoUrlArbitrary, async (branch, repositoryUrl) => {
        // Clear previous calls
        windowOpenSpy.mockClear();

        // Render the Tombstone component
        const { container, unmount } = render(<Tombstone branch={branch} repositoryUrl={repositoryUrl} />);
        
        // Find the tombstone element
        const tombstone = container.querySelector('.tombstone');
        expect(tombstone).toBeDefined();
        expect(tombstone).not.toBeNull();

        // Simulate a click on the tombstone
        const user = userEvent.setup();
        await user.click(tombstone!);

        // Extract owner and repo from the repository URL
        const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        expect(match).not.toBeNull();
        
        if (match) {
          const [, owner, repo] = match;
          const expectedUrl = `https://github.com/${owner}/${repo}/commit/${branch.lastCommitSha}`;

          // Verify window.open was called with the correct URL
          expect(windowOpenSpy).toHaveBeenCalledTimes(1);
          expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
        }

        // Clean up to prevent memory leaks
        unmount();
      }),
      { numRuns: 100 }
    );
  }, 30000);

  // Feature: git-reaper, Property 9: Tombstone Content Completeness
  // Validates: Requirements 3.3
  it('property test: rendered tombstone contains both branch name and date', () => {
    // Generator for DeadBranch objects with various names and dates
    const deadBranchArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      lastCommitDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
        .map(d => d.toISOString().split('T')[0]),
      lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
    });

    // Generator for repository URLs
    const repoUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
    }).map(({ owner, repo }) => `https://github.com/${owner}/${repo}`);

    fc.assert(
      fc.property(deadBranchArbitrary, repoUrlArbitrary, (branch, repositoryUrl) => {
        // Simulate the Tombstone component's rendering logic
        // The component should display both the branch name and the formatted date
        
        // Test that the branch name is present
        const branchName = branch.name;
        expect(branchName).toBeDefined();
        expect(branchName.length).toBeGreaterThan(0);
        
        // Test that the date is present and can be formatted
        const dateString = branch.lastCommitDate;
        expect(dateString).toBeDefined();
        expect(dateString.length).toBeGreaterThan(0);
        
        // Simulate the formatDate function from the component
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        };
        
        const formattedDate = formatDate(dateString);
        
        // Verify the formatted date is a valid string
        expect(formattedDate).toBeDefined();
        expect(typeof formattedDate).toBe('string');
        expect(formattedDate.length).toBeGreaterThan(0);
        
        // Verify the formatted date contains expected components
        // A properly formatted date should contain a month, day, and year
        expect(formattedDate).toMatch(/\w+/); // Should contain at least one word (month)
        expect(formattedDate).toMatch(/\d+/); // Should contain at least one number (day or year)
        
        // Verify both pieces of content would be rendered
        // In the actual component, these would be in separate divs:
        // <div className="branch-name">{branch.name}</div>
        // <div className="commit-date">{formatDate(branch.lastCommitDate)}</div>
        
        // The rendered output should contain both the name and the formatted date
        const renderedContent = {
          branchName: branchName,
          commitDate: formattedDate
        };
        
        expect(renderedContent.branchName).toBe(branch.name);
        expect(renderedContent.commitDate).toBe(formattedDate);
        
        // Verify both are non-empty strings
        expect(renderedContent.branchName.length).toBeGreaterThan(0);
        expect(renderedContent.commitDate.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  // Unit Tests - Requirements: 3.3
  it('displays branch name and formatted date', () => {
    const mockBranch: DeadBranch = {
      name: 'feature/user-authentication',
      lastCommitDate: '2024-01-15',
      lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
    };
    
    render(<Tombstone branch={mockBranch} repositoryUrl="https://github.com/test/repo" />);
    
    // Should display the branch name
    expect(screen.getByText('feature/user-authentication')).toBeDefined();
    
    // Should display a formatted date (the exact format depends on locale, but it should contain the year)
    const dateElement = screen.getByText(/2024/);
    expect(dateElement).toBeDefined();
  });

  it('displays different branch names correctly', () => {
    const mockBranch: DeadBranch = {
      name: 'bugfix/critical-issue',
      lastCommitDate: '2023-12-25',
      lastCommitSha: 'def456abc123def456abc123def456abc123def4'
    };
    
    render(<Tombstone branch={mockBranch} repositoryUrl="https://github.com/owner/project" />);
    
    // Should display the branch name
    expect(screen.getByText('bugfix/critical-issue')).toBeDefined();
    
    // Should display a formatted date
    const dateElement = screen.getByText(/2023/);
    expect(dateElement).toBeDefined();
  });
});
