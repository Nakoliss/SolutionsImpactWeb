/**
 * Playwright SEO Verification Script
 *
 * Verifies that SSR/CSR doesn't remove critical SEO head tags.
 * Tests a subset of pages to ensure canonical and hreflang are present in the live DOM.
 *
 * Usage: npx playwright test scripts/verify-seo-playwright.ts
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://solutionsimpactweb.ca';

// Subset of pages to test with Playwright
const TEST_PAGES = [
  { path: '/fr', label: 'Home FR' },
  { path: '/en', label: 'Home EN' },
  { path: '/fr/services', label: 'Services FR' },
  { path: '/en/services', label: 'Services EN' },
  { path: '/fr/contact', label: 'Contact FR' },
  { path: '/en/contact', label: 'Contact EN' },
  { path: '/fr/content/guides', label: 'Guides FR' },
  { path: '/en/content/guides', label: 'Guides EN' },
  { path: '/fr/compliance', label: 'Compliance FR' },
  { path: '/en/compliance', label: 'Compliance EN' },
];

test.describe('SEO Head Tags Verification (SSR/CSR)', () => {
  for (const page of TEST_PAGES) {
    test(`${page.label} - ${page.path}`, async ({ page: browserPage }) => {
      await browserPage.goto(`${BASE_URL}${page.path}`, {
        waitUntil: 'networkidle',
      });

      // Wait for hydration to complete
      await browserPage.waitForTimeout(1000);

      // Check canonical tag exists
      const canonical = await browserPage
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical, 'Canonical tag should exist').toBeTruthy();
      expect(canonical, 'Canonical should be locale-prefixed').toMatch(
        /\/(fr|en)(\/|$)/
      );

      // Check hreflang tags exist
      const hreflangFr = await browserPage
        .locator('link[rel="alternate"][hreflang*="fr"]')
        .count();
      const hreflangEn = await browserPage
        .locator('link[rel="alternate"][hreflang*="en"]')
        .count();

      expect(hreflangFr, 'French hreflang should exist').toBeGreaterThan(0);
      expect(hreflangEn, 'English hreflang should exist').toBeGreaterThan(0);

      // Verify canonical matches the current page path
      const canonicalPath = new URL(canonical!).pathname;
      const expectedPath = page.path;
      expect(canonicalPath, 'Canonical path should match page path').toBe(
        expectedPath
      );

      // Additional check: ensure no duplicate canonical tags
      const canonicalCount = await browserPage
        .locator('link[rel="canonical"]')
        .count();
      expect(canonicalCount, 'Should have exactly one canonical tag').toBe(1);
    });
  }
});

test.describe('Conversion Pages noindex Verification', () => {
  const conversionPages = [
    { path: '/fr/merci', label: 'Merci FR' },
    { path: '/en/thank-you', label: 'Thank You EN' },
    { path: '/fr/commande-reussie', label: 'Commande Réussie FR' },
    { path: '/en/commande-reussie', label: 'Order Success EN' },
  ];

  for (const page of conversionPages) {
    test(`${page.label} - should have noindex`, async ({
      page: browserPage,
    }) => {
      const response = await browserPage.goto(`${BASE_URL}${page.path}`, {
        waitUntil: 'networkidle',
      });

      // Page might 404 if not implemented, skip gracefully
      if (response?.status() === 404) {
        test.skip(true, `Page ${page.path} returns 404, skipping`);
        return;
      }

      // Wait for hydration
      await browserPage.waitForTimeout(1000);

      // Check for noindex in robots meta
      const robotsMeta = await browserPage
        .locator('meta[name="robots"]')
        .getAttribute('content');

      if (robotsMeta) {
        expect(
          robotsMeta.toLowerCase(),
          'Conversion page should have noindex'
        ).toContain('noindex');
      } else {
        // Check for X-Robots-Tag header as fallback
        const headers = response?.headers();
        const xRobotsTag = headers?.['x-robots-tag'];
        expect(
          xRobotsTag?.toLowerCase() || '',
          'Conversion page should have noindex (meta or header)'
        ).toContain('noindex');
      }
    });
  }
});

test.describe('Sitemap and Robots.txt Verification', () => {
  test('sitemap.xml is accessible and contains locale URLs', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(response.status(), 'Sitemap should return 200').toBe(200);

    const content = await response.text();
    expect(content, 'Sitemap should contain French URLs').toMatch(/\/fr\//);
    expect(content, 'Sitemap should contain English URLs').toMatch(/\/en\//);
    expect(content, 'Sitemap should NOT contain /merci').not.toMatch(
      /\/merci[<"']/
    );
    expect(content, 'Sitemap should NOT contain /thank-you').not.toMatch(
      /\/thank-you[<"']/
    );
    expect(content, 'Sitemap should NOT contain /commande-reussie').not.toMatch(
      /\/commande-reussie[<"']/
    );
  });

  test('robots.txt is accessible and references sitemap', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    expect(response.status(), 'Robots.txt should return 200').toBe(200);

    const content = await response.text();
    expect(
      content.toLowerCase(),
      'Robots.txt should reference sitemap'
    ).toContain('sitemap:');
  });
});

test.describe('Duplicate Content Detection', () => {
  test('FR and EN pages have distinct canonicals', async ({ page }) => {
    // Load FR page
    await page.goto(`${BASE_URL}/fr/services`, { waitUntil: 'networkidle' });
    const frCanonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');

    // Load EN page
    await page.goto(`${BASE_URL}/en/services`, { waitUntil: 'networkidle' });
    const enCanonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');

    expect(frCanonical, 'FR canonical should exist').toBeTruthy();
    expect(enCanonical, 'EN canonical should exist').toBeTruthy();
    expect(frCanonical, 'FR and EN should have different canonicals').not.toBe(
      enCanonical
    );
    expect(frCanonical!, 'FR canonical should contain /fr/').toContain('/fr/');
    expect(enCanonical!, 'EN canonical should contain /en/').toContain('/en/');
  });
});
