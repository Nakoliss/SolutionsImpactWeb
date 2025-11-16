import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import CanonicalLink from '@/components/CanonicalLink';
import DownloadGate from '@/components/DownloadGate';
import HrefLangLinks from '@/components/HrefLangLinks';
import { CONTENT_CATEGORIES, type ContentCategory, SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { contentExists, getContentBySlug, getContentSlugs } from '@/lib/mdx';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';

interface ContentPageProps {
  params: {
    locale: SupportedLocale;
    category: string;
    slug: string;
  };
}

// Generate static paths for all content
export async function generateStaticParams() {
  const params: Array<{ locale: SupportedLocale; category: string; slug: string }> = [];
  
  for (const category of Object.keys(CONTENT_CATEGORIES)) {
    const slugs = getContentSlugs(category as ContentCategory);
    
    for (const slug of slugs) {
      for (const locale of SUPPORTED_LOCALES) {
        if (contentExists(category as ContentCategory, slug, locale)) {
          params.push({
            locale,
            category,
            slug
          });
        }
      }
    }
  }
  
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ContentPageProps) {
  const { locale, category, slug } = params;
  
  // Validate category
  if (!Object.keys(CONTENT_CATEGORIES).includes(category)) {
    return {};
  }
  
  const content = getContentBySlug(category as ContentCategory, slug, locale);
  
  if (!content) {
    return {};
  }
  
  return generateBaseMetadata({
    title: content.metadata.title,
    description: content.metadata.description,
    locale,
    alternateLocales: content.metadata.localeAvail,
    canonical: `/content/${category}/${slug}`,
    openGraph: {
      type: 'article',
      publishedTime: content.metadata.publishedAt,
      modifiedTime: content.metadata.updatedAt,
      ...(content.metadata.author && { authors: [content.metadata.author] }),
      ...(content.metadata.tags && { tags: content.metadata.tags })
    }
  });
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { locale, category, slug } = params;
  
  // Validate category
  if (!Object.keys(CONTENT_CATEGORIES).includes(category)) {
    notFound();
  }
  
  const content = getContentBySlug(category as ContentCategory, slug, locale);
  
  if (!content) {
    notFound();
  }
  
  const categoryInfo = CONTENT_CATEGORIES[category as ContentCategory];
  const contactHref = buildLocalePath(locale, '/contact');
  const servicesHref = `${buildLocalePath(locale)}#services`;
  
  return (
    <div className="min-h-screen bg-white">
      <CanonicalLink 
        locale={locale} 
        path={`/content/${category}/${slug}`} 
      />
      <HrefLangLinks 
        currentLocale={locale} 
        path={`/content/${category}/${slug}`} 
      />
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {categoryInfo.name}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.metadata.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {content.metadata.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-6">
            {content.metadata.author && (
              <span>Par {content.metadata.author}</span>
            )}
            
            {content.metadata.readTime && (
              <span>{content.metadata.readTime} min de lecture</span>
            )}
            
            <time dateTime={content.metadata.publishedAt}>
              {new Date(content.metadata.publishedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {content.metadata.tags && content.metadata.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {content.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <MDXRemote source={content.content} components={{ DownloadGate }} />
        </article>
        
        {/* Lead capture form */}
        {content.metadata.leadForm && (
          <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Besoin d&apos;aide avec votre projet ?
              </h3>
              <p className="text-gray-600 mb-6">
                Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={contactHref}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Consultation gratuite
                </a>
                <a
                  href={servicesHref}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Voir nos services
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Alternate language link */}
        {content.metadata.localeAvail.length > 1 && (
          <div className="mt-8 text-center">
            {content.metadata.localeAvail
              .filter(altLocale => altLocale !== locale)
              .map(altLocale => (
                <a
                  key={altLocale}
                  href={buildLocalePath(altLocale as SupportedLocale, `/content/${category}/${slug}`)}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {altLocale === 'en' ? 'Read in English' : 'Lire en français'}
                </a>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
