'use client';

import { useState } from 'react';
import Link from 'next/link';

import { BUNDLES, type BundleSlug } from '@/data/bundles';
import { analytics } from '@/lib/analytics';
import { buildLocalePath } from '@/lib/localeRouting';
import type { SupportedLocale } from '@/content';

interface BundlesProps {
  locale: SupportedLocale;
}

export default function Bundles({ locale }: BundlesProps) {
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const contactHref = buildLocalePath(locale, '/contact');

  const handleCheckout = async (slug: BundleSlug, mode: 'ot' | 'm') => {
    // Track begin_checkout event
    analytics.track('begin_checkout', {
      bundle: slug,
      modality: mode,
      item_list_name: 'bundles',
      item_name: slug,
    });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, mode }),
      });

      const data = await res.json();

      if (data.status === 'coming_soon' || res.status === 501) {
        setCheckoutMessage(
          'Le paiement en ligne arrive bientôt. Pour commander, utilisez le diagnostic ou la page Contact.'
        );
        // Clear message after 5 seconds
        setTimeout(() => setCheckoutMessage(null), 5000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutMessage(
        'Le paiement en ligne arrive bientôt. Pour commander, utilisez le diagnostic ou la page Contact.'
      );
      setTimeout(() => setCheckoutMessage(null), 5000);
    }
  };

  const handleBookClick = (slug: BundleSlug) => {
    analytics.track('select_item', {
      item_list_name: 'bundles',
      item_name: slug,
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Bundles Solutions Impact Web',
    itemListElement: BUNDLES.map((b, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Service',
        name: b.title,
        description: b.features.join('; '),
      },
      price: b.mPrice,
      priceCurrency: 'CAD',
      category: 'subscription',
    })),
  };

  return (
    <section id="bundles" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-semibold">Nos offres</h1>
        <p className="mt-2 text-neutral-600">
          Des bundles clairs (OT + M), conformes à la Loi 25 et orientés résultat.
        </p>

        {checkoutMessage && (
          <div className="mt-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
            {checkoutMessage}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLES.map((b) => (
            <article key={b.slug} className="rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-medium">{b.title}</h2>
              <ul className="mt-4 list-disc pl-5 text-sm text-neutral-700">
                {b.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{b.otLabel}</span>
                  <strong>{b.otPrice.toLocaleString('fr-CA')} $</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>{b.mLabel}</span>
                  <strong>{b.mPrice.toLocaleString('fr-CA')} $/mo</strong>
                </div>
                <p className="text-xs text-neutral-500">
                  OT = mise en place (one‑time). M = mensuel. Engagements & rabais possibles (3/6/12 mois).
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={contactHref}
                  className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                  onClick={() => handleBookClick(b.slug)}
                >
                  {b.ctaBook}
                </Link>
                {b.ctaBuy && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                      onClick={() => handleCheckout(b.slug, 'ot')}
                    >
                      Commander OT
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                      onClick={() => handleCheckout(b.slug, 'm')}
                    >
                      Commander Mensuel
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Ce qui est inclus */}
        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-2xl font-semibold mb-4">Ce qui est inclus</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Les liens détaillés vers les documents seront ajoutés ultérieurement.
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#compliance-package"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Compliance Package – Loi 25 Essentials
              </a>
              {' '}
              (preuve de conformité)
            </li>
            <li>
              <a
                href="#quickstart"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Quickstart Guide
              </a>
              {' '}
              (remis à la livraison, support & données)
            </li>
            <li>
              <a
                href="#rapports"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Rapport Maintenance + Rapport SEO/AEO mensuel
              </a>
              {' '}
              (preuves mensuelles)
            </li>
          </ul>
        </div>
      </div>

      {/* JSON-LD OfferCatalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <noscript>
        <p>Liste des offres disponible sans JavaScript.</p>
      </noscript>
    </section>
  );
}


