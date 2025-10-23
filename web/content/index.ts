/**
 * Content taxonomy and organization system
 * Defines the structure and metadata for all content types
 */

export interface ContentMetadata {
  title: string;
  description: string;
  slug: string;
  localeAvail: string[];
  leadForm: boolean;
  category: 'guides' | 'pricing' | 'compliance';
  publishedAt: string;
  updatedAt: string;
  tags?: string[];
  author?: string;
  readTime?: number;
}

export interface ContentItem {
  metadata: ContentMetadata;
  content: string;
  locale: string;
}

/**
 * Content categories and their purposes
 */
export const CONTENT_CATEGORIES = {
  guides: {
    name: 'Guides',
    description: 'Educational content and tutorials',
    slug: 'guides',
    icon: 'BookOpen',
    leadFormDefault: false
  },
  pricing: {
    name: 'Pricing',
    description: 'Pricing information and calculators',
    slug: 'pricing',
    icon: 'Calculator',
    leadFormDefault: true
  },
  compliance: {
    name: 'Compliance',
    description: 'Legal and regulatory compliance resources',
    slug: 'compliance',
    icon: 'Shield',
    leadFormDefault: true
  }
} as const;

/**
 * Supported locales for content
 * Note: English is temporarily disabled - only French is available
 */
export const SUPPORTED_LOCALES = ['fr'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export type ContentCategory = keyof typeof CONTENT_CATEGORIES;

/**
 * Default metadata template for new content
 */
export function createDefaultMetadata(
  category: ContentCategory,
  _locale: SupportedLocale = 'fr'
): Partial<ContentMetadata> {
  const now = new Date().toISOString();

  return {
    localeAvail: ['fr'], // English temporarily disabled
    leadForm: CONTENT_CATEGORIES[category].leadFormDefault,
    category,
    publishedAt: now,
    updatedAt: now,
    tags: [],
    readTime: 5
  };
}

/**
 * Validate content metadata
 */
export function validateMetadata(metadata: ContentMetadata): string[] {
  const errors: string[] = [];

  if (!metadata.title?.trim()) {
    errors.push('Title is required');
  }

  if (!metadata.description?.trim()) {
    errors.push('Description is required');
  }

  if (!metadata.slug?.trim()) {
    errors.push('Slug is required');
  }

  if (!metadata.localeAvail?.length) {
    errors.push('At least one locale must be available');
  }

  if (!Object.keys(CONTENT_CATEGORIES).includes(metadata.category)) {
    errors.push('Invalid category');
  }

  return errors;
}