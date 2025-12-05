# Design Document: Landing Page Viewport Optimization

## Overview

This design optimizes the landing page layout to fit within a 1920x1080 viewport without scrolling. The key changes include:
1. Converting FAQ from an accordion section to a header-based modal (similar to About)
2. Reducing vertical spacing throughout all sections
3. Scaling down hero elements (logo, title, tagline)
4. Compacting the token section and popular repositories grid

The design maintains visual hierarchy and usability while maximizing viewport efficiency.

## Architecture

The changes involve:
1. **Component Modification**: Convert `FAQAccordion` to `FAQModal` component
2. **Header Update**: Add FAQ button to `Header` component alongside About button
3. **Layout Restructuring**: Remove FAQ section from landing page body in `app/page.tsx`
4. **CSS Updates**: Reduce spacing variables and element sizes in `app/globals.css`

### Component Hierarchy Changes

**Before:**
```
<Header onAboutClick={...} />
<main>
  ├── Hero Section
  ├── PillInput
  ├── Token Section
  ├── PopularReposGrid
  └── FAQAccordion
</main>
<AboutModal />
```

**After:**
```
<Header onAboutClick={...} onFAQClick={...} />
<main>
  ├── Hero Section (compact)
  ├── PillInput
  ├── Token Section (compact)
  └── PopularReposGrid (compact)
</main>
<AboutModal />
<FAQModal />
```

## Components and Interfaces

### New Component: FAQModal

Create `components/FAQModal.tsx` based on `AboutModal` structure:

```typescript
interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Behavior:**
- Displays FAQ content in a modal overlay
- Supports Escape key to close
- Prevents body scroll when open
- Backdrop click closes modal
- Reuses FAQ content from current `FAQAccordion`

### Modified Component: Header

Update `components/Header.tsx`:

```typescript
interface HeaderProps {
  onAboutClick: () => void;
  onFAQClick: () => void;  // New prop
}
```

**Changes:**
- Add FAQ button next to About button
- Both buttons styled consistently
- Maintain fixed positioning at top-right

### Modified Component: Home Page

Update `app/page.tsx`:

**State Changes:**
- Add `isFAQOpen` state (boolean)
- Add `setIsFAQOpen` state setter

**JSX Changes:**
- Remove `<FAQAccordion>` from landing page body
- Add `<FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />`
- Update `<Header>` to include `onFAQClick={() => setIsFAQOpen(true)}`

### CSS Updates

Update `app/globals.css` with reduced spacing:

**Hero Section:**
- Reduce `.hero-section` margin from `var(--space-12)` to `var(--space-6)`
- Reduce `.hero-title` font-size from `var(--text-5xl)` (48px) to `var(--text-4xl)` (40px)
- Reduce `.hero-tagline` font-size from `var(--text-xl)` (20px) to `var(--text-lg)` (18px)
- Reduce ghost logo size prop from "large" to "medium"

**Spacing Between Sections:**
- Reduce `.pill-input-container` margin from default to `var(--space-4) auto`
- Reduce `.token-section` margin from `var(--space-4)` to `var(--space-2)`
- Reduce `.popular-repos-section` margin from `var(--space-12)` to `var(--space-6)`

**Popular Repositories:**
- Reduce `.popular-repos-section h2` margin-bottom from `var(--space-8)` to `var(--space-4)`
- Reduce `.popular-repos-grid` gap from `var(--space-6)` to `var(--space-4)`
- Reduce `.popular-repo-card` padding from `var(--space-6)` to `var(--space-4)`
- Reduce `.popular-repo-card` min-height from 200px to 160px

**Token Section:**
- Already compact, maintain current styling

## Data Models

No data model changes required. State management additions:

```typescript
// In app/page.tsx
const [isFAQOpen, setIsFAQOpen] = useState(false);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

**1.1 WHEN the landing page loads on a 1920x1080 viewport THEN the system SHALL display all content within the visible area without requiring vertical scrolling**
- Thoughts: This is a visual/layout requirement that depends on viewport size. We can test this by rendering the page in a 1920x1080 viewport and checking if the document height exceeds the viewport height. This is testable as an example test with a specific viewport size.
- Testable: yes - example

**1.2 WHEN the landing page renders THEN the system SHALL use reduced vertical spacing between all sections to maximize viewport efficiency**
- Thoughts: This is about CSS styling and visual design. We cannot programmatically test "reduced" spacing as it's relative to the previous design. This is verified through visual inspection.
- Testable: no

**1.3 WHEN the landing page renders THEN the system SHALL scale hero elements appropriately to fit within the viewport constraints**
- Thoughts: This is about visual scaling and design. "Appropriately" is subjective and cannot be programmatically verified.
- Testable: no

**2.1 WHEN the landing page loads THEN the system SHALL display a FAQ button in the header next to the About button**
- Thoughts: This is testing that a specific element exists in the DOM in a specific location. We can test this by querying for the FAQ button within the header component.
- Testable: yes - example

**2.2 WHEN a user clicks the FAQ button THEN the system SHALL open a modal overlay displaying FAQ content**
- Thoughts: This is testing a UI interaction. We can simulate a click on the FAQ button and verify that the modal becomes visible and contains FAQ content. This applies to all instances of clicking the FAQ button.
- Testable: yes - property

**2.3 WHEN the FAQ modal is open THEN the system SHALL display the same FAQ information previously shown in the accordion format**
- Thoughts: This is testing that specific content is present in the modal. We can verify that all FAQ items from the original accordion are present in the modal.
- Testable: yes - example

**2.4 WHEN a user closes the FAQ modal THEN the system SHALL return to the landing page without the FAQ section visible**
- Thoughts: This is testing a UI interaction. We can test that after closing the modal, it is no longer visible in the DOM or has display:none. This applies to all ways of closing the modal (X button, backdrop click, Escape key).
- Testable: yes - property

**3.1 WHEN the hero section renders THEN the system SHALL use reduced font sizes for the title and tagline compared to the current implementation**
- Thoughts: This is about CSS styling. "Reduced" is relative to the previous design and cannot be programmatically verified without storing the old values.
- Testable: no

**3.2 WHEN the hero section renders THEN the system SHALL use reduced vertical spacing around the ghost logo, title, and tagline**
- Thoughts: This is about CSS styling and visual design. "Reduced" is relative and subjective.
- Testable: no

**3.3 WHEN the hero section renders THEN the system SHALL maintain visual hierarchy while occupying less vertical space**
- Thoughts: "Visual hierarchy" is a subjective design concept that cannot be programmatically tested.
- Testable: no

**4.1 WHEN the landing page renders THEN the system SHALL reduce margins between the hero section and input field**
- Thoughts: This is about CSS styling. "Reduce" is relative to the previous design.
- Testable: no

**4.2 WHEN the landing page renders THEN the system SHALL reduce margins between the input field and token section**
- Thoughts: This is about CSS styling. "Reduce" is relative to the previous design.
- Testable: no

**4.3 WHEN the landing page renders THEN the system SHALL reduce margins between the token section and popular repositories grid**
- Thoughts: This is about CSS styling. "Reduce" is relative to the previous design.
- Testable: no

**4.4 WHEN the landing page renders THEN the system SHALL maintain sufficient spacing for visual clarity and touch targets**
- Thoughts: "Sufficient spacing" and "visual clarity" are subjective design concepts.
- Testable: no

**5.1 WHEN the token section renders in collapsed state THEN the system SHALL occupy minimal vertical space**
- Thoughts: "Minimal" is subjective and relative. This is a design goal rather than a testable property.
- Testable: no

**5.2 WHEN the token section renders THEN the system SHALL use smaller font sizes and reduced padding compared to the current implementation**
- Thoughts: This is about CSS styling. "Smaller" and "reduced" are relative to the previous design.
- Testable: no

**5.3 WHEN the token section is expanded THEN the system SHALL display all content clearly while maintaining compact spacing**
- Thoughts: "Clearly" and "compact" are subjective design concepts.
- Testable: no

### Property Reflection

Reviewing the testable criteria:
- **2.2** (FAQ button click opens modal) and **2.4** (closing modal hides it) are related but test different behaviors - one tests opening, one tests closing. Both should be kept as they validate different state transitions.
- **2.1** and **2.3** are example tests for specific structural checks.

No redundancy identified. Each testable property provides unique validation value.

### Correctness Properties

**Property 1: FAQ button click opens modal**
*For any* initial state where the FAQ modal is closed, clicking the FAQ button should result in the FAQ modal becoming visible
**Validates: Requirements 2.2**

**Property 2: Modal close actions hide modal**
*For any* close action (X button click, backdrop click, Escape key), when the FAQ modal is open, performing that action should result in the modal no longer being visible
**Validates: Requirements 2.4**

## Error Handling

No new error handling required. The FAQ modal follows the same patterns as the existing About modal:
- Escape key handling
- Backdrop click handling
- Body scroll prevention

## Testing Strategy

### Unit Tests

**Component Tests:**
- Test `FAQModal` renders with correct content when open
- Test `FAQModal` does not render when closed
- Test `Header` renders both About and FAQ buttons
- Test FAQ button click triggers `onFAQClick` callback
- Test modal close button triggers `onClose` callback
- Test Escape key triggers modal close
- Test backdrop click triggers modal close

**Example Tests:**
- Verify FAQ button exists in header (Requirement 2.1)
- Verify FAQ modal contains all FAQ items from original accordion (Requirement 2.3)
- Verify landing page content fits in 1920x1080 viewport (Requirement 1.1)

### Property-Based Testing

**Framework:** fast-check (existing project setup)

**Property Tests:**
- Property 1: FAQ button click opens modal (Requirement 2.2)
- Property 2: Modal close actions hide modal (Requirement 2.4)

**Test Configuration:**
- Minimum 100 iterations per property test
- Each property test tagged with: `**Feature: landing-page-redesign, Property {number}: {property_text}**`

### Visual Verification

Manual verification required for:
- Overall page fits within 1920x1080 viewport without scrolling
- Spacing reductions maintain visual clarity
- Hero section scaling maintains visual hierarchy
- All interactive elements remain accessible and usable

### Responsive Testing

Verify layout works correctly at breakpoints:
- Desktop: 1920x1080 (primary target)
- Tablet: 768px width
- Mobile: 480px width
