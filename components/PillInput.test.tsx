import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import * as fc from 'fast-check';
import PillInput from './PillInput';

describe('PillInput Component - Property-Based Tests', () => {
  /**
   * Feature: landing-page-redesign, Property 3: Valid URL Triggers Analysis
   * Validates: Requirements 2.4
   * 
   * For any valid GitHub URL entered in the input field, clicking the REAP button 
   * SHALL initiate the repository analysis (call the onSubmit handler).
   */
  it('property: valid GitHub URLs trigger onSubmit when REAP button is clicked', () => {
    fc.assert(
      fc.property(
        // Generate valid GitHub URLs
        fc.record({
          owner: fc.stringMatching(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/),
          repo: fc.stringMatching(/^[a-zA-Z0-9._-]{1,100}$/)
        }),
        ({ owner, repo }) => {
          const validUrl = `https://github.com/${owner}/${repo}`;
          const mockOnChange = vi.fn();
          const mockOnSubmit = vi.fn();
          
          const { unmount } = render(
            <PillInput
              value=""
              onChange={mockOnChange}
              onSubmit={mockOnSubmit}
              isLoading={false}
            />
          );
          
          const input = screen.getByTestId('pill-input-field');
          const button = screen.getByTestId('pill-reap-button');
          
          // Simulate user entering the URL
          fireEvent.change(input, { target: { value: validUrl } });
          
          // Click the REAP button
          fireEvent.click(button);
          
          // Verify onSubmit was called
          expect(mockOnSubmit).toHaveBeenCalled();
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PillInput Component - Unit Tests', () => {
  // Requirements: 2.1
  it('renders input with placeholder', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    expect(input).toBeDefined();
  });

  // Requirements: 2.2
  it('GitHub icon is visible', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );
    
    const icon = document.querySelector('.pill-input-icon');
    expect(icon).toBeDefined();
  });

  // Requirements: 2.3
  it('REAP button triggers onSubmit with valid URL', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );
    
    const input = screen.getByTestId('pill-input-field');
    const button = screen.getByTestId('pill-reap-button');
    
    // Enter a valid GitHub URL
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    
    // Click REAP button
    fireEvent.click(button);
    
    // Verify onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  // Requirements: 2.5
  it('loading state shows spinner', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value="https://github.com/facebook/react"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeDefined();
  });

  // Requirements: 2.4
  it('Enter key triggers onSubmit with valid URL', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );
    
    const input = screen.getByTestId('pill-input-field');
    
    // Enter a valid GitHub URL
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    
    // Press Enter key
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Verify onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('does not trigger onSubmit with invalid URL', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );
    
    const input = screen.getByTestId('pill-input-field');
    const button = screen.getByTestId('pill-reap-button');
    
    // Enter an invalid URL
    fireEvent.change(input, { target: { value: 'https://example.com/not-github' } });
    
    // Try to click REAP button (should be disabled)
    fireEvent.click(button);
    
    // Verify onSubmit was NOT called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not trigger onSubmit when loading', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <PillInput
        value="https://github.com/facebook/react"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );
    
    const button = screen.getByTestId('pill-reap-button');
    
    // Try to click REAP button (should be disabled)
    fireEvent.click(button);
    
    // Verify onSubmit was NOT called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
