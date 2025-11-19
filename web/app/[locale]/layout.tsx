import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { CookieConsentProvider } from '@/components/CookieConsentBanner';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';
import ChatbotGate from '@/components/ChatbotGate';
import ConsentGate from '@/components/ConsentGate';
import MetaPixelGate from '@/components/MetaPixelGate';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { repairLocalizedMessages } from '@/lib/messages';
import DesignContextWrapper from '@/components/DesignContextWrapper';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const rawMessages = await getMessages({ locale });
  const fallbackEn = await getMessages({ locale: 'en' });
  const messages = locale === 'fr' ? repairLocalizedMessages(rawMessages, fallbackEn) : rawMessages;

  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages as Record<string, unknown>}>
        <DesignContextWrapper>
          <CookieConsentProvider locale={locale as SupportedLocale}>
            <ConsentGate />
            <MetaPixelGate />
            <Suspense fallback={null}>
              <Header locale={locale as SupportedLocale} />
            </Suspense>
            {children}
            <LegalFooter locale={locale as SupportedLocale} />
            <ChatbotGate provider="crisp" locale={locale as SupportedLocale} />
          </CookieConsentProvider>
        </DesignContextWrapper>
      </NextIntlClientProvider>
    </>
  );
}
