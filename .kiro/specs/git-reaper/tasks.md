# Implementation Plan

> **IMPORTANT**: When running commands (npm, tests, etc.), always use `cmd /c` prefix on Windows.
> Example: `cmd /c npm test` instead of `npm test`

- [x] 1. Initialize Next.js project and install dependencies


















  - Create Next.js 14+ project with TypeScript and App Router
  - Install dependencies: `simple-git`, `fast-check`, `vitest`
  - Set up project structure with directories for components, lib, and API routes
  - Configure TypeScript with strict mode
  - _Requirements: All_

- [x] 2. Implement core data types and validation






  - [x] 2.1 Create TypeScript interfaces for data models

    - Define `DeadBranch`, `ReapRequest`, `ReapSuccessResponse`, `ReapErrorResponse`, `ValidationResult` interfaces
    - Create types file at `lib/types.ts`
    - _Requirements: 6.2_



  - [x] 2.2 Implement URL validation module





    - Create `lib/validators.ts` with `validateGitHubUrl` function
    - Use regex pattern: `^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$`
    - Extract owner and repo from valid URLs
    - Return validation result with error messages for invalid URLs
    - _Requirements: 1.2, 4.2_

  - [x] 2.3 Write property test for URL validation







    - **Property 1: URL Validation Consistency**
    - **Validates: Requirements 1.2, 4.2**
    - Generate random strings and valid/invalid GitHub URLs
    - Verify validation returns consistent boolean results

  - [x] 2.4 Write unit tests for URL validation edge cases






    - Test valid URLs (https, http, with/without trailing slash)
    - Test invalid URLs (wrong domain, missing parts, special characters)
    - _Requirements: 1.2, 4.2_

- [x] 3. Implement Git operations and repository analysis




  - [x] 3.1 Create branch service module


    - Create `lib/git/branch-service.ts`
    - Implement `getMergedBranches(git, mainBranch)` to find merged branches
    - Implement `getLastCommit(git, branch)` to retrieve commit date and SHA
    - Format dates consistently (ISO 8601 format)
    - _Requirements: 5.3, 6.1, 6.4_

  - [x] 3.2 Implement repository analyzer module


    - Create `lib/git/analyzer.ts` with `analyzeRepository` function
    - Create temporary directory using `os.tmpdir()`
    - Clone repository with bare option using `simple-git`
    - Detect main branch (check for "main" then "master")
    - Call branch service to get merged branches and commit info
    - Transform data into `DeadBranch[]` format
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 6.2_

  - [x] 3.3 Implement cleanup utility


    - Create `lib/git/cleanup.ts` with `cleanupTempDirectory` function
    - Recursively remove temporary directories
    - Handle cleanup errors gracefully
    - _Requirements: 5.4_

  - [x] 3.4 Add timeout mechanism to analyzer


    - Implement AbortController with 90-second timeout
    - Ensure cleanup runs even on timeout
    - Return timeout error response
    - _Requirements: 8.1_

  - [x] 3.5 Write property test for branch data transformation






    - **Property 14: Branch Data Transformation Pipeline**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
    - Generate random branch names and commit data
    - Verify output DeadBranch objects have all required fields in correct format

  - [x] 3.6 Write property test for cleanup guarantee






    - **Property 15: Cleanup Guarantee**
    - **Validates: Requirements 5.4, 7.4**
    - Generate various success/failure scenarios
    - Verify temporary directories are always removed

  - [x] 3.7 Write unit tests for Git operations (REQUIRED)



    - Test main branch detection with "main" and "master"
    - Test merged branch filtering logic
    - Test date formatting consistency
    - _Requirements: 5.5, 6.4_

- [x] 4. Build API route handler






  - [x] 4.1 Create `/api/reap` POST endpoint



    - Create `app/api/reap/route.ts`
    - Implement request body validation (check for githubUrl field)
    - Call URL validator and return 400 error for invalid URLs
    - Call repository analyzer with validated URL
    - Format success response with `ReapSuccessResponse` structure
    - Handle errors and return appropriate error responses with codes
    - Ensure cleanup happens in finally block
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.1, 7.2, 7.3, 7.4_

  - [x] 4.2 Write property test for invalid input rejection






    - **Property 2: Invalid Input Rejection**
    - **Validates: Requirements 1.3, 4.1, 4.3**
    - Generate empty strings, malformed URLs, incomplete request bodies
    - Verify all invalid inputs are rejected with 400 status

  - [x] 4.3 Write unit tests for API error handling






    - Test missing githubUrl field returns 400
    - Test invalid URL returns 400 with error message
    - Test error response format matches `ReapErrorResponse`
    - _Requirements: 4.1, 4.3, 7.2_

- [x] 5. Checkpoint - Verify backend functionality




  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Build frontend components





  - [x] 6.1 Create RepoInput component


    - Create `components/RepoInput.tsx`
    - Implement input field for GitHub URL
    - Add client-side URL validation on input change
    - Implement "Reap" button with disabled state for invalid URLs
    - Show loading state when analysis is in progress
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2_

  - [x] 6.2 Create Tombstone component


    - Create `components/Tombstone.tsx`
    - Display branch name and last commit date
    - Style as tombstone with graveyard theme
    - Implement click handler to open GitHub commit URL in new tab
    - Add hover effects
    - _Requirements: 3.3, 9.1_

  - [x] 6.3 Create Graveyard component


    - Create `components/Graveyard.tsx`
    - Render graveyard-themed container with nighttime aesthetic
    - Sort dead branches by last commit date (newest to oldest)
    - Display grid of Tombstone components
    - Show empty state message: "This repository is clean! No dead branches found."
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 6.4 Write property test for tombstone count consistency






    - **Property 8: Tombstone Count Consistency**
    - **Validates: Requirements 3.2**
    - Generate arrays of DeadBranch objects (0 to 50 branches)
    - Verify rendered tombstone count equals input array length
-

  - [x] 6.5 Write property test for tombstone content completeness





    - **Property 9: Tombstone Content Completeness**
    - **Validates: Requirements 3.3**
    - Generate random DeadBranch objects with various names and dates
    - Verify rendered output contains both name and date

  - [x] 6.6 Write property test for tombstone click navigation






    - **Property 16: Tombstone Click Navigation**
    - **Validates: Requirements 9.1**
    - Generate random DeadBranch objects
    - Verify click handler calls window.open with correct GitHub URL


  - [x] 6.7 Write unit tests for component rendering





    - Test RepoInput enables button for valid URLs
    - Test Graveyard shows empty state with no branches
    - Test Tombstone displays branch name and date
    - _Requirements: 1.4, 3.3, 3.4_

- [x] 7. Implement main page with state management




  - [x] 7.1 Create main page component


    - Create `app/page.tsx`
    - Manage application state (loading, error, results, repositoryUrl)
    - Implement form submission handler that calls `/api/reap`
    - Handle API responses (success and error)
    - Render RepoInput component
    - Conditionally render Graveyard component with results
    - Display error messages when API fails
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 7.2 Write property test for API request formation






    - **Property 4: API Request Formation**
    - **Validates: Requirements 2.1**
    - Generate valid GitHub URLs
    - Verify form submission results in POST request with correct payload
-

  - [x] 7.3 Write property test for loading state management





    - **Property 5: Loading State Management**
    - **Validates: Requirements 2.2**
    - Test loading state is set when analysis starts
    - Test loading state is cleared when analysis completes

  - [x] 7.4 Write property test for success result display






    - **Property 6: Success Result Display**
    - **Validates: Requirements 2.3, 3.1**
    - Generate successful API responses with dead branches
    - Verify graveyard interface is rendered with returned data

  - [x] 7.5 Write property test for error message display






    - **Property 7: Error Message Display**
    - **Validates: Requirements 2.4, 7.2**
    - Generate failed API responses
    - Verify error message is displayed with failure reason

- [x] 8. Add styling and theming





  - [x] 8.1 Create graveyard theme styles


    - Add CSS for nighttime graveyard aesthetic (dark background, moon, fog effects)
    - Style tombstone components with stone texture and shadows
    - Add grid layout for tombstones with responsive design
    - Implement hover effects for tombstones
    - Style input form and button
    - _Requirements: 3.1_

  - [x] 8.2 Add loading and error state styles


    - Create loading spinner or skeleton UI
    - Style error messages with appropriate colors
    - Add animations for smooth transitions
    - _Requirements: 2.2, 2.4_

- [x] 9. Final checkpoint - End-to-end verification





  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Add graveyard animations and atmospheric effects









  - [x] 10.1 Create FloatingGhosts component

    - Create `components/FloatingGhosts.tsx` for atmospheric ghost animations
    - Implement floating animation with random paths and speeds
    - Add multiple ghost elements with varying opacity
    - _Requirements: 10.2_

  - [x] 10.2 Add tombstone entrance animations


    - Update `components/Tombstone.tsx` to accept index prop
    - Implement staggered fade-in and rise-up animation using CSS
    - Calculate animation delay based on tombstone index (e.g., index * 100ms)
    - Use CSS transitions or keyframe animations for smooth entrance
    - _Requirements: 10.1, 10.3_

  - [x] 10.3 Integrate atmospheric effects into Graveyard




    - Update `components/Graveyard.tsx` to include FloatingGhosts component
    - Pass index prop to each Tombstone component
    - Ensure animations don't interfere with readability or interaction
    - _Requirements: 10.2_

  - [x] 10.4 Write property test for animation stagger







    - **Property 17: Tombstone Animation Stagger**
    - **Validates: Requirements 10.1**
    - Generate arrays of DeadBranch objects
    - Verify each tombstone has appropriate animation delay based on index

  - [x] 10.5 Write unit tests for animation components







    - Test FloatingGhosts component renders ghost elements
    - Test Tombstone component applies correct animation delay
    - Test Graveyard passes index prop to tombstones
    - _Requirements: 10.1, 10.2_

- [x] 11. Update design system with new theme and fonts






  - [x] 11.1 Install react-icons library


    - Run `npm install react-icons` to add icon library
    - Verify installation in package.json
    - _Requirements: All (UI Enhancement)_

  - [x] 11.2 Import Google Fonts in globals.css


    - Add Google Fonts import at the top of `app/globals.css`
    - Import "Creepster" font for headings
    - Import "Inter" font for body text
    - _Requirements: All (UI Enhancement)_

  - [x] 11.3 Define CSS variables for new color palette


    - Add `:root` selector in `app/globals.css`
    - Define `--background: #0d1117;`
    - Define `--panels: #161b22;`
    - Define `--borders: #30363d;`
    - Define `--text-primary: #c9d1d9;`
    - Define `--text-secondary: #8b949e;`
    - Define `--accent: #3fb950;`
    - _Requirements: All (UI Enhancement)_

  - [x] 11.4 Apply new design system to body element


    - Update `body` background to use `var(--background)`
    - Set default font-family to "Inter", sans-serif
    - Set default text color to `var(--text-secondary)`
    - _Requirements: All (UI Enhancement)_

  - [x] 11.5 Update heading styles to use Creepster font


    - Apply "Creepster" font to all heading elements (h1, h2, h3, etc.)
    - Ensure headings use `var(--text-primary)` color
    - _Requirements: All (UI Enhancement)_

  - [x] 11.6 Refactor existing styles to use CSS variables


    - Replace hardcoded colors with CSS variables throughout globals.css
    - Update panel backgrounds to use `var(--panels)`
    - Update borders to use `var(--borders)`
    - Update accent colors to use `var(--accent)`
    - _Requirements: All (UI Enhancement)_

- [x] 12. Redesign header and input form with new icons






  - [x] 12.1 Update main h1 title styling


    - Apply "Creepster" font to the "Git Reaper" h1 title
    - Increase font size to make it larger and more prominent
    - Add `text-shadow` using `var(--accent)` color for glow effect
    - _Requirements: All (UI Enhancement)_

  - [x] 12.2 Add skull icons to header title


    - Import `FaSkull` from `react-icons/fa`
    - Add `<FaSkull />` icon before the title text
    - Add `<FaSkull />` icon after the title text
    - Style icons to match the title aesthetic
    - _Requirements: All (UI Enhancement)_

  - [x] 12.3 Add GitHub icon to input field


    - Import `FaGithub` from `react-icons/fa`
    - Position `<FaGithub />` icon inside the input field on the left side
    - Adjust input padding to accommodate the icon
    - Style icon with appropriate color and size
    - _Requirements: 1.1 (UI Enhancement)_

  - [x] 12.4 Increase input field size


    - Make the URL input field larger with increased padding
    - Adjust font size for better readability
    - Ensure responsive design is maintained
    - _Requirements: 1.1 (UI Enhancement)_

  - [x] 12.5 Redesign REAP button with accent color


    - Update button background to use `var(--accent)` color
    - Make button text bold and uppercase
    - Import `FaScythe` from `react-icons/fa` (or use alternative icon if not available)
    - Replace existing button icon with `<FaScythe />` or similar reaper-themed icon
    - _Requirements: 1.4, 2.1 (UI Enhancement)_

  - [x] 12.6 Add hover effect to REAP button


    - Implement hover effect that brightens the `--accent` background color
    - Use CSS filter or lighter shade for hover state
    - Add smooth transition for hover animation
    - Maintain accessibility with proper contrast
    - _Requirements: 1.4 (UI Enhancement)_

- [x] 13. Redesign tombstone cards with CSS modules






  - [x] 13.1 Create Tombstone CSS module file


    - Create new file `components/Tombstone.module.css`
    - Set up module structure for tombstone styling
    - _Requirements: 3.3 (UI Enhancement)_

  - [x] 13.2 Style tombstone with curved top shape


    - Use CSS `clip-path` property to create curved top tombstone shape
    - Set background color to `var(--panels)`
    - Set border color to `var(--borders)`
    - Add appropriate padding and dimensions
    - _Requirements: 3.3 (UI Enhancement)_

  - [x] 13.3 Style branch name as prominent text


    - Make branch name the most prominent text element
    - Use `var(--text-primary)` color for branch name
    - Set appropriate font size and weight
    - _Requirements: 3.3 (UI Enhancement)_

  - [x] 13.4 Style commit date as secondary text


    - Make date text smaller than branch name
    - Use `var(--text-secondary)` color for date
    - Set appropriate font size and styling
    - _Requirements: 3.3 (UI Enhancement)_

  - [x] 13.5 Add hover effects to tombstone


    - Implement `transform: translateY(-5px);` on hover
    - Add `box-shadow` using `var(--accent)` color for glow effect
    - Add smooth CSS transition for hover animation
    - _Requirements: 3.3, 9.1 (UI Enhancement)_

  - [x] 13.6 Update Tombstone component to use CSS module


    - Import styles from `Tombstone.module.css`
    - Replace existing className references with module styles
    - Ensure all functionality remains intact
    - Test hover and click interactions
    - _Requirements: 3.3, 9.1 (UI Enhancement)_

- [x] 14. Update application icons with react-icons






  - [x] 14.1 Update Repo Stats section icons


    - Import `FaBookDead`, `FaHourglassHalf`, `FaCalendarAlt` from `react-icons/fa`
    - Replace 'Dead Branches' icon with `<FaBookDead />`
    - Replace 'Avg Days' icon with `<FaHourglassHalf />`
    - Replace 'Oldest Branch' icon with `<FaCalendarAlt />`
    - Style icons to match the design system
    - _Requirements: All (UI Enhancement)_

  - [x] 14.2 Update Cleanup Suggestions section icon


    - Import `FaExclamationTriangle` from `react-icons/fa`
    - Replace title icon with `<FaExclamationTriangle />`
    - Style icon appropriately for the section header
    - _Requirements: All (UI Enhancement)_

  - [x] 14.3 Review and replace remaining placeholder icons



    - Audit the application for any remaining placeholder icons or emojis
    - Replace with appropriate react-icons where applicable
    - Ensure consistent icon styling across the application
    - _Requirements: All (UI Enhancement)_
