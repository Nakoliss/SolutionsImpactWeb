import Script from 'next/script';
import { notFound } from 'next/navigation';

import BusinessCarousel from '@/components/BusinessCarousel';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { fetchServicesForStaticProps } from '@/data/services';
import { buildLocalePath, buildLocaleUrl } from '@/lib/localeRouting';
import { buildServicesItemListJsonLd } from '@/lib/seo/servicesJsonLd';
import { SITE_URL, generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface HomePageProps {
  params: {
    locale: SupportedLocale;
  };
}

export const revalidate = 3600;

export async function renderHomePage(locale: SupportedLocale) {
  const servicesResult = await fetchServicesForStaticProps(locale);
  const servicesJsonLd = buildServicesItemListJsonLd({
    locale,
    services: servicesResult.catalog.services,
    pageUrl: buildLocaleUrl(SITE_URL, locale),
    sectionId: 'services',
  });

  return (
    <>
      <BusinessCarousel
        key={locale}
        locale={locale}
        initialServiceCatalog={servicesResult.catalog}
        disableClientPrefetch
      />
      <Script
        id={`services-list-jsonld-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: servicesJsonLd }}
      />
    </>
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return renderHomePage(locale);
}

export async function buildHomeMetadata(locale: SupportedLocale) {
  const title = locale === 'fr'
    ? 'Marketing numérique bilingue et intelligent | Agence web: Solutions Impact Web'
    : 'Bilingual & intelligent digital marketing | Web agency: Solutions Impact Web';

  const description = locale === 'fr'
    ? 'Transformez votre présence numérique avec nos services de marketing intelligent. Expertise bilingue, technologies de pointe, résultats mesurables.'
    : 'Transform your digital presence with intelligent marketing services. Bilingual expertise, cutting-edge tech, measurable results.';

  const canonicalPath = locale === 'fr' ? '/' : buildLocalePath(locale);

  return generateSEOMetadata({
    title,
    description,
    locale,
    canonical: canonicalPath,
    alternateLocales: SUPPORTED_LOCALES,
  });
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return buildHomeMetadata(locale);
}
