import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import GhostLogo from './GhostLogo';

/**
 * **Feature: landing-page-redesign, Property 1: Ghost Logo Styling**
 * **Validates: Requirements 1.2, 1.3, 13.3**
 * 
 * For any rendered ghost logo element, the element SHALL have CSS properties for:
 * - Glow effect (box-shadow or filter containing drop-shadow)
 * - Animation (animation property referencing float/bob keyframes)
 */
describe('GhostLogo Component', () => {
  // Property-Based Tests
  describe('Property 1: Ghost Logo Styling', () => {
    it('should have glow effect and animation CSS properties for all size variants', () => {
      // **Feature: landing-page-redesign, Property 1: Ghost Logo Styling**
      // **Validates: Requirements 1.2, 1.3, 13.3**
      
      // Generator for valid size variants
      const sizeArb = fc.constantFrom('small', 'medium', 'large') as fc.Arbitrary<'small' | 'medium' | 'large'>;
      
      fc.assert(
        fc.property(sizeArb, (size) => {
          const { container } = render(<GhostLogo size={size} />);
          const ghostLogo = container.querySelector('[data-testid="ghost-logo"]') as HTMLElement;
          
          expect(ghostLogo).not.toBeNull();
          
          // Property: Ghost logo should have glow effect via filter (drop-shadow)
          const filterStyle = ghostLogo.style.filter;
          expect(filterStyle).toContain('drop-shadow');
          
          // Property: Ghost logo should have floating animation
          const animationStyle = ghostLogo.style.animation;
          expect(animationStyle).toContain('ghostFloat');
          
          // Property: Ghost logo should have glow pulse animation
          expect(animationStyle).toContain('glowPulse');
        }),
        { numRuns: 100 }
      );
    });

    it('should apply correct size dimensions for each variant', () => {
      // **Feature: landing-page-redesign, Property 1: Ghost Logo Styling**
      // **Validates: Requirements 1.2, 1.3, 13.3**
      
      const sizeMap = {
        small: { width: 48, height: 48 },
        medium: { width: 80, height: 80 },
        large: { width: 120, height: 120 },
      };
      
      const sizeArb = fc.constantFrom('small', 'medium', 'large') as fc.Arbitrary<'small' | 'medium' | 'large'>;
      
      fc.assert(
        fc.property(sizeArb, (size) => {
          const { container } = render(<GhostLogo size={size} />);
          const svg = container.querySelector('svg');
          
          expect(svg).not.toBeNull();
          
          // Property: SVG dimensions should match the size variant
          const expectedDimensions = sizeMap[size];
          expect(svg?.getAttribute('width')).toBe(String(expectedDimensions.width));
          expect(svg?.getAttribute('height')).toBe(String(expectedDimensions.height));
        }),
        { numRuns: 100 }
      );
    });
  });

  // Unit Tests
  describe('Unit Tests', () => {
    it('renders with correct CSS classes', () => {
      // _Requirements: 1.1, 1.2_
      const { container } = render(<GhostLogo />);
      const ghostLogo = container.querySelector('[data-testid="ghost-logo"]');
      
      expect(ghostLogo).not.toBeNull();
      expect(ghostLogo?.classList.contains('ghost-logo')).toBe(true);
      expect(ghostLogo?.classList.contains('ghost-logo--large')).toBe(true);
    });

    it('renders small size variant correctly', () => {
      // _Requirements: 1.1, 1.2_
      const { container } = render(<GhostLogo size="small" />);
      const ghostLogo = container.querySelector('[data-testid="ghost-logo"]');
      const svg = container.querySelector('svg');
      
      expect(ghostLogo?.classList.contains('ghost-logo--small')).toBe(true);
      expect(svg?.getAttribute('width')).toBe('48');
      expect(svg?.getAttribute('height')).toBe('48');
    });

    it('renders medium size variant correctly', () => {
      // _Requirements: 1.1, 1.2_
      const { container } = render(<GhostLogo size="medium" />);
      const ghostLogo = container.querySelector('[data-testid="ghost-logo"]');
      const svg = container.querySelector('svg');
      
      expect(ghostLogo?.classList.contains('ghost-logo--medium')).toBe(true);
      expect(svg?.getAttribute('width')).toBe('80');
      expect(svg?.getAttribute('height')).toBe('80');
    });

    it('renders large size variant correctly (default)', () => {
      // _Requirements: 1.1, 1.2_
      const { container } = render(<GhostLogo size="large" />);
      const ghostLogo = container.querySelector('[data-testid="ghost-logo"]');
      const svg = container.querySelector('svg');
      
      expect(ghostLogo?.classList.contains('ghost-logo--large')).toBe(true);
      expect(svg?.getAttribute('width')).toBe('120');
      expect(svg?.getAttribute('height')).toBe('120');
    });

    it('applies custom className', () => {
      // _Requirements: 1.1_
      const { container } = render(<GhostLogo className="custom-class" />);
      const ghostLogo = container.querySelector('[data-testid="ghost-logo"]');
      
      expect(ghostLogo?.classList.contains('custom-class')).toBe(true);
    });

    it('has accessible aria-label on SVG', () => {
      // Accessibility requirement
      const { container } = render(<GhostLogo />);
      const svg = container.querySelector('svg');
      
      expect(svg?.getAttribute('aria-label')).toBe('Ghost logo');
    });

    it('contains ghost visual elements (eyes, body, mouth)', () => {
      // _Requirements: 13.3_ - ethereal, translucent appearance
      const { container } = render(<GhostLogo />);
      
      // Should have ghost body path
      const bodyPath = container.querySelector('path');
      expect(bodyPath).not.toBeNull();
      
      // Should have eyes (ellipses)
      const ellipses = container.querySelectorAll('ellipse');
      expect(ellipses.length).toBeGreaterThanOrEqual(3); // 2 eyes + mouth + inner glow
      
      // Should have gradient definitions for glow effect
      const defs = container.querySelector('defs');
      expect(defs).not.toBeNull();
      
      const gradients = container.querySelectorAll('radialGradient, linearGradient');
      expect(gradients.length).toBeGreaterThanOrEqual(2);
    });
  });
});
