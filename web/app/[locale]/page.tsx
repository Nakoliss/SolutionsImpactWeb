import { notFound } from 'next/navigation';

import BusinessCarousel from '@/components/BusinessCarousel';
import type { SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface HomePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return <BusinessCarousel key={locale} locale={locale} />;
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
