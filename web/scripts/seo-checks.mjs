#!/usr/bin/env node

/**
 * SEO CI Checks Script
 * Runs during CI to ensure critical SEO requirements are met:
 * 1. sitemap.ts and robots.ts exist
 * 2. Non-locale routes are properly configured for 301 redirects (static analysis)
 * 3. Conversion pages have noindex: true
 * 
 * Exit code 0 = all checks pass
 * Exit code 1 = one or more checks failed
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(__dirname, '..');
const appDir = path.join(webDir, 'app');

let passed = 0;
let failed = 0;

function logPass(message) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
}

function logFail(message) {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
}

function logWarn(message) {
    console.warn(`  ⚠️  WARN: ${message}`);
}

function logSection(title) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${title}`);
    console.log('='.repeat(60));
}

// -----------------------------------------------------------------------------
// CHECK 1: Sitemap and Robots files exist
// -----------------------------------------------------------------------------
function checkSitemapRobotsExist() {
    logSection('CHECK 1: Sitemap & Robots Files');

    const sitemapPath = path.join(appDir, 'sitemap.ts');
    const robotsPath = path.join(appDir, 'robots.ts');

    if (fs.existsSync(sitemapPath)) {
        logPass('sitemap.ts exists');
    } else {
        logFail('sitemap.ts is MISSING - Site cannot be indexed properly');
    }

    if (fs.existsSync(robotsPath)) {
        logPass('robots.ts exists');
    } else {
        logFail('robots.ts is MISSING - Crawlers may not behave as expected');
    }
}

// -----------------------------------------------------------------------------
// CHECK 2: Non-locale routes middleware configuration
// Verifies that middleware.ts handles redirects for locale-less routes
// -----------------------------------------------------------------------------
function checkNonLocaleRedirects() {
    logSection('CHECK 2: Non-Locale Route Redirect Configuration');

    const middlewarePath = path.join(webDir, 'middleware.ts');

    if (!fs.existsSync(middlewarePath)) {
        logFail('middleware.ts not found - Cannot verify redirect configuration');
        return;
    }

    const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');

    // Check for Next-intl or custom locale redirect logic
    const hasLocaleRedirect =
        middlewareContent.includes('createMiddleware') ||
        middlewareContent.includes('NextResponse.redirect') ||
        middlewareContent.includes('localePrefix');

    if (hasLocaleRedirect) {
        logPass('middleware.ts contains locale redirect logic');
    } else {
        logFail('middleware.ts may not properly redirect non-locale URLs to locale-prefixed URLs');
    }

    // Check for permanent redirect (301) configuration
    const hasPermanentRedirect =
        middlewareContent.includes('permanent: true') ||
        middlewareContent.includes("localePrefix: 'always'") ||
        middlewareContent.includes('localePrefix: "always"');

    if (hasPermanentRedirect) {
        logPass('middleware configured for permanent (301) redirects');
    } else {
        logWarn("Could not confirm 301 redirect configuration - verify 'localePrefix: always' is set");
    }
}

// -----------------------------------------------------------------------------
// CHECK 3: Conversion pages have noindex
// -----------------------------------------------------------------------------
function checkConversionPagesNoindex() {
    logSection('CHECK 3: Conversion Pages noindex Configuration');

    // These are pages that should NOT be indexed
    const conversionPages = [
        { name: 'merci', path: path.join(appDir, '[locale]', 'merci', 'page.tsx') },
        { name: 'thank-you', path: path.join(appDir, '[locale]', 'thank-you', 'page.tsx') },
        { name: 'commande-reussie', path: path.join(appDir, '[locale]', 'commande-reussie', 'page.tsx') },
    ];

    for (const page of conversionPages) {
        if (!fs.existsSync(page.path)) {
            logWarn(`${page.name} page does not exist at ${page.path}`);
            continue;
        }

        const content = fs.readFileSync(page.path, 'utf-8');

        // Check for noindex configuration
        const hasNoindex = content.includes('noindex: true') || content.includes('noindex:true');

        if (hasNoindex) {
            logPass(`${page.name} page has noindex: true`);
        } else {
            logFail(`${page.name} page is MISSING noindex: true - This conversion page may be indexed!`);
        }
    }
}

// -----------------------------------------------------------------------------
// CHECK 4: Sitemap excludes conversion pages
// -----------------------------------------------------------------------------
function checkSitemapExcludesConversionPages() {
    logSection('CHECK 4: Sitemap Excludes Conversion Pages');

    const sitemapPath = path.join(appDir, 'sitemap.ts');

    if (!fs.existsSync(sitemapPath)) {
        logFail('Cannot check sitemap - file does not exist');
        return;
    }

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const conversionSlugs = ['merci', 'thank-you', 'commande-reussie'];

    let hasConversionPages = false;
    for (const slug of conversionSlugs) {
        // Check if the slug appears in pathByLocale configuration
        const slugRegex = new RegExp(`['"\`]${slug}['"\`]\\s*[,})]`, 'i');
        if (slugRegex.test(content)) {
            logFail(`Sitemap includes conversion page: ${slug}`);
            hasConversionPages = true;
        }
    }

    if (!hasConversionPages) {
        logPass('Sitemap correctly excludes all conversion pages');
    }
}

// -----------------------------------------------------------------------------
// CHECK 5: No x-default in hreflang (since no neutral landing page)
// -----------------------------------------------------------------------------
function checkNoXDefaultHreflang() {
    logSection('CHECK 5: No x-default hreflang (no neutral landing page)');

    const hrefLangPath = path.join(webDir, 'components', 'HrefLangLinks.tsx');

    if (!fs.existsSync(hrefLangPath)) {
        logWarn('HrefLangLinks.tsx not found - hreflang may be handled elsewhere');
        return;
    }

    const content = fs.readFileSync(hrefLangPath, 'utf-8');

    // Look for actual x-default hreflang JSX attribute (not in comments)
    // Pattern: hrefLang="x-default" or hreflang="x-default" or hrefLang='x-default'
    const xDefaultPatterns = [
        /hrefLang\s*=\s*["']x-default["']/i,
        /hreflang\s*=\s*["']x-default["']/i,
        /hrefLang\s*=\s*\{["']x-default["']\}/i,
    ];

    let hasActiveXDefault = false;
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip pure comment lines
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            continue;
        }

        // For lines with code, remove inline comments before checking
        const codeOnly = line.split('//')[0];

        for (const pattern of xDefaultPatterns) {
            if (pattern.test(codeOnly)) {
                hasActiveXDefault = true;
                break;
            }
        }

        if (hasActiveXDefault) break;
    }

    if (hasActiveXDefault) {
        logFail('HrefLangLinks.tsx contains active x-default hreflang - Remove it since no neutral page exists');
    } else {
        logPass('No active x-default hreflang found (correct for bilingual site without neutral landing)');
    }
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
console.log('\n🔍 SEO CI Checks for SolutionsImpactWeb');
console.log(`   Running from: ${webDir}`);

checkSitemapRobotsExist();
checkNonLocaleRedirects();
checkConversionPagesNoindex();
checkSitemapExcludesConversionPages();
checkNoXDefaultHreflang();

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`\n  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);

if (failed > 0) {
    console.log('\n⛔ SEO checks FAILED - Please fix the issues above before merging.\n');
    process.exit(1);
} else {
    console.log('\n✨ All SEO checks passed!\n');
    process.exit(0);
}
