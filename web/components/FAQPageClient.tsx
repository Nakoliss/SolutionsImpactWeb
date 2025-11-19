'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import type { SupportedLocale } from '@/content';
import type { FAQPage } from '@/lib/seo/structuredData';
import { useAnalytics } from '@/lib/analytics';
import { useConsent } from './CookieConsentBanner';
import { buildLocalePath } from '@/lib/localeRouting';

interface FAQPageClientProps {
  locale: SupportedLocale;
  faq: FAQPage;
  copy: {
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
}

export default function FAQPageClient({ locale, faq, copy }: FAQPageClientProps) {
  const { track } = useAnalytics();
  const { consent } = useConsent();
  const analyticsAllowed = Boolean(consent?.analytics);

  useEffect(() => {
    if (analyticsAllowed) {
      track('faq_view', {
        locale,
        faq_items_count: faq.mainEntity.length,
      });
    }
  }, [analyticsAllowed, locale, track, faq.mainEntity.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {copy.title}
          </h1>
          <p className="text-xl text-gray-600">
            {copy.subtitle}
          </p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {faq.mainEntity.map((item, index) => (
            <article
              key={index}
              className="border-b border-gray-200 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {item.name}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{item.acceptedAnswer.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {copy.ctaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {copy.ctaDescription}
            </p>
            <Link
              href={buildLocalePath(locale, '/contact')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {copy.ctaButton}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

