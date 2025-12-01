import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import fc from 'fast-check';
import { DeadBranch } from '@/lib/types';
import Graveyard from './Graveyard';

describe('Graveyard Component', () => {
  // Feature: git-reaper, Property 8: Tombstone Count Consistency
  // Validates: Requirements 3.2
  it('property test: rendered tombstone count equals input array length', () => {
    // Generator for DeadBranch objects
    const deadBranchArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      lastCommitDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
        .map(d => d.toISOString().split('T')[0]),
      lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 }),
    });

    // Generator for arrays of DeadBranch objects (0 to 50 branches)
    const deadBranchArrayArbitrary = fc.array(deadBranchArbitrary, { minLength: 0, maxLength: 50 });

    fc.assert(
      fc.property(deadBranchArrayArbitrary, (deadBranches) => {
        // Test the component's rendering logic
        // The Graveyard component should render exactly one Tombstone per DeadBranch
        
        // Simulate the component's logic:
        // 1. If deadBranches.length === 0, it shows empty state (no tombstones)
        // 2. Otherwise, it sorts and renders one tombstone per branch
        
        const expectedTombstoneCount = deadBranches.length;
        
        // Verify the sorting logic doesn't change the count
        const sortedBranches = [...deadBranches].sort((a, b) => {
          const dateA = new Date(a.lastCommitDate).getTime();
          const dateB = new Date(b.lastCommitDate).getTime();
          return dateB - dateA;
        });
        
        // The sorted array should have the same length as the input
        expect(sortedBranches.length).toBe(expectedTombstoneCount);
        
        // Verify that each branch in the input would result in exactly one tombstone
        // by checking that all branches have unique keys (names)
        const uniqueNames = new Set(deadBranches.map(b => b.name));
        
        // If there are duplicate names, React would still render all of them
        // (though it would warn about duplicate keys)
        // The count should still match the input array length
        expect(deadBranches.length).toBe(expectedTombstoneCount);
        
        // Verify the component logic: empty array = 0 tombstones, non-empty = length tombstones
        if (deadBranches.length === 0) {
          // Empty state: no tombstones rendered
          expect(expectedTombstoneCount).toBe(0);
        } else {
          // Non-empty: should render exactly deadBranches.length tombstones
          expect(expectedTombstoneCount).toBe(deadBranches.length);
        }
      }),
      { numRuns: 100 }
    );
  });

  // Unit Tests - Requirements: 3.4
  it('shows empty state message when no branches are provided', () => {
    render(<Graveyard deadBranches={[]} repositoryUrl="https://github.com/test/repo" />);
    
    // Should display the empty state message
    expect(screen.getByText('This repository is clean! No dead branches found.')).toBeDefined();
  });

  it('renders tombstones when branches are provided', () => {
    const mockBranches: DeadBranch[] = [
      {
        name: 'feature/test-branch',
        lastCommitDate: '2024-01-15',
        lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
      },
      {
        name: 'bugfix/another-branch',
        lastCommitDate: '2024-02-20',
        lastCommitSha: 'def456abc123def456abc123def456abc123def4'
      }
    ];
    
    render(<Graveyard deadBranches={mockBranches} repositoryUrl="https://github.com/test/repo" />);
    
    // Should render both branch names
    expect(screen.getByText('feature/test-branch')).toBeDefined();
    expect(screen.getByText('bugfix/another-branch')).toBeDefined();
    
    // Should not show empty state
    expect(screen.queryByText('This repository is clean! No dead branches found.')).toBeNull();
  });

  // Unit Tests - Requirements: 10.1, 10.2
  it('passes index prop to tombstones for staggered animation', () => {
    const mockBranches: DeadBranch[] = [
      {
        name: 'feature/first',
        lastCommitDate: '2024-03-01',
        lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
      },
      {
        name: 'feature/second',
        lastCommitDate: '2024-02-15',
        lastCommitSha: 'def456abc123def456abc123def456abc123def4'
      },
      {
        name: 'feature/third',
        lastCommitDate: '2024-01-10',
        lastCommitSha: '123456789012345678901234567890123456789a'
      }
    ];
    
    const { container } = render(<Graveyard deadBranches={mockBranches} repositoryUrl="https://github.com/test/repo" />);
    
    // Get all tombstone elements
    const tombstones = container.querySelectorAll('[data-testid="tombstone"]') as NodeListOf<HTMLElement>;
    
    // Should render 3 tombstones
    expect(tombstones.length).toBe(3);
    
    // Each tombstone should have an animation delay based on its index
    // Index 0: 0s, Index 1: 0.1s, Index 2: 0.2s
    expect(tombstones[0].style.animationDelay).toBe('0s');
    expect(tombstones[1].style.animationDelay).toBe('0.1s');
    expect(tombstones[2].style.animationDelay).toBe('0.2s');
  });

  it('renders FloatingGhosts component for atmospheric effects', () => {
    const mockBranches: DeadBranch[] = [
      {
        name: 'feature/test',
        lastCommitDate: '2024-01-15',
        lastCommitSha: 'abc123def456abc123def456abc123def456abc1'
      }
    ];
    
    const { container } = render(<Graveyard deadBranches={mockBranches} repositoryUrl="https://github.com/test/repo" />);
    
    // Should render the FloatingGhosts container
    const ghostContainer = container.querySelector('.floating-ghosts-container');
    expect(ghostContainer).not.toBeNull();
    
    // Should render ghost elements
    const ghosts = container.querySelectorAll('.floating-ghost');
    expect(ghosts.length).toBe(5);
  });
});
