# Implementation Plan

> **IMPORTANT**: When running commands (npm, tests, etc.), always use `cmd /c` prefix on Windows.
> Example: `cmd /c npm test` instead of `npm test`

- [x] 1. Create environment component structure
  - [x] 1.1 Create component directory and files
    - Create `components/environment/` directory
    - Create `GraveyardEnvironment.tsx` as main container component
    - Create `EnvironmentBackground.tsx` for distant hills layer
    - Create `EnvironmentMiddleGround.tsx` for gate/fence layer
    - Create `EnvironmentForeground.tsx` for tree silhouettes layer
    - Create `EnvironmentFog.tsx` for subtle fog overlay
    - Create `GraveyardEnvironment.module.css` for styles
    - _Requirements: 1.1, 2.1, 7.1_

  - [x] 1.2 Write unit tests for component structure
    - Test GraveyardEnvironment renders all four child components
    - Test each layer component renders without errors
    - Test components apply correct CSS module classes
    - _Requirements: 1.1, 3.1_

- [x] 2. Implement CSS positioning and layout
  - [x] 2.1 Create base environment container styles
    - Add `position: fixed` with `bottom: 0` positioning
    - Set `height: 10vh` with `max-height: 120px`
    - Add `pointer-events: none` to allow click-through
    - Set `z-index: 2` for proper stacking (below main content)
    - Add `overflow: hidden` to contain elements
    - _Requirements: 1.1, 1.4, 8.1, 8.3_

  - [x] 2.2 Implement layer z-index stacking
    - Set background layer to `z-index: 1` with `opacity: 0.4`
    - Set middle ground layer to `z-index: 2` with `opacity: 0.6`
    - Set foreground layer to `z-index: 3` with `opacity: 0.7`
    - Set fog layer to `z-index: 4` with `opacity: 0.25`
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 2.3 Create seamless transition gradient
    - Add `::before` pseudo-element with gradient overlay
    - Position gradient at least 30px above environment bottom
    - Use `linear-gradient` from transparent to environment background color
    - Ensure no hard visual edge between 10% and 90% areas
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.4 Write property test for seamless transition
    - **Property 2: Seamless Transition Gradient**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Verify gradient element exists with minimum 30px height
    - Verify gradient uses transparent-to-opaque coloring

  - [x] 2.5 Write property test for viewport split
    - **Property 1: Viewport Split (90/10)**
    - **Validates: Requirements 1.1, 1.2, 1.3**
    - Generate random viewport heights (400px to 2000px)
    - Verify environment height is no more than 10% of viewport

  - [x] 2.6 Write property test for z-index ordering
    - **Property 3: Layer Z-Index Ordering**
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - Query all layer elements
    - Verify foreground z-index > middle ground z-index > background z-index
    - Verify opacity ordering matches

  - [x] 2.7 Write unit tests for CSS properties
    - Test environment has position: fixed
    - Test height is 10vh with max-height
    - Test pointer-events: none is applied
    - Test z-index values are correct
    - _Requirements: 1.4, 8.1_

- [x] 3. Create SVG background layer (distant hills)
  - [x] 3.1 Implement EnvironmentBackground component
    - Create simple SVG with viewBox="0 0 1200 100"
    - Add `preserveAspectRatio="none"` for stretching
    - Draw simple path for distant hills silhouette with gentle curves
    - Use `var(--panels)` or similar CSS variable for fill color
    - Keep path points under 50 for performance
    - _Requirements: 6.1, 6.2, 6.3, 10.1_

  - [x] 3.2 Write unit tests for background layer
    - Test EnvironmentBackground renders SVG element
    - Test SVG has correct viewBox and preserveAspectRatio
    - Test uses CSS variables for colors
    - _Requirements: 6.1, 5.4_

- [x] 4. Create SVG middle ground layer (gate/fence)
  - [x] 4.1 Implement EnvironmentMiddleGround component
    - Create simple SVG with viewBox="0 0 400 100"
    - Draw simple gothic-style gate or fence structure (centered)
    - Use `var(--borders)` or `var(--text-secondary)` for fill
    - Keep design minimal and small-scale (under 200px width)
    - Position centered with `margin: 0 auto`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.2 Write unit tests for middle ground layer
    - Test EnvironmentMiddleGround renders SVG element
    - Test SVG has correct viewBox
    - Test uses CSS variables for colors
    - Test element is centered
    - _Requirements: 5.1, 5.4_

- [x] 5. Create SVG foreground layer (tree silhouettes)
  - [x] 5.1 Implement EnvironmentForeground component
    - Create two small SVG elements for left and right trees
    - Use viewBox="0 0 100 120" for compact size
    - Draw simple tree silhouette paths (bare branches, spooky style)
    - Position left tree at `left: 20px`, right tree at `right: 20px`
    - Set width to 80px max, height to auto
    - Use `var(--background)` with `opacity: 0.7` for fill
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 5.2 Write property test for foreground sizing





    - **Property 5: Foreground Element Sizing**
    - **Validates: Requirements 4.3**
    - Verify tree elements are small (under 150px wide)
    - Verify positioned at left and right edges only

  - [x] 5.3 Write unit tests for foreground layer
    - Test EnvironmentForeground renders two SVG elements
    - Test trees have correct viewBox and size
    - Test trees are positioned at edges
    - Test uses CSS variables for colors
    - _Requirements: 4.1, 4.3, 5.4_

- [x] 6. Create fog overlay layer
  - [x] 6.1 Implement EnvironmentFog component
    - Create div with semi-transparent gradient background
    - Use `linear-gradient` with rgba colors for fog effect
    - Set opacity to 0.2-0.3 (subtle, not overwhelming)
    - Position to cover full environment width
    - Ensure silhouettes remain visible through fog
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Write unit tests for fog layer
    - Test EnvironmentFog renders
    - Test fog has low opacity (under 0.4)
    - Test fog spans full width
    - _Requirements: 7.1, 7.3_

- [x] 7. Checkpoint - Verify layers render correctly
  - Ensure all tests pass, ask the user if questions arise

- [x] 8. Implement responsive design
  - [x] 8.1 Add desktop styles (>= 769px)
    - Show all elements at normal size
    - Tree width: 80px, gate width: 200px
    - Environment height: 10vh, max-height: 120px
    - _Requirements: 1.1, 4.3_

  - [x] 8.2 Add tablet styles (481px-768px)
    - Reduce element sizes proportionally
    - Tree width: 60px, gate width: 150px
    - Maintain 10vh height
    - _Requirements: 1.3_

  - [x] 8.3 Add mobile styles (<= 480px)
    - Hide foreground trees (`display: none`)
    - Reduce environment height to 8vh, max-height: 80px
    - Gate width: 100px with reduced opacity
    - _Requirements: 4.4_

  - [x] 8.4 Write property test for mobile adaptation





    - **Property 7: Mobile Viewport Adaptation**
    - **Validates: Requirements 4.4**
    - Generate mobile viewport widths (320px to 479px)
    - Verify foreground trees are hidden

  - [x] 8.5 Write unit tests for responsive behavior




    - Test elements visible at desktop sizes
    - Test elements scaled at tablet sizes
    - Test foreground hidden at mobile sizes
    - _Requirements: 4.4_

- [x] 9. Integrate with existing application
  - [x] 9.1 Add GraveyardEnvironment to main layout
    - Import GraveyardEnvironment in `app/layout.tsx` or `app/page.tsx`
    - Add component after main content JSX
    - Add `aria-hidden="true"` and `role="presentation"` for accessibility
    - _Requirements: 8.4, 9.1_

  - [x] 9.2 Verify z-index coordination with existing components





    - Ensure TwinklingStars, GlowingMoon at z-index: 1
    - Ensure AnimatedFog at z-index: 5
    - Ensure FloatingGhosts at z-index: 6
    - Ensure main content at z-index: 10 with position: relative
    - Ensure GraveyardEnvironment at z-index: 2 (behind main content)
    - _Requirements: 9.1, 8.3_

   - [x] 9.3 Write property test for content accessibility





    - **Property 4: Content Accessibility (Click-Through)**
    - **Validates: Requirements 8.1, 8.2, 8.3**
    - Verify pointer-events: none on environment container
    - Verify click events reach underlying elements

  - [x] 9.4 Write property test for animation compatibility





    - **Property 8: Animation Layer Compatibility**
    - **Validates: Requirements 9.1**
    - Query all animated elements and environment layers
    - Verify z-index ordering prevents visual conflicts

  - [x] 9.5 Write unit tests for integration

















    - Test GraveyardEnvironment renders in layout
    - Test has correct accessibility attributes
    - Test doesn't interfere with existing animations
    - _Requirements: 8.4, 9.1_

- [x] 10. Performance optimization




- [ ] 10. Performance optimization
  - [x] 10.1 Verify SVG optimization


    - Ensure fixed positioning is used
    - Verify pointer-events: none is applied
    - Check SVG path complexity (under 50 points each)
    - Ensure no external assets loaded
    - _Requirements: 10.1, 10.2_

  - [x] 10.2 Write property test for layout shift prevention


    - **Property 9: Layout Shift Prevention**
    - **Validates: Requirements 9.3**
    - Verify environment uses fixed positioning
    - Verify explicit dimensions prevent layout shift

  - [x] 10.3 Write property test for design system consistency


    - **Property 6: Design System Color Consistency**
    - **Validates: Requirements 5.4, 9.2**
    - Query all SVG elements
    - Verify all color values reference CSS variables

  - [x] 10.4 Write unit tests for performance





    - Test environment adds minimal DOM nodes
    - Test no external assets are loaded
    - _Requirements: 10.2_

- [x] 11. Final checkpoint - Verify complete integration













  - Ensure all tests pass, ask the user if questions arise
  - Verify environment is subtle and atmospheric
  - Verify no interference with main content interactions
