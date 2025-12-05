'use client';

import React from 'react';
import styles from './GraveyardEnvironment.module.css';
import EnvironmentBackground from './EnvironmentBackground';
import EnvironmentMiddleGround from './EnvironmentMiddleGround';
import EnvironmentForeground from './EnvironmentForeground';
import EnvironmentFog from './EnvironmentFog';

interface GraveyardEnvironmentProps {
  className?: string;
}

export default function GraveyardEnvironment({ className }: GraveyardEnvironmentProps) {
  return (
    <div 
      className={`${styles.environment} ${className || ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <EnvironmentBackground />
      <EnvironmentMiddleGround />
      <EnvironmentForeground />
      <EnvironmentFog />
    </div>
  );
}
