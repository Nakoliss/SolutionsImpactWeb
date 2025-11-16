import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocaleUrl, getHrefLang } from '@/lib/localeRouting';
import { SITE_URL } from '@/lib/metadata';

interface HrefLangLinksProps {
  currentLocale: SupportedLocale;
  path: string; // Path without locale prefix, e.g., "/contact", "/content/compliance/bill-64"
  baseUrl?: string;
}

export default function HrefLangLinks({
  currentLocale,
  path,
  baseUrl = SITE_URL,
}: HrefLangLinksProps) {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const locales = SUPPORTED_LOCALES;
  const normalizedLocale = locales.includes(currentLocale) ? currentLocale : locales[0];
  const defaultHref = buildLocaleUrl(baseUrl, normalizedLocale, canonicalPath);

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
      <link rel="alternate" hrefLang="x-default" href={defaultHref} />
    </>
  );
}
