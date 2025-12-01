import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import FloatingGhosts from './FloatingGhosts';

describe('FloatingGhosts Component', () => {
  // Unit Tests - Requirements: 10.2
  it('renders ghost elements', () => {
    const { container } = render(<FloatingGhosts />);
    
    // Should render the container
    const ghostContainer = container.querySelector('.floating-ghosts-container');
    expect(ghostContainer).not.toBeNull();
    
    // Should render multiple ghost elements (5 ghosts as per component implementation)
    const ghosts = container.querySelectorAll('.floating-ghost');
    expect(ghosts.length).toBe(5);
  });

  it('renders ghosts with emoji content', () => {
    const { container } = render(<FloatingGhosts />);
    
    const ghosts = container.querySelectorAll('.floating-ghost');
    
    // Each ghost should contain the ghost emoji
    ghosts.forEach((ghost) => {
      expect(ghost.textContent).toBe('👻');
    });
  });

  it('applies random styling properties to ghosts', () => {
    const { container } = render(<FloatingGhosts />);
    
    const ghosts = container.querySelectorAll('.floating-ghost') as NodeListOf<HTMLElement>;
    
    // Each ghost should have style properties set
    ghosts.forEach((ghost) => {
      // Should have left position
      expect(ghost.style.left).toBeTruthy();
      expect(ghost.style.left).toMatch(/%$/);
      
      // Should have animation duration
      expect(ghost.style.animationDuration).toBeTruthy();
      expect(ghost.style.animationDuration).toMatch(/s$/);
      
      // Should have animation delay
      expect(ghost.style.animationDelay).toBeTruthy();
      expect(ghost.style.animationDelay).toMatch(/s$/);
      
      // Should have opacity
      expect(ghost.style.opacity).toBeTruthy();
      
      // Should have font size
      expect(ghost.style.fontSize).toBeTruthy();
      expect(ghost.style.fontSize).toMatch(/rem$/);
    });
  });
});
