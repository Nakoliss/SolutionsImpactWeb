import type { SupportedLocale } from '@/content';
import { SITE_URL } from '@/lib/metadata';

interface HrefLangLinksProps {
  currentLocale: SupportedLocale;
  path: string; // Path without locale prefix, e.g., "/contact", "/content/compliance/bill-64"
  baseUrl?: string;
}

export default function HrefLangLinks({ 
  currentLocale, 
  path,
  baseUrl = SITE_URL
}: HrefLangLinksProps) {
  const locales: SupportedLocale[] = ['fr'];
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedLocale = locales.includes(currentLocale) ? currentLocale : 'fr';

  return (
    <>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale === 'fr' ? 'fr-CA' : 'en-CA'}
          href={`${baseUrl}/${locale}${canonicalPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/${normalizedLocale}${canonicalPath}`}
      />
    </>
  );
}
