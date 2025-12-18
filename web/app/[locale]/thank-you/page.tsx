import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import ThankYouContent from './ThankYouContent';

interface ThankYouPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({
  params,
}: ThankYouPageProps): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Thank You',
    description: 'Confirmation',
    locale,
    noindex: true,
    canonical: '/thank-you',
    alternateLocales: [...SUPPORTED_LOCALES],
  });
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { locale } = await params;

  return <ThankYouContent locale={locale} />;
}
