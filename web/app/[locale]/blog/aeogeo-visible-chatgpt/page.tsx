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

const ARTICLE_SLUG = 'aeogeo-visible-chatgpt';
const ARTICLE_SLUG_EN = 'aeogeo-visibility-chatgpt';

export async function generateMetadata({ params }: BlogPostProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {};
  }

  const title =
    locale === 'fr'
      ? 'AEO/GEO : Comment apparaître dans ChatGPT et les moteurs de réponses IA'
      : 'AEO/GEO: How to Appear in ChatGPT and AI Answer Engines';

  const description =
    locale === 'fr'
      ? 'Guide pratique pour optimiser votre présence dans ChatGPT, Claude et autres moteurs de réponses IA. Stratégies AEO (Answer Engine Optimization) pour PME du Québec.'
      : 'Practical guide to optimize your presence in ChatGPT, Claude and other AI answer engines. AEO (Answer Engine Optimization) strategies for Quebec SMEs.';

  const canonicalPath =
    locale === 'fr' ? `/blog/${ARTICLE_SLUG}` : `/blog/${ARTICLE_SLUG_EN}`;

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: canonicalPath,
    keywords:
      locale === 'fr'
        ? [
            'AEO',
            'GEO',
            'ChatGPT',
            'optimisation IA',
            'moteurs de réponses',
            'Québec',
          ]
        : [
            'AEO',
            'GEO',
            'ChatGPT',
            'AI optimization',
            'answer engines',
            'Quebec',
          ],
  });
}

const articleContent = {
  fr: {
    title:
      'AEO/GEO : Comment apparaître dans ChatGPT et les moteurs de réponses IA',
    intro:
      'Les moteurs de réponses IA comme ChatGPT, Claude et Perplexity changent la façon dont les utilisateurs trouvent des informations. Voici comment optimiser votre présence pour ces nouvelles sources de trafic.',
    sections: [
      {
        title: "1) Comprendre l'AEO (Answer Engine Optimization)",
        content:
          "L'AEO consiste à optimiser votre contenu pour qu'il soit cité par les IA conversationnelles. Contrairement au SEO traditionnel qui cible les résultats de recherche, l'AEO vise les réponses directes générées par l'IA.",
      },
      {
        title: '2) Créer du contenu structuré et factuel',
        content:
          'Les IA privilégient le contenu bien structuré, factuel et à jour. Utilisez des listes, des tableaux, des FAQ et des données vérifiables. Évitez le contenu générique ou trop promotionnel.',
      },
      {
        title: '3) Optimiser avec des schémas JSON-LD',
        content:
          "Les schémas structurés (FAQPage, Article, LocalBusiness) aident les IA à comprendre votre contenu. Assurez-vous d'inclure des FAQPage sur vos pages principales et des Article sur vos articles de blog.",
      },
      {
        title: '4) Cibler les requêtes conversationnelles',
        content:
          'Les utilisateurs posent des questions naturelles aux IA ("Comment optimiser mon site pour la Loi 25 ?"). Créez du contenu qui répond directement à ces questions avec des réponses claires et concises.',
      },
      {
        title: '5) Maintenir la cohérence NAP',
        content:
          'Pour le GEO (Google Engine Optimization), assurez-vous que votre Nom, Adresse et Téléphone sont cohérents partout : site web, Google Business Profile, annuaires locaux. Les IA vérifient cette cohérence.',
      },
      {
        title: '6) Publier régulièrement du contenu',
        content:
          'Les IA privilégient les sources récentes et régulièrement mises à jour. Publiez du contenu frais régulièrement et mettez à jour vos pages existantes avec de nouvelles informations.',
      },
      {
        title: '7) Utiliser des citations et sources',
        content:
          'Les IA aiment citer des sources fiables. Incluez des citations, des statistiques vérifiables et des liens vers des sources autoritaires dans votre contenu.',
      },
      {
        title: '8) Optimiser pour la recherche vocale',
        content:
          "Les requêtes vocales sont souvent plus longues et conversationnelles. Créez du contenu qui répond à des questions complètes plutôt qu'à des mots-clés isolés.",
      },
      {
        title: '9) Surveiller votre présence IA',
        content:
          'Testez régulièrement votre présence dans ChatGPT, Claude et Perplexity. Posez des questions pertinentes à votre secteur et voyez si votre entreprise est mentionnée.',
      },
      {
        title: '10) Combiner AEO et SEO traditionnel',
        content:
          "L'AEO complète le SEO, ne le remplace pas. Continuez d'optimiser pour Google Search tout en créant du contenu adapté aux IA. Les deux stratégies se renforcent mutuellement.",
      },
    ],
    cta: {
      title: "Besoin d'aide pour optimiser votre présence IA ?",
      description:
        'Contactez-nous pour découvrir comment nous pouvons vous aider à apparaître dans ChatGPT et améliorer votre visibilité dans les moteurs de réponses IA.',
      button: 'Planifier un diagnostic',
    },
  },
  en: {
    title: 'AEO/GEO: How to Appear in ChatGPT and AI Answer Engines',
    intro:
      "AI answer engines like ChatGPT, Claude, and Perplexity are changing how users find information. Here's how to optimize your presence for these new traffic sources.",
    sections: [
      {
        title: '1) Understanding AEO (Answer Engine Optimization)',
        content:
          'AEO involves optimizing your content to be cited by conversational AIs. Unlike traditional SEO targeting search results, AEO targets direct answers generated by AI.',
      },
      {
        title: '2) Create structured and factual content',
        content:
          'AIs favor well-structured, factual, and up-to-date content. Use lists, tables, FAQs, and verifiable data. Avoid generic or overly promotional content.',
      },
      {
        title: '3) Optimize with JSON-LD schemas',
        content:
          'Structured schemas (FAQPage, Article, LocalBusiness) help AIs understand your content. Make sure to include FAQPage on your main pages and Article on your blog posts.',
      },
      {
        title: '4) Target conversational queries',
        content:
          'Users ask natural questions to AIs ("How do I optimize my site for Law 25?"). Create content that directly answers these questions with clear and concise responses.',
      },
      {
        title: '5) Maintain NAP consistency',
        content:
          'For GEO (Google Engine Optimization), ensure your Name, Address, and Phone are consistent everywhere: website, Google Business Profile, local directories. AIs check this consistency.',
      },
      {
        title: '6) Publish content regularly',
        content:
          'AIs favor recent and regularly updated sources. Publish fresh content regularly and update existing pages with new information.',
      },
      {
        title: '7) Use citations and sources',
        content:
          'AIs like to cite reliable sources. Include citations, verifiable statistics, and links to authoritative sources in your content.',
      },
      {
        title: '8) Optimize for voice search',
        content:
          'Voice queries are often longer and conversational. Create content that answers complete questions rather than isolated keywords.',
      },
      {
        title: '9) Monitor your AI presence',
        content:
          'Regularly test your presence in ChatGPT, Claude, and Perplexity. Ask relevant questions to your sector and see if your business is mentioned.',
      },
      {
        title: '10) Combine AEO and traditional SEO',
        content:
          "AEO complements SEO, it doesn't replace it. Continue optimizing for Google Search while creating AI-adapted content. Both strategies reinforce each other.",
      },
    ],
    cta: {
      title: 'Need help optimizing your AI presence?',
      description:
        'Contact us to discover how we can help you appear in ChatGPT and improve your visibility in AI answer engines.',
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
      '@type': 'Organization',
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
    articleSection: 'SEO',
    keywords:
      locale === 'fr'
        ? ['AEO', 'GEO', 'ChatGPT', 'optimisation IA', 'moteurs de réponses']
        : ['AEO', 'GEO', 'ChatGPT', 'AI optimization', 'answer engines'],
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
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
