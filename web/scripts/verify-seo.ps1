# SEO Verification Script for solutionsimpactweb.ca
# Run this after deployment to verify GSC readiness

param(
    [string]$Domain = "https://solutionsimpactweb.ca"
)

$ErrorActionPreference = "Continue"

Write-Host "`nSEO Verification Script for $Domain" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

$passed = 0
$failed = 0

# TEST 1: Sitemap
Write-Host "`nTEST 1: Sitemap & Robots.txt" -ForegroundColor Yellow
try {
    $sitemap = Invoke-WebRequest -Uri "$Domain/sitemap.xml" -UseBasicParsing
    if ($sitemap.StatusCode -eq 200) {
        Write-Host "  PASS: Sitemap accessible" -ForegroundColor Green
        $passed++
        
        if ($sitemap.Content -match "<loc>$Domain/(fr|en)/") {
            Write-Host "  PASS: Sitemap contains locale-prefixed URLs" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: Sitemap missing locale prefixes" -ForegroundColor Red
            $failed++
        }
        
        if ($sitemap.Content -notmatch "(merci|thank-you|commande-reussie)") {
            Write-Host "  PASS: Sitemap excludes conversion pages" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: Sitemap contains conversion pages" -ForegroundColor Red
            $failed++
        }
    }
}
catch {
    Write-Host "  FAIL: Sitemap not accessible" -ForegroundColor Red
    $failed++
}

try {
    $robots = Invoke-WebRequest -Uri "$Domain/robots.txt" -UseBasicParsing
    if ($robots.StatusCode -eq 200) {
        Write-Host "  PASS: Robots.txt accessible" -ForegroundColor Green
        $passed++
        
        if ($robots.Content -match "Sitemap: $Domain/sitemap.xml") {
            Write-Host "  PASS: Robots.txt references sitemap" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: Robots.txt missing sitemap reference" -ForegroundColor Red
            $failed++
        }
    }
}
catch {
    Write-Host "  FAIL: Robots.txt not accessible" -ForegroundColor Red
    $failed++
}

# TEST 2: Redirects
Write-Host "`nTEST 2: Canonical Redirects" -ForegroundColor Yellow
$redirectTests = @("/compliance", "/services", "/faq", "/contact")

foreach ($path in $redirectTests) {
    try {
        $response = Invoke-WebRequest -Uri "$Domain$path" -MaximumRedirection 0 -ErrorAction Stop
        Write-Host "  FAIL: $path returns 200 (should redirect)" -ForegroundColor Red
        $failed++
    }
    catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 301) {
            $location = $_.Exception.Response.Headers.Location.PathAndQuery
            Write-Host "  PASS: $path -> 301 -> $location" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: $path returns $status (expected 301)" -ForegroundColor Red
            $failed++
        }
    }
}

# TEST 3: Metadata
Write-Host "`nTEST 3: Canonical & Hreflang Tags" -ForegroundColor Yellow
$metaTests = @(
    @{ Url = "$Domain/fr"; Path = "/" }
    @{ Url = "$Domain/en"; Path = "/" }
    @{ Url = "$Domain/fr/compliance"; Path = "/compliance" }
    @{ Url = "$Domain/en/services"; Path = "/services" }
)

foreach ($test in $metaTests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing
        $content = $response.Content
        
        $hasCanonical = $content -match "rel=`"canonical`""
        $hasHreflangFr = $content -match "hreflang=`"fr-CA`""
        $hasHreflangEn = $content -match "hreflang=`"en-CA`""
        $hasXDefault = $content -match "hreflang=`"x-default`""
        
        if ($hasCanonical -and $hasHreflangFr -and $hasHreflangEn -and -not $hasXDefault) {
            Write-Host "  PASS: $($test.Url) has correct metadata" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: $($test.Url) missing or incorrect metadata" -ForegroundColor Red
            if (-not $hasCanonical) { Write-Host "    Missing: canonical" -ForegroundColor Yellow }
            if (-not $hasHreflangFr) { Write-Host "    Missing: hreflang fr-CA" -ForegroundColor Yellow }
            if (-not $hasHreflangEn) { Write-Host "    Missing: hreflang en-CA" -ForegroundColor Yellow }
            if ($hasXDefault) { Write-Host "    Found: x-default (should not exist)" -ForegroundColor Yellow }
            $failed++
        }
    }
    catch {
        Write-Host "  FAIL: $($test.Url) not accessible" -ForegroundColor Red
        $failed++
    }
}

# TEST 4: Noindex pages
Write-Host "`nTEST 4: Conversion Pages (noindex)" -ForegroundColor Yellow
$noindexTests = @("$Domain/fr/merci", "$Domain/en/thank-you", "$Domain/fr/commande-reussie")

foreach ($url in $noindexTests) {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        $content = $response.Content
        
        $hasNoindex = $content -match 'content="noindex'
        $hasFollow = $content -match 'follow'
        
        if ($hasNoindex -and $hasFollow) {
            Write-Host "  PASS: $url has noindex,follow" -ForegroundColor Green
            $passed++
        }
        else {
            Write-Host "  FAIL: $url missing noindex,follow" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        Write-Host "  WARN: $url not accessible" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n" -NoNewline
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "`nPassed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`nAll critical tests passed! Site is GSC-ready." -ForegroundColor Green
    exit 0
}
else {
    Write-Host "`nSome tests failed. Review the issues above." -ForegroundColor Yellow
    exit 1
}
