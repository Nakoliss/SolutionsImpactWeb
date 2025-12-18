'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useAnalytics } from '@/lib/analytics';
import { useConsent } from '@/components/CookieConsentBanner';
import { buildLocalePath } from '@/lib/localeRouting';
import type { SupportedLocale } from '@/content';

import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface ThankYouPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({
  params,
}: ThankYouPageProps): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Thank You',
    description: 'Confirmation',
    locale,
    noindex: true,
  });
}

function ThankYouContent({ locale }: { locale: SupportedLocale }) {
  const searchParams = useSearchParams();
  const analytics = useAnalytics();
  const { consent } = useConsent();

  useEffect(() => {
    const asset = searchParams.get('asset');

    // Only track if analytics consent is granted
    if (consent?.analytics && asset) {
      // Track lead_confirmed event
      analytics.track('lead_confirmed', {
        asset,
        locale,
      });

      // Trigger PDF download if asset is loi25 or law25
      if (asset === 'loi25' || asset === 'law25') {
        const downloadLink = document.createElement('a');
        downloadLink.href = '/downloads/loi25-essentials.pdf';
        downloadLink.download =
          locale === 'fr' ? 'Loi25-Essentials.pdf' : 'Law25-Essentials.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Track download event
        analytics.track('lead_download', {
          asset: 'law25',
          locale,
        });
      }
    }
  }, [searchParams, analytics, consent, locale]);

  const copy = {
    fr: {
      title: 'Merci — vérification confirmée ✅',
      description: 'Le téléchargement démarre automatiquement. Sinon,',
      downloadLink: 'cliquez ici',
      contactLink: 'Planifier un diagnostic',
    },
    en: {
      title: 'Thank you — verification confirmed ✅',
      description: 'The download starts automatically. Otherwise,',
      downloadLink: 'click here',
      contactLink: 'Book a diagnostic',
    },
  };

  const currentCopy = copy[locale];

  return (
    <>
      <h1 className="text-3xl font-semibold mb-4">{currentCopy.title}</h1>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">
        {currentCopy.description}{' '}
        <Link
          href="/downloads/loi25-essentials.pdf"
          className="underline hover:opacity-80"
          download
        >
          {currentCopy.downloadLink}
        </Link>
        .
      </p>

      <div className="mt-8">
        <Link
          href={buildLocalePath(locale, '/contact')}
          className="inline-block bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white px-6 py-3 rounded-md font-medium hover:from-[#1e40af] hover:to-[#0ea5e9] transition-all"
        >
          {currentCopy.contactLink}
        </Link>
      </div>
    </>
  );
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  const [locale, setLocale] = useState<SupportedLocale>('en');

  useEffect(() => {
    // Get locale from params
    params.then(({ locale: loc }) => setLocale(loc));
  }, [params]);

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-semibold mb-4">Loading...</h1>
        </main>
      }
    >
      <main className="mx-auto max-w-3xl px-4 py-12">
        <ThankYouContent locale={locale} />
      </main>
    </Suspense>
  );
}
