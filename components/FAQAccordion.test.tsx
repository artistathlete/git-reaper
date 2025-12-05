import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQAccordion from './FAQAccordion';

describe('FAQAccordion', () => {
  it('renders collapsed by default', () => {
    // _Requirements: 4.1, 4.3_
    const { container } = render(<FAQAccordion />);
    
    const header = container.querySelector('[data-testid="faq-header"]') as HTMLElement;
    expect(header).not.toBeNull();
    expect(header.getAttribute('aria-expanded')).toBe('false');
    
    const content = container.querySelector('[data-testid="faq-content"]') as HTMLElement;
    expect(content.classList.contains('faq-content-open')).toBe(false);
  });

  it('expands on click', async () => {
    // _Requirements: 4.1, 4.3_
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion />);
    
    const header = container.querySelector('[data-testid="faq-header"]') as HTMLElement;
    expect(header.getAttribute('aria-expanded')).toBe('false');
    
    await user.click(header);
    
    expect(header.getAttribute('aria-expanded')).toBe('true');
    const content = container.querySelector('[data-testid="faq-content"]') as HTMLElement;
    expect(content.classList.contains('faq-content-open')).toBe(true);
  });

  it('shows FAQ content when expanded', async () => {
    // _Requirements: 4.1, 4.3_
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion />);
    
    const header = container.querySelector('[data-testid="faq-header"]') as HTMLElement;
    await user.click(header);
    
    // Check that FAQ items are present
    expect(screen.getByText('How does this work?')).not.toBeNull();
    expect(screen.getByText('Is my data stored?')).not.toBeNull();
    expect(screen.getByText('Is this safe?')).not.toBeNull();
    expect(screen.getByText('Why need a token?')).not.toBeNull();
    expect(screen.getByText('How to create token?')).not.toBeNull();
    expect(screen.getByText('What happens to branches?')).not.toBeNull();
  });

  it('can be initialized as open with defaultOpen prop', () => {
    // _Requirements: 4.1_
    const { container } = render(<FAQAccordion defaultOpen={true} />);
    
    const header = container.querySelector('[data-testid="faq-header"]') as HTMLElement;
    expect(header.getAttribute('aria-expanded')).toBe('true');
    
    const content = container.querySelector('[data-testid="faq-content"]') as HTMLElement;
    expect(content.classList.contains('faq-content-open')).toBe(true);
  });

  it('toggles between open and closed states', async () => {
    // _Requirements: 4.1, 4.3_
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion />);
    
    const header = container.querySelector('[data-testid="faq-header"]') as HTMLElement;
    const content = container.querySelector('[data-testid="faq-content"]') as HTMLElement;
    
    // Initially closed
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(content.classList.contains('faq-content-open')).toBe(false);
    
    // Click to open
    await user.click(header);
    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(content.classList.contains('faq-content-open')).toBe(true);
    
    // Click to close
    await user.click(header);
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(content.classList.contains('faq-content-open')).toBe(false);
  });
});
