# Z-Index Coordination Documentation

This document describes the z-index layering strategy for all visual elements in the Git Reaper application.

## Requirements

- **Requirements 9.1**: Graveyard Environment SHALL not visually conflict with existing animations
- **Requirements 8.3**: Graveyard Environment SHALL use z-index values that place it behind interactive content

## Z-Index Layer Stack

The application uses a carefully coordinated z-index system to ensure proper visual layering:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 10: Main Content (Interactive)                        │
│   - All interactive elements (buttons, inputs, tombstones)  │
│   - Defined in: app/globals.css (main { z-index: 10 })     │
│   - Position: relative                                       │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: Floating Ghosts                                    │
│   - Animated ghost emojis floating upward                   │
│   - Defined in: components/FloatingGhosts.tsx               │
│   - Position: absolute                                       │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Animated Fog                                       │
│   - Drifting fog effect                                     │
│   - Defined in: components/AnimatedFog.tsx                  │
│   - Position: fixed                                          │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Graveyard Environment                              │
│   - Bottom silhouette scene (trees, gate, hills, fog)      │
│   - Defined in: components/environment/*.tsx                │
│   - Position: fixed, bottom: 0                              │
│   - Pointer-events: none (allows click-through)            │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Background Elements                                │
│   - TwinklingStars: Starfield animation                    │
│   - GlowingMoon: Moon with glow effect                     │
│   - Defined in: components/TwinklingStars.tsx & GlowingMoon.tsx │
│   - Position: fixed                                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Z-Index Values

| Component | Z-Index | Position | File Location |
|-----------|---------|----------|---------------|
| TwinklingStars | 1 | fixed | components/TwinklingStars.tsx |
| GlowingMoon | 1 | fixed | components/GlowingMoon.tsx |
| GraveyardEnvironment | 2 | fixed | components/environment/GraveyardEnvironment.module.css |
| AnimatedFog | 5 | fixed | components/AnimatedFog.tsx |
| FloatingGhosts | 6 | absolute | components/FloatingGhosts.tsx |
| Main Content | 10 | relative | app/globals.css |

## Key Design Decisions

### 1. Graveyard Environment at z-index: 2
- Positioned above background elements (stars, moon) but below all other content
- Ensures the environment is visible but never interferes with user interactions
- Uses `pointer-events: none` to allow clicks to pass through to main content

### 2. Main Content at z-index: 10
- Highest z-index ensures all interactive elements remain accessible
- Uses `position: relative` to establish stacking context
- Includes all user-facing elements (input fields, buttons, tombstones)

### 3. Animation Layers (5-6)
- Fog and ghosts sit between environment and main content
- Creates atmospheric depth without blocking interactions
- Fog (5) below ghosts (6) for proper visual layering

### 4. Background Layer (1)
- Stars and moon share z-index: 1 as they're both background elements
- Furthest back in the visual stack
- Provides ambient atmosphere without interfering with foreground

## Testing

Z-index coordination is verified through:

1. **Unit Tests**: `components/environment/GraveyardEnvironment.zindex.test.tsx`
   - Verifies all components render with correct structure
   - Ensures accessibility attributes are present
   - Confirms no rendering errors

2. **Visual Inspection**: 
   - Manual testing confirms proper layering
   - No visual conflicts between animated elements
   - Main content remains fully interactive

## Maintenance Notes

When adding new visual elements:

1. **Background decorations**: Use z-index: 1
2. **Environment elements**: Use z-index: 2
3. **Atmospheric effects**: Use z-index: 3-9
4. **Interactive content**: Use z-index: 10+

Always ensure `pointer-events: none` is set on decorative elements to maintain interactivity.

## Verification Checklist

- [x] TwinklingStars at z-index: 1
- [x] GlowingMoon at z-index: 1
- [x] GraveyardEnvironment at z-index: 2
- [x] AnimatedFog at z-index: 5
- [x] FloatingGhosts at z-index: 6
- [x] Main content at z-index: 10 with position: relative
- [x] GraveyardEnvironment has pointer-events: none
- [x] No visual conflicts between layers
- [x] All interactive elements remain accessible
