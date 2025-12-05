import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EnvironmentForeground from './EnvironmentForeground';
import styles from './GraveyardEnvironment.module.css';

describe('EnvironmentForeground', () => {
  it('renders without errors', () => {
    const { container } = render(<EnvironmentForeground />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders two SVG tree elements', () => {
    const { container } = render(<EnvironmentForeground />);
    const svgs = container.querySelectorAll('svg');
    
    expect(svgs.length).toBe(2);
  });

  it('applies correct CSS module classes', () => {
    const { container } = render(<EnvironmentForeground />);
    const foregroundDiv = container.querySelector(`.${styles.foreground}`);
    
    expect(foregroundDiv).toBeTruthy();
  });

  it('positions trees at left and right edges', () => {
    const { container } = render(<EnvironmentForeground />);
    const leftTree = container.querySelector(`.${styles.treeLeft}`);
    const rightTree = container.querySelector(`.${styles.treeRight}`);
    
    expect(leftTree).toBeTruthy();
    expect(rightTree).toBeTruthy();
  });

  it('uses CSS variables for colors', () => {
    const { container } = render(<EnvironmentForeground />);
    const paths = container.querySelectorAll('path');
    
    paths.forEach(path => {
      expect(path.getAttribute('stroke')).toContain('var(--');
    });
  });
});
