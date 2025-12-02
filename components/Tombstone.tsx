'use client';

import React from 'react';
import { DeadBranch } from '@/lib/types';
import styles from './Tombstone.module.css';
import GraveyardIcon from './GraveyardIcon';

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
      className={styles.tombstoneContainer}
      data-testid="tombstone"
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
      <svg 
        className={styles.tombstone}
        viewBox="0 0 200 280" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground */}
        <rect x="0" y="260" width="200" height="20" fill="currentColor" opacity="0.2"/>
        
        {/* Tombstone body with rounded top */}
        <path 
          d="M30 260 L30 80 Q30 20 100 20 Q170 20 170 80 L170 260 Z" 
          fill="var(--panels)"
          stroke="var(--borders)" 
          strokeWidth="4"
        />
        
        {/* RIP text at top */}
        <text 
          x="100" 
          y="70" 
          fontSize="20" 
          fontWeight="bold" 
          fill="var(--text-secondary)" 
          textAnchor="middle"
          opacity="0.6"
        >
          RIP
        </text>
        
        {/* Branch name */}
        <foreignObject x="40" y="95" width="120" height="100">
          <div className={styles.branchName}>
            {branch.name}
          </div>
        </foreignObject>
        
        {/* Commit date */}
        <foreignObject x="40" y="200" width="120" height="50">
          <div className={styles.commitDate}>
            Last commit: {formatDate(branch.lastCommitDate)}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
