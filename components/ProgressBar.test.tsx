import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders progress information correctly', () => {
    render(
      <ProgressBar 
        current={25} 
        total={100} 
        found={5} 
        status="Analyzing branches..."
      />
    );

    expect(screen.getByText('Analyzing branches...')).toBeTruthy();
  });

  it('calculates percentage correctly', () => {
    const { container } = render(
      <ProgressBar 
        current={50} 
        total={100} 
        found={10}
      />
    );

    const progressFill = container.querySelector('.progress-bar-fill');
    expect(progressFill?.getAttribute('style')).toContain('width: 50%');
  });

  it('handles zero total gracefully', () => {
    const { container } = render(
      <ProgressBar 
        current={0} 
        total={0} 
        found={0}
      />
    );

    const progressFill = container.querySelector('.progress-bar-fill');
    expect(progressFill?.getAttribute('style')).toContain('width: 0%');
  });

  it('uses default status when not provided', () => {
    render(
      <ProgressBar 
        current={10} 
        total={50} 
        found={2}
      />
    );

    expect(screen.getByText('Analyzing branches...')).toBeTruthy();
  });



  it('renders progress bar with correct width', () => {
    const { container } = render(
      <ProgressBar 
        current={75} 
        total={100} 
        found={15}
      />
    );

    const progressFill = container.querySelector('.progress-bar-fill');
    expect(progressFill?.getAttribute('style')).toContain('width: 75%');
  });
});
