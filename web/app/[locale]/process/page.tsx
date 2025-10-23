import { notFound } from 'next/navigation';

import { ProcessPageContent } from '@/components/ProcessPageContent';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface ProcessPageProps {
    params: Promise<{
        locale: SupportedLocale;
    }>;
}

export async function generateMetadata({ params }: ProcessPageProps) {
    const { locale } = await params;

  const title = locale === 'fr'
        ? 'Notre processus | Agence web: Solutions Impact Web'
        : 'Our process | Web agency: Solutions Impact Web';

    const description = locale === 'fr'
        ? 'Découvrez notre méthodologie éprouvée pour livrer des projets de qualité. Processus structuré, communication transparente et résultats garantis.'
        : 'Discover our proven methodology for delivering quality projects. Structured process, transparent communication, and guaranteed results.';

    return generateSEOMetadata({
        title,
        description,
        locale
    });
}

export default async function ProcessPage({ params }: ProcessPageProps) {
    const { locale } = await params;

    if (!['fr', 'en'].includes(locale)) {
        notFound();
    }

    return <ProcessPageContent locale={locale} />;
}
