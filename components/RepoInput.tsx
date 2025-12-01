'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaGithub, FaSkullCrossbones } from 'react-icons/fa';
import { validateGitHubUrl } from '@/lib/validators';

interface RepoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // Validate URL on input change
    const validation = validateGitHubUrl(value);
    setIsValid(validation.isValid);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="repo-input-form">
      <div className="input-container">
        <div className="input-wrapper">
          <FaGithub className="input-icon" />
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="https://github.com/owner/repo"
            className="repo-input"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="reap-button"
          disabled={!isValid || isLoading}
        >
          <FaSkullCrossbones className="button-icon" />
          {isLoading ? 'REAPING...' : 'REAP'}
        </button>
      </div>
    </form>
  );
}
