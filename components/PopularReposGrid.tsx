'use client';

import React from 'react';
import Image from 'next/image';
import PopularRepoCard from './PopularRepoCard';

interface PopularRepository {
  id: string;
  icon: string;
  name: string;
  author: string;
  description: string;
  url: string;
}

const POPULAR_REPOS: PopularRepository[] = [
  {
    id: 'react',
    icon: '/icons/react.png',
    name: 'React',
    author: 'facebook',
    description: 'A JavaScript library for building user interfaces',
    url: 'https://github.com/facebook/react',
  },
  {
    id: 'vscode',
    icon: '/icons/vscode.png',
    name: 'VS Code',
    author: 'microsoft',
    description: 'Visual Studio Code editor',
    url: 'https://github.com/microsoft/vscode',
  },
  {
    id: 'nextjs',
    icon: '/icons/vercel.png',
    name: 'Next.js',
    author: 'vercel',
    description: 'The React Framework for Production',
    url: 'https://github.com/vercel/next.js',
  },
  {
    id: 'nodejs',
    icon: '/icons/nodejs.png',
    name: 'Node.js',
    author: 'nodejs',
    description: "JavaScript runtime built on Chrome's V8",
    url: 'https://github.com/nodejs/node',
  },
  {
    id: 'tensorflow',
    icon: '/icons/tensorflow.png',
    name: 'TensorFlow',
    author: 'tensorflow',
    description: 'Machine Learning framework',
    url: 'https://github.com/tensorflow/tensorflow',
  },
  {
    id: 'kubernetes',
    icon: '/icons/Kubernetes.png',
    name: 'Kubernetes',
    author: 'kubernetes',
    description: 'Container orchestration system',
    url: 'https://github.com/kubernetes/kubernetes',
  },
];

interface PopularReposGridProps {
  onSelectRepo: (url: string) => void;
}

/**
 * PopularReposGrid component - Displays a grid of popular repositories
 * Features:
 * - Responsive grid layout (3 columns desktop, 2 tablet, 1 mobile)
 * - 6 predefined popular repositories
 * - Passes click handler to cards
 */
export default function PopularReposGrid({ onSelectRepo }: PopularReposGridProps) {
  return (
    <section className="popular-repos-section" data-testid="popular-repos-section">
      <h2>TRY THESE POPULAR REPOSITORIES</h2>
      <div className="popular-repos-grid" data-testid="popular-repos-grid">
        {POPULAR_REPOS.map((repo) => (
          <PopularRepoCard
            key={repo.id}
            icon={<Image src={repo.icon} alt={`${repo.name} logo`} width={48} height={48} />}
            name={repo.name}
            author={repo.author}
            description={repo.description}
            url={repo.url}
            onClick={onSelectRepo}
          />
        ))}
      </div>
    </section>
  );
}
