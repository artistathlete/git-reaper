'use client';

import React from 'react';

export default function FloatingGhosts() {
  // Generate multiple ghost elements with random properties
  const ghosts = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    emoji: '👻',
    // Random starting positions
    left: `${Math.random() * 80 + 10}%`,
    // Random animation duration (slower = more atmospheric)
    duration: `${15 + Math.random() * 10}s`,
    // Random animation delay for staggered effect
    delay: `${Math.random() * 5}s`,
    // Random opacity for depth effect
    opacity: 0.15 + Math.random() * 0.25,
    // Random size variation
    size: 1.5 + Math.random() * 1,
  }));

  return (
    <div className="floating-ghosts-container">
      {ghosts.map((ghost) => (
        <div
          key={ghost.id}
          className="floating-ghost"
          style={{
            left: ghost.left,
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
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .floating-ghost {
          position: absolute;
          bottom: -50px;
          animation: floatUp infinite ease-in-out;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          transition: all 0.3s ease;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--ghost-opacity, 0.3);
          }
          50% {
            transform: translateY(-50vh) translateX(20px) rotate(5deg);
          }
          90% {
            opacity: var(--ghost-opacity, 0.3);
          }
          100% {
            transform: translateY(-100vh) translateX(-20px) rotate(-5deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
