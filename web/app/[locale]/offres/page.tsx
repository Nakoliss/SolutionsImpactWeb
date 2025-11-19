import { notFound } from 'next/navigation';

import Bundles from '@/components/Bundles';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';

interface OffresPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({ params }: OffresPageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {};
  }

  return generateBaseMetadata({
    title: 'Offres & Bundles — Essentials, Growth, Pro | Solutions Impact Web',
    description: 'Bundles clairs (OT + M) : Essentials, Growth, Pro. Loi 25 incluse, SEO/AEO, Social, Maintenance.',
    locale,
    canonical: '/offres',
  });
}

export default async function OffresPage({ params }: OffresPageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white py-16">
      <Bundles locale={locale} />
    </main>
  );
}

