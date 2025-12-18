import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import MerciContent from './MerciContent';

interface MerciPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({
  params,
}: MerciPageProps): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Merci',
    description: 'Confirmation',
    locale,
    noindex: true,
    canonical: '/merci',
    alternateLocales: [...SUPPORTED_LOCALES],
  });
}

export default async function MerciPage({ params }: MerciPageProps) {
  const { locale } = await params;

  return <MerciContent locale={locale} />;
}
