import type { SupportedLocale } from '@/content';
import type { ServiceCategory } from '@/lib/serviceLoader';
import { SITE_URL } from '@/lib/metadata';

interface ServicesJsonLdOptions {
  locale: SupportedLocale;
  services: ServiceCategory[];
  pageUrl?: string;
  sectionId?: string;
}

function resolveAbsoluteUrl(path: string | undefined, locale: SupportedLocale) {
  const base = SITE_URL.replace(/\/$/, '');
  if (!path) {
    return `${base}/${locale}`;
  }

  if (path.startsWith('http')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function buildServiceItem(
  service: ServiceCategory,
  index: number,
  baseUrl: string,
  sectionId?: string,
) {
  const serviceAnchor = sectionId
    ? `${baseUrl}#${sectionId}-${service.id}`
    : `${baseUrl}#${service.id}`;

  const offers =
    service.headlinePrice || service.launchSpecial?.specialHeadline
      ? [
          {
            '@type': 'Offer',
            price: service.launchSpecial?.specialHeadline ?? service.headlinePrice,
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
          },
        ]
      : undefined;

  return {
    '@type': 'ListItem' as const,
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      ...(service.shortDescription || service.description
        ? {
            description: service.shortDescription ?? service.description,
          }
        : {}),
      areaServed: 'Québec, Canada',
      url: serviceAnchor,
      ...(offers ? { offers } : {}),
    },
  };
}

export function buildServicesItemListJsonLd({
  locale,
  services,
  pageUrl,
  sectionId = 'services',
}: ServicesJsonLdOptions): string {
  const absolutePageUrl = resolveAbsoluteUrl(pageUrl, locale).replace(/\/$/, '');

  const itemListElement = services.map((service, index) =>
    buildServiceItem(service, index, absolutePageUrl, sectionId),
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: absolutePageUrl,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return JSON.stringify(schema);
}

