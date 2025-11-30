import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RepoInput from './RepoInput';

describe('RepoInput Component - Unit Tests', () => {
  // Requirements: 1.4
  it('enables button for valid GitHub URLs', () => {
    const mockOnSubmit = vi.fn();
    
    render(<RepoInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    const button = screen.getByRole('button', { name: /reap/i });
    
    // Initially, button should be disabled (no URL entered)
    expect(button.hasAttribute('disabled')).toBe(true);
    
    // Enter a valid GitHub URL
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    
    // Button should now be enabled
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('keeps button disabled for invalid URLs', () => {
    const mockOnSubmit = vi.fn();
    
    render(<RepoInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    const button = screen.getByRole('button', { name: /reap/i });
    
    // Enter an invalid URL
    fireEvent.change(input, { target: { value: 'https://example.com/not-github' } });
    
    // Button should remain disabled
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('disables button when loading', () => {
    const mockOnSubmit = vi.fn();
    
    render(<RepoInput onSubmit={mockOnSubmit} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    const button = screen.getByRole('button', { name: /reaping/i });
    
    // Enter a valid URL
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    
    // Button should still be disabled because isLoading is true
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('calls onSubmit with URL when form is submitted with valid URL', () => {
    const mockOnSubmit = vi.fn();
    
    render(<RepoInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    const form = input.closest('form')!;
    
    // Enter a valid URL
    const validUrl = 'https://github.com/facebook/react';
    fireEvent.change(input, { target: { value: validUrl } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // onSubmit should be called with the URL
    expect(mockOnSubmit).toHaveBeenCalledWith(validUrl);
  });
});
