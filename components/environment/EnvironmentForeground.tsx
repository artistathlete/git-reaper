'use client';

import React from 'react';
import styles from './GraveyardEnvironment.module.css';

export default function EnvironmentForeground() {
  return (
    <div className={styles.foreground}>
      {/* Left tree */}
      <svg 
        viewBox="0 0 100 120" 
        className={`${styles.treeSvg} ${styles.treeLeft}`}
      >
        <path
          d="M50,120 L50,60 M50,80 L30,70 M50,70 L70,60 M50,60 L35,50 M50,50 L65,40"
          stroke="var(--background)"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
      </svg>
      
      {/* Right tree */}
      <svg 
        viewBox="0 0 100 120" 
        className={`${styles.treeSvg} ${styles.treeRight}`}
      >
        <path
          d="M50,120 L50,60 M50,80 L70,70 M50,70 L30,60 M50,60 L65,50 M50,50 L35,40"
          stroke="var(--background)"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
