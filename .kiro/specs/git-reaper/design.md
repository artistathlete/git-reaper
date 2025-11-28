# Design Document

## Overview

The Git Reaper is a Next.js web application that analyzes public GitHub repositories to identify and visualize merged branches (dead branches). The application uses a graveyard theme with tombstone components to display each dead branch along with its last commit date. The system consists of a React-based frontend and Next.js API routes for backend processing, utilizing the `simple-git` library for Git operations.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Git Operations**: `simple-git` library
- **Styling**: CSS Modules or Tailwind CSS for theming
- **Testing**: Vitest for unit tests, fast-check for property-based testing
- **Deployment**: Vercel or similar platform

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Input Form    │  │   Graveyard  │  │   Tombstone    │  │
│  │  Component     │  │   Display    │  │   Component    │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
│           │                   ▲                              │
│           │                   │                              │
│           ▼                   │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           API Client (fetch)                         │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP POST /api/reap
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Backend (API Route)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              /api/reap Handler                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  1. URL Validation                            │   │   │
│  │  │  2. Repository Cloning (simple-git)          │   │   │
│  │  │  3. Branch Analysis                           │   │   │
│  │  │  4. Commit Date Extraction                    │   │   │
│  │  │  5. Cleanup                                   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Temporary File System                        │   │
│  │         (os.tmpdir() + fs operations)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. Main Page Component (`app/page.tsx`)
- Manages application state (loading, error, results)
- Handles form submission and API communication
- Renders input form and graveyard display

#### 2. RepoInput Component
```typescript
interface RepoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}
```
- Renders GitHub URL input field
- Validates URL format on client side
- Provides "Reap" button with loading state

#### 3. Graveyard Component
```typescript
interface GraveyardProps {
  deadBranches: DeadBranch[];
  repositoryUrl: string;
}
```
- Renders graveyard-themed container with nighttime aesthetic
- Displays grid of tombstone components
- Sorts dead branches by last commit date (newest to oldest) before rendering
- Shows a user-friendly empty state when no dead branches exist, such as "This repository is clean! No dead branches found."

#### 4. Tombstone Component
```typescript
interface TombstoneProps {
  branch: DeadBranch;
  repositoryUrl: string;
}
```
- Renders individual tombstone with branch name and date
- Handles click events to open GitHub commit URL
- Applies hover effects and styling

### Backend Components

#### 1. API Route Handler (`app/api/reap/route.ts`)
```typescript
export async function POST(request: Request): Promise<Response>
```
- Validates incoming request body
- Orchestrates repository analysis workflow
- Returns JSON response with dead branches or error

#### 2. URL Validator Module
```typescript
function validateGitHubUrl(url: string): { isValid: boolean; error?: string }
```
- Validates GitHub URL format using the regex: `^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$`
- Checks for required URL components (github.com, owner, repo)
- Returns validation result with error message if invalid

#### 3. Repository Analyzer Module
```typescript
interface AnalyzerOptions {
  repoUrl: string;
  timeout: number;
}

async function analyzeRepository(options: AnalyzerOptions): Promise<DeadBranch[]>
```
- Creates temporary directory for bare clone
- Uses `simple-git` to clone repository
- Identifies main branch (main or master)
- Finds merged branches
- Extracts commit dates and SHAs for each merged branch
- Cleans up temporary directory
- Implements timeout mechanism

#### 4. Branch Service Module
```typescript
async function getMergedBranches(git: SimpleGit, mainBranch: string): Promise<string[]>
async function getLastCommit(git: SimpleGit, branch: string): Promise<{ date: string; sha: string }>
```
- Executes Git commands via `simple-git`
- Parses Git output to extract branch information
- Retrieves both commit date and SHA for each branch
- Formats dates consistently

#### 5. Cleanup Utility
```typescript
async function cleanupTempDirectory(path: string): Promise<void>
```
- Recursively removes temporary directories
- Handles cleanup errors gracefully
- Ensures cleanup runs even on failure

## Data Models

### DeadBranch
```typescript
interface DeadBranch {
  name: string;           // Branch name (e.g., "feature/user-auth")
  lastCommitDate: string; // ISO 8601 date string (e.g., "2024-01-15")
  lastCommitSha: string;  // Commit SHA for generating GitHub URL
}
```

### API Request
```typescript
interface ReapRequest {
  githubUrl: string; // Full GitHub repository URL
}
```

### API Response (Success)
```typescript
interface ReapSuccessResponse {
  deadBranches: DeadBranch[];
  repositoryUrl: string;
  analyzedAt: string; // ISO 8601 timestamp
}
```

### API Response (Error)
```typescript
interface ReapErrorResponse {
  error: string;        // Human-readable error message
  code: string;         // Error code (e.g., "INVALID_URL", "CLONE_FAILED")
  details?: string;     // Additional error details
}
```

### Validation Result
```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
  owner?: string;  // Extracted repository owner
  repo?: string;   // Extracted repository name
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: URL Validation Consistency
*For any* string input, the URL validation function should correctly identify whether it matches the GitHub repository URL format (containing github.com, owner, and repository name), returning consistent results across both client and server validation.
**Validates: Requirements 1.2, 4.2**

### Property 2: Invalid Input Rejection
*For any* invalid input (empty strings, malformed URLs, or missing githubUrl field), the system should prevent analysis from proceeding and return appropriate error responses with HTTP 400 status.
**Validates: Requirements 1.3, 4.1, 4.3**

### Property 3: Valid Input Enables Action
*For any* valid GitHub URL, the system should enable the "Reap" button and allow the analysis to proceed when triggered.
**Validates: Requirements 1.4, 4.4**

### Property 4: API Request Formation
*For any* valid GitHub URL, clicking the "Reap" button should result in a POST request to `/api/reap` with the URL correctly included in the request body.
**Validates: Requirements 2.1**

### Property 5: Loading State Management
*For any* analysis operation, the system should display loading feedback when the operation starts and remove it when the operation completes (success or failure).
**Validates: Requirements 2.2**

### Property 6: Success Result Display
*For any* successful API response containing dead branches, the system should render the graveyard interface with the returned data.
**Validates: Requirements 2.3, 3.1**

### Property 7: Error Message Display
*For any* failed API response, the system should display an error message that includes the failure reason from the response.
**Validates: Requirements 2.4, 7.2**

### Property 8: Tombstone Count Consistency
*For any* list of dead branches returned from the API, the number of tombstone components rendered should equal the number of branches in the list.
**Validates: Requirements 3.2**

### Property 9: Tombstone Content Completeness
*For any* dead branch, the rendered tombstone should contain both the branch name and the last commit date in a human-readable format.
**Validates: Requirements 3.3**

### Property 10: Bare Clone Usage
*For any* repository analysis, the system should clone the repository using the bare clone option (bare: true) to a temporary directory.
**Validates: Requirements 5.1**

### Property 11: Branch Retrieval After Clone
*For any* successful clone operation, the system should execute Git commands to retrieve all remote branches before identifying merged branches.
**Validates: Requirements 5.2**

### Property 12: Merged Branch Identification
*For any* repository with a main branch, the system should correctly identify which branches have been merged into that main branch using Git merge-base or equivalent commands.
**Validates: Requirements 5.3**

### Property 13: Main Branch Detection
*For any* repository, the system should check for both "main" and "master" branch names when determining the main branch, selecting whichever exists.
**Validates: Requirements 5.5**

### Property 14: Branch Data Transformation Pipeline
*For any* merged branch identified during analysis, the system should retrieve its last commit date and SHA, format the date consistently, and create a DeadBranch object containing the branch name, formatted date, and commit SHA, ultimately returning all branches as a JSON array. The returned JSON array does not need to be pre-sorted by the backend; sorting is handled by the frontend.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 15: Cleanup Guarantee
*For any* repository analysis (whether successful or failed), the system should ensure the temporary directory is cleaned up before returning a response.
**Validates: Requirements 5.4, 7.4**

### Property 16: Tombstone Click Navigation
*For any* tombstone component, clicking it should open a new browser tab with the GitHub URL pointing to the last commit of that branch.
**Validates: Requirements 9.1**

## Error Handling

### Error Categories

1. **Validation Errors** (HTTP 400)
   - Invalid GitHub URL format
   - Missing required fields
   - Malformed request body

2. **Repository Access Errors** (HTTP 404/403)
   - Repository does not exist
   - Repository is private (no access)
   - Network connectivity issues

3. **Git Operation Errors** (HTTP 500)
   - Clone failures
   - Git command execution failures
   - Missing main branch

4. **Timeout Errors** (HTTP 408)
   - Analysis exceeds 90-second limit

5. **System Errors** (HTTP 500)
   - File system errors
   - Unexpected exceptions

### Error Response Format

All errors follow a consistent structure:
```typescript
{
  error: "Human-readable error message",
  code: "ERROR_CODE",
  details?: "Additional context"
}
```

### Error Handling Strategy

1. **Input Validation**: Validate early at API boundary
2. **Graceful Degradation**: Return partial results if possible
3. **Resource Cleanup**: Always cleanup temp directories using try-finally
4. **Timeout Protection**: Implement AbortController for Git operations
5. **Logging**: Log errors server-side for debugging
6. **User-Friendly Messages**: Translate technical errors to user-friendly messages

### Timeout Implementation

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 90000);

try {
  // Git operations with signal: controller.signal
} finally {
  clearTimeout(timeoutId);
  // Cleanup
}
```

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and integration points:

1. **URL Validation**
   - Test valid GitHub URLs (https, ssh formats)
   - Test invalid URLs (missing parts, wrong domain)
   - Test edge cases (trailing slashes, query parameters)

2. **Component Rendering**
   - Test Tombstone component renders branch data correctly
   - Test Graveyard component with empty results
   - Test loading states

3. **API Route Handler**
   - Test request validation
   - Test error response formatting
   - Test successful response structure

4. **Git Operations**
   - Test main branch detection logic
   - Test branch filtering logic
   - Test date formatting

### Property-Based Testing

Property-based tests will verify universal properties across many inputs using the **fast-check** library. Each test will run a minimum of 100 iterations.

**Configuration:**
```typescript
import fc from 'fast-check';

// Configure to run 100+ iterations
fc.assert(
  fc.property(/* generators */, /* test function */),
  { numRuns: 100 }
);
```

**Test Tagging Convention:**
Each property-based test must include a comment referencing the design document:
```typescript
// Feature: git-reaper, Property 1: URL Validation Consistency
test('validates GitHub URLs consistently', () => {
  // test implementation
});
```

**Property Tests to Implement:**

1. **Property 1: URL Validation Consistency**
   - Generator: Random strings, valid/invalid GitHub URLs
   - Verify: Validation returns consistent boolean results

2. **Property 2: Invalid Input Rejection**
   - Generator: Empty strings, malformed URLs, incomplete request bodies
   - Verify: All invalid inputs are rejected with 400 status

3. **Property 3: Valid Input Enables Action**
   - Generator: Valid GitHub URLs
   - Verify: Button enabled state and analysis proceeds

4. **Property 8: Tombstone Count Consistency**
   - Generator: Arrays of DeadBranch objects (0 to 50 branches)
   - Verify: Rendered tombstone count equals input array length

5. **Property 9: Tombstone Content Completeness**
   - Generator: Random DeadBranch objects with various names and dates
   - Verify: Rendered output contains both name and date

6. **Property 14: Branch Data Transformation Pipeline**
   - Generator: Random branch names and commit data
   - Verify: Output DeadBranch objects have all required fields in correct format

7. **Property 15: Cleanup Guarantee**
   - Generator: Various success/failure scenarios
   - Verify: Temporary directories are always removed

8. **Property 16: Tombstone Click Navigation**
   - Generator: Random DeadBranch objects
   - Verify: Click handler calls window.open with correct GitHub URL

**Generators:**

```typescript
// Example generators for property tests
const githubUrlArbitrary = fc.record({
  owner: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'), { minLength: 1, maxLength: 39 }),
  repo: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-_'), { minLength: 1, maxLength: 100 })
}).map(({ owner, repo }) => `https://github.com/${owner}/${repo}`);

const deadBranchArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  lastCommitDate: fc.date().map(d => d.toISOString().split('T')[0]),
  lastCommitSha: fc.hexaString({ minLength: 40, maxLength: 40 })
});
```

### Integration Testing

While not part of the core property-based testing strategy, integration tests can verify:
- End-to-end flow from UI to API to Git operations
- Actual Git repository analysis with test repositories
- Cleanup behavior with real file system operations

### Test Execution

- Unit tests: Run on every commit
- Property tests: Run on every commit (fast-check is efficient)
- Integration tests: Run before deployment

## Performance Considerations

### Frontend
- Lazy load graveyard component until results are available
- Virtualize tombstone grid for repositories with many dead branches (100+)
- Debounce URL validation on input

### Backend
- Use bare clone to minimize data transfer
- Implement request queuing to prevent concurrent clone operations from overwhelming the server
- Cache repository analysis results for 5 minutes (optional optimization)
- Stream large result sets if needed

### Resource Management
- Limit concurrent analysis operations (e.g., max 3 simultaneous)
- Set maximum repository size limit (e.g., 1GB)
- Implement cleanup job for orphaned temp directories

## Security Considerations

1. **Input Validation**: Strict URL validation to prevent command injection
2. **Rate Limiting**: Limit requests per IP to prevent abuse
3. **Resource Limits**: Timeout and size limits to prevent DoS
4. **Sanitization**: Sanitize branch names before rendering to prevent XSS
5. **CORS**: Configure appropriate CORS headers for API routes
6. **Error Messages**: Don't expose internal paths or system details in errors

## Deployment Considerations

### Environment Variables
```
NODE_ENV=production
ANALYSIS_TIMEOUT=90000
MAX_CONCURRENT_ANALYSES=3
TEMP_DIR=/tmp/git-reaper
```

### Vercel Configuration
- API routes automatically deployed
- Serverless function timeout: 60s (Hobby) or 300s (Pro)
- Note: May need Pro plan for 90s timeout requirement

### Alternative Deployment
If timeout limits are an issue:
- Deploy backend separately (Railway, Render, Fly.io)
- Use dedicated server with longer timeout support
- Implement job queue for long-running analyses

## Future Enhancements

1. **Abandoned Functions Analysis** (Stretch Goal)
   - Parse AST across commits to find removed functions
   - Requires language-specific parsers
   - Significantly more complex than branch analysis

2. **Additional Features**
   - Support for private repositories (OAuth)
   - Branch age visualization (color-coded tombstones)
   - Export results as CSV/JSON
   - Compare multiple repositories
   - Historical tracking of dead branches over time
