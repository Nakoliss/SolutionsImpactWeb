'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useAnalytics } from '@/lib/analytics';
import { useConsent } from '@/components/CookieConsentBanner';
import { buildLocalePath } from '@/lib/localeRouting';
import type { SupportedLocale } from '@/content';

interface MerciPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

function MerciContent({ locale }: { locale: SupportedLocale }) {
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
        downloadLink.download = locale === 'fr' ? 'Loi25-Essentials.pdf' : 'Law25-Essentials.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Track download event
        analytics.track('lead_download', {
          asset: 'loi25',
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
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">{currentCopy.title}</h1>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">
        {currentCopy.description}{' '}
        <Link
          href="/downloads/loi25-essentials.pdf"
          className="underline hover:opacity-80"
          download
        >
          {currentCopy.downloadLink}
        </Link>.
      </p>

      <div className="mt-8">
        <Link
          href={buildLocalePath(locale, '/contact')}
          className="inline-block bg-gradient-to-r from-purple-500 to-sky-500 text-white px-6 py-3 rounded-md font-medium hover:from-purple-600 hover:to-sky-600 transition-all"
        >
          {currentCopy.contactLink}
        </Link>
      </div>
    </main>
  );
}

export default function MerciPage({ params }: MerciPageProps) {
  const [locale, setLocale] = useState<SupportedLocale>('fr');

  useEffect(() => {
    // Get locale from params
    params.then(({ locale: loc }) => setLocale(loc));
  }, [params]);

  return (
    <Suspense fallback={
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold mb-4">Loading...</h1>
      </main>
    }>
      <MerciContent locale={locale} />
    </Suspense>
  );
}

