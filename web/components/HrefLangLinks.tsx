import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocaleUrl, getHrefLang } from '@/lib/localeRouting';
import { SITE_URL } from '@/lib/metadata';

interface HrefLangLinksProps {
  currentLocale: SupportedLocale;
  path: string; // Path without locale prefix, e.g., "/contact", "/content/compliance/bill-64"
  baseUrl?: string;
}

export default function HrefLangLinks({
  currentLocale: _currentLocale, // Kept for API compatibility; not used when x-default is omitted
  path,
  baseUrl = SITE_URL,
}: HrefLangLinksProps) {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const locales = SUPPORTED_LOCALES;

  // No x-default: Site doesn't have a neutral language selector page
  // Only output fr-CA and en-CA hreflang tags per GSC guidelines
  return (
    <>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={getHrefLang(locale)}
          href={buildLocaleUrl(baseUrl, locale, canonicalPath)}
        />
      ))}
    </>
  );
}
