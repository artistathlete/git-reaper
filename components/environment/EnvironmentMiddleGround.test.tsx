import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EnvironmentMiddleGround from './EnvironmentMiddleGround';
import styles from './GraveyardEnvironment.module.css';

describe('EnvironmentMiddleGround', () => {
  it('renders without errors', () => {
    const { container } = render(<EnvironmentMiddleGround />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders SVG element with correct viewBox', () => {
    const { container } = render(<EnvironmentMiddleGround />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 400 100');
  });

  it('applies correct CSS module classes', () => {
    const { container } = render(<EnvironmentMiddleGround />);
    const middleGroundDiv = container.querySelector(`.${styles.middleGround}`);
    
    expect(middleGroundDiv).toBeTruthy();
  });

  it('uses CSS variables for colors', () => {
    const { container } = render(<EnvironmentMiddleGround />);
    const group = container.querySelector('g');
    
    expect(group?.getAttribute('fill')).toContain('var(--');
  });
});
