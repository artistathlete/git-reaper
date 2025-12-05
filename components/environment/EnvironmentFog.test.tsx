import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import EnvironmentFog from './EnvironmentFog';
import styles from './GraveyardEnvironment.module.css';

describe('EnvironmentFog', () => {
  it('renders without errors', () => {
    const { container } = render(<EnvironmentFog />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies correct CSS module class', () => {
    const { container } = render(<EnvironmentFog />);
    const fogDiv = container.querySelector(`.${styles.fog}`);
    
    expect(fogDiv).toBeTruthy();
  });
});
