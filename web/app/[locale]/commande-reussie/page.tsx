'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { analytics } from '@/lib/analytics';
import { buildLocalePath } from '@/lib/localeRouting';
import type { SupportedLocale } from '@/content';

import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface CommandeReussiePageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({
  params,
}: CommandeReussiePageProps): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Commande réussie',
    description: 'Confirmation de commande',
    locale,
    noindex: true,
  });
}

export default function CommandeReussie() {
  const params = useParams();
  const locale = (params?.locale as SupportedLocale) || 'fr';
  const [sessionId, setSessionId] = useState<string | null>(null);
  const privacyHref = buildLocalePath(locale, '/compliance/privacy');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const sid = url.searchParams.get('session_id');

    if (sid) {
      setSessionId(sid);

      // Track purchase event via GA4
      analytics.track('purchase', {
        transaction_id: sid,
        value: 0, // Placeholder value - will be updated when Stripe integration is complete
        currency: 'CAD',
      });
    }
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Commande réussie ✅</h1>
      <p className="mt-2 text-lg text-neutral-700">
        Merci! Un courriel de confirmation Stripe vous a été envoyé.
      </p>

      {sessionId && (
        <p className="mt-4 text-sm text-neutral-600">
          Numéro de transaction :{' '}
          <code className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
            {sessionId}
          </code>
        </p>
      )}

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> Le paiement en ligne est actuellement en phase
          de mise en service/test. La confirmation officielle passera par un
          autre canal pour le moment.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-600">
          <strong>Données personnelles :</strong> Les paiements seront traités
          par <strong>Stripe</strong> (PCI-DSS) une fois activés. Consultez
          notre{' '}
          <Link
            href={privacyHref}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Politique de confidentialité
          </Link>{' '}
          pour plus de détails sur le traitement des données de paiement, les
          transferts, la conservation des journaux et vos droits
          d&apos;accès/effacement (≤ 30 jours).
        </p>
      </div>

      <div className="mt-8">
        <Link
          href={buildLocalePath(locale, '/offres')}
          className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Retour aux offres
        </Link>
      </div>
    </main>
  );
}
