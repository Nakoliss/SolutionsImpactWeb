import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/content';

const FALLBACK_BASE_URL = 'https://local.test';

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  if (!value) return false;
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function normalizePath(path?: string): string {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export function getLocalePrefix(locale: SupportedLocale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

export function buildLocalePath(locale: SupportedLocale, path: string = '/'): string {
  const normalizedPath = normalizePath(path);
  if (locale === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function buildLocaleHref(locale: SupportedLocale, path: string = '/', hash?: string): string {
  const href = buildLocalePath(locale, path);
  if (!hash) {
    return href;
  }

  return `${href}#${hash.replace(/^#/, '')}`;
}

export function buildLocaleUrl(baseUrl: string, locale: SupportedLocale, path: string = '/'): string {
  const normalizedBase = (baseUrl || FALLBACK_BASE_URL).replace(/\/$/, '');
  const localizedPath = buildLocalePath(locale, path);
  if (localizedPath === '/') {
    return normalizedBase;
  }
  return `${normalizedBase}${localizedPath}`;
}

export function stripLocaleFromPath(path: string): { locale: SupportedLocale; relativePath: string } {
  const url = new URL(path || '/', FALLBACK_BASE_URL);
  const segments = url.pathname.split('/').filter(Boolean);

  let locale: SupportedLocale = DEFAULT_LOCALE;
  if (segments.length && isSupportedLocale(segments[0])) {
    locale = segments[0];
    segments.shift();
  }

  const relativePath = `/${segments.join('/')}`.replace(/\/+$/, '') || '/';

  return {
    locale,
    relativePath,
  };
}

export function switchLocalePath(
  currentPath: string,
  targetLocale: SupportedLocale,
): string {
  const url = new URL(currentPath || '/', FALLBACK_BASE_URL);
  const { relativePath } = stripLocaleFromPath(url.pathname);
  const nextPath = buildLocalePath(targetLocale, relativePath);
  return `${nextPath}${url.search}${url.hash}`.replace(/\/+$/, nextPath === '/' ? '/' : '');
}

export function getHrefLang(locale: SupportedLocale): string {
  return locale === 'fr' ? 'fr-CA' : 'en-CA';
}

