# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI Web Agency is a bilingual (French/English) digital marketing agency website built for Quebec businesses, specializing in landing page creation, SEO services, and AI-powered marketing solutions. Built with Next.js 15 and TypeScript, featuring an interactive business carousel with 10 distinct website designs for different industries.

## Quick Start Commands

**All commands must be run from the `web/` directory:**

```bash
# Navigate to the web app directory
cd web

# Development
npm run dev                    # Start dev server with Turbopack
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix ESLint issues

# Testing
npm run test                   # Run unit tests (Vitest)
npm run test:ui                # Vitest with UI
npm run test:run               # Run tests once
npm run test:a11y              # Run Playwright accessibility tests
npm run test:a11y:headed       # Run accessibility tests with browser

# Content & Validation
npm run i18n:lint              # Validate translation files
npm run content:validate       # Validate content structure

# Analysis
npm run analyze                # Bundle analyzer
npm run analyze:server         # Server bundle analysis  
npm run analyze:browser        # Browser bundle analysis
```

**Node Version:** >=20.14 <21 (specified in package.json engines)

## Repository Structure

```
Daniel_SaaS_agency_Ernest/
├── web/                       # Main Next.js application (run commands here)
│   ├── app/                  # App Router with internationalized routes
│   │   ├── [locale]/        # Localized pages (/fr, /en)
│   │   └── api/             # API routes (leads endpoint)
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and business logic
│   ├── messages/            # Translation files (fr.json, en.json)
│   ├── content/             # MDX content files
│   ├── scripts/             # Development and validation scripts
│   ├── middleware.ts        # i18n routing middleware
│   ├── i18n.ts             # next-intl configuration
│   └── package.json        # Dependencies and scripts
├── Documents/               # Business documentation
├── Plans/                   # Project improvement plans
└── README.md               # Project overview
```

## Internationalization (i18n)

### Core Setup
- **Framework**: next-intl with App Router
- **Supported locales**: `fr` (default), `en`
- **Default locale**: French (`fr`) - Quebec market focused
- **Routing**: Always prefixed (`/fr/`, `/en/`)
- **Fallback**: Any unsupported locale defaults to French

### Key Files
- `web/i18n.ts` - Request configuration
- `web/middleware.ts` - Locale routing
- `web/messages/fr.json` - French translations (default)
- `web/messages/en.json` - English translations

### URLs Structure
- French homepage: `/fr/` (default)
- English homepage: `/en/`
- French services: `/fr/services`
- English services: `/en/services`

### Adding Content
1. Update translation files:
   - `web/messages/fr.json`
   - `web/messages/en.json`
2. Keep keys synchronized between both files
3. Run `npm run i18n:lint` to validate translation parity

### Usage in Components
- **Server Components**: `getTranslations` from next-intl
- **Client Components**: `useTranslations` from next-intl
- Always use translation keys, never hardcode strings

### ⚠️ CRITICAL: Complete Localization Required

**EVERYTHING must be localized** - this is a bilingual Quebec website where French is the primary language and English is required. No exceptions:

- ✅ **All UI Text**: Buttons, labels, placeholders, tooltips
- ✅ **All Messages**: Success, error, warning, info messages
- ✅ **All Content**: Headings, descriptions, body text
- ✅ **All Navigation**: Menu items, breadcrumbs, links
- ✅ **All Form Elements**: Field labels, validation messages, help text
- ✅ **All Dynamic Content**: Loading states, empty states, status messages
- ✅ **All Meta Content**: Page titles, descriptions, alt text

**Never hardcode text in any language - always use translation keys.**

## Architecture Details

### Framework Stack
- **Next.js 15** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Vitest** for unit testing
- **Playwright** for accessibility testing

### Key Components
- **BusinessCarousel**: Interactive homepage carousel showcasing 10 business designs
- **LeadCaptureForm**: Lead generation with validation
- **ComplianceHeatmap**: Quebec Law 25 compliance tools
- **AIReadinessAssessment**: Interactive assessment tool
- **PricingCalculator**: Dynamic pricing calculator

### Business Designs
The carousel features 10 distinct website designs:
1. AI Marketing Agency (original)
2. Medical Clinic
3. Antique Shop
4. Auto Garage
5. Retail Store
6. Restaurant
7. Law Firm
8. Beauty Salon
9. Pet Grooming
10. Home Services

Each design has its own theme, colors, and specialized services configuration.

## Development Workflow

### Adding New Pages
1. Create page in `web/app/[locale]/your-page/page.tsx`
2. Add translations to both `fr.json` and `en.json`
3. Update navigation if needed
4. Test both locales

### Content Management
- **MDX Support**: Content pages use MDX with frontmatter
- **Validation**: Run `npm run content:validate` to check structure
- **Translation Parity**: Run `npm run i18n:lint` to ensure consistency

### Code Quality
- **Pre-commit Hooks**: Husky + lint-staged for automatic linting
- **ESLint**: Configured with Next.js and TypeScript rules
- **Import Sorting**: Automatic with simple-import-sort
- **Type Safety**: Strict TypeScript configuration

## Testing Strategy

### Unit Tests
- **Framework**: Vitest with jsdom
- **Location**: `web/__tests__/`
- **Command**: `npm run test`

### Accessibility Tests
- **Framework**: Playwright with axe-core
- **Location**: `web/tests/accessibility.spec.ts`
- **Commands**: 
  - `npm run test:a11y` (headless)
  - `npm run test:a11y:headed` (with browser)

### Running Single Tests
```bash
npm run test -- path/to/specific.test.ts
```

## API Routes

### Lead Capture
- **Endpoint**: `/api/leads`
- **Methods**: POST (submit), GET (development only)
- **Features**: Spam detection, email notifications, data storage

## Performance & SEO

### Optimizations
- **Bundle Analysis**: Built-in analyzer with `npm run analyze`
- **Image Optimization**: Next.js Image component
- **Lazy Motion**: Optimized Framer Motion loading
- **Code Splitting**: Automatic with Next.js

### SEO Features
- **Structured Data**: JSON-LD generation
- **Multilingual SEO**: hreflang links
- **Canonical URLs**: Proper canonicalization
- **Dynamic Sitemaps**: Auto-generated from content

## Environment & Configuration

### Security Headers
- Content Security Policy configured
- HTTPS enforcement
- Frame protection
- XSS protection

### Development Environment
- **Package Manager**: npm
- **Node Version**: 20.x (specified in engines)
- **Build Tool**: Turbopack for development
- **Deployment**: Configured for Vercel

## Localization Best Practices

### 🔥 GOLDEN RULE: Never Hardcode Text

**❌ WRONG - Never do this:**
```tsx
// Never hardcode text in any language
<button>Submit</button>
<button>Soumettre</button>
<p>Loading...</p>
<div>Error: Something went wrong</div>
```

**✅ CORRECT - Always use translation keys:**
```tsx
// Server Components
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations('common');
  return (
    <button>{t('submit')}</button>
    <p>{t('loading')}</p>
    <div>{t('errors.generic')}</div>
  );
}

// Client Components
import { useTranslations } from 'next-intl';

export default function ClientComponent() {
  const t = useTranslations('common');
  return (
    <button>{t('submit')}</button>
    <p>{t('loading')}</p>
    <div>{t('errors.generic')}</div>
  );
}
```

### Translation Key Organization

Organize keys logically in `messages/fr.json` and `messages/en.json`:

```json
{
  "common": {
    "submit": "Soumettre", // "Submit"
    "cancel": "Annuler", // "Cancel"
    "loading": "Chargement...", // "Loading..."
    "save": "Enregistrer", // "Save"
    "delete": "Supprimer", // "Delete"
    "edit": "Modifier", // "Edit"
    "close": "Fermer", // "Close"
    "back": "Retour", // "Back"
    "next": "Suivant", // "Next"
    "previous": "Précédent" // "Previous"
  },
  "navigation": {
    "home": "Accueil", // "Home"
    "services": "Services", // "Services"
    "contact": "Contact", // "Contact"
    "about": "À propos" // "About"
  },
  "forms": {
    "name": "Nom", // "Name"
    "email": "Courriel", // "Email"
    "phone": "Téléphone", // "Phone"
    "message": "Message", // "Message"
    "required": "Obligatoire", // "Required"
    "optional": "Optionnel" // "Optional"
  },
  "errors": {
    "generic": "Une erreur s'est produite", // "An error occurred"
    "required": "Ce champ est obligatoire", // "This field is required"
    "invalidEmail": "Courriel invalide", // "Invalid email"
    "network": "Erreur de réseau" // "Network error"
  },
  "success": {
    "saved": "Enregistré avec succès", // "Successfully saved"
    "sent": "Message envoyé", // "Message sent"
    "updated": "Mis à jour" // "Updated"
  }
}
```

### Dynamic Content Localization

For dynamic content with variables:

```tsx
// In messages/fr.json
{
  "welcome": "Bienvenue, {name}!",
  "itemCount": "Vous avez {count, plural, =0 {aucun élément} =1 {un élément} other {# éléments}}"
}

// In components
const t = useTranslations('common');
<p>{t('welcome', { name: user.name })}</p>
<p>{t('itemCount', { count: items.length })}</p>
```

### Form Validation Localization

All form validation must be localized:

```tsx
// Zod schema with localized messages
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const useContactFormSchema = () => {
  const t = useTranslations('forms.validation');
  
  return z.object({
    name: z.string().min(1, t('nameRequired')),
    email: z.string().email(t('invalidEmail')),
    phone: z.string().min(10, t('phoneMinLength'))
  });
};
```

### Error Boundaries Localization

Even error messages must be localized:

```tsx
import { useTranslations } from 'next-intl';

export function ErrorBoundary({ error }: { error: Error }) {
  const t = useTranslations('errors');
  
  return (
    <div>
      <h2>{t('unexpectedError')}</h2>
      <p>{t('tryRefresh')}</p>
      <button onClick={() => window.location.reload()}>
        {t('refresh')}
      </button>
    </div>
  );
}
```

## Common Tasks

### Update Translation Content
1. Edit `web/messages/fr.json` for French content
2. Edit `web/messages/en.json` for English content
3. Run `npm run i18n:lint` to validate
4. Restart dev server if needed

### Add Business Design
1. Update `web/lib/businessDesigns.ts` with new design
2. Create modal component in `web/components/business-modals/`
3. **Add translations to message files for ALL text content**
4. Update carousel component

### Adding New Content (Complete Localization Workflow)

**For ANY new text content, follow these steps:**

1. **Add French translation key** to `web/messages/fr.json`:
   ```json
   {
     "mySection": {
       "title": "Mon titre",
       "description": "Ma description"
     }
   }
   ```

2. **Add English translation** to `web/messages/en.json`:
   ```json
   {
     "mySection": {
       "title": "My title",
       "description": "My description"
     }
   }
   ```

3. **Use translation keys in component**:
   ```tsx
   const t = useTranslations('mySection');
   return (
     <div>
       <h2>{t('title')}</h2>
       <p>{t('description')}</p>
     </div>
   );
   ```

4. **Validate translations**:
   ```bash
   npm run i18n:lint
   ```

5. **Test both locales**:
   - Visit `/fr/your-page` 
   - Visit `/en/your-page`
   - Verify all text appears correctly

### Content Checklist ✅

Before committing any changes, verify:

- [ ] No hardcoded text anywhere (search for strings in quotes)
- [ ] All user-facing text has translation keys
- [ ] French and English translations are complete
- [ ] `npm run i18n:lint` passes
- [ ] Both `/fr/` and `/en/` routes work
- [ ] Error messages are localized
- [ ] Form validation messages are localized
- [ ] Loading states are localized
- [ ] Meta tags (titles, descriptions) are localized

### Validate Code Quality
```bash
cd web
npm run lint          # Check linting
npm run i18n:lint     # Check translations
npm run content:validate  # Check content structure
npm run test          # Run unit tests
npm run test:a11y     # Check accessibility
```

## Troubleshooting

### Common Localization Issues

1. **Translation Missing**: 
   - Check both `fr.json` and `en.json` have the exact same key structure
   - Run `npm run i18n:lint` to find missing keys
   - Look for `[Missing key]` or raw translation keys in UI

2. **Hardcoded Text Found**:
   - Search codebase for hardcoded strings: `"text"` or `'text'`
   - Replace with translation keys immediately
   - Never commit hardcoded user-facing text

3. **Translation Key Not Found**:
   - Verify key exists in both language files
   - Check key path: `t('section.subsection.key')`
   - Ensure translation namespace matches: `useTranslations('section')`

4. **Locale Not Working**: 
   - Verify middleware.ts and i18n.ts configuration
   - Check URL structure (`/fr/` vs `/en/`)
   - Inspect browser network tab for locale resolution

5. **Build Failing**: 
   - Run `npm run i18n:lint` first
   - Check for TypeScript errors in translation usage
   - Verify all translation keys are strings

6. **Mixed Languages Appearing**:
   - Check if fallback is working correctly
   - Verify no hardcoded text is mixed with translations
   - Test both locales thoroughly

### Localization Debugging Tools

```bash
# Find hardcoded text (run from web/ directory)
grep -r "\"[A-Za-z]" src/ --include="*.tsx" --include="*.ts"
grep -r "\'[A-Za-z]" src/ --include="*.tsx" --include="*.ts"

# Validate translations
npm run i18n:lint

# Check translation key usage
grep -r "t('" src/ --include="*.tsx"
grep -r "t(\"" src/ --include="*.tsx"
```

### Browser Debugging
- Use browser dev tools to inspect locale routing
- Check middleware logs for locale resolution  
- Validate translation keys in browser console
- Test URL patterns: `/fr/page`, `/en/page`
- Verify meta tags are localized in both languages

## Important Notes

### 🚨 CRITICAL LOCALIZATION REQUIREMENTS
- **NO HARDCODED TEXT**: Every single piece of user-facing text MUST use translation keys
- **COMPLETE BILINGUAL SUPPORT**: French (primary) and English (required) for ALL content
- **Quebec Market Focus**: French-first approach, culturally appropriate translations
- **Zero Exceptions**: Buttons, errors, tooltips, placeholders, meta tags - everything localized

### Technical Requirements
- **Working Directory**: Always run npm commands from `web/` directory
- **Default Locale**: French (fr) is default for Quebec market
- **Translation Sync**: Keep fr.json and en.json keys perfectly synchronized
- **TypeScript**: Strict mode enabled for type safety
- **Performance**: Bundle size monitoring via analyze scripts
- **Compliance**: Built-in Quebec Law 25 compliance tools

### Before Every Commit
1. ✅ Run `npm run i18n:lint` - must pass
2. ✅ Test both `/fr/` and `/en/` routes
3. ✅ Search for hardcoded strings - none allowed
4. ✅ Verify all new text uses translation keys
5. ✅ Check error messages are localized
