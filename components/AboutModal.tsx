'use client';

import React, { useEffect } from 'react';
import { FaTimes, FaGithub, FaShieldAlt, FaLock, FaEye } from 'react-icons/fa';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
      data-testid="modal-overlay"
    >
      <div className="modal-content" data-testid="modal-content">
        <button 
          className="modal-close-button" 
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close-button"
        >
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>👻 About Git Reaper</h2>
        </div>

        <div className="modal-body">
          <section className="about-section">
            <h3>What is Git Reaper?</h3>
            <p>
              Git Reaper is a web application that helps you identify "dead branches" in GitHub repositories. 
              Dead branches are branches that have been merged into the main branch but haven't been deleted yet. 
              They clutter your repository and make it harder to navigate.
            </p>
          </section>

          <section className="about-section">
            <h3>How does it work?</h3>
            <p>
              Simply paste a GitHub repository URL and click "REAP". Git Reaper uses the GitHub API to analyze 
              all branches in the repository, checking which ones have been merged but not deleted. The results 
              are displayed as tombstones in a spooky graveyard theme, making branch cleanup feel like an adventure 
              rather than a chore.
            </p>
          </section>

          <section className="about-section">
            <h3>How to use Git Reaper</h3>
            <ol className="usage-steps">
              <li>Paste a GitHub repository URL (e.g., https://github.com/owner/repo)</li>
              <li>Optionally add your GitHub token for higher rate limits</li>
              <li>Click the "REAP" button to start analysis</li>
              <li>View dead branches as tombstones in the graveyard</li>
              <li>Click any tombstone to view the branch's commits on GitHub</li>
              <li>Use the provided git commands to clean up branches locally</li>
            </ol>
          </section>

          <section className="about-section privacy-section">
            <h3><FaLock /> Privacy & Safety</h3>
            <div className="info-grid">
              <div className="info-card">
                <FaShieldAlt className="info-icon" />
                <h4>No Data Stored</h4>
                <p>
                  We don't store any data. Your repository information and GitHub tokens are only used 
                  for the current request and are never saved to our servers.
                </p>
              </div>
              <div className="info-card">
                <FaEye className="info-icon" />
                <h4>Read-Only Access</h4>
                <p>
                  Git Reaper only reads repository data through the GitHub API. We never modify or delete 
                  anything. You have complete control over what to delete.
                </p>
              </div>
              <div className="info-card">
                <FaGithub className="info-icon" />
                <h4>Open Source</h4>
                <p>
                  Git Reaper is open source. You can review the code, contribute, or run your own instance. 
                  Transparency is important to us.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h3>Why use a GitHub token?</h3>
            <p>
              GitHub's API has rate limits: 60 requests per hour without authentication, and 5,000 requests 
              per hour with a token. For most repositories, the free tier is sufficient. However, if you're 
              analyzing large repositories or multiple repositories, adding your own token gives you much 
              higher limits.
            </p>
            <p className="token-note">
              <strong>Note:</strong> You don't need to grant any permissions or scopes when creating a token. 
              A token with no scopes can still access public repository data and provides the higher rate limit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
