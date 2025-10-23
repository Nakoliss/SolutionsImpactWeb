# Content Taxonomy

This directory contains the structured content management system for the AI Web Agency website.

## Directory Structure

```
content/
├── index.ts           # Content types and utilities
├── guides/           # Educational content and tutorials
├── pricing/          # Pricing information and calculators  
├── compliance/       # Legal and regulatory compliance resources
└── README.md         # This file
```

## Content Categories

### Guides (`guides/`)
- **Purpose**: Educational content, how-to guides, best practices
- **Lead Form**: Usually disabled (informational content)
- **Examples**: SEO guides, marketing tutorials, technology explanations

### Pricing (`pricing/`)
- **Purpose**: Pricing information, cost calculators, package details
- **Lead Form**: Usually enabled (conversion-focused)
- **Examples**: Service pricing, ROI calculators, package comparisons

### Compliance (`compliance/`)
- **Purpose**: Legal and regulatory compliance information
- **Lead Form**: Usually enabled (expertise demonstration)
- **Examples**: Bill 64 compliance, PIPEDA guidelines, privacy policies

## Content Metadata Schema

Each piece of content should include the following metadata:

```typescript
{
  title: string;              // Content title
  description: string;        // SEO meta description
  slug: string;              // URL slug
  localeAvail: string[];     // Available locales ['fr', 'en']
  leadForm: boolean;         // Show lead capture form
  category: string;          // Content category
  publishedAt: string;       // ISO date string
  updatedAt: string;         // ISO date string
  tags?: string[];           // Optional tags
  author?: string;           // Content author
  readTime?: number;         // Estimated read time in minutes
}
```

## File Naming Convention

- French content: `filename.fr.mdx`
- English content: `filename.en.mdx`
- Shared assets: `filename.shared.json` or `filename.assets/`

## Usage

Import the content utilities:

```typescript
import { 
  ContentMetadata, 
  CONTENT_CATEGORIES, 
  createDefaultMetadata,
  validateMetadata 
} from './index';
```

## Future Enhancements

- MDX component integration
- Dynamic content loading
- Content search and filtering
- Automated content validation
- SEO optimization helpers