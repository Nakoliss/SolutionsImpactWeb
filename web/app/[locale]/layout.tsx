import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import CanonicalLink from '@/components/CanonicalLink';
import { CookieConsentProvider } from '@/components/CookieConsentBanner';
import Header from '@/components/Header';
import HrefLangLinks from '@/components/HrefLangLinks';
import LegalFooter from '@/components/LegalFooter';
import type { SupportedLocale } from '@/content';
import { repairLocalizedMessages } from '@/lib/messages';
import DesignContextWrapper from '@/components/DesignContextWrapper';
import EnWaitlistOverlay from '@/components/EnWaitlistOverlay';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rawMessages = await getMessages({ locale });
  const fallbackEn = await getMessages({ locale: 'en' });
  const messages = locale === 'fr' ? repairLocalizedMessages(rawMessages, fallbackEn) : rawMessages;

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || `/${locale}`;

  return (
    <>
      <CanonicalLink locale={locale as SupportedLocale} path="/" />
      <HrefLangLinks currentLocale={locale as SupportedLocale} path="/" />
      <NextIntlClientProvider locale={locale} messages={messages as Record<string, unknown>}>
        <DesignContextWrapper>
          <CookieConsentProvider locale={locale as SupportedLocale}>
            <Header locale={locale as SupportedLocale} currentPath={pathname} />
            {children}
            <LegalFooter locale={locale as SupportedLocale} />
          </CookieConsentProvider>
        </DesignContextWrapper>
      </NextIntlClientProvider>
    </>
  );
}
