'use client';

import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    trees: boolean;
    bats: boolean;
    floatingGhosts: boolean;
    jumpscareGhost: boolean;
    glitch: boolean;
  };
  onSettingsChange: (settings: {
    trees: boolean;
    bats: boolean;
    floatingGhosts: boolean;
    jumpscareGhost: boolean;
    glitch: boolean;
  }) => void;
  githubToken: string;
  onTokenChange: (token: string) => void;
  hauntingMode: boolean;
  onHauntingModeChange: (mode: boolean) => void;
}

/**
 * SettingsModal component - Combined settings for token and scary effects
 * Features:
 * - GitHub token configuration
 * - Individual toggles for each scary effect
 * - Collapsible sections
 * - Layout mode toggle (haunting vs professional)
 */
export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange, githubToken, onTokenChange, hauntingMode, onHauntingModeChange }: SettingsModalProps) {
  const [isEffectsExpanded, setIsEffectsExpanded] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key: keyof typeof settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const allEnabled = Object.values(settings).every(v => v);
  const allDisabled = Object.values(settings).every(v => !v);

  const toggleAll = () => {
    const newValue = allDisabled;
    onSettingsChange({
      trees: newValue,
      bats: newValue,
      floatingGhosts: newValue,
      jumpscareGhost: newValue,
      glitch: newValue
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
        </div>
        
        <div className="modal-body">
          {/* GitHub Token Section */}
          <div className="about-section">
            <h3>🔑 GitHub Token</h3>
            <p>Add your personal token for unlimited access (5,000 requests/hour vs 60 without)</p>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => onTokenChange(e.target.value)}
              className="token-input"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                border: '1px solid var(--borders)',
                borderRadius: '8px',
                background: 'var(--bg-deep)',
                color: 'var(--text-primary)'
              }}
            />
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                How to get a token?
              </summary>
              <div style={{ marginTop: '0.5rem', paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <ol style={{ paddingLeft: '1.5rem' }}>
                  <li>Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)' }}>github.com/settings/tokens</a></li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>Give it a name (e.g., "Git Reaper")</li>
                  <li>No scopes needed - leave all unchecked</li>
                  <li>Click "Generate token" and copy it here</li>
                </ol>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>🔒 Your token is stored locally and never sent to our servers.</p>
              </div>
            </details>
          </div>

          {/* Layout Mode Section */}
          <div className="about-section">
            <h3>🎨 Layout Mode</h3>
            <p>Choose between professional or haunting FAQ layout</p>
            
            <div className="settings-toggle-item" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
              <div className="settings-toggle-label">
                <span className="settings-toggle-icon">🌙</span>
                <div>
                  <div className="settings-toggle-title">Haunting Mode</div>
                  <div className="settings-toggle-description">Transparent, spooky FAQ layout</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={hauntingMode}
                  onChange={(e) => onHauntingModeChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Scary Effects Section - Collapsible */}
          <div className="about-section">
            <details open={isEffectsExpanded} onToggle={(e) => setIsEffectsExpanded((e.target as HTMLDetailsElement).open)}>
              <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>👻 Scary Effects</h3>
              </summary>
              
              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '1rem' }}>Customize which spooky effects you want to see</p>
                
                {/* Master Toggle */}
                <div className="settings-toggle-item" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px', border: '2px solid var(--accent-purple)' }}>
                  <div className="settings-toggle-label">
                    <span className="settings-toggle-icon">🎃</span>
                    <div>
                      <div className="settings-toggle-title">Master Haunting Mode</div>
                      <div className="settings-toggle-description">Toggle all effects at once</div>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={allEnabled}
                      onChange={toggleAll}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Individual Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="settings-toggle-item">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-icon">🌲</span>
                      <div>
                        <div className="settings-toggle-title">Haunted Trees</div>
                        <div className="settings-toggle-description">Spooky trees with glowing owl eyes</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.trees}
                        onChange={() => handleToggle('trees')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-icon">🦇</span>
                      <div>
                        <div className="settings-toggle-title">Flying Bats</div>
                        <div className="settings-toggle-description">Bats flying across the screen</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.bats}
                        onChange={() => handleToggle('bats')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-icon">👻</span>
                      <div>
                        <div className="settings-toggle-title">Floating Ghosts</div>
                        <div className="settings-toggle-description">Gentle floating ghost spirits</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.floatingGhosts}
                        onChange={() => handleToggle('floatingGhosts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-icon">😱</span>
                      <div>
                        <div className="settings-toggle-title">Jumpscare Ghost</div>
                        <div className="settings-toggle-description">Random scary ghost appearances</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.jumpscareGhost}
                        onChange={() => handleToggle('jumpscareGhost')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-icon">⚡</span>
                      <div>
                        <div className="settings-toggle-title">Screen Glitch</div>
                        <div className="settings-toggle-description">Random screen glitch effects</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.glitch}
                        onChange={() => handleToggle('glitch')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
