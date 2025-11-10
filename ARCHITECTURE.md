# Architecture Documentation

## Overview

Solutions Impact Web is a bilingual digital marketing agency website built with Next.js 15, focusing on Quebec businesses with French/English internationalization support. The homepage features an interactive business carousel showcasing 10 distinct website designs for different business types, demonstrating the agency's versatility across various industries.

## Project Structure

```
SolutionsImpactWeb/
├── web/                    # Main Next.js application (authoritative source)
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/      # Internationalized routes
│   │   │   ├── page.tsx   # Localized homepage
│   │   │   ├── ai-roadmap/# AI roadmap generator
│   │   │   ├── assessment/# AI readiness assessment
│   │   │   ├── compliance/# Compliance tools and heatmap
│   │   │   ├── content/   # Dynamic content pages
│   │   │   └── pricing/   # Pricing calculator
│   │   ├── api/           # API routes
│   │   │   └── leads/     # Lead capture endpoints
│   │   ├── layout.tsx     # Root layout
│   │   ├── globals.css    # Global styles
│   │   └── favicon.ico    # Site icon
│   ├── components/        # React components
│   │   ├── BusinessCarousel.tsx      # Homepage carousel
│   │   ├── LeadCaptureForm.tsx       # Lead generation form
│   │   ├── ComplianceHeatmap.tsx     # Compliance assessment tool
│   │   ├── AIRoadmapGenerator.tsx    # AI roadmap tool
│   │   ├── PricingCalculator.tsx     # Dynamic pricing tool
│   │   └── ...                       # Other components
│   ├── lib/               # Utility functions
│   │   ├── analytics.ts   # Analytics tracking
│   │   ├── env.ts         # Environment validation
│   │   ├── seo/           # SEO utilities
│   │   └── ...            # Other utilities
│   ├── messages/          # i18n translation files
│   │   ├── fr.json        # French translations (default)
│   │   └── en.json        # English translations
│   ├── content/           # MDX content files
│   │   ├── compliance/    # Compliance guides
│   │   └── pricing/       # Pricing content
│   ├── scripts/           # Build and validation scripts
│   │   ├── i18n-lint.ts   # Translation validation
│   │   └── content-validate.ts # Content validation
│   ├── tests/             # Test files
│   │   └── accessibility.spec.ts # Accessibility tests
│   ├── __tests__/         # Unit tests
│   ├── public/            # Static assets
│   ├── middleware.ts      # Route middleware for i18n
│   ├── i18n.ts           # i18n configuration
│   ├── package.json      # Dependencies and scripts
│   └── config files      # TypeScript, ESLint, Next.js configs
├── Documents/             # Business documentation
│   ├── BusinessPlanV0.5.md
│   └── Chronological_Roadmap_v0.1.md
├── Plans/                 # Project improvement planning
│   └── 2025-08_site_improvement/
│       ├── README.md      # Master plan
│       ├── TODO.md        # Task checklist
│       └── PROMPT_FOR_AI_CODER.md # AI coder instructions
├── .vscode/              # VS Code configuration
├── .claude/              # Claude Code configuration
├── .github/              # GitHub configuration
│   └── workflows/        # CI/CD pipelines
├── .husky/               # Git hooks
├── CLAUDE.md             # Project instructions for Claude
├── README.md             # Project overview
└── ARCHITECTURE.md       # This file
```

## Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **React 19**: Latest React version

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Internationalization
- **next-intl**: Internationalization framework
- **Middleware**: Automatic locale detection and routing
- **Supported locales**: French (default), English
- **Routing strategy**: Always prefixed (`/fr/`, `/en/`)

### Development Tools
- **ESLint**: Code linting with Next.js config
- **TypeScript**: Strict type checking
- **VS Code**: Configured workspace

## Architecture Patterns

### Business Carousel Architecture
- **Homepage Component**: `BusinessCarousel` component as primary homepage experience
- **Design Variants**: 10 distinct website layouts for different business types:
  - AI Marketing Agency (original design)
  - Medical Clinic with appointment booking
  - Antique Shop with catalog browsing
  - Auto Garage with service booking
  - Retail Store with product showcase
  - Restaurant with menu and reservations
  - Law Firm with consultation forms
  - Beauty Salon with service packages
  - Pet Grooming with care packages
  - Home Services with maintenance offerings
- **Navigation**: Interactive carousel with previous/next controls
- **Responsive Design**: All variants optimized for mobile and desktop
- **Performance**: Lazy loading and optimized rendering for large component

### Internationalization Architecture
- **Default locale**: French (`fr`)
- **Locale resolution**: Browser detection with fallback to French
- **Route structure**: `/[locale]/...` pattern
- **Translation loading**: Server-side with next-intl
- **Metadata**: Localized per route

### File Organization
- **Monorepo structure**: Single repository with `web/` as main app
- **Configuration centralization**: All configs in `web/` directory
- **Content separation**: Business docs separate from application code
- **Planning artifacts**: Organized in `Plans/` directory

### Development Workflow
- **Working directory**: All development in `web/` subdirectory
- **Commands**: All npm scripts run from `web/` directory
- **Build process**: Next.js with Turbopack for development
- **Linting**: ESLint with Next.js and TypeScript rules

## Key Design Decisions

1. **Monorepo with separation**: Business content separate from application code
2. **French-first**: Quebec market focus with French as default locale
3. **Modern stack**: Latest versions of Next.js, React, and TypeScript
4. **Utility-first CSS**: Tailwind for rapid development
5. **Type safety**: Strict TypeScript configuration
6. **Performance**: Turbopack for fast development builds

## Dependencies

### Production Dependencies
- `next-intl`: Internationalization
- `framer-motion`: Animations
- `lucide-react`: Icons
- `next-seo`: SEO optimization
- Utility libraries: `clsx`, `class-variance-authority`, `tailwind-merge`

### Development Dependencies
- `@tailwindcss/postcss`: CSS processing
- `eslint`: Code linting
- `typescript`: Type checking
- Various type definitions

## Future Architecture Considerations
- MDX support for content management
- Structured data and SEO enhancements
- Performance monitoring and analytics
- CI/CD pipeline integration
- Content validation and quality gates
