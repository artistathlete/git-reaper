'use client';

import React from 'react';
import styles from './GraveyardEnvironment.module.css';

export default function EnvironmentMiddleGround() {
  return (
    <div className={styles.middleGround}>
      <svg 
        viewBox="0 0 400 100" 
        className={styles.gateSvg}
      >
        <g fill="var(--borders)">
          {/* Left gate post */}
          <rect x="150" y="20" width="8" height="60" />
          <circle cx="154" cy="15" r="6" />
          
          {/* Right gate post */}
          <rect x="242" y="20" width="8" height="60" />
          <circle cx="246" cy="15" r="6" />
          
          {/* Gate bars */}
          <rect x="158" y="30" width="84" height="3" />
          <rect x="158" y="50" width="84" height="3" />
          <rect x="158" y="70" width="84" height="3" />
        </g>
      </svg>
    </div>
  );
}
