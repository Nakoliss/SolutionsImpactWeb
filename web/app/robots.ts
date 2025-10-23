import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/metadata';

function getBaseUrl(): string {
  return SITE_URL.replace(/\/$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/data/',
          '/_next/static/',
          '/preview/',
          '/draft/',
          '/server-actions/',
          '/en/',
        ],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };
}
