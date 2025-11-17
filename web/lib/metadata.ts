import type { Metadata } from 'next';

import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { brandConfig, pickBrandLocale } from '@/lib/brand';
import { buildLocaleUrl } from '@/lib/localeRouting';

// In development, use localhost; in production, use canonical domain
const isDev = process.env.NODE_ENV === 'development';
export const SITE_URL = isDev
  ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  : (process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process.env.NEXT_PUBLIC_SITE_URL
        ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^\/+/, '')}`
        : 'https://www.solutionsimpactweb.ca');

interface MetadataOptions {
  title: string | null;
  description: string;
  locale: SupportedLocale;
  canonical?: string;
  alternateLocales?: string[];
  keywords?: string[];
  openGraph?: {
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitterImage?: string;
  openGraphImage?: string;
}

function formatTitle(pageTitle: string | null, locale: SupportedLocale): string {
  if (!pageTitle || !pageTitle.trim()) {
    return pickBrandLocale(locale, brandConfig.meta.defaultTitle);
  }
  const template = pickBrandLocale(locale, brandConfig.meta.titleTemplate);
  return template.replace('%s', pageTitle.trim());
}

function resolveUrl(path: string | undefined, locale: SupportedLocale): string | undefined {
  if (!path) return undefined;
  return buildLocaleUrl(SITE_URL, locale, path);
}

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    locale,
    canonical,
    alternateLocales = SUPPORTED_LOCALES,
    keywords = [],
    openGraph,
    twitterImage,
    openGraphImage,
  } = options;

  const finalTitle = formatTitle(title, locale);
  const canonicalUrl = resolveUrl(canonical, locale);
  const languageAlternates: Record<string, string> = {};

  if (canonical) {
    for (const alt of alternateLocales) {
      if (alt !== locale) {
        const altUrl = resolveUrl(canonical, alt as SupportedLocale);
        if (altUrl) {
          languageAlternates[alt] = altUrl;
        }
      }
    }
  }

  const baseKeywords = pickBrandLocale(locale, brandConfig.keywords);
  const combinedKeywords = Array.from(new Set([...baseKeywords, ...keywords]));

  const ogImages = [
    openGraphImage ?? buildLocaleUrl(SITE_URL, locale, '/opengraph-image'),
  ];
  const twitterImages = twitterImage ? [twitterImage] : ogImages;

  return {
    title: finalTitle,
    description,
    robots: {
      index: true,
      follow: true,
    },
    keywords: combinedKeywords,
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
        languages: {
          ...languageAlternates,
          'x-default': canonicalUrl,
        },
      },
    }),
    openGraph: {
      title: finalTitle,
      description,
      url: canonicalUrl,
      siteName: brandConfig.name,
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: openGraph?.type ?? 'website',
      images: ogImages,
      ...(openGraph?.publishedTime && { publishedTime: openGraph.publishedTime }),
      ...(openGraph?.modifiedTime && { modifiedTime: openGraph.modifiedTime }),
      ...(openGraph?.authors && { authors: openGraph.authors }),
      ...(openGraph?.tags && { tags: openGraph.tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: twitterImages,
    },
  };
}
