# Implementation Plan

- [x] 1. Create FAQ Modal component






  - [x] 1.1 Create `components/FAQModal.tsx` based on AboutModal structure

    - Implement modal overlay with backdrop click handling
    - Add Escape key listener for closing
    - Prevent body scroll when modal is open
    - Include close button with icon
    - _Requirements: 2.2, 2.4_


  - [x] 1.2 Migrate FAQ content from FAQAccordion to FAQModal

    - Copy all FAQ items and content from FAQAccordion
    - Adapt layout for modal display (grid format)
    - Ensure all FAQ information is preserved
    - _Requirements: 2.3_


  - [x] 1.3 Write unit tests for FAQModal component







    - Test modal renders when isOpen is true
    - Test modal does not render when isOpen is false
    - Test close button triggers onClose callback
    - Test Escape key triggers onClose callback
    - Test backdrop click triggers onClose callback
    - Test body scroll is prevented when modal is open
    - _Requirements: 2.2, 2.4_

  - [x] 1.4 Write property test for modal open behavior






    - **Property 1: FAQ button click opens modal**
    - **Validates: Requirements 2.2**

  - [x] 1.5 Write property test for modal close behavior





    - **Property 2: Modal close actions hide modal**
    - **Validates: Requirements 2.4**


- [x] 2. Update Header component to include FAQ button


  - [x] 2.1 Add onFAQClick prop to Header interface


    - Update HeaderProps interface with onFAQClick callback
    - _Requirements: 2.1_


  - [x] 2.2 Add FAQ button to Header JSX

    - Add FAQ button next to About button
    - Style consistently with About button
    - Wire up onFAQClick callback
    - Add appropriate aria-label and data-testid
    - _Requirements: 2.1_

  - [x] 2.3 Write unit tests for updated Header





    - Test Header renders FAQ button
    - Test FAQ button click triggers onFAQClick callback
    - Test both About and FAQ buttons are present
    - _Requirements: 2.1_

- [x] 3. Update landing page to use FAQ modal





  - [x] 3.1 Add FAQ modal state to app/page.tsx


    - Add isFAQOpen state (boolean)
    - Initialize to false
    - _Requirements: 2.2, 2.4_

  - [x] 3.2 Remove FAQAccordion from landing page body


    - Remove FAQAccordion import
    - Remove FAQAccordion JSX from landing page
    - _Requirements: 2.1_

  - [x] 3.3 Add FAQModal to page and wire up Header


    - Import FAQModal component
    - Add FAQModal JSX with isOpen and onClose props
    - Update Header component with onFAQClick prop
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.4 Write integration tests for FAQ modal flow






    - Test clicking FAQ button opens modal
    - Test FAQ modal contains expected content
    - Test closing modal returns to landing page
    - _Requirements: 2.2, 2.3, 2.4_


- [x] 4. Reduce hero section spacing and sizing





  - [x] 4.1 Update hero section CSS in app/globals.css

    - Reduce `.hero-section` margin from `var(--space-12)` to `var(--space-6)`
    - Reduce `.hero-title` font-size from `var(--text-5xl)` to `var(--text-4xl)`
    - Reduce `.hero-tagline` font-size from `var(--text-xl)` to `var(--text-lg)`
    - Reduce padding in `.hero-section`
    - _Requirements: 1.1, 1.2, 3.1, 3.2_

  - [x] 4.2 Update GhostLogo size in app/page.tsx


    - Change GhostLogo size prop from "large" to "medium"
    - _Requirements: 1.1, 3.2_

- [x] 5. Reduce spacing between landing page sections





  - [x] 5.1 Update section margins in app/globals.css


    - Reduce `.pill-input-container` margin to `var(--space-4) auto`
    - Reduce `.token-section` margin from `var(--space-4)` to `var(--space-2)`
    - Reduce `.popular-repos-section` margin from `var(--space-12)` to `var(--space-6)`
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_

- [x] 6. Compact popular repositories section





  - [x] 6.1 Update popular repos CSS in app/globals.css


    - Reduce `.popular-repos-section h2` margin-bottom from `var(--space-8)` to `var(--space-4)`
    - Reduce `.popular-repos-grid` gap from `var(--space-6)` to `var(--space-4)`
    - Reduce `.popular-repo-card` padding from `var(--space-6)` to `var(--space-4)`
    - Reduce `.popular-repo-card` min-height from 200px to 160px
    - _Requirements: 1.1, 1.2, 4.3_

- [x] 7. Add FAQ modal styles









  - [x] 7.1 Create FAQ modal CSS styles in app/globals.css




    - Reuse modal overlay and content styles from About modal
    - Add FAQ-specific grid layout for FAQ items
    - Ensure consistent styling with About modal
    - _Requirements: 2.2, 2.3_

- [x] 8. Final Checkpoint





  - Ensure all tests pass, ask the user if questions arise.
