'use client';

import React from 'react';

interface PopularRepoCardProps {
  icon: React.ReactNode;
  name: string;
  author: string;
  description: string;
  url: string;
  onClick: (url: string) => void;
}

/**
 * PopularRepoCard component - A clickable card displaying a popular repository
 * Features:
 * - Displays icon, name, author, and description
 * - Hover lift/scale transform effect
 * - Hover glow effect with theme-consistent colors
 * - Smooth 200-300ms transitions
 * - Click triggers analysis
 */
export default function PopularRepoCard({
  icon,
  name,
  author,
  description,
  url,
  onClick,
}: PopularRepoCardProps) {
  const handleClick = () => {
    onClick(url);
  };

  return (
    <div
      className="popular-repo-card"
      onClick={handleClick}
      data-testid="popular-repo-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="popular-repo-icon" data-testid="repo-icon">
        {icon}
      </div>
      <h3 className="popular-repo-name" data-testid="repo-name">
        {name}
      </h3>
      <p className="popular-repo-author" data-testid="repo-author">
        {author}
      </p>
      <p className="popular-repo-description" data-testid="repo-description">
        {description}
      </p>
    </div>
  );
}
