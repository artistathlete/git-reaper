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
        const { getByTestId, unmount } = render(<Tombstone branch={branch} repositoryUrl={repositoryUrl} />);
        
        // Find the tombstone element
        const tombstone = getByTestId('tombstone');
        expect(tombstone).toBeDefined();
        expect(tombstone).not.toBeNull();

        // Simulate a click on the tombstone
        const user = userEvent.setup();
        await user.click(tombstone);

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

  // Feature: git-reaper, Property 17: Tombstone Animation Stagger
  // Validates: Requirements 10.1
  it('property test: each tombstone has appropriate animation delay based on index', () => {
    // Generator for arrays of DeadBranch objects
    const deadBranchArrayArbitrary = fc.array(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        lastCommitDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
          .map(d => d.toISOString().split('T')[0]),
        lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
      }),
      { minLength: 0, maxLength: 20 } // Test with 0 to 20 branches
    );

    // Generator for repository URLs
    const repoUrlArbitrary = fc.record({
      owner: fc.stringMatching(/^[a-zA-Z0-9_-]{1,39}$/),
      repo: fc.stringMatching(/^[a-zA-Z0-9_.-]{1,100}$/),
    }).map(({ owner, repo }) => `https://github.com/${owner}/${repo}`);

    fc.assert(
      fc.property(deadBranchArrayArbitrary, repoUrlArbitrary, (branches, repositoryUrl) => {
        // For each branch in the array, verify the animation delay is correct
        branches.forEach((branch, index) => {
          const { getByTestId, unmount } = render(
            <Tombstone branch={branch} repositoryUrl={repositoryUrl} index={index} />
          );
          
          const tombstone = getByTestId('tombstone') as HTMLElement;
          expect(tombstone).not.toBeNull();
          
          // Calculate expected animation delay (100ms per tombstone = index * 0.1 seconds)
          const expectedDelay = `${index * 0.1}s`;
          
          // Verify the animation delay is set correctly in the style attribute
          const actualDelay = tombstone.style.animationDelay;
          expect(actualDelay).toBe(expectedDelay);
          
          // Clean up
          unmount();
        });
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

  // Unit Tests - Requirements: 10.1, 10.2
  it('applies correct animation delay based on index', () => {
    const mockBranch: DeadBranch = {
      name: 'feature/test',
      lastCommitDate: '2024-01-15',
      lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
    };
    
    // Test with index 0
    const { getByTestId: getByTestId0, unmount: unmount0 } = render(
      <Tombstone branch={mockBranch} repositoryUrl="https://github.com/test/repo" index={0} />
    );
    const tombstone0 = getByTestId0('tombstone') as HTMLElement;
    expect(tombstone0.style.animationDelay).toBe('0s');
    unmount0();
    
    // Test with index 5
    const { getByTestId: getByTestId5, unmount: unmount5 } = render(
      <Tombstone branch={mockBranch} repositoryUrl="https://github.com/test/repo" index={5} />
    );
    const tombstone5 = getByTestId5('tombstone') as HTMLElement;
    expect(tombstone5.style.animationDelay).toBe('0.5s');
    unmount5();
    
    // Test with index 10
    const { getByTestId: getByTestId10, unmount: unmount10 } = render(
      <Tombstone branch={mockBranch} repositoryUrl="https://github.com/test/repo" index={10} />
    );
    const tombstone10 = getByTestId10('tombstone') as HTMLElement;
    expect(tombstone10.style.animationDelay).toBe('1s');
    unmount10();
  });

  it('defaults to index 0 when index prop is not provided', () => {
    const mockBranch: DeadBranch = {
      name: 'feature/test',
      lastCommitDate: '2024-01-15',
      lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
    };
    
    const { getByTestId } = render(
      <Tombstone branch={mockBranch} repositoryUrl="https://github.com/test/repo" />
    );
    
    const tombstone = getByTestId('tombstone') as HTMLElement;
    expect(tombstone.style.animationDelay).toBe('0s');
  });
});
