# Project Structure & Organization

## Repository Layout

```
AI_Web_Agency/
├── web/                    # Main Next.js application (authoritative source)
├── Documents/             # Business documentation
├── Plans/                 # Project improvement plans
├── .kiro/                 # Kiro configuration and steering
├── .github/               # GitHub workflows and configuration
└── README.md              # Project overview
```

## Web Application Structure

```
web/
├── app/                   # Next.js App Router
│   ├── [locale]/         # Internationalized routes
│   │   ├── page.tsx      # Homepage with Business Carousel
│   │   ├── services/     # Services pages
│   │   ├── packages/     # Package offerings
│   │   ├── pricing/      # Pricing calculator
│   │   ├── why-us/       # Why choose us
│   │   ├── process/      # Our process
│   │   └── ...           # Other localized pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions and helpers
├── messages/             # i18n translation files
├── content/              # MDX content files
├── scripts/              # Build and validation scripts
├── tests/                # Playwright tests
├── __tests__/            # Unit tests
├── public/               # Static assets
├── middleware.ts         # i18n routing middleware
└── i18n.ts              # i18n configuration
```

## File Naming Conventions

### Components
- **PascalCase**: `BusinessCarousel.tsx`, `Header.tsx`
- **Descriptive names**: Reflect component purpose
- **Client components**: Use `'use client'` directive when needed
- **Props interface**: Define `ComponentNameProps` interface

### Pages
- **App Router**: Use `page.tsx` for route pages
- **Layout files**: Use `layout.tsx` for shared layouts
- **Loading states**: Use `loading.tsx` for loading UI
- **Error boundaries**: Use `error.tsx` for error handling

### Utilities
- **camelCase**: `scrollToContact.ts`, `themeUtils.ts`
- **Descriptive modules**: Group related functions
- **Type exports**: Export types alongside functions

### Content
- **kebab-case**: `business-plan.md`, `pricing-guide.md`
- **Locale-specific**: Organize by language when needed

## Import Organization

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. Internal components (`@/components/`)
4. Internal utilities (`@/lib/`)
5. Types and interfaces
6. Relative imports

### Path Aliases
- Use `@/` for all internal imports
- Avoid relative paths (`../`) when possible
- Example: `import { Header } from '@/components/Header'`

## Component Patterns

### Functional Components
```typescript
interface ComponentProps {
  locale: SupportedLocale;
  // Other props
}

export default function Component({ locale }: ComponentProps) {
  // Component logic
}
```

### Client Components
- Use `'use client'` directive for interactive components
- Minimize client-side JavaScript
- Prefer server components when possible

### Internationalization
- Use `useTranslations()` hook for client components
- Pass translations as props to server components
- Organize translation keys logically in JSON files

## Directory-Specific Rules

### `/app/[locale]/`
- All pages must support both French and English
- Use `SupportedLocale` type for locale parameters
- Include proper metadata for SEO

### `/components/`
- One component per file
- Export as default
- Include TypeScript interfaces
- Use Tailwind for styling

### `/lib/`
- Pure functions when possible
- Proper TypeScript typing
- Export individual functions
- Group related utilities

### `/messages/`
- `fr.json` (default locale)
- `en.json` (secondary locale)
- Nested structure for organization
- Consistent key naming

## Monorepo Considerations

- **Primary workspace**: `web/` directory
- **Business docs**: Keep in root `Documents/`
- **Planning**: Use `Plans/` for project planning
- **Configuration**: Centralize in `web/` directory
- **Dependencies**: Manage only in `web/package.json`

## Code Organization Principles

1. **Separation of concerns**: Components, utilities, and content in dedicated directories
2. **Locale-first**: French as default, English as secondary
3. **Type safety**: Comprehensive TypeScript usage
4. **Performance**: Lazy loading for heavy components
5. **Accessibility**: ARIA labels and semantic HTML
6. **SEO**: Proper metadata and structured data