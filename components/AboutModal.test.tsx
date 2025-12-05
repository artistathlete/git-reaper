import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AboutModal from './AboutModal';

describe('AboutModal', () => {
  it('renders when isOpen is true', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByTestId('modal-overlay')).not.toBeNull();
    expect(screen.getByTestId('modal-content')).not.toBeNull();
  });

  it('does not render when isOpen is false', () => {
    render(<AboutModal isOpen={false} onClose={vi.fn()} />);
    
    expect(screen.queryByTestId('modal-overlay')).toBeNull();
  });

  it('contains required content', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for main headings
    expect(screen.getByText(/About Git Reaper/i)).not.toBeNull();
    expect(screen.getByText(/What is Git Reaper\?/i)).not.toBeNull();
    expect(screen.getByText(/How does it work\?/i)).not.toBeNull();
    expect(screen.getByText(/How to use Git Reaper/i)).not.toBeNull();
    
    // Check for privacy and safety information
    expect(screen.getByText(/Privacy & Safety/i)).not.toBeNull();
    expect(screen.getByText(/No Data Stored/i)).not.toBeNull();
    expect(screen.getByText(/Read-Only Access/i)).not.toBeNull();
    
    // Check for key information about the app - use getAllByText for text that appears multiple times
    const deadBranchesText = screen.getAllByText(/dead branches/i);
    expect(deadBranchesText.length).toBeGreaterThan(0);
    const githubAPIText = screen.getAllByText(/GitHub API/i);
    expect(githubAPIText.length).toBeGreaterThan(0);
  });

  it('close button works', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<AboutModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByTestId('modal-close-button');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<AboutModal isOpen={true} onClose={onClose} />);
    
    const overlay = screen.getByTestId('modal-overlay');
    await user.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<AboutModal isOpen={true} onClose={onClose} />);
    
    const content = screen.getByTestId('modal-content');
    await user.click(content);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<AboutModal isOpen={true} onClose={onClose} />);
    
    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('contains usage steps', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for usage steps - use getAllByText for text that appears multiple times
    const pasteText = screen.getAllByText(/Paste a GitHub repository URL/i);
    expect(pasteText.length).toBeGreaterThan(0);
    expect(screen.getByText(/Click the "REAP" button/i)).not.toBeNull();
    expect(screen.getByText(/View dead branches as tombstones/i)).not.toBeNull();
  });

  it('contains privacy information', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for privacy details
    expect(screen.getByText(/We don't store any data/i)).not.toBeNull();
    expect(screen.getByText(/never modify or delete/i)).not.toBeNull();
    expect(screen.getByText(/Read-Only Access/i)).not.toBeNull();
  });

  it('contains GitHub token information', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for token information
    expect(screen.getByText(/Why use a GitHub token\?/i)).not.toBeNull();
    expect(screen.getByText(/60 requests per hour/i)).not.toBeNull();
    expect(screen.getByText(/5,000 requests per hour/i)).not.toBeNull();
  });
});
