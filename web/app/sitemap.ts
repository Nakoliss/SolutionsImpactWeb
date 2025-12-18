import type { MetadataRoute } from 'next';

import {
  CONTENT_CATEGORIES,
  type ContentCategory,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/content';
import { buildLocaleUrl } from '@/lib/localeRouting';
import { getCategoryContent } from '@/lib/mdx';
import { SITE_URL } from '@/lib/metadata';

type LocalePaths = Partial<Record<SupportedLocale, string>>;

interface StaticRouteConfig {
  pathByLocale: LocalePaths;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]['changeFrequency']
  >;
  priority: NonNullable<MetadataRoute.Sitemap[number]['priority']>;
  lastModified?: Date;
}

const STATIC_ROUTES: StaticRouteConfig[] = [
  {
    pathByLocale: { fr: '', en: '' },
    priority: 1.0,
    changeFrequency: 'weekly',
  },

  {
    pathByLocale: { fr: 'services', en: 'services' },
    priority: 0.85,
    changeFrequency: 'weekly',
  },

  // Only include 'offres' for French, as there is no English equivalent page yet
  {
    pathByLocale: { fr: 'offres' },
    priority: 0.85,
    changeFrequency: 'weekly',
  },

  {
    pathByLocale: { fr: 'assessment', en: 'assessment' },
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    pathByLocale: { fr: 'ai-roadmap', en: 'ai-roadmap' },
    priority: 0.6,
    changeFrequency: 'monthly',
  },
  {
    pathByLocale: { fr: 'contact', en: 'contact' },
    priority: 0.7,
    changeFrequency: 'weekly',
  },

  {
    pathByLocale: { fr: 'compliance', en: 'compliance' },
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    pathByLocale: { fr: 'compliance/privacy', en: 'compliance/privacy' },
    priority: 0.6,
    changeFrequency: 'yearly',
    lastModified: new Date('2025-09-24'),
  },
  {
    pathByLocale: { fr: 'compliance/cookies', en: 'compliance/cookies' },
    priority: 0.6,
    changeFrequency: 'yearly',
  },
  {
    pathByLocale: {
      fr: 'compliance/data-request',
      en: 'compliance/data-request',
    },
    priority: 0.5,
    changeFrequency: 'yearly',
  },
  {
    pathByLocale: { fr: 'compliance/heatmap', en: 'compliance/heatmap' },
    priority: 0.5,
    changeFrequency: 'monthly',
  },

  {
    pathByLocale: { fr: 'content/guides', en: 'content/guides' },
    priority: 0.7,
    changeFrequency: 'weekly',
  },
  {
    pathByLocale: { fr: 'content/pricing', en: 'content/pricing' },
    priority: 0.65,
    changeFrequency: 'weekly',
  },
  {
    pathByLocale: { fr: 'content/compliance', en: 'content/compliance' },
    priority: 0.7,
    changeFrequency: 'weekly',
  },

  {
    pathByLocale: { fr: 'faq', en: 'faq' },
    priority: 0.75,
    changeFrequency: 'monthly',
  },

  {
    pathByLocale: { fr: 'lp/loi-25-essentials', en: 'lp/loi-25-essentials' },
    priority: 0.8,
    changeFrequency: 'monthly',
  },

  {
    pathByLocale: {
      fr: 'blog/loi-25-erreurs-courantes',
      en: 'blog/loi-25-erreurs-courantes',
    },
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    pathByLocale: {
      fr: 'blog/aeogeo-visible-chatgpt',
      en: 'blog/aeogeo-visible-chatgpt',
    },
    priority: 0.7,
    changeFrequency: 'monthly',
  },
];

function getBaseUrl(): string {
  return SITE_URL.replace(/\/$/, '');
}

function resolveStaticRoutes(
  locale: SupportedLocale,
  baseUrl: string
): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap((route) => {
    const path = route.pathByLocale[locale];

    // If path is explicitly undefined for this locale, do not generate a route
    if (path === undefined) return [];

    const localizedPath = path ? `/${path}` : '/';
    const url = buildLocaleUrl(baseUrl, locale, localizedPath);

    const entry: MetadataRoute.Sitemap[number] = {
      url,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
    };

    if (route.lastModified) entry.lastModified = route.lastModified;

    return [entry];
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
      console.error(
        `Failed to load content for category '${category}' in sitemap`,
        error
      );
      continue;
    }

    for (const item of contentItems) {
      const availableLocales = (item.metadata.localeAvail ??
        SUPPORTED_LOCALES) as SupportedLocale[];
      const updatedAt = new Date(
        item.metadata.updatedAt ?? item.metadata.publishedAt ?? Date.now()
      );
      const validDate = Number.isNaN(updatedAt.getTime())
        ? new Date()
        : updatedAt;

      for (const locale of availableLocales) {
        const url = buildLocaleUrl(
          baseUrl,
          locale,
          `/content/${category}/${item.metadata.slug}`
        );
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
