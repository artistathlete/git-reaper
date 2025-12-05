'use client';

import React from 'react';
import GhostLogo from './GhostLogo';

/**
 * JumpscareGhost component - A large ghost that appears during blackouts
 * Features:
 * - Appears in center during lights-out effect
 * - 2x larger than normal ghost logo
 * - Synced with blackout animation timing
 */
export default function JumpscareGhost() {
  return (
    <div className="jumpscare-ghost">
      <GhostLogo size="large" />
    </div>
  );
}
