# Solutions Impact Web

A bilingual (French/English) digital marketing agency website for Quebec businesses, specializing in landing page creation, SEO services, and AI-powered marketing solutions.

## Key Features

- **Business Design Carousel**: Interactive showcase of 10 distinct website designs for different business types (medical clinics, restaurants, law firms, auto garages, beauty salons, pet grooming, home services, retail stores, antique shops, and AI agencies)
- **Bilingual Support**: Complete French/English internationalization for Quebec market
- **Lead Generation**: Integrated forms, assessments, and calculators for client acquisition
- **Compliance Tools**: Quebec Law 25 compliance resources and interactive tools
- **Performance Optimized**: Modern Next.js 15 with strict performance budgets

## Project Structure

```
SolutionsImpactWeb/
├── web/                    # Main Next.js application (authoritative source)
│   ├── app/               # App Router pages and layouts
│   ├── components/        # React components
│   ├── lib/               # Utility functions and helpers
│   ├── messages/          # i18n translation files (fr.json, en.json)
│   ├── scripts/           # Build and validation scripts
│   ├── content/           # MDX content files
│   ├── tests/             # Test files
│   ├── package.json       # Dependencies and scripts
│   └── ...
├── Documents/             # Business documentation
│   ├── BusinessPlanV0.5.md
│   └── Chronological_Roadmap_v0.1.md
├── Plans/                 # Project improvement plans
│   └── 2025-08_site_improvement/
└── README.md             # This file
```

## Getting Started

All development happens in the `web/` directory. Navigate there to run the application:

```bash
cd web
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Commands

All development commands should be run from the `web/` directory:

```bash
cd web
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Languages**: TypeScript, bilingual French/English support
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-intl
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Architecture

See `ARCHITECTURE.md` for detailed architecture documentation.
