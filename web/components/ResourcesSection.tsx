'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import type { SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { useAnalytics } from '@/lib/analytics';
import { useConsent } from './CookieConsentBanner';

interface ResourcesSectionProps {
  locale: SupportedLocale;
  className?: string;
}

const resources = {
  fr: {
    title: 'Ressources',
    subtitle: 'Guides pratiques et articles pour améliorer votre présence numérique',
    items: [
      {
        title: 'FAQ SEO Local et Loi 25',
        description: 'Réponses aux questions fréquentes sur le SEO local, Google Business Profile et la conformité Loi 25',
        href: '/faq',
        type: 'faq',
      },
      {
        title: 'Loi 25 : 10 erreurs courantes',
        description: 'Guide simple pour rendre votre site conforme à la Loi 25 tout en améliorant votre visibilité',
        href: '/blog/loi-25-erreurs-courantes',
        type: 'blog',
      },
      {
        title: 'AEO/GEO : Apparaître dans ChatGPT',
        description: 'Comment optimiser votre présence dans ChatGPT et les moteurs de réponses IA',
        href: '/blog/aeogeo-visible-chatgpt',
        type: 'blog',
      },
    ],
    cta: {
      text: 'Besoin d\'aide ?',
      link: '/contact',
      label: 'Planifier un diagnostic',
    },
  },
  en: {
    title: 'Resources',
    subtitle: 'Practical guides and articles to improve your digital presence',
    items: [
      {
        title: 'Local SEO and Law 25 FAQ',
        description: 'Answers to frequently asked questions about local SEO, Google Business Profile, and Law 25 compliance',
        href: '/faq',
        type: 'faq',
      },
      {
        title: 'Law 25: 10 Common Mistakes',
        description: 'Simple guide to make your site Law 25 compliant while improving your visibility',
        href: '/blog/law25-common-mistakes',
        type: 'blog',
      },
      {
        title: 'AEO/GEO: Appear in ChatGPT',
        description: 'How to optimize your presence in ChatGPT and AI answer engines',
        href: '/blog/aeogeo-visibility-chatgpt',
        type: 'blog',
      },
    ],
    cta: {
      text: 'Need help?',
      link: '/contact',
      label: 'Book a diagnostic',
    },
  },
};

export default function ResourcesSection({ locale, className = '' }: ResourcesSectionProps) {
  const { track } = useAnalytics();
  const { consent } = useConsent();
  const analyticsAllowed = Boolean(consent?.analytics);

  const content = resources[locale];

  const handleLinkClick = (href: string, type: string) => {
    if (!analyticsAllowed) return;
    
    if (type === 'blog') {
      track('view_content', {
        content_type: 'blog',
        content_path: href,
        locale,
      });
    } else if (type === 'faq') {
      track('faq_view', {
        locale,
        source: 'resources_section',
      });
    }
  };

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-lg text-gray-600">{content.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {content.items.map((item, index) => (
            <Link
              key={index}
              href={buildLocalePath(locale, item.href)}
              onClick={() => handleLinkClick(item.href, item.type)}
              className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{content.cta.text}</p>
          <Link
            href={buildLocalePath(locale, content.cta.link)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {content.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

