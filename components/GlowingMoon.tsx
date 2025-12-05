'use client';

import React from 'react';

export default function GlowingMoon() {
  return (
    <div className="glowing-moon-container">
      <div className="moon">
        <div className="crater crater-1" />
        <div className="crater crater-2" />
        <div className="crater crater-3" />
      </div>
      <style jsx>{`
        .glowing-moon-container {
          position: fixed;
          top: 8%;
          right: 10%;
          pointer-events: none;
          z-index: 1;
        }

        .moon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fef9e7 0%, #f4e4c1 100%);
          box-shadow: 
            0 0 40px rgba(255, 255, 200, 0.6),
            0 0 80px rgba(255, 255, 200, 0.4),
            0 0 120px rgba(255, 255, 200, 0.2),
            inset -10px -10px 20px rgba(0, 0, 0, 0.1);
          animation: moonPulse 4s ease-in-out infinite;
          position: relative;
        }

        .crater {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.15);
        }

        .crater-1 {
          width: 20px;
          height: 20px;
          top: 30%;
          left: 25%;
        }

        .crater-2 {
          width: 15px;
          height: 15px;
          top: 50%;
          right: 30%;
        }

        .crater-3 {
          width: 12px;
          height: 12px;
          bottom: 30%;
          left: 40%;
        }

        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 
              0 0 40px rgba(255, 255, 200, 0.6),
              0 0 80px rgba(255, 255, 200, 0.4),
              0 0 120px rgba(255, 255, 200, 0.2),
              inset -10px -10px 20px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 
              0 0 50px rgba(255, 255, 200, 0.8),
              0 0 100px rgba(255, 255, 200, 0.5),
              0 0 150px rgba(255, 255, 200, 0.3),
              inset -10px -10px 20px rgba(0, 0, 0, 0.1);
          }
        }

        @media (max-width: 768px) {
          .glowing-moon-container {
            top: 5%;
            right: 5%;
          }

          .moon {
            width: 80px;
            height: 80px;
          }

          .crater-1 {
            width: 14px;
            height: 14px;
          }

          .crater-2 {
            width: 10px;
            height: 10px;
          }

          .crater-3 {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
}
