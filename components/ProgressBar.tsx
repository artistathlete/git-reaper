'use client';

import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  found: number;
  status?: string;
}

export default function ProgressBar({ current, total, found, status }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const radar = radarRef.current;
    if (!radar) return;

    const moveRadar = () => {
      // Random position anywhere on screen
      const leftPos = 10 + Math.random() * 80; // 10% to 90% from left
      const topPos = 15 + Math.random() * 70; // 15% to 85% from top
      
      radar.style.left = `${leftPos}%`;
      radar.style.top = `${topPos}%`;
    };

    // Move radar every 2.5 seconds (matching animation duration)
    const interval = setInterval(moveRadar, 2500);
    
    // Set initial random position
    moveRadar();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="progress-container">
      <div ref={radarRef} className="radar-ping"></div>
      <div className="progress-status">
        {status || 'Analyzing branches...'}
      </div>
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
