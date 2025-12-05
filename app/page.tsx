'use client';

import React, { useState, useEffect } from 'react';
import { FaBookDead, FaClock, FaMagic } from 'react-icons/fa';
import GhostLogo from '@/components/GhostLogo';
import PillInput from '@/components/PillInput';
import PopularReposGrid from '@/components/PopularReposGrid';

import FAQModal from '@/components/FAQModal';
import AboutModal from '@/components/AboutModal';
import SettingsModal from '@/components/SettingsModal';
import Header from '@/components/Header';
import Graveyard from '@/components/Graveyard';
import FloatingGhosts from '@/components/FloatingGhosts';
import JumpscareGhost from '@/components/JumpscareGhost';
import HauntedTrees from '@/components/HauntedTrees';
import FlyingBats from '@/components/FlyingBats';
import { DeadBranch, ReapSuccessResponse, ReapErrorResponse } from '@/lib/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DeadBranch[] | null>(null);
  const [repositoryUrl, setRepositoryUrl] = useState<string>('');
  const [progress, setProgress] = useState<{ current: number; total: number; found: number; status?: string } | null>(null);
  const [githubToken, setGithubToken] = useState<string>('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hauntingMode, setHauntingMode] = useState(true);
  const [scarySettings, setScarySettings] = useState({
    trees: true,
    bats: true,
    floatingGhosts: true,
    jumpscareGhost: true,
    glitch: true
  });
  const [isGlitching, setIsGlitching] = useState(false);

  // Random glitch effect that triggers periodically (only when glitch setting is enabled)
  useEffect(() => {
    if (!scarySettings.glitch) {
      setIsGlitching(false);
      return;
    }

    const triggerRandomGlitch = () => {
      // Random delay between 8-20 seconds
      const randomDelay = Math.random() * 12000 + 8000;
      
      const timer = setTimeout(() => {
        if (scarySettings.glitch) {
          setIsGlitching(true);
          // Glitch lasts 0.5 seconds
          setTimeout(() => {
            setIsGlitching(false);
          }, 500);
        }
        
        // Schedule next glitch
        triggerRandomGlitch();
      }, randomDelay);

      return timer;
    };

    // Initial glitch after 2 seconds
    const initialTimer = setTimeout(() => {
      if (scarySettings.glitch) {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
        }, 500);
      }
      
      // Start random glitch cycle
      const randomTimer = triggerRandomGlitch();
      return () => clearTimeout(randomTimer);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [scarySettings.glitch]);

  const handleSubmit = async (url: string) => {
    // Reset state
    setIsLoading(true);
    setError(null);
    setResults(null);
    setRepositoryUrl(url);
    setProgress(null);

    try {
      // Call the /api/reap endpoint with streaming
      const response = await fetch('/api/reap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          githubUrl: url,
          githubToken: githubToken || undefined
        }),
      });

      // Check if response is streaming
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'progress') {
                  setProgress({
                    current: data.current,
                    total: data.total,
                    found: data.found,
                    status: data.status
                  });
                } else if (data.type === 'complete') {
                  setResults(data.deadBranches);
                  setRepositoryUrl(data.repositoryUrl);
                } else if (data.type === 'error') {
                  setError(data.error);
                }
              }
            }
          }
        }
      } else {
        // Fallback to regular JSON response
        const data = await response.json();

        if (!response.ok) {
          const errorData = data as ReapErrorResponse;
          setError(errorData.error || 'An error occurred while analyzing the repository');
        } else {
          const successData = data as ReapSuccessResponse;
          setResults(successData.deadBranches);
          setRepositoryUrl(successData.repositoryUrl);
        }
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className={isGlitching && hauntingMode ? 'page-glitch' : ''}>
      {hauntingMode && scarySettings.trees && <HauntedTrees />}
      {hauntingMode && scarySettings.bats && <FlyingBats />}
      {hauntingMode && scarySettings.floatingGhosts && <FloatingGhosts />}
      {hauntingMode && scarySettings.jumpscareGhost && <JumpscareGhost />}
      
      <Header 
        onAboutClick={() => setIsAboutOpen(true)} 
        onFAQClick={() => setIsFAQOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        hauntingMode={hauntingMode}
        onHauntingToggle={() => setHauntingMode(!hauntingMode)}
      />
      
      <main className={hauntingMode ? '' : 'no-flicker'}>
        {/* Hero Section with GhostLogo, title, and tagline */}
        {!results && !isLoading && (
          <div className="hero-section">
            <GhostLogo size="medium" />
            <h1 className="hero-title" data-text="GIT REAPER">GIT REAPER</h1>
            <p className="hero-tagline">The cozy place where dead branches rest in peace.</p>
          </div>
        )}

        {/* PillInput - integrated input with REAP button */}
        <PillInput
          value={repositoryUrl}
          onChange={setRepositoryUrl}
          onSubmit={() => handleSubmit(repositoryUrl)}
          isLoading={isLoading}
          placeholder="https://github.com/owner/repo"
        />

        {/* Popular Repositories Grid - hidden during loading/results */}
        {!results && !isLoading && !error && (
          <PopularReposGrid onSelectRepo={handleSubmit} />
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            {error.includes('rate limit') && !githubToken && (
              <div className="rate-limit-help">
                <p><strong>🚫 All rate limits exhausted!</strong></p>
                <p>Both the free tier and our backup token have been used up.</p>
                <p>👉 Add your own GitHub token above to continue (it's free and takes 30 seconds!)</p>
                <p>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a>, create a token with no scopes, and paste it above.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            {hauntingMode ? (
              <div className="scary-summoning">
                <div className="summoning-circle">
                  <div className="pentagram">💀</div>
                </div>
                <div className="loading-text">🔮 SUMMONING BRANCHES FROM THE VOID 🔮</div>
              </div>
            ) : (
              <div className="normal-loading">
                <div className="spinner-circle">
                  <div className="spinner"></div>
                </div>
                <div className="loading-text-normal">Analyzing Repository...</div>
              </div>
            )}
            {progress && (
              <div className="progress-display">
                <div className="progress-info">
                  <span className="progress-label">Scanning Repository...</span>
                  <span className="progress-stats">{progress.current} / {progress.total} branches</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                  >
                    <span className="progress-glow"></span>
                  </div>
                </div>
                <div className="progress-found">
                  {hauntingMode ? '💀' : '📊'} Found {progress.found} dead {progress.found === 1 ? 'branch' : 'branches'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results View - Graveyard and Stats */}
        {results && !isLoading && (
          <>
            <div className="results-header">
              <button 
                className="back-to-landing-button"
                onClick={() => {
                  setResults(null);
                  setError(null);
                  setRepositoryUrl('');
                }}
                data-testid="back-to-landing-button"
              >
                ← Try Another Repository
              </button>
            </div>
            
            <Graveyard deadBranches={results} repositoryUrl={repositoryUrl} hauntingMode={hauntingMode} />
            
            {results.length > 0 && (
              <div className="suggestions-section" style={{ maxWidth: '800px', margin: '3rem auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Graveyard Stats</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaBookDead />
                    </div>
                    <div className="stat-number">{results.length}</div>
                    <div className="stat-label">Ghosts Found</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaClock />
                    </div>
                    <div className="stat-number">
                      {Math.round((results.reduce((sum, branch) => {
                        const daysSince = Math.floor(
                          (Date.now() - new Date(branch.lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
                        );
                        return sum + daysSince;
                      }, 0) / results.length))}
                    </div>
                    <div className="stat-label">Avg. Days Inactive</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaMagic />
                    </div>
                    <div className="stat-number">
                      {results.length === 0 ? 'Clean' : 'Needs Cleanup'}
                    </div>
                    <div className="stat-label">Status</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      
      {/* FAQ Modal */}
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      
      {/* Settings Modal - Combined Token & Effects */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        githubToken={githubToken}
        onTokenChange={setGithubToken}
        settings={scarySettings}
        onSettingsChange={setScarySettings}
        hauntingMode={hauntingMode}
        onHauntingModeChange={setHauntingMode}
      />
    </div>
  );
}
