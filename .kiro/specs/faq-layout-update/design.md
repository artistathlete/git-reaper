# Design Document: FAQ Layout Update

## Overview

This design updates the landing page layout to reposition the FAQ section below the Popular Repositories grid and reduce its visual footprint. The change prioritizes the interactive repository selection experience while keeping helpful information accessible at the bottom of the page.

## Architecture

The change is purely presentational and involves:
1. Reordering JSX elements in `app/page.tsx`
2. Updating CSS styles in `app/globals.css` for the FAQ section

No new components or architectural changes are required.

## Components and Interfaces

### Modified Components

#### `app/page.tsx`
- Swap the render order of `<FAQAccordion>` and `<PopularReposGrid>`
- No prop or interface changes needed

#### `app/globals.css`
- Update `.faq-section` styles for reduced spacing
- Update `.faq-wrapper` and `.faq-content` for compact appearance
- Reduce font sizes and padding in FAQ items
- Update `.token-section` styles for reduced spacing and smaller typography
- Update `.token-content` for compact appearance

### Component Hierarchy (Landing State)
```
<main>
  ├── Hero Section
  ├── PillInput
  ├── Token Section
  ├── PopularReposGrid  ← Moved up
  └── FAQAccordion      ← Moved down, compact styling
</main>
```

## Data Models

No data model changes required. This is a purely visual/layout update.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the testable acceptance criteria are structural DOM checks that are better suited as example-based tests rather than property-based tests. The visual styling criteria (2.1, 2.2, 2.3) are not programmatically testable as they involve subjective design decisions.

**Example Tests (not properties):**
- Verify Popular Repositories section appears before FAQ section in DOM order
- Verify FAQ section is the last content section on the landing page

No universal properties identified for this feature - the requirements are primarily about visual layout and styling which are verified through visual inspection and example-based tests.

## Error Handling

No error handling changes required. The components already handle their own states appropriately.

## Testing Strategy

### Unit Tests
- Update existing `page.test.tsx` to verify the new component order
- Test that PopularReposGrid renders before FAQAccordion in the DOM

### Visual Verification
- Manual verification that FAQ appears smaller and below Popular Repos
- Verify responsive behavior at different breakpoints

### Property-Based Testing
No property-based tests are applicable for this feature as the requirements are structural/visual in nature and don't involve universal properties across input spaces.

### Test Framework
- Vitest with React Testing Library (existing setup)
