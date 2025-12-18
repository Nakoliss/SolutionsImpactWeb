# Google Search Console Setup - Complete Guide

## solutionsimpactweb.ca

---

## PART A: CODE CHANGES SUMMARY

### ✅ Changes Completed

#### 1. **Metadata Generation (`lib/metadata.ts`)**

- ✅ Removed `x-default` hreflang (no neutral landing page exists)
- ✅ Made `canonical` required for all indexable pages
- ✅ Added runtime validation: throws error if canonical is missing on indexable pages
- ✅ Fixed duplicate spread operator in `languages` object
- ✅ Robots meta correctly set: `noindex,follow` for conversion pages, `index,follow` for others

#### 2. **Page Metadata Fixes**

- ✅ **Services page** (`/services/page.tsx`): Fixed double locale prefix in canonical
- ✅ **Contact page** (`/contact/page.tsx`): Fixed double locale prefix + added hreflang
- ✅ **Assessment page** (`/assessment/page.tsx`): Added missing canonical parameter
- ✅ **Conversion pages** (`/merci`, `/thank-you`, `/commande-reussie`): All have `noindex: true`

#### 3. **Sitemap (`app/sitemap.ts`)**

- ✅ Only includes locale-prefixed URLs (`/fr/*`, `/en/*`)
- ✅ Excludes conversion pages (merci, thank-you, commande-reussie)
- ✅ Uses `pathByLocale` for proper locale-aware routing
- ✅ Static routes only include `lastModified` when explicitly provided

#### 4. **Robots.txt (`app/robots.ts`)**

- ✅ Publicly accessible at `/robots.txt`
- ✅ Includes sitemap reference: `Sitemap: https://solutionsimpactweb.ca/sitemap.xml`
- ✅ Allows crawling of canonical pages (`/fr/*`, `/en/*`)
- ✅ Disallows API routes, static assets, preview/draft paths

#### 5. **Middleware Redirects (`middleware.ts`)**

- ✅ **301 redirects** from non-locale URLs to locale-prefixed URLs
- ✅ Locale detection from `Accept-Language` header (defaults to `fr`)
- ✅ Examples:
  - `/compliance` → `301` → `/fr/compliance` (or `/en/compliance`)
  - `/services` → `301` → `/fr/services`
  - `/faq` → `301` → `/en/faq` (if browser prefers English)

---

## PART B: EXAMPLE URL TABLE

| URL                    | Status | Redirect Destination                 | Indexable       | In Sitemap |
| ---------------------- | ------ | ------------------------------------ | --------------- | ---------- |
| `/`                    | 308    | `/fr`                                | No              | No         |
| `/fr`                  | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/en`                  | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/compliance`          | 301    | `/fr/compliance` or `/en/compliance` | No              | No         |
| `/fr/compliance`       | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/en/compliance`       | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/services`            | 301    | `/fr/services` or `/en/services`     | No              | No         |
| `/fr/services`         | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/en/services`         | 200    | -                                    | ✅ Yes          | ✅ Yes     |
| `/fr/merci`            | 200    | -                                    | ❌ No (noindex) | ❌ No      |
| `/en/thank-you`        | 200    | -                                    | ❌ No (noindex) | ❌ No      |
| `/fr/commande-reussie` | 200    | -                                    | ❌ No (noindex) | ❌ No      |

---

## PART C: EXAMPLE RENDERED `<head>` TAGS

### French Homepage (`/fr`)

```html
<head>
  <meta charset="utf-8" />
  <title>
    Marketing numérique bilingue et intelligent | Agence web: Solutions Impact
    Web
  </title>
  <meta
    name="description"
    content="Transformez votre présence numérique avec nos services de marketing intelligent..."
  />
  <meta name="robots" content="index, follow" />

  <!-- Canonical -->
  <link rel="canonical" href="https://solutionsimpactweb.ca/fr" />

  <!-- Hreflang -->
  <link
    rel="alternate"
    hreflang="fr-CA"
    href="https://solutionsimpactweb.ca/fr"
  />
  <link
    rel="alternate"
    hreflang="en-CA"
    href="https://solutionsimpactweb.ca/en"
  />
  <!-- NO x-default -->

  <!-- OpenGraph -->
  <meta
    property="og:title"
    content="Marketing numérique bilingue et intelligent | Agence web: Solutions Impact Web"
  />
  <meta property="og:url" content="https://solutionsimpactweb.ca/fr" />
  <meta property="og:locale" content="fr_CA" />
  ...
</head>
```

### English Compliance Page (`/en/compliance`)

```html
<head>
  <meta charset="utf-8" />
  <title>Data Privacy & Compliance Expertise | Solutions Impact Web</title>
  <meta
    name="description"
    content="Global data protection expertise: GDPR, PIPEDA, and Quebec Law 25..."
  />
  <meta name="robots" content="index, follow" />

  <!-- Canonical -->
  <link rel="canonical" href="https://solutionsimpactweb.ca/en/compliance" />

  <!-- Hreflang -->
  <link
    rel="alternate"
    hreflang="fr-CA"
    href="https://solutionsimpactweb.ca/fr/compliance"
  />
  <link
    rel="alternate"
    hreflang="en-CA"
    href="https://solutionsimpactweb.ca/en/compliance"
  />
  <!-- NO x-default -->

  <!-- OpenGraph -->
  <meta
    property="og:title"
    content="Data Privacy & Compliance Expertise | Solutions Impact Web"
  />
  <meta
    property="og:url"
    content="https://solutionsimpactweb.ca/en/compliance"
  />
  <meta property="og:locale" content="en_CA" />
  ...
</head>
```

### Conversion Page (`/fr/merci`)

```html
<head>
  <meta charset="utf-8" />
  <title>Merci | Solutions Impact Web</title>
  <meta name="description" content="Confirmation" />
  <meta name="robots" content="noindex, follow" />

  <!-- NO canonical (noindex page) -->
  <!-- NO hreflang (noindex page) -->

  <!-- OpenGraph -->
  <meta property="og:title" content="Merci | Solutions Impact Web" />
  <meta property="og:locale" content="fr_CA" />
  ...
</head>
```

---

## PART D: GOOGLE SEARCH CONSOLE ADMIN CHECKLIST

### Step 1: Create Domain Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add property"**
3. Select **"Domain"** property type
4. Enter: `solutionsimpactweb.ca` (no https://, no www)
5. Click **"Continue"**

### Step 2: Verify via DNS

1. Google will provide a TXT record like:
   ```
   google-site-verification=ABC123XYZ...
   ```
2. Go to your DNS provider (Cloudflare / registrar)
3. Add a **TXT record**:
   - **Name/Host**: `@` or leave blank (root domain)
   - **Type**: `TXT`
   - **Value**: The verification string from Google
   - **TTL**: Auto or 3600
4. Save the record
5. Wait 5-10 minutes for DNS propagation
6. Return to GSC and click **"Verify"**

✅ **Success**: You'll see "Ownership verified" message

### Step 3: Submit Sitemap

1. In GSC, go to **Indexing → Sitemaps** (left sidebar)
2. Enter sitemap URL: `https://solutionsimpactweb.ca/sitemap.xml`
3. Click **"Submit"**
4. Wait 24-48 hours for Google to process

✅ **Success indicators**:

- Status: "Success"
- Discovered URLs: ~30-50 (depending on content)
- No errors in "Couldn't fetch" or "Parsing errors"

### Step 4: Validate Key URLs with URL Inspection

Test these URLs to confirm Google sees them correctly:

#### Homepage

- **FR**: `https://solutionsimpactweb.ca/fr`
- **EN**: `https://solutionsimpactweb.ca/en`

#### Compliance Pages

- **FR**: `https://solutionsimpactweb.ca/fr/compliance`
- **EN**: `https://solutionsimpactweb.ca/en/compliance`

#### Services Pages

- **FR**: `https://solutionsimpactweb.ca/fr/services`
- **EN**: `https://solutionsimpactweb.ca/en/services`

#### Blog/Guide Examples

- **FR Guide**: `https://solutionsimpactweb.ca/fr/content/guides/[slug]`
- **EN Guide**: `https://solutionsimpactweb.ca/en/content/guides/[slug]`

**For each URL:**

1. Go to **URL Inspection** (top search bar in GSC)
2. Paste the URL
3. Click **"Test Live URL"**
4. Verify:
   - ✅ **Google-selected canonical** matches the locale-prefixed URL
   - ✅ **Indexing allowed**: "URL is on Google" or "URL can be indexed"
   - ✅ **Page is in sitemap**: Check "Coverage" section
   - ✅ **Hreflang tags detected**: Check "Enhancements" → "Hreflang"

### Step 5: Monitor Reports (First 7-14 Days)

#### A. Sitemaps Report (`Indexing → Sitemaps`)

**What to check:**

- ✅ Status: "Success"
- ✅ Discovered URLs: Should match your sitemap count
- ❌ **If errors**:
  - "Couldn't fetch": Check if sitemap URL is accessible
  - "Parsing errors": Validate sitemap XML syntax

#### B. Pages/Indexing Report (`Indexing → Pages`)

**What to check:**

- ✅ **Indexed pages**: Should grow over 7-14 days
- ❌ **404 errors**: Means sitemap has dead URLs or redirects are wrong
  - **Fix**: Remove URLs from sitemap or fix redirects
- ❌ **Duplicate without user-selected canonical**: Means canonical/hreflang/redirect issue
  - **Fix**: Verify canonical tags and middleware redirects
- ⚠️ **Crawled – currently not indexed**: Content/quality signals, internal linking
  - **Fix**: Improve content quality, add internal links

#### C. Experience Reports

- **Core Web Vitals**: Monitor page speed
- **Mobile Usability**: Check for mobile issues
- **HTTPS**: Verify all pages use HTTPS

### Step 6: Troubleshooting Common Issues

| Issue                        | Cause                                  | Fix                                              |
| ---------------------------- | -------------------------------------- | ------------------------------------------------ |
| **404 errors in sitemap**    | Sitemap contains URLs that don't exist | Remove from `STATIC_ROUTES` in `sitemap.ts`      |
| **Duplicate content**        | Non-locale URLs returning 200          | Verify middleware redirects (should be 301)      |
| **Missing hreflang**         | Page missing canonical parameter       | Add `canonical: '/path'` to `generateMetadata()` |
| **x-default detected**       | Old code still present                 | Verify `lib/metadata.ts` has no x-default        |
| **Conversion pages indexed** | Missing noindex                        | Verify `noindex: true` in page metadata          |
| **Wrong canonical domain**   | SITE_URL env var incorrect             | Check Vercel env: `NEXT_PUBLIC_SITE_URL`         |

---

## PART E: VERCEL ENVIRONMENT VARIABLES

### Required Configuration

Go to: **Vercel → Project Settings → Environment Variables**

Add/verify:

```
NEXT_PUBLIC_SITE_URL = https://solutionsimpactweb.ca
```

**Important:**

- ✅ Include `https://` explicitly
- ✅ **NO trailing slash** (e.g., NOT `https://solutionsimpactweb.ca/`)
- ✅ Apply to **Production**, **Preview**, and **Development**
- ✅ Use apex domain (not `www.solutionsimpactweb.ca`)

### Verification

After setting the env var, redeploy and check:

```bash
# Check sitemap URLs
curl https://solutionsimpactweb.ca/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -5

# Should show:
# <loc>https://solutionsimpactweb.ca/fr</loc>
# <loc>https://solutionsimpactweb.ca/en</loc>
# <loc>https://solutionsimpactweb.ca/fr/services</loc>
# ...
```

---

## PART F: ACCEPTANCE TEST CHECKLIST

Run these tests after deployment:

### 1. Sitemap & Robots

```bash
# Sitemap accessible
curl -I https://solutionsimpactweb.ca/sitemap.xml
# Expected: HTTP/2 200

# Robots.txt accessible
curl https://solutionsimpactweb.ca/robots.txt
# Expected: Contains "Sitemap: https://solutionsimpactweb.ca/sitemap.xml"
```

### 2. Redirects

```bash
# Non-locale URLs redirect
curl -I https://solutionsimpactweb.ca/compliance
# Expected: HTTP/2 301, Location: /fr/compliance or /en/compliance

curl -I https://solutionsimpactweb.ca/services
# Expected: HTTP/2 301, Location: /fr/services or /en/services
```

### 3. Canonical & Hreflang

```bash
# FR homepage
curl -s https://solutionsimpactweb.ca/fr | grep -E '(canonical|hreflang)'
# Expected:
# <link rel="canonical" href="https://solutionsimpactweb.ca/fr" />
# <link rel="alternate" hreflang="fr-CA" href="https://solutionsimpactweb.ca/fr" />
# <link rel="alternate" hreflang="en-CA" href="https://solutionsimpactweb.ca/en" />
# NO x-default

# EN compliance
curl -s https://solutionsimpactweb.ca/en/compliance | grep -E '(canonical|hreflang)'
# Expected:
# <link rel="canonical" href="https://solutionsimpactweb.ca/en/compliance" />
# <link rel="alternate" hreflang="fr-CA" href="https://solutionsimpactweb.ca/fr/compliance" />
# <link rel="alternate" hreflang="en-CA" href="https://solutionsimpactweb.ca/en/compliance" />
```

### 4. Noindex Pages

```bash
# Conversion page
curl -s https://solutionsimpactweb.ca/fr/merci | grep 'robots'
# Expected: <meta name="robots" content="noindex, follow" />
```

### 5. PowerShell Verification Script

```powershell
# Run the automated script
.\scripts\verify-seo.ps1

# Expected: All tests pass
```

---

## PART G: TIMELINE & EXPECTATIONS

### Week 1 (Days 1-7)

- ✅ Submit sitemap
- ✅ Validate 5-10 key URLs via URL Inspection
- ⏳ Google discovers and crawls pages (gradual)

### Week 2 (Days 8-14)

- ⏳ Indexed pages start appearing in GSC
- ⏳ Monitor for errors (404s, duplicates)
- ⏳ Core Web Vitals data starts populating

### Week 3-4 (Days 15-30)

- ✅ Most pages should be indexed
- ✅ Search Console data stabilizes
- ✅ Can start analyzing search queries and impressions

### Ongoing

- 📊 Monitor **Pages** report for indexing issues
- 📊 Check **Performance** report for search queries
- 📊 Review **Core Web Vitals** for speed issues
- 🔄 Re-submit sitemap after major content updates

---

## PART H: QUICK REFERENCE

### Key URLs

- **Sitemap**: https://solutionsimpactweb.ca/sitemap.xml
- **Robots**: https://solutionsimpactweb.ca/robots.txt
- **GSC**: https://search.google.com/search-console

### Canonical Strategy

- ✅ **Indexable**: `/fr/*` and `/en/*` only
- ❌ **Not indexable**: Non-locale URLs (redirect 301)
- ❌ **Not indexable**: Conversion pages (noindex,follow)

### Hreflang Strategy

- ✅ **fr-CA**: French Canadian pages
- ✅ **en-CA**: English Canadian pages
- ❌ **NO x-default**: No neutral landing page

### Files Modified

1. `lib/metadata.ts` - Metadata generation logic
2. `app/[locale]/services/page.tsx` - Fixed canonical
3. `app/[locale]/contact/page.tsx` - Fixed canonical + hreflang
4. `app/[locale]/assessment/page.tsx` - Added canonical
5. `scripts/verify-seo.ps1` - Verification script

---

## ✅ FINAL CHECKLIST

Before submitting to GSC:

- [ ] Verify `NEXT_PUBLIC_SITE_URL` in Vercel
- [ ] Deploy latest changes to production
- [ ] Run `.\scripts\verify-seo.ps1` (all tests pass)
- [ ] Manually check 3-5 pages for canonical + hreflang
- [ ] Verify sitemap accessible and correct
- [ ] Verify robots.txt accessible and correct
- [ ] Create GSC Domain property
- [ ] Add DNS TXT record for verification
- [ ] Submit sitemap to GSC
- [ ] Inspect 5-10 key URLs in GSC
- [ ] Monitor for 7-14 days

**Status**: 🎉 **GSC-READY** (pending Vercel env var verification)
