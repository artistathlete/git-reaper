'use client';

import React, { useState } from 'react';
import { FaGhost, FaBookDead, FaClock, FaCalendarAlt, FaMagic } from 'react-icons/fa';
import RepoInput from '@/components/RepoInput';
import Graveyard from '@/components/Graveyard';
import FloatingGhosts from '@/components/FloatingGhosts';
import { DeadBranch, ReapSuccessResponse, ReapErrorResponse } from '@/lib/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DeadBranch[] | null>(null);
  const [repositoryUrl, setRepositoryUrl] = useState<string>('');
  const [progress, setProgress] = useState<{ current: number; total: number; found: number; status?: string } | null>(null);
  const [githubToken, setGithubToken] = useState<string>('');

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
    <>
      <FloatingGhosts />
      <main>
        <div className="header">
          {/* Replaced Skull with friendly Ghost */}
          <h1>
            <FaGhost className="bounce" /> Git Reaper
          </h1>
          <p>The cozy place where dead branches rest in peace.</p>
        </div>

      <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="token-section">
        <details>
          <summary>⚙️ Optional: Add your GitHub token for unlimited use</summary>
          <div className="token-content">
            <p>🎁 <strong>You can use this for free!</strong> No token needed for basic usage.</p>
            <p>⚡ <strong>Want more?</strong> Add your own token for 5000 requests/hour (vs 60 without)</p>
            <p>Get a free token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a> - no scopes/permissions needed</p>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const details = e.currentTarget.closest('details');
                  if (details) details.open = false;
                }
              }}
              className="token-input"
            />
          </div>
        </details>
      </div>

      {!results && !isLoading && !error && (
        <>
          <div className="faq-section">
            <details className="faq-wrapper">
              <summary className="faq-header">❓ FAQ</summary>
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
            </details>
          </div>
          
          <div className="examples-section">
            <h2>🌟 Try These Popular Repositories</h2>
          <div className="examples-grid">
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/facebook/react')}
            >
              <div className="example-icon">⚛️</div>
              <div className="example-name">React</div>
              <div className="example-author">facebook</div>
              <div className="example-desc">A JavaScript library for building user interfaces</div>
            </button>
            
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/microsoft/vscode')}
            >
              <div className="example-icon">💻</div>
              <div className="example-name">VS Code</div>
              <div className="example-author">microsoft</div>
              <div className="example-desc">Visual Studio Code editor</div>
            </button>
            
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/vercel/next.js')}
            >
              <div className="example-icon">▲</div>
              <div className="example-name">Next.js</div>
              <div className="example-author">vercel</div>
              <div className="example-desc">The React Framework for Production</div>
            </button>
            
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/nodejs/node')}
            >
              <div className="example-icon">🟢</div>
              <div className="example-name">Node.js</div>
              <div className="example-author">nodejs</div>
              <div className="example-desc">JavaScript runtime built on Chrome's V8</div>
            </button>
            
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/tensorflow/tensorflow')}
            >
              <div className="example-icon">🧠</div>
              <div className="example-name">TensorFlow</div>
              <div className="example-author">tensorflow</div>
              <div className="example-desc">Machine Learning framework</div>
            </button>
            
            <button 
              className="example-card"
              onClick={() => handleSubmit('https://github.com/torvalds/linux')}
            >
              <div className="example-icon">🐧</div>
              <div className="example-name">Linux</div>
              <div className="example-author">torvalds</div>
              <div className="example-desc">Linux kernel source tree</div>
            </button>
          </div>
        </div>
        </>
      )}

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

      {isLoading && (
        <div className="loading-container">
          <div className="spooky-loading">
            <div className="ghost-loader">👻</div>
            <div className="ghost-loader ghost-2">👻</div>
            <div className="ghost-loader ghost-3">👻</div>
          </div>
          <div className="loading-text">✨ Summoning Branches... ✨</div>
          {progress && (
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Checking {progress.current} of {progress.total}... Found {progress.found}
            </p>
          )}
        </div>
      )}

      {results && !isLoading && (
        <>
          <Graveyard deadBranches={results} repositoryUrl={repositoryUrl} />
          
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
                    {/* Simple logic to just show 'Ready' or similar could go here */}
                    Clean
                  </div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      </main>
    </>
  );
}
