# AI Web Agency

A bilingual (French/English) digital marketing agency website for Quebec businesses, built with Next.js 15 and TypeScript. The project focuses on landing page creation, SEO services, and AI-powered marketing solutions.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Languages**: TypeScript, bilingual French/English support
- **Styling**: Tailwind CSS v4 with PostCSS
- **Internationalization**: next-intl for i18n routing and content
- **Content**: MDX with gray-matter frontmatter
- **Testing**: Vitest with jsdom and Playwright for E2E
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Development Scripts

### Core Development
```bash
npm run dev              # Start development server with Turbopack
npm run build            # Production build
npm run start            # Start production server
```

### Code Quality & Testing
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run test             # Run unit tests (Vitest)
npm run test:ui          # Run Vitest with UI
npm run test:run         # Run tests once
npm run test:a11y        # Run accessibility tests (Playwright)
npm run test:a11y:headed # Run accessibility tests with browser UI
```

### Content & Validation
```bash
npm run i18n:lint        # Validate translation parity between fr/en
npm run content:validate # Validate MDX content structure and metadata
```

### Performance Analysis
```bash
npm run analyze          # Analyze bundle size
npm run analyze:server   # Analyze server bundle
npm run analyze:browser  # Analyze browser bundle
```

## Project Structure

```
web/
├── app/                 # Next.js App Router
│   ├── [locale]/       # Internationalized routes
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # Reusable React components
├── content/           # MDX content files
│   ├── guides/        # Tutorial and guide content
│   ├── pricing/       # Pricing information
│   └── compliance/    # Legal compliance content
├── lib/               # Utility libraries
│   ├── mdx.ts         # MDX processing utilities
│   ├── metadata.ts    # SEO metadata helpers
│   └── seo/           # SEO and structured data
├── messages/          # i18n translation files
│   ├── fr.json        # French translations
│   └── en.json        # English translations
├── scripts/           # Development and validation scripts
└── tests/             # Test files
```

## Internationalization

The site supports French (default) and English:

- **Default locale**: French (`fr`)
- **Supported locales**: `['fr', 'en']`
- **Routing**: Always prefixed (`/fr/`, `/en/`)
- **Content**: MDX files with `localeAvail` frontmatter
- **Middleware**: Automatic locale detection and routing

## Content Management

Content is managed through MDX files with structured frontmatter:

```yaml
---
title: "Page Title"
description: "Page description for SEO"
slug: "url-slug"
category: "guides"
localeAvail: ["fr", "en"]
publishedAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-01T00:00:00Z"
author: "Author Name"
tags: ["tag1", "tag2"]
leadForm: true
---

# Content goes here...
```

### Content Validation

Run `npm run content:validate` to check:
- Frontmatter structure and required fields
- Translation parity between locales
- Metadata consistency
- Content quality (headings, links, etc.)

## Code Quality

### ESLint Configuration
- Import ordering and organization
- TypeScript strict rules
- React best practices
- Auto-fixing with `npm run lint:fix`

### Pre-commit Hooks
- Automatic ESLint fixing
- TypeScript type checking
- Prettier formatting
- Runs only on staged files

### CI/CD Pipeline
GitHub Actions runs on every push/PR:
1. Install dependencies
2. ESLint validation
3. TypeScript checking
4. i18n validation
5. Content validation
6. Unit tests
7. Build verification
8. Accessibility tests

## Performance

- **Bundle Analysis**: Built-in bundle analyzer
- **Image Optimization**: Optimized Next.js Image component
- **Motion Optimization**: LazyMotion for Framer Motion
- **Performance Budget**: Documented targets in `Plans/`

## SEO Features

- **Structured Data**: Schema.org JSON-LD
- **Multilingual SEO**: hreflang links
- **Canonical URLs**: Proper canonicalization
- **Sitemaps**: Auto-generated from content
- **OpenGraph**: Dynamic OG image generation

## Accessibility

- **WCAG 2.1 AA**: Target compliance level
- **Automated Testing**: Playwright + axe-core
- **Reduced Motion**: Respects user preferences
- **Semantic HTML**: Proper heading structure

## Contributing

1. Follow the pre-commit hooks (automatic)
2. Run tests before submitting PRs
3. Ensure all validation scripts pass
4. Update documentation for new features

## Technical Decisions

See `ARCHITECTURE.md` for detailed technical decisions and patterns used in this project.
