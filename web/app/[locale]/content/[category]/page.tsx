import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CONTENT_CATEGORIES, type ContentCategory, SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { getCategoryContent } from '@/lib/mdx';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';

interface CategoryPageProps {
  params: {
    locale: SupportedLocale;
    category: string;
  };
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const params: Array<{ locale: SupportedLocale; category: string }> = [];
  
  for (const category of Object.keys(CONTENT_CATEGORIES)) {
    for (const locale of SUPPORTED_LOCALES) {
      params.push({
        locale,
        category
      });
    }
  }
  
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
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
      compliance: 'Conformité et Réglementation'
    },
    en: {
      guides: 'Guides and Tutorials',
      pricing: 'Pricing and Rates',
      compliance: 'Compliance and Regulation'
    }
  };
  
  const descriptions = {
    fr: {
      guides: 'Découvrez nos guides complets sur le marketing numérique, le SEO et les technologies web pour optimiser votre présence en ligne.',
      pricing: 'Consultez notre grille tarifaire transparente pour nos services de marketing numérique alimentés par l\'IA.',
      compliance: 'Ressources et guides de conformité pour respecter la réglementation québécoise en matière de protection des données.'
    },
    en: {
      guides: 'Discover our comprehensive guides on digital marketing, SEO and web technologies to optimize your online presence.',
      pricing: 'View our transparent pricing structure for our AI-powered digital marketing services.',
      compliance: 'Compliance resources and guides to meet Quebec data protection regulations.'
    }
  };
  
  const title = titles[locale][category as keyof typeof titles[typeof locale]];
  const description = descriptions[locale][category as keyof typeof descriptions[typeof locale]];
  
  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: `/content/${category}`
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = params;
  
  // Validate category
  if (!Object.keys(CONTENT_CATEGORIES).includes(category)) {
    notFound();
  }
  
  // const categoryInfo = CONTENT_CATEGORIES[category as ContentCategory];
  const content = getCategoryContent(category as ContentCategory)
    .filter(item => item.metadata.localeAvail.includes(locale));
  
  // Group content by slug to handle bilingual versions
  const contentBySlug = content.reduce((acc, item) => {
    if (!acc[item.slug]) {
      acc[item.slug] = item;
    }
    return acc;
  }, {} as Record<string, typeof content[0]>);
  
  const uniqueContent = Object.values(contentBySlug);
  
  const titles = {
    fr: {
      guides: 'Guides et Tutoriels',
      pricing: 'Tarification et Prix',
      compliance: 'Conformité et Réglementation'
    },
    en: {
      guides: 'Guides and Tutorials',
      pricing: 'Pricing and Rates',
      compliance: 'Compliance and Regulation'
    }
  };
  
  const descriptions = {
    fr: {
      guides: 'Découvrez nos guides complets pour optimiser votre présence numérique.',
      pricing: 'Consultez notre grille tarifaire transparente pour nos services IA.',
      compliance: 'Ressources de conformité pour la réglementation québécoise.'
    },
    en: {
      guides: 'Discover our comprehensive guides to optimize your digital presence.',
      pricing: 'View our transparent pricing for our AI services.',
      compliance: 'Compliance resources for Quebec regulations.'
    }
  };
  
  const title = titles[locale][category as keyof typeof titles[typeof locale]];
  const description = descriptions[locale][category as keyof typeof descriptions[typeof locale]];
  const homePath = buildLocalePath(locale);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav className="mb-6">
            <Link
              href={homePath}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← {locale === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </nav>
          
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {CONTENT_CATEGORIES[category as ContentCategory].name}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl">
            {description}
          </p>
        </div>
      </header>
      
      {/* Content Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {uniqueContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
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
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <time
                      dateTime={item.metadata.publishedAt}
                      className="text-sm text-gray-500"
                    >
                      {new Date(item.metadata.publishedAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    
                    {item.metadata.readTime && (
                      <span className="text-sm text-gray-500">
                        {item.metadata.readTime} min
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.metadata.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.metadata.description}
                  </p>
                  
                  {item.metadata.tags && item.metadata.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {item.metadata.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href={buildLocalePath(locale, `/content/${category}/${item.slug}`)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {locale === 'fr' ? 'Lire la suite' : 'Read more'}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'fr' 
                ? 'Besoin d\'aide personnalisée ?'
                : 'Need personalized help?'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {locale === 'fr'
                ? 'Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider à atteindre vos objectifs.'
                : 'Contact us for a free consultation and discover how we can help you achieve your goals.'}
            </p>
            <Link
              href={buildLocalePath(locale, '/contact')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {locale === 'fr' ? 'Consultation gratuite' : 'Free consultation'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}