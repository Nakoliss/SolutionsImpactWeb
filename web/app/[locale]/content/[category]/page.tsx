import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  CONTENT_CATEGORIES,
  type ContentCategory,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { getCategoryContent } from '@/lib/mdx';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';

interface CategoryPageProps {
  params: Promise<{
    locale: SupportedLocale;
    category: string;
  }>;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const params: Array<{ locale: SupportedLocale; category: string }> = [];

  for (const category of Object.keys(CONTENT_CATEGORIES)) {
    for (const locale of SUPPORTED_LOCALES) {
      params.push({
        locale,
        category,
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata(props: CategoryPageProps) {
  const params = await props.params;
  const { locale, category } = params;

  // Validate category
  if (!Object.keys(CONTENT_CATEGORIES).includes(category)) {
    return {};
  }

  // const categoryInfo = CONTENT_CATEGORIES[category as ContentCategory];

  const titles = {
    fr: {
      guides: 'Guides et Tutoriels',
      pricing: 'Tarification et Prix',
      compliance: 'Conformité et Réglementation',
    },
    en: {
      guides: 'Guides and Tutorials',
      pricing: 'Pricing and Rates',
      compliance: 'Compliance and Regulation',
    },
  };

  const descriptions = {
    fr: {
      guides:
        'Découvrez nos guides complets sur le marketing numérique, le SEO et les technologies web pour optimiser votre présence en ligne.',
      pricing:
        "Consultez notre grille tarifaire transparente pour nos services de marketing numérique alimentés par l'IA.",
      compliance:
        'Ressources et guides de conformité pour respecter la réglementation québécoise en matière de protection des données.',
    },
    en: {
      guides:
        'Discover our comprehensive guides on digital marketing, SEO and web technologies to optimize your online presence.',
      pricing:
        'View our transparent pricing structure for our AI-powered digital marketing services.',
      compliance:
        'Compliance resources and guides to meet Quebec data protection regulations.',
    },
  };

  const title =
    titles[locale][category as keyof (typeof titles)[typeof locale]];
  const description =
    descriptions[locale][
      category as keyof (typeof descriptions)[typeof locale]
    ];

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: `/content/${category}`,
  });
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const { locale, category } = params;

  // Validate category
  if (!Object.keys(CONTENT_CATEGORIES).includes(category)) {
    notFound();
  }

  // const categoryInfo = CONTENT_CATEGORIES[category as ContentCategory];
  const content = getCategoryContent(category as ContentCategory, locale);

  // Group content by slug to handle bilingual versions
  const contentBySlug = content.reduce(
    (acc, item) => {
      if (!acc[item.slug]) {
        acc[item.slug] = item;
      }
      return acc;
    },
    {} as Record<string, (typeof content)[0]>
  );

  const uniqueContent = Object.values(contentBySlug);

  const titles = {
    fr: {
      guides: 'Guides et Tutoriels',
      pricing: 'Tarification et Prix',
      compliance: 'Conformité et Réglementation',
    },
    en: {
      guides: 'Guides and Tutorials',
      pricing: 'Pricing and Rates',
      compliance: 'Compliance and Regulation',
    },
  };

  const descriptions = {
    fr: {
      guides:
        'Découvrez nos guides complets pour optimiser votre présence numérique.',
      pricing:
        'Consultez notre grille tarifaire transparente pour nos services IA.',
      compliance: 'Ressources de conformité pour la réglementation québécoise.',
    },
    en: {
      guides:
        'Discover our comprehensive guides to optimize your digital presence.',
      pricing: 'View our transparent pricing for our AI services.',
      compliance: 'Compliance resources for Quebec regulations.',
    },
  };

  const title =
    titles[locale][category as keyof (typeof titles)[typeof locale]];
  const description =
    descriptions[locale][
      category as keyof (typeof descriptions)[typeof locale]
    ];
  const homePath = buildLocalePath(locale);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-950 border-b border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/50 to-transparent opacity-50" />
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[140%] bg-[#2563eb]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <nav className="mb-6">
            <Link
              href={homePath}
              className="text-[#38bdf8] hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
            >
              <span className="transform transition-transform group-hover:-translate-x-1">
                ←
              </span>
              {locale === 'fr' ? "Retour à l'accueil" : 'Back to home'}
            </Link>
          </nav>

          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[rgba(56,189,248,0.1)] text-[#38bdf8] border border-[#38bdf8]/20">
              {CONTENT_CATEGORIES[category as ContentCategory].name}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      {/* Content Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {uniqueContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {locale === 'fr'
                ? 'Aucun contenu disponible dans cette catégorie.'
                : 'No content available in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {uniqueContent.map((item) => (
              <article
                key={item.slug}
                className="bg-slate-900/50 border border-white/10 rounded-lg shadow-sm hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-[#38bdf8]/30 transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <time
                      dateTime={item.metadata.publishedAt}
                      className="text-sm text-slate-500 font-medium"
                    >
                      {new Date(item.metadata.publishedAt).toLocaleDateString(
                        locale,
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </time>

                    {item.metadata.readTime && (
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                        {item.metadata.readTime} min
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#38bdf8] transition-colors">
                    {item.metadata.title}
                  </h2>

                  <p className="text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                    {item.metadata.description}
                  </p>

                  <div className="mt-auto">
                    {item.metadata.tags && item.metadata.tags.length > 0 && (
                      <div className="mb-5 flex flex-wrap gap-2">
                        {item.metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={buildLocalePath(
                        locale,
                        `/content/${category}/${item.slug}`
                      )}
                      className="inline-flex items-center text-[#38bdf8] hover:text-white font-semibold text-sm group/link"
                    >
                      {locale === 'fr' ? 'Lire la suite' : 'Read more'}
                      <svg
                        className="ml-2 w-4 h-4 transform transition-transform group-hover/link:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {locale === 'fr'
                  ? "Besoin d'aide personnalisée ?"
                  : 'Need personalized help?'}
              </h3>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
                {locale === 'fr'
                  ? 'Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider à atteindre vos objectifs numèriques.'
                  : 'Contact us for a free consultation and discover how we can help you achieve your digital goals.'}
              </p>
              <Link
                href={buildLocalePath(locale, '/contact')}
                className="inline-flex items-center px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2563eb] to-[#38bdf8] hover:from-[#1e40af] hover:to-[#0ea5e9] shadow-[0_4px_14px_0_rgba(56,189,248,0.39)] hover:shadow-[0_6px_20px_rgba(56,189,248,0.23)] hover:-translate-y-1 transition-all duration-300"
              >
                {locale === 'fr'
                  ? 'Consultation gratuite'
                  : 'Free consultation'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
