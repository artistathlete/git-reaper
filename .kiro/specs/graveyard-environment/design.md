# Design Document: Graveyard Environment

## Overview

The Graveyard Environment is a decorative, atmospheric layer positioned at the bottom 10% of the viewport. It creates a spooky graveyard ambiance using layered SVG silhouettes (trees, gate, hills) with a subtle fog overlay. The implementation prioritizes visual harmony with existing animations while ensuring zero interference with user interactions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Content Area (90%)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ TwinklingStars (z-index: 1)                             ││
│  │ GlowingMoon (z-index: 1)                                ││
│  │ AnimatedFog (z-index: 5)                                ││
│  │ FloatingGhosts (z-index: 6)                             ││
│  │ Main Content (z-index: 10, position: relative)          ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│              Graveyard Environment (10%)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Fog Overlay (z-index: 5, semi-transparent)              ││
│  │ Foreground Trees (z-index: 4, opacity: 0.7)             ││
│  │ Middle Ground Gate (z-index: 3, opacity: 0.6)           ││
│  │ Background Hills (z-index: 2, opacity: 0.4)             ││
│  └─────────────────────────────────────────────────────────┘│
│  position: fixed; bottom: 0; pointer-events: none           │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Component Hierarchy

```
GraveyardEnvironment (container)
├── EnvironmentFog (fog overlay)
├── EnvironmentForeground (tree silhouettes)
├── EnvironmentMiddleGround (gate/fence)
└── EnvironmentBackground (distant hills)
```

### GraveyardEnvironment.tsx

Main container component that orchestrates all layers.

```typescript
interface GraveyardEnvironmentProps {
  className?: string;
}
```

**Responsibilities:**
- Render all child layer components
- Apply fixed positioning at viewport bottom
- Set pointer-events: none for click-through
- Apply aria-hidden="true" for accessibility

### EnvironmentForeground.tsx

Renders tree silhouettes on left and right edges.

```typescript
// No props - self-contained SVG component
```

**Responsibilities:**
- Render two SVG tree silhouettes
- Position left tree at left edge, right tree at right edge
- Apply opacity: 0.7 for depth effect
- Hide on mobile viewports (< 480px)

### EnvironmentMiddleGround.tsx

Renders centered gate/fence silhouette.

```typescript
// No props - self-contained SVG component
```

**Responsibilities:**
- Render SVG gate silhouette
- Center horizontally
- Apply opacity: 0.6 for depth effect
- Scale down on smaller viewports

### EnvironmentBackground.tsx

Renders distant hills spanning full width.

```typescript
// No props - self-contained SVG component
```

**Responsibilities:**
- Render SVG hills silhouette
- Stretch to full container width
- Apply opacity: 0.4 for depth effect

### EnvironmentFog.tsx

Renders subtle fog overlay.

```typescript
// No props - self-contained component
```

**Responsibilities:**
- Render semi-transparent gradient fog
- Blend with existing AnimatedFog above
- Keep opacity low (0.2-0.3) to not obscure silhouettes

## Data Models

No data models required - this is a purely presentational feature with no state or data persistence.



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Viewport Split (90/10)

*For any* viewport height between 400px and 2000px, the Graveyard Environment height SHALL be no more than 10% of the viewport height, ensuring the main content area occupies at least 90%.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Seamless Transition Gradient

*For any* rendered Graveyard Environment, there SHALL exist a gradient transition element that spans at least 30px in height and uses transparent-to-opaque coloring to create a smooth visual blend between the 10% environment and 90% main content areas.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 3: Layer Z-Index Ordering

*For any* rendered Graveyard Environment, the z-index values SHALL follow the ordering: foreground > middle ground > background, AND opacity values SHALL follow: foreground > middle ground > background.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 4: Content Accessibility (Click-Through)

*For any* click event within the main content area, the event SHALL reach the underlying interactive elements without being blocked by the Graveyard Environment, verified by pointer-events: none on the environment container.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 5: Foreground Element Sizing

*For any* foreground tree element, the computed width SHALL be under 150px to ensure trees remain small and unobtrusive.

**Validates: Requirements 4.3**

### Property 6: Design System Color Consistency

*For any* SVG element within the Graveyard Environment, all fill and stroke color values SHALL reference CSS variables (contain "var(--") to maintain design system consistency.

**Validates: Requirements 5.4, 9.2**

### Property 7: Mobile Viewport Adaptation

*For any* viewport width below 480px, the foreground tree elements SHALL be hidden (display: none or visibility: hidden) or have significantly reduced dimensions.

**Validates: Requirements 4.4**

### Property 8: Animation Layer Compatibility

*For any* rendered page with both Graveyard Environment and existing animations (TwinklingStars, GlowingMoon, AnimatedFog, FloatingGhosts), the z-index values SHALL not create visual conflicts, with main content z-index > environment z-index.

**Validates: Requirements 9.1**

### Property 9: Layout Shift Prevention

*For any* Graveyard Environment render, the container SHALL use position: fixed with explicit height dimensions to prevent Cumulative Layout Shift (CLS).

**Validates: Requirements 9.3**

## Error Handling

This feature is purely presentational with no user input or data processing. Error handling is minimal:

- **Missing CSS Variables**: SVG elements should have fallback colors defined
- **SVG Rendering Failures**: Browser handles gracefully; no JavaScript fallback needed
- **Viewport Edge Cases**: CSS clamp() and max-height ensure reasonable bounds

## Testing Strategy

### Unit Tests

Unit tests verify specific component behavior:

- GraveyardEnvironment renders all four child components (fog, foreground, middle, background)
- Each layer component renders correct SVG elements
- CSS classes are applied correctly
- Accessibility attributes (aria-hidden) are present
- Fixed positioning and pointer-events styles are applied

### Property-Based Tests

Property-based tests use **fast-check** to verify universal properties:

1. **Viewport Split**: Generate random viewport heights, verify 10% max environment height
2. **Layer Ordering**: Query all layers, verify z-index and opacity ordering
3. **Click-Through**: Generate random click coordinates, verify events reach targets
4. **Foreground Sizing**: Verify tree widths under 150px
5. **Color Consistency**: Query all SVG elements, verify CSS variable usage
6. **Mobile Adaptation**: Generate mobile viewport widths, verify tree hiding
7. **Animation Compatibility**: Query all animated elements, verify z-index ordering
8. **Layout Shift Prevention**: Verify fixed positioning and explicit dimensions

Each property-based test will run a minimum of 100 iterations and be tagged with the format:
`**Feature: graveyard-environment, Property {number}: {property_text}**`

### Integration Tests

- Verify GraveyardEnvironment renders in app layout
- Verify no interference with existing animations
- Verify main content remains interactive
