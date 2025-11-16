import type { MetadataRoute } from 'next';

import { CONTENT_CATEGORIES, type ContentCategory, SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocaleUrl } from '@/lib/localeRouting';
import { getCategoryContent } from '@/lib/mdx';
import { SITE_URL } from '@/lib/metadata';

interface StaticRouteConfig {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: NonNullable<MetadataRoute.Sitemap[number]['priority']>;
  lastModified?: Date;
}

const STATIC_ROUTES: StaticRouteConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: 'services', priority: 0.85, changeFrequency: 'weekly' },
  { path: 'pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'assessment', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'ai-roadmap', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'compliance', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'compliance/privacy', priority: 0.6, changeFrequency: 'yearly', lastModified: new Date('2025-09-24') },
  { path: 'compliance/cookies', priority: 0.6, changeFrequency: 'yearly' },
  { path: 'compliance/data-request', priority: 0.5, changeFrequency: 'yearly' },
  { path: 'compliance/heatmap', priority: 0.5, changeFrequency: 'monthly' },
  { path: 'content/guides', priority: 0.7, changeFrequency: 'weekly' },
  { path: 'content/pricing', priority: 0.65, changeFrequency: 'weekly' },
  { path: 'content/compliance', priority: 0.7, changeFrequency: 'weekly' },
];

function getBaseUrl(): string {
  return SITE_URL.replace(/\/$/, '');
}

function resolveStaticRoutes(locale: SupportedLocale, baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => {
    const localizedPath = route.path ? `/${route.path}` : '/';
    const url = buildLocaleUrl(baseUrl, locale, localizedPath);
    return {
      url,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
      lastModified: route.lastModified ?? now,
    };
  });
}

function resolveContentRoutes(baseUrl: string): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  const categories = Object.keys(CONTENT_CATEGORIES) as ContentCategory[];

  for (const category of categories) {
    let contentItems = [] as ReturnType<typeof getCategoryContent>;
    try {
      contentItems = getCategoryContent(category);
    } catch (error) {
      console.error(`Failed to load content for category '${category}' in sitemap`, error);
      continue;
    }

    for (const item of contentItems) {
      const availableLocales = (item.metadata.localeAvail ?? SUPPORTED_LOCALES) as SupportedLocale[];
      const updatedAt = new Date(item.metadata.updatedAt ?? item.metadata.publishedAt ?? Date.now());
      const validDate = Number.isNaN(updatedAt.getTime()) ? new Date() : updatedAt;

      for (const locale of availableLocales) {
        const url = buildLocaleUrl(baseUrl, locale, `/content/${category}/${item.metadata.slug}`);
        routes.push({
          url,
          priority: 0.7,
          changeFrequency: 'monthly',
          lastModified: validDate,
        });
      }
    }
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const locales = SUPPORTED_LOCALES;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    sitemapEntries.push(...resolveStaticRoutes(locale, baseUrl));
  }

  sitemapEntries.push(...resolveContentRoutes(baseUrl));

  return sitemapEntries;
}
