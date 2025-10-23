import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { createConsent } from '@/lib/consent';
import * as mdxModule from '@/lib/mdx';
import { buildServices, generatePageStructuredData } from '@/lib/seo/structuredData';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/CookieConsentBanner', () => ({
  CookiePreferencesButton: ({ locale, className }: { locale: string; className?: string }) => (
    <button type="button" data-locale={locale} className={className}>
      preferences
    </button>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Structured data helpers', () => {
  it('includes organization, local business, and service schemas', () => {
    const services = buildServices('en');
    const jsonLd = generatePageStructuredData({
      locale: 'en',
      organization: true,
      localBusiness: true,
      services,
    });

    const parsed = jsonLd.map((entry) => JSON.parse(entry));

    expect(parsed.some((schema) => schema['@type'] === 'Organization')).toBe(true);
    expect(parsed.some((schema) => schema['@type'] === 'LocalBusiness')).toBe(true);
    expect(parsed.filter((schema) => schema['@type'] === 'Service')).toHaveLength(services.length);
  });
});

describe('Consent helpers', () => {
  it('creates consent state with essential category enforced', () => {
    const consent = createConsent({ analytics: true, marketing: false, preferences: false });

    expect(consent.essential).toBe(true);
    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(consent.preferences).toBe(false);
    expect(new Date(consent.updatedAt).getTime()).not.toBeNaN();
  });
});

describe('robots metadata route', () => {
  it('references the canonical site host and sitemap', () => {
    const config = robots();

    expect(config.host).toBe('https://webimpactsolutions.ca');
    expect(config.sitemap).toEqual(['https://webimpactsolutions.ca/sitemap.xml']);
    expect(config.rules[0]?.disallow).toContain('/api/');
  });
});

describe('sitemap metadata route', () => {
  it('includes compliance routes and content for available locales', () => {
    const mockContent = [
      {
        metadata: {
          slug: 'law-25-guide',
          localeAvail: ['fr', 'en'],
          updatedAt: '2025-09-24T00:00:00.000Z',
          publishedAt: '2025-09-01T00:00:00.000Z',
        },
        content: '',
        slug: 'law-25-guide',
      },
    ];

    vi.spyOn(mdxModule, 'getCategoryContent').mockImplementation((category) => {
      return category === 'guides' ? mockContent : [];
    });

    const entries = sitemap();

    const frPrivacy = entries.filter((entry) => entry.url.endsWith('/fr/compliance/privacy'));
    const enPrivacy = entries.filter((entry) => entry.url.endsWith('/en/compliance/privacy'));
    const frGuide = entries.some((entry) => entry.url.endsWith('/fr/content/guides/law-25-guide'));
    const enGuide = entries.some((entry) => entry.url.endsWith('/en/content/guides/law-25-guide'));

    expect(frPrivacy).toHaveLength(1);
    expect(enPrivacy).toHaveLength(1);
    expect(frGuide).toBe(true);
    expect(enGuide).toBe(true);
  });
});

describe('LegalFooter component', () => {
  it('renders localized legal navigation and compliance badges', async () => {
    const { default: LegalFooter } = await import('@/components/LegalFooter');

    render(<LegalFooter locale="fr" />);

    expect(screen.getByText('Web Impact Solutions')).toBeInTheDocument();
    expect(screen.getByText('Loi 25')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Politique des cookies' })).toHaveAttribute(
      'href',
      '/fr/compliance/cookies',
    );
    expect(screen.getByRole('button', { name: /preferences/i })).toHaveAttribute('data-locale', 'fr');

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(`${currentYear} Web Impact Solutions Inc. Tous droits reserves.`),
    ).toBeInTheDocument();
  });
});
