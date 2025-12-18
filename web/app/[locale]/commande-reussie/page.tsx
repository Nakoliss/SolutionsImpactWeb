import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import CommandeReussieContent from './CommandeReussieContent';

interface CommandeReussiePageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({
  params,
}: CommandeReussiePageProps): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Commande réussie',
    description: 'Confirmation de commande',
    locale,
    noindex: true,
    canonical: '/commande-reussie',
    alternateLocales: [...SUPPORTED_LOCALES],
  });
}

export default async function CommandeReussiePage({
  params,
}: CommandeReussiePageProps) {
  const { locale } = await params;

  return <CommandeReussieContent locale={locale} />;
}
