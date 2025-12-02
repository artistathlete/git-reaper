# Project Structure

## Directory Organization

```
app/                    # Next.js App Router
  api/                  # API routes
    reap/               # Branch analysis endpoint
  globals.css           # Global styles
  layout.tsx            # Root layout
  page.tsx              # Home page

components/             # React components
  *.tsx                 # Component implementation
  *.test.tsx            # Component tests
  *.module.css          # Component-scoped styles

lib/                    # Business logic and utilities
  git/                  # Git-related functionality
    analyzer.ts         # GitHub API branch analysis
    branch-service.ts   # Branch operations
    cleanup.ts          # Cleanup utilities
  types.ts              # Shared TypeScript types
  validators.ts         # Input validation
  hooks.ts              # Custom React hooks
```

## Code Organization Patterns

### File Naming
- Components: PascalCase (e.g., `Tombstone.tsx`)
- Utilities/services: kebab-case (e.g., `branch-service.ts`)
- Tests: Same name as source with `.test` suffix
- CSS Modules: `ComponentName.module.css`

### Import Paths
- Use `@/` alias for absolute imports from project root
- Example: `import { DeadBranch } from '@/lib/types'`

### Component Structure
- Client components marked with `'use client'` directive
- Props interfaces defined inline above component
- Event handlers prefixed with `handle` (e.g., `handleClick`)

### Type Definitions
- Shared types in `lib/types.ts`
- Component-specific types defined in component file
- API types match request/response structure

### Testing
- Tests colocated with source files
- Use `data-testid` attributes for test selectors
- Property-based tests with `fast-check` where applicable
