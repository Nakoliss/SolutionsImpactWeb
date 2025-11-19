import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import type { ContentCategory, ContentMetadata, SupportedLocale } from '@/content';

export interface MDXContent {
  metadata: ContentMetadata;
  content: string;
  slug: string;
}

/**
 * Get the content directory path
 */
function getContentPath(category: ContentCategory): string {
  return path.join(process.cwd(), 'content', category);
}

/**
 * Get all MDX files for a category
 */
export function getMDXFiles(category: ContentCategory): string[] {
  const contentPath = getContentPath(category);

  if (!fs.existsSync(contentPath)) {
    return [];
  }

  return fs.readdirSync(contentPath)
    .filter(file => file.endsWith('.mdx'))
    .sort();
}

/**
 * Parse MDX file and extract metadata + content
 */
export function parseMDXFile(
  category: ContentCategory,
  filename: string
): MDXContent | null {
  try {
    const filePath = path.join(getContentPath(category), filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Extract slug from filename (remove .locale.mdx)
    const slug = filename.replace(/\.(fr|en)\.mdx$/, '');

    // Validate required metadata
    if (!data.title || !data.description) {
      console.warn(`Missing required metadata in ${filename}`);
      return null;
    }

    const metadata: ContentMetadata = {
      title: data.title,
      description: data.description,
      slug: data.slug || slug,
      localeAvail: data.localeAvail || ['fr'], // English temporarily disabled
      leadForm: data.leadForm ?? true,
      category,
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      tags: data.tags || [],
      author: data.author,
      readTime: data.readTime || estimateReadTime(content)
    };

    return {
      metadata,
      content,
      slug
    };
  } catch (error) {
    console.error(`Error parsing MDX file ${filename}:`, error);
    return null;
  }
}

/**
 * Get all content for a specific category
 */
export function getCategoryContent(category: ContentCategory, locale?: SupportedLocale): MDXContent[] {
  const files = getMDXFiles(category);
  const content: MDXContent[] = [];
  const processedSlugs = new Set<string>();

  for (const file of files) {
    // Extract locale from filename
    const localeMatch = file.match(/\.(fr|en)\.mdx$/);
    const fileLocale = localeMatch ? (localeMatch[1] as SupportedLocale) : 'fr';
    
    // If a specific locale is requested, only process files for that locale
    if (locale && fileLocale !== locale) {
      continue;
    }
    
    // Extract slug to avoid processing both translations
    const slug = file.replace(/\.(fr|en)\.mdx$/, '');
    if (!locale && processedSlugs.has(slug)) {
      // Skip if we already processed this slug (prefer first file found)
      continue;
    }
    processedSlugs.add(slug);
    
    const parsed = parseMDXFile(category, file);
    if (parsed) {
      content.push(parsed);
    }
  }

  return content;
}

/**
 * Get content by slug and locale
 */
export function getContentBySlug(
  category: ContentCategory,
  slug: string,
  locale: SupportedLocale = 'fr'
): MDXContent | null {
  const filename = `${slug}.${locale}.mdx`;
  return parseMDXFile(category, filename);
}

/**
 * Get all content slugs for a category
 */
export function getContentSlugs(category: ContentCategory): string[] {
  const files = getMDXFiles(category);
  const slugs = new Set<string>();

  for (const file of files) {
    const slug = file.replace(/\.(fr|en)\.mdx$/, '');
    slugs.add(slug);
  }

  return Array.from(slugs).sort();
}

/**
 * Check if content exists for a slug and locale
 */
export function contentExists(
  category: ContentCategory,
  slug: string,
  locale: SupportedLocale
): boolean {
  const filename = `${slug}.${locale}.mdx`;
  const filePath = path.join(getContentPath(category), filename);
  return fs.existsSync(filePath);
}

/**
 * Simple read time estimation (words per minute)
 */
function estimateReadTime(content: string, wpm: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

/**
 * Get content statistics
 */
export function getContentStats() {
  const categories = ['guides', 'pricing', 'compliance'] as const;
  const stats = {
    total: 0,
    byCategory: {} as Record<ContentCategory, number>,
    byLocale: { fr: 0, en: 0 } as Record<SupportedLocale, number>
  };

  for (const category of categories) {
    const files = getMDXFiles(category);
    stats.byCategory[category] = files.length;
    stats.total += files.length;

    for (const file of files) {
      if (file.includes('.fr.')) stats.byLocale.fr++;
      if (file.includes('.en.')) stats.byLocale.en++;
    }
  }

  return stats;
}