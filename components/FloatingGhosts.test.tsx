import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import * as fc from 'fast-check';
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

  // Property-Based Test
  // **Feature: landing-page-redesign, Property 7: FloatingGhosts Speed Control**
  // **Validates: Requirements 6.6**
  it('property: all ghost animations have controlled slow speeds (>= 3s)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // Number of test iterations
        (_iteration) => {
          // Render the component
          const { container } = render(<FloatingGhosts />);
          
          // Get all ghost elements
          const ghosts = container.querySelectorAll('.floating-ghost') as NodeListOf<HTMLElement>;
          
          // For any ghost element, the animation duration should be >= 3s
          ghosts.forEach((ghost) => {
            const durationStr = ghost.style.animationDuration;
            expect(durationStr).toBeTruthy();
            expect(durationStr).toMatch(/s$/);
            
            // Extract numeric value from duration string (e.g., "15.5s" -> 15.5)
            const durationValue = parseFloat(durationStr.replace('s', ''));
            
            // Verify duration is at least 3 seconds (prevents erratic fast motion)
            expect(durationValue).toBeGreaterThanOrEqual(3);
          });
          
          return true;
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design doc
    );
  });
});
