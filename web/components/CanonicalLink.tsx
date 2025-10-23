import type { SupportedLocale } from '@/content';
import { SITE_URL } from '@/lib/metadata';

interface CanonicalLinkProps {
  locale: SupportedLocale;
  path: string; // Path without locale prefix, e.g., "/contact", "/content/compliance/bill-64"
  baseUrl?: string;
}

export default function CanonicalLink({ 
  locale, 
  path,
  baseUrl = SITE_URL
}: CanonicalLinkProps) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${normalizedBase}/${locale}${normalizedPath}`;
  
  return (
    <link
      rel="canonical"
      href={canonicalUrl}
    />
  );
}
