# Technology Stack

## Framework & Core

- **Next.js 14** with App Router (React 18)
- **TypeScript 5** with strict mode enabled
- **Server-Sent Events** for real-time progress streaming

## Key Libraries

- `simple-git` - Git operations (minimal usage, primarily GitHub API)
- `react-icons` - Icon components
- `fast-check` - Property-based testing

## Testing

- **Vitest** as test runner with jsdom environment
- **React Testing Library** for component tests
- **@testing-library/user-event** for interaction testing
- Test files colocated with source: `*.test.ts` or `*.test.tsx`

## Build System

- Next.js bundler with default configuration
- Path alias: `@/*` maps to project root
- React Strict Mode enabled

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Testing
npm test                 # Run all tests once (CI mode)
npm run test:watch       # Run tests in watch mode

# Production
npm run build            # Build for production
npm start                # Start production server
```

## Environment Variables

- `GITHUB_TOKEN` (optional) - GitHub personal access token for higher API rate limits
- Stored in `.env.local` (gitignored)
