import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  it('renders About link', () => {
    render(<Header onAboutClick={vi.fn()} onFAQClick={vi.fn()} />);
    
    const aboutLink = screen.getByTestId('about-link');
    expect(aboutLink).not.toBeNull();
    expect(aboutLink.textContent).toBe('About');
  });

  it('click triggers onAboutClick', async () => {
    const user = userEvent.setup();
    const onAboutClick = vi.fn();
    
    render(<Header onAboutClick={onAboutClick} onFAQClick={vi.fn()} />);
    
    const aboutLink = screen.getByTestId('about-link');
    await user.click(aboutLink);
    
    expect(onAboutClick).toHaveBeenCalledTimes(1);
  });

  it('renders header element', () => {
    render(<Header onAboutClick={vi.fn()} onFAQClick={vi.fn()} />);
    
    const header = screen.getByTestId('page-header');
    expect(header).not.toBeNull();
    expect(header.tagName).toBe('HEADER');
  });

  it('About link has proper accessibility attributes', () => {
    render(<Header onAboutClick={vi.fn()} onFAQClick={vi.fn()} />);
    
    const aboutLink = screen.getByTestId('about-link');
    expect(aboutLink.getAttribute('aria-label')).toBe('Open About modal');
  });

  it('renders FAQ button', () => {
    render(<Header onAboutClick={vi.fn()} onFAQClick={vi.fn()} />);
    
    const faqLink = screen.getByTestId('faq-link');
    expect(faqLink).not.toBeNull();
    expect(faqLink.textContent).toBe('FAQ');
  });

  it('FAQ button click triggers onFAQClick callback', async () => {
    const user = userEvent.setup();
    const onFAQClick = vi.fn();
    
    render(<Header onAboutClick={vi.fn()} onFAQClick={onFAQClick} />);
    
    const faqLink = screen.getByTestId('faq-link');
    await user.click(faqLink);
    
    expect(onFAQClick).toHaveBeenCalledTimes(1);
  });

  it('renders both About and FAQ buttons', () => {
    render(<Header onAboutClick={vi.fn()} onFAQClick={vi.fn()} />);
    
    const aboutLink = screen.getByTestId('about-link');
    const faqLink = screen.getByTestId('faq-link');
    
    expect(aboutLink).not.toBeNull();
    expect(faqLink).not.toBeNull();
    expect(aboutLink.textContent).toBe('About');
    expect(faqLink.textContent).toBe('FAQ');
  });
});
