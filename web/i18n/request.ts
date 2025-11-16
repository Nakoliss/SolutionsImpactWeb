import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/content';

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : DEFAULT_LOCALE;
  const messages = (await import(`../messages/${normalizedLocale}.json`)).default;
  return { locale: normalizedLocale, messages };
});
