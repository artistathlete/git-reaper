'use client';

import React from 'react';

/**
 * HauntedTrees component - Terrifying dead trees with ominous owls
 * Features:
 * - Gnarled, twisted dead trees
 * - Menacing owls with piercing red eyes
 * - Pure black silhouettes for maximum fear
 */
export default function HauntedTrees() {
  return (
    <>
      {/* Left Tree - Enhanced Scary */}
      <div className="haunted-tree haunted-tree-left">
        <svg viewBox="0 0 250 650" xmlns="http://www.w3.org/2000/svg">
          {/* Twisted trunk - thicker and more menacing */}
          <path
            d="M 120 650 Q 115 550 110 450 Q 105 380 100 320 Q 95 250 90 180 Q 88 120 85 60"
            stroke="#000000"
            strokeWidth="16"
            fill="none"
            opacity="1"
          />
          
          {/* Gnarled main branches - more twisted and scary */}
          <path d="M 90 180 Q 70 170 50 155 Q 35 145 25 130 Q 18 120 12 108" stroke="#000000" strokeWidth="9" fill="none" opacity="1" />
          <path d="M 95 250 Q 65 245 40 235 Q 20 228 10 215 Q 5 208 2 198" stroke="#000000" strokeWidth="8" fill="none" opacity="1" />
          <path d="M 100 320 Q 75 310 55 295 Q 40 285 30 270 Q 25 260 20 248" stroke="#000000" strokeWidth="8" fill="none" opacity="1" />
          <path d="M 105 380 Q 80 370 60 355 Q 45 345 35 330 Q 30 320 25 308" stroke="#000000" strokeWidth="7" fill="none" opacity="1" />
          <path d="M 108 440 Q 85 430 65 415 Q 55 408 48 398" stroke="#000000" strokeWidth="6" fill="none" opacity="0.95" />
          <path d="M 112 500 Q 95 490 80 478" stroke="#000000" strokeWidth="5" fill="none" opacity="0.9" />
          
          {/* Sharp, broken twigs - more jagged */}
          <path d="M 12 108 L 8 98 L 5 88 L 3 78" stroke="#000000" strokeWidth="4" fill="none" opacity="0.9" />
          <path d="M 12 108 L 6 95 L 4 85" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 2 198 L -2 188 L -4 178" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 20 248 L 15 238 L 12 228" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 25 308 L 20 298" stroke="#000000" strokeWidth="3" fill="none" opacity="0.85" />
          
          {/* Additional creepy branches */}
          <path d="M 88 120 Q 75 115 65 108 Q 58 103 52 96" stroke="#000000" strokeWidth="5" fill="none" opacity="0.95" />
          <path d="M 98 280 Q 85 275 75 268" stroke="#000000" strokeWidth="4" fill="none" opacity="0.9" />
          
          {/* Owl perch branch - visible horizontal branch */}
          <path d="M 12 130 L 45 130" stroke="#000000" strokeWidth="6" fill="none" opacity="1" />
          
          {/* Menacing Owl - Larger and scarier */}
          <g className="owl owl-scary" transform="translate(28, 108)">
            {/* Body - larger and more ominous */}
            <ellipse cx="0" cy="0" rx="18" ry="24" fill="#000000" opacity="1" />
            {/* Head - angular and menacing */}
            <path d="M -14 -14 L 0 -24 L 14 -14 L 14 -6 L -14 -6 Z" fill="#000000" opacity="1" />
            {/* Large menacing eyes */}
            <ellipse cx="-6" cy="-12" rx="5" ry="6" fill="#0a0000" />
            <ellipse cx="6" cy="-12" rx="5" ry="6" fill="#0a0000" />
            {/* Glowing red pupils - larger */}
            <circle cx="-6" cy="-12" r="3" fill="#ff0000" className="owl-eye-glow-red" />
            <circle cx="6" cy="-12" r="3" fill="#ff0000" className="owl-eye-glow-red" />
            {/* Sharp beak */}
            <path d="M 0 -8 L -4 -2 L 4 -2 Z" fill="#1a1a1a" />
            {/* Sharp ear tufts - longer */}
            <path d="M -12 -24 L -16 -32" stroke="#000000" strokeWidth="4" />
            <path d="M 12 -24 L 16 -32" stroke="#000000" strokeWidth="4" />
            {/* Talons gripping branch - sharper */}
            <path d="M -10 22 L -12 26 M -5 22 L -5 26 M 0 22 L 0 26" stroke="#000000" strokeWidth="2.5" />
            <path d="M 5 22 L 5 26 M 10 22 L 12 26" stroke="#000000" strokeWidth="2.5" />
          </g>
        </svg>
      </div>

      {/* Right Tree - Enhanced Scary */}
      <div className="haunted-tree haunted-tree-right">
        <svg viewBox="0 0 250 650" xmlns="http://www.w3.org/2000/svg">
          {/* Twisted trunk - thicker and more menacing */}
          <path
            d="M 130 650 Q 135 550 140 450 Q 145 380 150 320 Q 155 250 160 180 Q 162 120 165 60"
            stroke="#000000"
            strokeWidth="16"
            fill="none"
            opacity="1"
          />
          
          {/* Gnarled main branches - more twisted and scary */}
          <path d="M 160 180 Q 180 170 200 155 Q 215 145 225 130 Q 232 120 238 108" stroke="#000000" strokeWidth="9" fill="none" opacity="1" />
          <path d="M 155 250 Q 185 245 210 235 Q 230 228 240 215 Q 245 208 248 198" stroke="#000000" strokeWidth="8" fill="none" opacity="1" />
          <path d="M 150 320 Q 175 310 195 295 Q 210 285 220 270 Q 225 260 230 248" stroke="#000000" strokeWidth="8" fill="none" opacity="1" />
          <path d="M 145 380 Q 170 370 190 355 Q 205 345 215 330 Q 220 320 225 308" stroke="#000000" strokeWidth="7" fill="none" opacity="1" />
          <path d="M 142 440 Q 165 430 185 415 Q 195 408 202 398" stroke="#000000" strokeWidth="6" fill="none" opacity="0.95" />
          <path d="M 138 500 Q 155 490 170 478" stroke="#000000" strokeWidth="5" fill="none" opacity="0.9" />
          
          {/* Sharp, broken twigs - more jagged */}
          <path d="M 238 108 L 242 98 L 245 88 L 247 78" stroke="#000000" strokeWidth="4" fill="none" opacity="0.9" />
          <path d="M 238 108 L 244 95 L 246 85" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 248 198 L 252 188 L 254 178" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 230 248 L 235 238 L 238 228" stroke="#000000" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 225 308 L 230 298" stroke="#000000" strokeWidth="3" fill="none" opacity="0.85" />
          
          {/* Additional creepy branches */}
          <path d="M 162 120 Q 175 115 185 108 Q 192 103 198 96" stroke="#000000" strokeWidth="5" fill="none" opacity="0.95" />
          <path d="M 152 280 Q 165 275 175 268" stroke="#000000" strokeWidth="4" fill="none" opacity="0.9" />
          
          {/* Owl perch branch - visible horizontal branch */}
          <path d="M 205 130 L 238 130" stroke="#000000" strokeWidth="6" fill="none" opacity="1" />
          
          {/* Menacing Owl - Larger and scarier */}
          <g className="owl owl-scary" transform="translate(222, 108)">
            {/* Body - larger and more ominous */}
            <ellipse cx="0" cy="0" rx="18" ry="24" fill="#000000" opacity="1" />
            {/* Head - angular and menacing */}
            <path d="M -14 -14 L 0 -24 L 14 -14 L 14 -6 L -14 -6 Z" fill="#000000" opacity="1" />
            {/* Large menacing eyes */}
            <ellipse cx="-6" cy="-12" rx="5" ry="6" fill="#0a0000" />
            <ellipse cx="6" cy="-12" rx="5" ry="6" fill="#0a0000" />
            {/* Glowing red pupils - larger */}
            <circle cx="-6" cy="-12" r="3" fill="#ff0000" className="owl-eye-glow-red" />
            <circle cx="6" cy="-12" r="3" fill="#ff0000" className="owl-eye-glow-red" />
            {/* Sharp beak */}
            <path d="M 0 -8 L -4 -2 L 4 -2 Z" fill="#1a1a1a" />
            {/* Sharp ear tufts - longer */}
            <path d="M -12 -24 L -16 -32" stroke="#000000" strokeWidth="4" />
            <path d="M 12 -24 L 16 -32" stroke="#000000" strokeWidth="4" />
            {/* Talons gripping branch - sharper */}
            <path d="M -10 22 L -12 26 M -5 22 L -5 26 M 0 22 L 0 26" stroke="#000000" strokeWidth="2.5" />
            <path d="M 5 22 L 5 26 M 10 22 L 12 26" stroke="#000000" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </>
  );
}
