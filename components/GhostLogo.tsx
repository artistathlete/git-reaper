'use client';

import React from 'react';

interface GhostLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { width: 48, height: 48 },
  medium: { width: 80, height: 80 },
  large: { width: 120, height: 120 },
};

/**
 * GhostLogo component - An ethereal, animated ghost icon for the hero section
 * Features:
 * - Translucent, ghostly appearance with inner glow
 * - Floating/bobbing animation using ghostFloat keyframe
 * - Glow pulse effect using glowPulse keyframe
 * - Size variants: small (48px), medium (80px), large (120px)
 */
export default function GhostLogo({ className = '', size = 'large' }: GhostLogoProps) {
  const dimensions = sizeMap[size];

  return (
    <div
      className={`ghost-logo ghost-logo--${size} ${className}`}
      data-testid="ghost-logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'ghostFloat 3s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
        filter: 'drop-shadow(0 0 20px var(--ghost-glow))',
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ghost logo"
        style={{
          filter: 'drop-shadow(0 0 10px var(--ghost-glow))',
        }}
      >
        {/* Ghost body - ethereal translucent shape */}
        <defs>
          {/* Radial gradient for inner glow effect */}
          <radialGradient id="ghostGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.6)" />
          </radialGradient>
          {/* Linear gradient for body depth */}
          <linearGradient id="ghostBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.7)" />
          </linearGradient>
        </defs>

        {/* Main ghost body with wavy bottom */}
        <path
          d="M50 10 
             C25 10 15 30 15 50 
             L15 75 
             Q20 70 25 75 
             Q30 80 35 75 
             Q40 70 45 75 
             Q50 80 55 75 
             Q60 70 65 75 
             Q70 80 75 75 
             Q80 70 85 75 
             L85 50 
             C85 30 75 10 50 10 Z"
          fill="url(#ghostBody)"
          opacity="0.9"
        />

        {/* Inner glow overlay */}
        <ellipse
          cx="50"
          cy="40"
          rx="25"
          ry="20"
          fill="url(#ghostGlow)"
          opacity="0.5"
        />

        {/* Ghost eyes - cute hollow look */}
        <ellipse cx="38" cy="42" rx="6" ry="8" fill="#1a1a3a" opacity="0.8" />
        <ellipse cx="62" cy="42" rx="6" ry="8" fill="#1a1a3a" opacity="0.8" />

        {/* Eye highlights for ethereal effect */}
        <circle cx="36" cy="40" r="2" fill="rgba(255, 255, 255, 0.8)" />
        <circle cx="60" cy="40" r="2" fill="rgba(255, 255, 255, 0.8)" />

        {/* Subtle mouth - small 'o' shape */}
        <ellipse cx="50" cy="58" rx="4" ry="5" fill="#1a1a3a" opacity="0.6" />
      </svg>
    </div>
  );
}
