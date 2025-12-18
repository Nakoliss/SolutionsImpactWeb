#!/usr/bin/env npx tsx
/**
 * Comprehensive SEO Verification Script
 *
 * Verifies all critical SEO aspects of solutionsimpactweb.ca:
 * - HTTP status and redirect behavior
 * - Canonical tag correctness (locale-prefixed)
 * - hreflang alternates (fr-CA, en-CA)
 * - noindex meta for conversion pages
 * - sitemap.xml and robots.txt availability
 *
 * Usage: npx tsx scripts/verify-seo-comprehensive.ts
 *
 * Output:
 * - Console table with all results
 * - CSV file: scripts/seo-verification-report.csv
 * - Exit code 1 if any failures
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================

const BASE_URL = process.env.BASE_URL || 'https://solutionsimpactweb.ca';

// All static pages to verify
const STATIC_PATHS = [
  '/fr',
  '/en',
  '/fr/services',
  '/en/services',
  '/fr/offres',
  '/en/offres',
  '/fr/assessment',
  '/en/assessment',
  '/fr/ai-roadmap',
  '/en/ai-roadmap',
  '/fr/contact',
  '/en/contact',
  '/fr/compliance',
  '/en/compliance',
  '/fr/compliance/privacy',
  '/en/compliance/privacy',
  '/fr/compliance/cookies',
  '/en/compliance/cookies',
  '/fr/compliance/data-request',
  '/en/compliance/data-request',
  '/fr/compliance/heatmap',
  '/en/compliance/heatmap',
  '/fr/content/guides',
  '/en/content/guides',
  '/fr/content/pricing',
  '/en/content/pricing',
  '/fr/content/compliance',
  '/en/content/compliance',
  '/fr/faq',
  '/en/faq',
  '/fr/lp/loi-25-essentials',
  '/en/lp/loi-25-essentials',
  '/fr/merci',
  '/en/merci',
  '/fr/thank-you',
  '/en/thank-you',
  '/fr/commande-reussie',
  '/en/commande-reussie',
  '/fr/blog/loi-25-erreurs-courantes',
  '/en/blog/loi-25-erreurs-courantes',
  '/fr/blog/aeogeo-visible-chatgpt',
  '/en/blog/aeogeo-visible-chatgpt',
];

// Dynamic MDX pages
const DYNAMIC_MDX_PATHS = [
  '/fr/content/guides/loi-25-analytics-consentement',
  '/en/content/guides/loi-25-analytics-consentement',
  '/fr/content/guides/seo-local-google-business-profile',
  '/en/content/guides/seo-local-google-business-profile',
  '/fr/content/pricing/quebec-ai-services-pricing',
  '/en/content/pricing/quebec-ai-services-pricing',
  '/fr/content/compliance/bill-64-data-residency-guide',
  '/en/content/compliance/bill-64-data-residency-guide',
];

// Pages that should have noindex
const NOINDEX_PATHS = [
  '/fr/merci',
  '/en/merci',
  '/fr/thank-you',
  '/en/thank-you',
  '/fr/commande-reussie',
  '/en/commande-reussie',
];

// Combine all paths
const ALL_PATHS = [...STATIC_PATHS, ...DYNAMIC_MDX_PATHS];

// ============================================================================
// TYPES
// ============================================================================

interface VerificationResult {
  inputUrl: string;
  initialStatus: number | string;
  redirectChain: string;
  finalUrl: string;
  finalStatus: number | string;
  canonical: string;
  canonicalOk: boolean;
  hreflangValues: string;
  hreflangOk: boolean;
  robotsMeta: string;
  noindexOk: boolean;
  errors: string[];
}

interface HreflangEntry {
  hreflang: string;
  href: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Fetch a URL with manual redirect handling to track the redirect chain
 */
async function fetchWithRedirectTracking(url: string): Promise<{
  initialStatus: number;
  redirectChain: string[];
  finalUrl: string;
  finalStatus: number;
  html: string;
}> {
  const redirectChain: string[] = [];
  let currentUrl = url;
  let initialStatus = 0;
  let attempts = 0;
  const maxRedirects = 10;

  while (attempts < maxRedirects) {
    attempts++;

    try {
      const response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'SEO-Verification-Bot/1.0',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (attempts === 1) {
        initialStatus = response.status;
      }

      // Check for redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          // Handle relative redirects
          const nextUrl = location.startsWith('http')
            ? location
            : new URL(location, currentUrl).toString();
          redirectChain.push(`${response.status} -> ${nextUrl}`);
          currentUrl = nextUrl;
          continue;
        }
      }

      // Final response
      const html = await response.text();
      return {
        initialStatus,
        redirectChain,
        finalUrl: currentUrl,
        finalStatus: response.status,
        html,
      };
    } catch (error) {
      return {
        initialStatus: initialStatus || 0,
        redirectChain,
        finalUrl: currentUrl,
        finalStatus: 0,
        html: '',
      };
    }
  }

  return {
    initialStatus,
    redirectChain,
    finalUrl: currentUrl,
    finalStatus: 0,
    html: '',
  };
}

/**
 * Extract canonical URL from HTML
 */
function extractCanonical(html: string): string {
  const match =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? match[1] : '';
}

/**
 * Extract hreflang entries from HTML
 */
function extractHreflang(html: string): HreflangEntry[] {
  const results: HreflangEntry[] = [];
  const regex =
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi;
  const regex2 =
    /<link[^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*rel=["']alternate["']/gi;
  const regex3 =
    /<link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']([^"']+)["'][^>]*rel=["']alternate["']/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    results.push({ hreflang: match[1], href: match[2] });
  }

  while ((match = regex2.exec(html)) !== null) {
    results.push({ hreflang: match[1], href: match[2] });
  }

  while ((match = regex3.exec(html)) !== null) {
    results.push({ hreflang: match[2], href: match[1] });
  }

  // Dedupe
  const seen = new Set<string>();
  return results.filter((entry) => {
    const key = `${entry.hreflang}:${entry.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Extract robots meta content from HTML
 */
function extractRobotsMeta(html: string): string {
  const match =
    html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);
  return match ? match[1] : '';
}

/**
 * Get the path from a URL
 */
function getPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/**
 * Check if a path is locale-prefixed
 */
function isLocalePrefixed(urlPath: string): boolean {
  return /^\/(fr|en)(\/|$)/.test(urlPath);
}

/**
 * Get expected locale from path
 */
function getLocaleFromPath(urlPath: string): string {
  const match = urlPath.match(/^\/(fr|en)/);
  return match ? match[1] : '';
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

async function verifyUrl(inputPath: string): Promise<VerificationResult> {
  const url = `${BASE_URL}${inputPath}`;
  const errors: string[] = [];
  const isNoindexExpected = NOINDEX_PATHS.includes(inputPath);
  const expectedLocale = getLocaleFromPath(inputPath);

  try {
    const { initialStatus, redirectChain, finalUrl, finalStatus, html } =
      await fetchWithRedirectTracking(url);

    // Extract SEO elements
    const canonical = extractCanonical(html);
    const hreflangEntries = extractHreflang(html);
    const robotsMeta = extractRobotsMeta(html);

    // Validation: Final status must be 200
    if (finalStatus !== 200) {
      errors.push(`Final status ${finalStatus} != 200`);
    }

    // Validation: Canonical must be locale-prefixed and match final URL path
    const canonicalPath = getPathFromUrl(canonical);
    const finalPath = getPathFromUrl(finalUrl);
    let canonicalOk = true;

    if (!canonical) {
      canonicalOk = false;
      errors.push('Missing canonical tag');
    } else if (!isLocalePrefixed(canonicalPath)) {
      canonicalOk = false;
      errors.push(`Canonical not locale-prefixed: ${canonical}`);
    } else if (canonicalPath !== finalPath) {
      canonicalOk = false;
      errors.push(`Canonical path mismatch: ${canonicalPath} != ${finalPath}`);
    }

    // Validation: hreflang must include current locale and alternate
    const hreflangLangs = hreflangEntries.map((e) => e.hreflang.toLowerCase());
    let hreflangOk = true;

    // Check for fr-CA or fr, and en-CA or en
    const hasFr = hreflangLangs.some((h) => h.startsWith('fr'));
    const hasEn = hreflangLangs.some((h) => h.startsWith('en'));

    if (!hasFr) {
      hreflangOk = false;
      errors.push('Missing French hreflang (fr or fr-CA)');
    }
    if (!hasEn) {
      hreflangOk = false;
      errors.push('Missing English hreflang (en or en-CA)');
    }

    // Format hreflang values for display
    const hreflangValues = hreflangEntries
      .map((e) => `${e.hreflang}:${getPathFromUrl(e.href)}`)
      .join(' | ');

    // Validation: noindex for conversion pages
    let noindexOk = true;
    const hasNoindex = robotsMeta.toLowerCase().includes('noindex');

    if (isNoindexExpected && !hasNoindex) {
      noindexOk = false;
      errors.push('Conversion page missing noindex');
    } else if (!isNoindexExpected && hasNoindex) {
      // Not a failure, just a note - some pages might legitimately be noindex
    }

    return {
      inputUrl: url,
      initialStatus,
      redirectChain: redirectChain.join(' | ') || 'none',
      finalUrl,
      finalStatus,
      canonical,
      canonicalOk,
      hreflangValues: hreflangValues || 'none',
      hreflangOk,
      robotsMeta: robotsMeta || 'none',
      noindexOk,
      errors,
    };
  } catch (error) {
    return {
      inputUrl: url,
      initialStatus: 'ERROR',
      redirectChain: '',
      finalUrl: url,
      finalStatus: 'ERROR',
      canonical: '',
      canonicalOk: false,
      hreflangValues: '',
      hreflangOk: false,
      robotsMeta: '',
      noindexOk: !isNoindexExpected,
      errors: [
        `Fetch error: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

async function verifySitemap(): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    if (response.status !== 200) {
      return { ok: false, message: `Status ${response.status}` };
    }

    const content = await response.text();

    // Check for locale URLs
    const hasFrUrls =
      content.includes('/fr/') ||
      content.includes('/fr"') ||
      content.includes("/fr'");
    const hasEnUrls =
      content.includes('/en/') ||
      content.includes('/en"') ||
      content.includes("/en'");

    if (!hasFrUrls && !hasEnUrls) {
      return { ok: false, message: 'Sitemap missing locale-prefixed URLs' };
    }

    // Check for conversion pages that should NOT be in sitemap
    const hasConversionPages =
      content.includes('/merci') ||
      content.includes('/thank-you') ||
      content.includes('/commande-reussie');

    if (hasConversionPages) {
      return {
        ok: false,
        message: 'Sitemap contains conversion pages (should be excluded)',
      };
    }

    return {
      ok: true,
      message: 'OK - Contains locale URLs, excludes conversion pages',
    };
  } catch (error) {
    return {
      ok: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function verifyRobotsTxt(): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    if (response.status !== 200) {
      return { ok: false, message: `Status ${response.status}` };
    }

    const content = await response.text();

    // Check for sitemap reference
    const hasSitemapRef = content.toLowerCase().includes('sitemap:');

    if (!hasSitemapRef) {
      return { ok: false, message: 'Missing Sitemap: directive' };
    }

    return { ok: true, message: 'OK - References sitemap' };
  } catch (error) {
    return {
      ok: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// DUPLICATE CANONICAL DETECTION
// ============================================================================

function detectDuplicateCanonicals(
  results: VerificationResult[]
): Map<string, string[]> {
  const canonicalToUrls = new Map<string, string[]>();

  for (const result of results) {
    if (result.canonical) {
      const existing = canonicalToUrls.get(result.canonical) || [];
      existing.push(result.inputUrl);
      canonicalToUrls.set(result.canonical, existing);
    }
  }

  // Filter to only duplicates
  const duplicates = new Map<string, string[]>();
  for (const [canonical, urls] of canonicalToUrls) {
    if (urls.length > 1) {
      duplicates.set(canonical, urls);
    }
  }

  return duplicates;
}

// ============================================================================
// OUTPUT FUNCTIONS
// ============================================================================

function generateCsv(results: VerificationResult[], outputPath: string): void {
  const headers = [
    'input_url',
    'initial_status',
    'redirect_chain',
    'final_url',
    'final_status',
    'canonical',
    'canonical_ok',
    'hreflang_values',
    'hreflang_ok',
    'robots_meta',
    'noindex_ok',
    'errors',
  ];

  const rows = results.map((r) => [
    r.inputUrl,
    String(r.initialStatus),
    r.redirectChain,
    r.finalUrl,
    String(r.finalStatus),
    r.canonical,
    r.canonicalOk ? 'PASS' : 'FAIL',
    r.hreflangValues,
    r.hreflangOk ? 'PASS' : 'FAIL',
    r.robotsMeta,
    r.noindexOk ? 'PASS' : 'FAIL',
    r.errors.join('; '),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  fs.writeFileSync(outputPath, csvContent, 'utf-8');
}

function printConsoleTable(results: VerificationResult[]): void {
  console.log('\n' + '='.repeat(120));
  console.log('SEO VERIFICATION RESULTS');
  console.log('='.repeat(120));

  // Print summary per URL
  for (const r of results) {
    const path = getPathFromUrl(r.inputUrl);
    const status = r.finalStatus === 200 ? '✅' : '❌';
    const canonical = r.canonicalOk ? '✅' : '❌';
    const hreflang = r.hreflangOk ? '✅' : '❌';
    const noindex = r.noindexOk ? '✅' : '❌';

    console.log(`\n${status} ${path}`);
    console.log(
      `   Status: ${r.initialStatus} -> ${r.finalStatus} | Canonical: ${canonical} | Hreflang: ${hreflang} | Noindex: ${noindex}`
    );

    if (r.redirectChain && r.redirectChain !== 'none') {
      console.log(`   Redirects: ${r.redirectChain}`);
    }

    if (r.errors.length > 0) {
      console.log(`   ⚠️  Errors: ${r.errors.join(', ')}`);
    }
  }
}

function printSummary(
  results: VerificationResult[],
  sitemapResult: { ok: boolean; message: string },
  robotsResult: { ok: boolean; message: string },
  duplicates: Map<string, string[]>
): number {
  const passed = results.filter(
    (r) => r.finalStatus === 200 && r.canonicalOk && r.hreflangOk && r.noindexOk
  ).length;

  const failed = results.length - passed;

  console.log('\n' + '='.repeat(120));
  console.log('SUMMARY');
  console.log('='.repeat(120));

  console.log(`\n📊 Page Results:`);
  console.log(`   ✅ Passed: ${passed}/${results.length}`);
  console.log(`   ❌ Failed: ${failed}/${results.length}`);

  console.log(
    `\n📄 Sitemap: ${sitemapResult.ok ? '✅' : '❌'} ${sitemapResult.message}`
  );
  console.log(
    `📄 Robots.txt: ${robotsResult.ok ? '✅' : '❌'} ${robotsResult.message}`
  );

  if (duplicates.size > 0) {
    console.log(`\n⚠️  Duplicate Canonicals Detected:`);
    for (const [canonical, urls] of duplicates) {
      console.log(`   ${canonical}:`);
      for (const url of urls) {
        console.log(`     - ${url}`);
      }
    }
  } else {
    console.log(`\n✅ No duplicate canonicals detected`);
  }

  const totalFailures =
    failed + (sitemapResult.ok ? 0 : 1) + (robotsResult.ok ? 0 : 1);

  if (totalFailures === 0) {
    console.log('\n🎉 All SEO checks passed!\n');
    return 0;
  } else {
    console.log(
      `\n⛔ ${totalFailures} issue(s) found. Review the results above.\n`
    );
    return 1;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log('\n🔍 SEO Comprehensive Verification Script');
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   URLs to check: ${ALL_PATHS.length}`);
  console.log('   ' + '-'.repeat(50));

  // Verify all URLs
  console.log('\n📡 Fetching and verifying URLs...\n');
  const results: VerificationResult[] = [];

  for (let i = 0; i < ALL_PATHS.length; i++) {
    const path = ALL_PATHS[i];
    process.stdout.write(`   [${i + 1}/${ALL_PATHS.length}] ${path}...`);

    const result = await verifyUrl(path);
    results.push(result);

    const status = result.errors.length === 0 ? '✅' : '❌';
    console.log(` ${status}`);

    // Small delay to be nice to the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Verify sitemap and robots
  console.log('\n📄 Checking sitemap.xml...');
  const sitemapResult = await verifySitemap();
  console.log(`   ${sitemapResult.ok ? '✅' : '❌'} ${sitemapResult.message}`);

  console.log('\n📄 Checking robots.txt...');
  const robotsResult = await verifyRobotsTxt();
  console.log(`   ${robotsResult.ok ? '✅' : '❌'} ${robotsResult.message}`);

  // Detect duplicate canonicals
  const duplicates = detectDuplicateCanonicals(results);

  // Generate outputs
  const csvPath = path.join(__dirname, 'seo-verification-report.csv');
  generateCsv(results, csvPath);
  console.log(`\n📊 CSV report saved to: ${csvPath}`);

  // Print console table
  printConsoleTable(results);

  // Print summary and exit
  const exitCode = printSummary(
    results,
    sitemapResult,
    robotsResult,
    duplicates
  );
  process.exit(exitCode);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
