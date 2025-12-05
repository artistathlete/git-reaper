'use client';

import React, { useMemo } from 'react';

export default function FloatingGhosts() {
  // Generate multiple ghost elements with random properties
  // useMemo ensures positions stay stable across re-renders
  const ghosts = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      emoji: '👻',
      // Random positions across the screen
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 60 + 20}%`,
      // Slow, gentle floating animation
      duration: `${4 + Math.random() * 3}s`,
      // Random animation delay for staggered effect
      delay: `${Math.random() * 5}s`,
      // Random opacity for depth effect
      opacity: 0.15 + Math.random() * 0.25,
      // Random size variation
      size: 1.5 + Math.random() * 1,
    })), []
  );

  return (
    <div className="floating-ghosts-container">
      {ghosts.map((ghost) => (
        <div
          key={ghost.id}
          className="floating-ghost"
          style={{
            left: ghost.left,
            top: ghost.top,
            animationDuration: ghost.duration,
            animationDelay: ghost.delay,
            opacity: ghost.opacity,
            fontSize: `${ghost.size}rem`,
          }}
        >
          {ghost.emoji}
        </div>
      ))}
      <style jsx>{`
        .floating-ghosts-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .floating-ghost {
          position: absolute;
          animation: gentleFloat infinite ease-in-out;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
