import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import PopularReposGrid from './PopularReposGrid';

describe('PopularReposGrid', () => {
  /**
   * Feature: landing-page-redesign, Property 5: Responsive Grid Columns
   * Validates: Requirements 5.2, 7.1, 7.2
   * 
   * For any viewport width, the popular repositories grid SHALL display:
   * - 3 columns when width >= 768px
   * - 2 columns when 480px <= width < 768px
   * - 1 column when width < 480px
   * 
   * Note: This test verifies the CSS class is applied correctly. The actual
   * responsive behavior is defined in globals.css with media queries.
   */
  it('property: grid has correct CSS class for responsive layout', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // viewport width (for documentation)
        () => {
          const onSelectRepo = vi.fn();
          const { container, unmount } = render(<PopularReposGrid onSelectRepo={onSelectRepo} />);

          const grid = container.querySelector('[data-testid="popular-repos-grid"]');
          expect(grid).not.toBeNull();

          // Property: Grid should have the 'popular-repos-grid' class which defines responsive behavior
          expect(grid?.classList.contains('popular-repos-grid')).toBe(true);

          // Verify the grid exists and can contain cards
          const cards = container.querySelectorAll('[data-testid="popular-repo-card"]');
          expect(cards.length).toBe(6);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Unit tests
  it('renders 6 repository cards', () => {
    const onSelectRepo = vi.fn();
    const { container } = render(<PopularReposGrid onSelectRepo={onSelectRepo} />);

    const cards = container.querySelectorAll('[data-testid="popular-repo-card"]');
    expect(cards.length).toBe(6);
  });

  it('renders section with title', () => {
    const onSelectRepo = vi.fn();
    const { container } = render(<PopularReposGrid onSelectRepo={onSelectRepo} />);

    const section = container.querySelector('[data-testid="popular-repos-section"]');
    expect(section).not.toBeNull();

    const heading = container.querySelector('h2');
    expect(heading?.textContent).toBe('TRY THESE POPULAR REPOSITORIES');
  });

  it('passes onSelectRepo handler to cards', () => {
    const onSelectRepo = vi.fn();
    const { container } = render(<PopularReposGrid onSelectRepo={onSelectRepo} />);

    const firstCard = container.querySelector('[data-testid="popular-repo-card"]') as HTMLElement;
    expect(firstCard).not.toBeNull();

    // Click the first card
    firstCard.click();

    // Verify onSelectRepo was called with a URL
    expect(onSelectRepo).toHaveBeenCalledTimes(1);
    expect(onSelectRepo).toHaveBeenCalledWith(expect.stringContaining('https://github.com/'));
  });

  it('renders all expected repositories', () => {
    const onSelectRepo = vi.fn();
    const { container } = render(<PopularReposGrid onSelectRepo={onSelectRepo} />);

    // Check for specific repository names
    const repoNames = ['React', 'VS Code', 'Next.js', 'Node.js', 'TensorFlow', 'Linux'];
    
    repoNames.forEach(name => {
      const nameElements = Array.from(container.querySelectorAll('[data-testid="repo-name"]'));
      const found = nameElements.some(el => el.textContent === name);
      expect(found).toBe(true);
    });
  });
});
