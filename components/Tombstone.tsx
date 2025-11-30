'use client';

import React from 'react';
import { DeadBranch } from '@/lib/types';

interface TombstoneProps {
  branch: DeadBranch;
  repositoryUrl: string;
  index?: number;
}

export default function Tombstone({ branch, repositoryUrl, index = 0 }: TombstoneProps) {
  const handleClick = () => {
    // Extract owner and repo from the repository URL
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      const [, owner, repo] = match;
      // Open GitHub commit URL in new tab
      const commitUrl = `https://github.com/${owner}/${repo}/commit/${branch.lastCommitSha}`;
      window.open(commitUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate animation delay based on index (100ms per tombstone)
  const animationDelay = `${index * 0.1}s`;

  return (
    <div 
      className="tombstone"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        animationDelay,
      }}
    >
      <div className="tombstone-top"></div>
      <div className="tombstone-body">
        <div className="branch-name">{branch.name}</div>
        <div className="commit-date">{formatDate(branch.lastCommitDate)}</div>
      </div>
    </div>
  );
}
