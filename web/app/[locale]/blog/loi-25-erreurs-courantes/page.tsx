import Link from 'next/link';
import { notFound } from 'next/navigation';

import StructuredData from '@/components/StructuredData';
import BlogPostClient from '@/components/BlogPostClient';
import type { SupportedLocale } from '@/content';
import { SUPPORTED_LOCALES } from '@/content';
import { buildLocalePath, buildLocaleUrl } from '@/lib/localeRouting';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/metadata';
import { brandConfig } from '@/lib/brand';

interface BlogPostProps {
  params: Promise<{ locale: SupportedLocale }>;
}

const ARTICLE_SLUG = 'loi-25-erreurs-courantes';
const ARTICLE_SLUG_EN = 'law25-common-mistakes';

export async function generateMetadata({ params }: BlogPostProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {};
  }

  const title =
    locale === 'fr'
      ? 'Loi 25 pour PME : 10 erreurs courantes (et comment les corriger)'
      : 'Law 25 for SMEs: 10 Common Mistakes (and How to Fix Them)';

  const description =
    locale === 'fr'
      ? 'Guide simple pour rendre votre site conforme à la Loi 25 tout en améliorant votre visibilité. Checklist rapide pour sécuriser votre site et gagner en crédibilité.'
      : 'Simple guide to make your site Law 25 compliant while improving your visibility. Quick checklist to secure your site and gain credibility.';

  const canonicalPath = `/blog/${ARTICLE_SLUG}`;

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: canonicalPath,
    keywords:
      locale === 'fr'
        ? [
            'Loi 25',
            'conformité',
            'PME Québec',
            'bannière cookies',
            'politique confidentialité',
          ]
        : [
            'Law 25',
            'compliance',
            'SME Quebec',
            'cookie banner',
            'privacy policy',
          ],
  });
}

const articleContent = {
  fr: {
    title: 'Loi 25 pour PME : 10 erreurs courantes',
    intro:
      'Voici un checklist rapide pour sécuriser votre site (bannière cookies, politique FR/EN, registre des sous-traitants) et gagner en crédibilité…',
    sections: [
      {
        title: '1) Pas de bannière cookie fonctionnelle',
        content:
          "Beaucoup de PME ont une bannière cookie qui s'affiche mais qui ne bloque pas réellement les scripts tiers avant consentement. La Loi 25 exige un consentement explicite et granulaire. Vérifiez que Google Analytics, les pixels publicitaires et autres outils de tracking ne se chargent qu'après acceptation.",
      },
      {
        title: '2) Politique de confidentialité absente ou incomplète',
        content:
          "Votre politique doit être accessible, en français (et en anglais si vous servez des clients anglophones), et mentionner tous les sous-traitants qui traitent des données (Vercel, Google Analytics, Cal.com, etc.). Incluez aussi un mécanisme de demande d'accès/suppression sous 30 jours.",
      },
      {
        title: '3) Pas de registre des sous-traitants',
        content:
          'La Loi 25 exige de documenter tous les tiers qui accèdent à vos données. Créez une liste claire avec le nom du service, la finalité, les données traitées et la localisation des serveurs.',
      },
      {
        title: '4) Consentement non documenté',
        content:
          'Vous devez pouvoir prouver quand et comment un utilisateur a consenti. Conservez les logs de consentement avec timestamp et préférences choisies.',
      },
      {
        title: '5) Pas de mécanisme de suppression',
        content:
          "Les utilisateurs doivent pouvoir demander l'accès, la rectification ou la suppression de leurs données sous 30 jours. Créez un formulaire simple accessible depuis votre politique de confidentialité.",
      },
      {
        title: '6) Données collectées sans finalité claire',
        content:
          'Chaque donnée collectée doit avoir une finalité légitime et documentée. Évitez de collecter des informations "au cas où" sans justification.',
      },
      {
        title: '7) Transferts internationaux non documentés',
        content:
          'Si vous utilisez des services hébergés aux États-Unis ou en Europe, documentez ces transferts et assurez-vous que les contrats incluent des clauses de protection des données.',
      },
      {
        title: '8) Pas de politique de conservation',
        content:
          'Définissez combien de temps vous conservez les données et pourquoi. La Loi 25 exige de ne garder que ce qui est nécessaire.',
      },
      {
        title: '9) Absence de responsable de la protection des données',
        content:
          "Désignez une personne responsable (RPD) et affichez ses coordonnées dans votre politique. Pour les PME, c'est souvent le fondateur ou le responsable IT.",
      },
      {
        title: "10) Pas de formation de l'équipe",
        content:
          "Assurez-vous que votre équipe comprend les enjeux de la Loi 25 et sait comment gérer les demandes d'accès/suppression. Documentez vos procédures internes.",
      },
    ],
    cta: {
      title: "Besoin d'aide pour rendre votre site conforme ?",
      description:
        'Contactez-nous pour un diagnostic gratuit et découvrez comment nous pouvons vous aider à sécuriser votre site tout en améliorant votre visibilité.',
      button: 'Planifier un diagnostic',
    },
  },
  en: {
    title: 'Law 25 for SMEs: 10 Common Mistakes',
    intro:
      "Here's a quick checklist to secure your site (cookie banner, FR/EN policy, subcontractor registry) and gain credibility…",
    sections: [
      {
        title: '1) No functional cookie banner',
        content:
          "Many SMEs have a cookie banner that displays but doesn't actually block third-party scripts before consent. Law 25 requires explicit and granular consent. Verify that Google Analytics, advertising pixels, and other tracking tools only load after acceptance.",
      },
      {
        title: '2) Missing or incomplete privacy policy',
        content:
          'Your policy must be accessible, in French (and English if you serve English-speaking clients), and mention all subcontractors processing data (Vercel, Google Analytics, Cal.com, etc.). Also include a mechanism for access/deletion requests within 30 days.',
      },
      {
        title: '3) No subcontractor registry',
        content:
          'Law 25 requires documenting all third parties accessing your data. Create a clear list with the service name, purpose, data processed, and server location.',
      },
      {
        title: '4) Undocumented consent',
        content:
          'You must be able to prove when and how a user consented. Keep consent logs with timestamps and chosen preferences.',
      },
      {
        title: '5) No deletion mechanism',
        content:
          'Users must be able to request access, rectification, or deletion of their data within 30 days. Create a simple form accessible from your privacy policy.',
      },
      {
        title: '6) Data collected without clear purpose',
        content:
          'Each data collected must have a legitimate and documented purpose. Avoid collecting information "just in case" without justification.',
      },
      {
        title: '7) Undocumented international transfers',
        content:
          'If you use services hosted in the United States or Europe, document these transfers and ensure contracts include data protection clauses.',
      },
      {
        title: '8) No retention policy',
        content:
          'Define how long you retain data and why. Law 25 requires keeping only what is necessary.',
      },
      {
        title: '9) Absence of data protection officer',
        content:
          'Designate a responsible person (DPO) and display their contact information in your policy. For SMEs, this is often the founder or IT manager.',
      },
      {
        title: '10) No team training',
        content:
          'Ensure your team understands Law 25 issues and knows how to handle access/deletion requests. Document your internal procedures.',
      },
    ],
    cta: {
      title: 'Need help making your site compliant?',
      description:
        'Contact us for a free diagnostic and discover how we can help you secure your site while improving your visibility.',
      button: 'Book a diagnostic',
    },
  },
};

export default async function BlogPost({ params }: BlogPostProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const content = articleContent[locale];
  const articleUrl = buildLocaleUrl(
    SITE_URL,
    locale,
    `/blog/${locale === 'fr' ? ARTICLE_SLUG : ARTICLE_SLUG_EN}`
  );

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: articleContent[locale].intro,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: {
      '@type': 'Organization' as const,
      name: brandConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: brandConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL.replace(/\/$/, '')}/favicon.ico`,
      },
    },
    datePublished: '2025-01-15',
    dateModified: '2025-01-15',
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    articleSection: 'Compliance',
    keywords:
      locale === 'fr'
        ? ['Loi 25', 'conformité', 'PME Québec', 'bannière cookies']
        : ['Law 25', 'compliance', 'SME Quebec', 'cookie banner'],
  };

  return (
    <>
      <StructuredData
        locale={locale}
        article={articleSchema}
        organization
        localBusiness
      />
      <BlogPostClient
        locale={locale}
        slug={locale === 'fr' ? ARTICLE_SLUG : ARTICLE_SLUG_EN}
        title={content.title}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <main className="mx-auto max-w-3xl px-4 py-12">
          <article>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              {content.title}
            </h1>
            <p className="text-lg text-slate-300 mb-8">{content.intro}</p>

            <div className="prose prose-lg max-w-none">
              {content.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    {section.title}
                  </h2>
                  <p className="text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                {content.cta.title}
              </h3>
              <p className="text-slate-300 mb-6">{content.cta.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={buildLocalePath(locale, '/contact')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#2563eb] to-[#38bdf8] hover:from-[#1e40af] hover:to-[#0ea5e9] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {content.cta.button}
                </Link>
                <Link
                  href={buildLocalePath(locale, '/services')}
                  className="inline-flex items-center px-6 py-3 border border-white/30 text-base font-medium rounded-md text-slate-200 bg-black/20 hover:bg-black/30 hover:border-white/50 transition-colors"
                >
                  {locale === 'fr' ? 'Voir nos services' : 'View our services'}
                </Link>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
