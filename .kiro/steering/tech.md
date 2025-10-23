# Technology Stack & Development

## Core Framework
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Strict type checking with comprehensive compiler options
- **Node.js**: Version 20.14+ (engines requirement)

## Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Utility class merging

## Internationalization
- **next-intl**: Primary i18n framework
- **Supported locales**: French (default), English
- **Routing strategy**: Always prefixed (`/fr/`, `/en/`)
- **Locale detection**: Browser-based with French fallback

## Development Tools
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **Vitest**: Testing framework
- **Playwright**: End-to-end and accessibility testing

## Build & Development Commands

All commands must be run from the `web/` directory:

```bash
cd web

# Development
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically

# Testing
npm run test         # Run unit tests with Vitest
npm run test:run     # Run tests once (non-watch mode)
npm run test:a11y    # Run accessibility tests with Playwright

# Internationalization
npm run i18n:lint    # Validate translation files
npm run i18n:check   # Check for encoding issues

# Analysis
npm run analyze      # Bundle analysis
```

## Project Structure Rules
- **Working directory**: Always `web/` for development
- **Import paths**: Use `@/` alias for relative imports
- **Component organization**: Functional components in `components/`
- **Utilities**: Helper functions in `lib/`
- **Content**: MDX files in `content/`
- **Translations**: JSON files in `messages/`

## TypeScript Configuration
- Strict mode enabled with comprehensive checks
- No unused locals/parameters allowed
- Exact optional property types enforced
- No implicit returns or fallthrough cases
- Index access checking enabled

## Performance Requirements
- Turbopack for fast development builds
- Bundle analysis tools integrated
- Performance budgets enforced
- Lazy loading for large components (Business Carousel)