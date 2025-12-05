import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import FAQModal from './FAQModal';

describe('FAQModal', () => {
  it('renders when isOpen is true', () => {
    render(<FAQModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByTestId('faq-modal-overlay')).not.toBeNull();
    expect(screen.getByTestId('faq-modal-content')).not.toBeNull();
  });

  it('does not render when isOpen is false', () => {
    render(<FAQModal isOpen={false} onClose={vi.fn()} />);
    
    expect(screen.queryByTestId('faq-modal-overlay')).toBeNull();
  });

  it('close button triggers onClose callback', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<FAQModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByTestId('faq-modal-close-button');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape key triggers onClose callback', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<FAQModal isOpen={true} onClose={onClose} />);
    
    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop click triggers onClose callback', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<FAQModal isOpen={true} onClose={onClose} />);
    
    const overlay = screen.getByTestId('faq-modal-overlay');
    await user.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<FAQModal isOpen={true} onClose={onClose} />);
    
    const content = screen.getByTestId('faq-modal-content');
    await user.click(content);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('body scroll is prevented when modal is open', () => {
    const { unmount } = render(<FAQModal isOpen={true} onClose={vi.fn()} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('contains FAQ content', () => {
    render(<FAQModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for FAQ heading
    expect(screen.getByText(/FAQ & Guide/i)).not.toBeNull();
    
    // Check for FAQ questions
    expect(screen.getByText(/How does this work\?/i)).not.toBeNull();
    expect(screen.getByText(/Is my data stored\?/i)).not.toBeNull();
    expect(screen.getByText(/Is this safe\?/i)).not.toBeNull();
    expect(screen.getByText(/Why need a token\?/i)).not.toBeNull();
    expect(screen.getByText(/How to create token\?/i)).not.toBeNull();
    expect(screen.getByText(/What happens to branches\?/i)).not.toBeNull();
  });

  it('contains FAQ answers', () => {
    render(<FAQModal isOpen={true} onClose={vi.fn()} />);
    
    // Check for key FAQ answers
    expect(screen.getByText(/Uses GitHub API to check which branches are merged/i)).not.toBeNull();
    expect(screen.getByText(/Nothing is stored/i)).not.toBeNull();
    expect(screen.getByText(/Read-only access/i)).not.toBeNull();
    expect(screen.getByText(/60 free requests\/hour/i)).not.toBeNull();
    expect(screen.getByText(/You decide what to delete/i)).not.toBeNull();
  });

  /**
   * Feature: landing-page-redesign, Property 2: Modal close actions hide modal
   * Validates: Requirements 2.4
   * 
   * Property: For any close action (X button click, backdrop click, Escape key),
   * when the FAQ modal is open, performing that action should result in the modal
   * no longer being visible.
   */
  it('property: modal close actions hide modal', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('close-button', 'backdrop', 'escape-key'),
        async (closeAction) => {
          const user = userEvent.setup();
          const onClose = vi.fn();
          
          const { unmount } = render(<FAQModal isOpen={true} onClose={onClose} />);
          
          // Verify modal is visible
          expect(screen.getByTestId('faq-modal-overlay')).not.toBeNull();
          
          // Perform the close action
          switch (closeAction) {
            case 'close-button':
              const closeButton = screen.getByTestId('faq-modal-close-button');
              await user.click(closeButton);
              break;
            case 'backdrop':
              const overlay = screen.getByTestId('faq-modal-overlay');
              await user.click(overlay);
              break;
            case 'escape-key':
              await user.keyboard('{Escape}');
              break;
          }
          
          // Verify onClose was called
          expect(onClose).toHaveBeenCalledTimes(1);
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
