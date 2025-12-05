'use client';

import React from 'react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubToken: string;
  onTokenChange: (token: string) => void;
}

/**
 * TokenModal component - Modal for GitHub token configuration
 * Features:
 * - Clean modal interface for token input
 * - Information about token benefits
 * - Link to GitHub token creation
 */
export default function TokenModal({ isOpen, onClose, githubToken, onTokenChange }: TokenModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content token-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        
        <h2 className="modal-title">⚙️ GitHub Token Settings</h2>
        
        <div className="token-modal-body">
          <div className="token-info-section">
            <p className="token-info-highlight">
              🎁 <strong>Free to use!</strong> No token needed for basic usage.
            </p>
            <p className="token-info-text">
              ⚡ <strong>Want unlimited access?</strong> Add your personal token for 5,000 requests/hour (vs 60 without)
            </p>
          </div>

          <div className="token-input-section">
            <label htmlFor="github-token" className="token-label">
              GitHub Personal Access Token
            </label>
            <input
              id="github-token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => onTokenChange(e.target.value)}
              className="token-modal-input"
            />
          </div>

          <div className="token-help-section">
            <p className="token-help-text">
              <strong>How to get a token:</strong>
            </p>
            <ol className="token-help-list">
              <li>Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a></li>
              <li>Click "Generate new token (classic)"</li>
              <li>Give it a name (e.g., "Git Reaper")</li>
              <li>No scopes/permissions needed - leave all unchecked</li>
              <li>Click "Generate token" and copy it here</li>
            </ol>
            <p className="token-privacy-note">
              🔒 Your token is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <button className="token-modal-save-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
