'use client';

import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      data-testid="faq-modal-overlay"
    >
      <div className="modal-content" data-testid="faq-modal-content">
        <button 
          className="modal-close-button" 
          onClick={onClose}
          aria-label="Close FAQ modal"
          data-testid="faq-modal-close-button"
        >
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>❓ FAQ & Guide</h2>
        </div>

        <div className="modal-body">
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
