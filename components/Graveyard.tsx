'use client';

import React from 'react';
import { DeadBranch } from '@/lib/types';
import Tombstone from './Tombstone';
import FloatingGhosts from './FloatingGhosts';

interface GraveyardProps {
  deadBranches: DeadBranch[];
  repositoryUrl: string;
  hauntingMode?: boolean;
}

export default function Graveyard({ deadBranches, repositoryUrl, hauntingMode = true }: GraveyardProps) {
  // Sort dead branches by last commit date (newest to oldest)
  const sortedBranches = [...deadBranches].sort((a, b) => {
    const dateA = new Date(a.lastCommitDate).getTime();
    const dateB = new Date(b.lastCommitDate).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  // Show empty state if no dead branches
  if (deadBranches.length === 0) {
    return (
      <div className="graveyard empty">
        <div className="empty-state">
          <p>This repository is clean! No dead branches found.</p>
        </div>
      </div>
    );
  }

  // Professional mode - clean list view
  if (!hauntingMode) {
    return (
      <div className="branch-list-container" data-testid="branch-list">
        <h2 className="branch-list-title">Dead Branches Found</h2>
        <div className="branch-list">
          {sortedBranches.map((branch, index) => {
            const daysSince = Math.floor(
              (Date.now() - new Date(branch.lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <div key={`${branch.name}-${index}`} className="branch-item">
                <div className="branch-info">
                  <div className="branch-name">{branch.name}</div>
                  <div className="branch-meta">
                    <span className="branch-author">by {branch.lastCommitAuthor}</span>
                    <span className="branch-separator">•</span>
                    <span className="branch-date">{daysSince} days inactive</span>
                    <span className="branch-separator">•</span>
                    <span className="branch-commits">{branch.commitCount} {branch.commitCount === 1 ? 'commit' : 'commits'}</span>
                  </div>
                </div>
                <a
                  href={`${repositoryUrl}/commits/${branch.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="branch-link"
                >
                  View Commits →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Haunting mode - graveyard with tombstones
  return (
    <div className="graveyard" data-testid="graveyard">
      <FloatingGhosts />
      <div className="graveyard-container">
        <div className="tombstone-grid">
          {sortedBranches.map((branch, index) => (
            <Tombstone
              key={`${branch.name}-${index}`}
              branch={branch}
              repositoryUrl={repositoryUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
