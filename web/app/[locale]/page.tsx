import Script from 'next/script';
import { notFound } from 'next/navigation';

import BusinessCarousel from '@/components/BusinessCarousel';
import type { SupportedLocale } from '@/content';
import { fetchServicesForStaticProps } from '@/data/services';
import { buildServicesItemListJsonLd } from '@/lib/seo/servicesJsonLd';
import { SITE_URL, generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface HomePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export const revalidate = 3600;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const servicesResult = await fetchServicesForStaticProps(locale);
  const servicesJsonLd = buildServicesItemListJsonLd({
    locale,
    services: servicesResult.catalog.services,
    pageUrl: `${SITE_URL.replace(/\/$/, '')}/${locale}`,
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

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;

  const title = locale === 'fr'
    ? 'Marketing numérique bilingue et intelligent | Agence web: Solutions Impact Web'
    : 'Bilingual & intelligent digital marketing | Web agency: Solutions Impact Web';

  const description = locale === 'fr'
    ? 'Transformez votre présence numérique avec nos services de marketing intelligent. Expertise bilingue, technologies de pointe, résultats mesurables.'
    : 'Transform your digital presence with intelligent marketing services. Bilingual expertise, cutting-edge tech, measurable results.';

  return generateSEOMetadata({
    title,
    description,
    locale,
    canonical: '/'
  });
}
