import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import PopularRepoCard from './PopularRepoCard';

describe('PopularRepoCard', () => {
  /**
   * Feature: landing-page-redesign, Property 4: Repository Card Content Completeness
   * Validates: Requirements 5.3
   * 
   * For any rendered repository card, the card SHALL contain an icon element,
   * repository name text, author text, and description text.
   */
  it('property: all required fields are rendered for any valid card data', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }), // name
        fc.string({ minLength: 1, maxLength: 50 }), // author
        fc.string({ minLength: 1, maxLength: 200 }), // description
        fc.webUrl(), // url
        (name, author, description, url) => {
          const icon = '🎯';
          const onClick = vi.fn();

          const { container, unmount } = render(
            <PopularRepoCard
              icon={icon}
              name={name}
              author={author}
              description={description}
              url={url}
              onClick={onClick}
            />
          );

          // Verify all required fields are present
          const iconElement = container.querySelector('[data-testid="repo-icon"]');
          const nameElement = container.querySelector('[data-testid="repo-name"]');
          const authorElement = container.querySelector('[data-testid="repo-author"]');
          const descriptionElement = container.querySelector('[data-testid="repo-description"]');

          expect(iconElement).not.toBeNull();
          expect(iconElement?.textContent).toBe(icon);
          expect(nameElement).not.toBeNull();
          expect(nameElement?.textContent).toBe(name);
          expect(authorElement).not.toBeNull();
          expect(authorElement?.textContent).toBe(author);
          expect(descriptionElement).not.toBeNull();
          expect(descriptionElement?.textContent).toBe(description);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Unit tests
  it('renders card with all content', () => {
    const onClick = vi.fn();
    const { container } = render(
      <PopularRepoCard
        icon="⚛️"
        name="React"
        author="facebook"
        description="A JavaScript library for building user interfaces"
        url="https://github.com/facebook/react"
        onClick={onClick}
      />
    );

    expect(container.querySelector('[data-testid="repo-icon"]')?.textContent).toBe('⚛️');
    expect(container.querySelector('[data-testid="repo-name"]')?.textContent).toBe('React');
    expect(container.querySelector('[data-testid="repo-author"]')?.textContent).toBe('facebook');
    expect(container.querySelector('[data-testid="repo-description"]')?.textContent).toBe(
      'A JavaScript library for building user interfaces'
    );
  });

  it('calls onClick with url when card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const url = 'https://github.com/facebook/react';

    render(
      <PopularRepoCard
        icon="⚛️"
        name="React"
        author="facebook"
        description="A JavaScript library"
        url={url}
        onClick={onClick}
      />
    );

    const card = screen.getByTestId('popular-repo-card');
    await user.click(card);

    expect(onClick).toHaveBeenCalledWith(url);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const url = 'https://github.com/facebook/react';

    render(
      <PopularRepoCard
        icon="⚛️"
        name="React"
        author="facebook"
        description="A JavaScript library"
        url={url}
        onClick={onClick}
      />
    );

    const card = screen.getByTestId('popular-repo-card');
    card.focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledWith(url);
  });

  it('has proper hover styles applied', () => {
    const onClick = vi.fn();
    const { container } = render(
      <PopularRepoCard
        icon="⚛️"
        name="React"
        author="facebook"
        description="A JavaScript library"
        url="https://github.com/facebook/react"
        onClick={onClick}
      />
    );

    const card = container.querySelector('[data-testid="popular-repo-card"]');
    expect(card?.classList.contains('popular-repo-card')).toBe(true);
  });
});
