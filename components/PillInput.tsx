'use client';

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { FaGithub } from 'react-icons/fa';
import { validateGitHubUrl } from '@/lib/validators';

interface PillInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function PillInput({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading,
  placeholder = 'https://github.com/owner/repo'
}: PillInputProps) {
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate URL on input change
    const validation = validateGitHubUrl(newValue);
    setIsValid(validation.isValid);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleButtonClick = () => {
    if (isValid && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="pill-input-container">
      <FaGithub className="pill-input-icon" />
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pill-input-field"
        disabled={isLoading}
        data-testid="pill-input-field"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="pill-reap-button"
        disabled={!isValid || isLoading}
        data-testid="pill-reap-button"
      >
        {isLoading ? (
          <span className="loading-spinner" data-testid="loading-spinner">⟳</span>
        ) : (
          'REAP'
        )}
      </button>
    </div>
  );
}
