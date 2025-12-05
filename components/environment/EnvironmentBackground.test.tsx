import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EnvironmentBackground from './EnvironmentBackground';
import styles from './GraveyardEnvironment.module.css';

describe('EnvironmentBackground', () => {
  it('renders without errors', () => {
    const { container } = render(<EnvironmentBackground />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders SVG element with correct attributes', () => {
    const { container } = render(<EnvironmentBackground />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 1200 100');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('none');
  });

  it('applies correct CSS module classes', () => {
    const { container } = render(<EnvironmentBackground />);
    const backgroundDiv = container.querySelector(`.${styles.background}`);
    
    expect(backgroundDiv).toBeTruthy();
  });

  it('uses CSS variables for colors', () => {
    const { container } = render(<EnvironmentBackground />);
    const path = container.querySelector('path');
    
    expect(path?.getAttribute('fill')).toContain('var(--');
  });
});
