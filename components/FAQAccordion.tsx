'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQAccordionProps {
  defaultOpen?: boolean;
  hauntingMode?: boolean;
}

export default function FAQAccordion({ defaultOpen = false, hauntingMode = true }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-section" data-testid="faq-accordion">
      <div className={`faq-wrapper ${hauntingMode ? 'faq-haunting' : 'faq-professional'}`}>
        <button 
          className="faq-header" 
          onClick={toggleOpen}
          aria-expanded={isOpen}
          data-testid="faq-header"
        >
          <span>FAQ & Guide</span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        <div 
          className={`faq-content ${isOpen ? 'faq-content-open' : ''}`}
          data-testid="faq-content"
        >
          <div className="faq-grid">
            <details className="faq-item">
              <summary>How does this work?</summary>
              <p>Uses GitHub API to check which branches are merged but not deleted.</p>
            </details>
            
            <details className="faq-item">
              <summary>Is my data stored?</summary>
              <p><strong>No!</strong> Nothing is stored. Tokens are only used for the current request.</p>
            </details>
            
            <details className="faq-item">
              <summary>Is this safe?</summary>
              <p>Yes! Read-only access. We never modify or delete anything.</p>
            </details>
            
            <details className="faq-item">
              <summary>Why need a token?</summary>
              <p>You don't! 60 free requests/hour. Token gives 5000/hour.</p>
            </details>
            
            <details className="faq-item">
              <summary>How to create token?</summary>
              <div className="token-guide">
                <p><strong>1.</strong> <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a></p>
                <p><strong>2.</strong> "Generate new token" → <span className="highlight">"Tokens (classic)"</span></p>
                <p><strong>3.</strong> Name it "Git Reaper"</p>
                <p><strong>4.</strong> <span className="highlight">Don't select any scopes!</span></p>
                <p><strong>5.</strong> Generate & copy token (ghp_...)</p>
                <p className="note">💡 Use classic, not fine-grained</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary>What happens to branches?</summary>
              <p>We only show them. You decide what to delete. Full control.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
