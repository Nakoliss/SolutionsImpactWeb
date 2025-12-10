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

export default function FAQPageClient({
  locale,
  faq,
  copy,
}: FAQPageClientProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            {copy.title}
          </h1>
          <p className="text-xl text-slate-300">{copy.subtitle}</p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {faq.mainEntity.map((item, index) => (
            <article
              key={index}
              className="border-b border-white/10 pb-8 last:border-b-0"
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                {item.name}
              </h2>
              <div className="prose prose-lg max-w-none text-slate-300">
                <p>{item.acceptedAnswer.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {copy.ctaTitle}
            </h3>
            <p className="text-slate-300 mb-6">{copy.ctaDescription}</p>
            <Link
              href={buildLocalePath(locale, '/contact')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {copy.ctaButton}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
