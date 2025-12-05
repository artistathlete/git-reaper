'use client';

import React, { useMemo } from 'react';

/**
 * FlyingBats component - Swarms of scary bats flying across the screen
 * Features:
 * - Multiple bat swarms with different paths
 * - Erratic, scary flight patterns
 * - Black silhouettes with wing flapping
 */
export default function FlyingBats() {
  // Create multiple bat swarms with stable positions
  const swarms = useMemo(() => [
    { 
      id: 1, 
      bats: Array.from({ length: 5 }, (_, i) => ({
        left: i * 60 + Math.random() * 40,
        top: Math.random() * 100,
        delay: i * 0.1,
      })),
      delay: 0, 
      duration: 15 
    },
    { 
      id: 2, 
      bats: Array.from({ length: 7 }, (_, i) => ({
        left: i * 60 + Math.random() * 40,
        top: Math.random() * 100,
        delay: i * 0.1,
      })),
      delay: 8, 
      duration: 18 
    },
    { 
      id: 3, 
      bats: Array.from({ length: 6 }, (_, i) => ({
        left: i * 60 + Math.random() * 40,
        top: Math.random() * 100,
        delay: i * 0.1,
      })),
      delay: 16, 
      duration: 16 
    },
    { 
      id: 4, 
      bats: Array.from({ length: 4 }, (_, i) => ({
        left: i * 60 + Math.random() * 40,
        top: Math.random() * 100,
        delay: i * 0.1,
      })),
      delay: 24, 
      duration: 14 
    },
  ], []);

  return (
    <div className="flying-bats-container">
      {swarms.map((swarm) => (
        <div
          key={swarm.id}
          className="bat-swarm"
          style={{
            animationDelay: `${swarm.delay}s`,
            animationDuration: `${swarm.duration}s`,
          }}
        >
          {swarm.bats.map((bat, i) => (
            <svg
              key={i}
              className="bat"
              style={{
                left: `${bat.left}px`,
                top: `${bat.top}px`,
                animationDelay: `${bat.delay}s`,
              }}
              width="50"
              height="35"
              viewBox="0 0 50 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bat body */}
              <ellipse cx="25" cy="20" rx="3" ry="5" fill="#000000" />
              
              {/* Bat head */}
              <circle cx="25" cy="16" r="2.5" fill="#000000" />
              
              {/* Sharp pointed ears */}
              <path d="M 23 14 L 22 10 L 24 14 Z" fill="#000000" />
              <path d="M 27 14 L 28 10 L 26 14 Z" fill="#000000" />
              
              {/* Left wing - sharp and angular like real bat */}
              <path
                className="bat-wing-left"
                d="M 22 20 
                   L 15 18 
                   L 8 15
                   L 3 12
                   L 2 14
                   L 4 18
                   L 8 22
                   L 15 24
                   L 22 22 Z"
                fill="#000000"
                opacity="0.95"
              />
              
              {/* Wing finger bones - left */}
              <path
                className="bat-wing-left"
                d="M 15 18 L 8 22 M 8 15 L 4 18"
                stroke="#1a1a1a"
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              
              {/* Right wing - sharp and angular */}
              <path
                className="bat-wing-right"
                d="M 28 20 
                   L 35 18 
                   L 42 15
                   L 47 12
                   L 48 14
                   L 46 18
                   L 42 22
                   L 35 24
                   L 28 22 Z"
                fill="#000000"
                opacity="0.95"
              />
              
              {/* Wing finger bones - right */}
              <path
                className="bat-wing-right"
                d="M 35 18 L 42 22 M 42 15 L 46 18"
                stroke="#1a1a1a"
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              
              {/* Red glowing eyes */}
              <circle cx="24" cy="16" r="0.8" fill="#ff0000" className="bat-eye" />
              <circle cx="26" cy="16" r="0.8" fill="#ff0000" className="bat-eye" />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}
