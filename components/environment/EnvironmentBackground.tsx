'use client';

import React from 'react';
import styles from './GraveyardEnvironment.module.css';

export default function EnvironmentBackground() {
  return (
    <div className={styles.background}>
      <svg 
        viewBox="0 0 1200 100" 
        preserveAspectRatio="none"
        className={styles.backgroundSvg}
      >
        <path
          d="M0,50 Q300,20 600,40 T1200,50 L1200,100 L0,100 Z"
          fill="var(--panels)"
        />
      </svg>
    </div>
  );
}
