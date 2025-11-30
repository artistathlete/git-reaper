'use client';

import React from 'react';
import { DeadBranch } from '@/lib/types';
import Tombstone from './Tombstone';
import FloatingGhosts from './FloatingGhosts';

interface GraveyardProps {
  deadBranches: DeadBranch[];
  repositoryUrl: string;
}

export default function Graveyard({ deadBranches, repositoryUrl }: GraveyardProps) {
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

  return (
    <div className="graveyard">
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
