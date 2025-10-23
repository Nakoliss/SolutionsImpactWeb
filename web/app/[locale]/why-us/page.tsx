import { notFound } from 'next/navigation';

import { WhyUsPageContent } from '@/components/WhyUsPageContent';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface WhyUsPageProps {
    params: Promise<{
        locale: SupportedLocale;
    }>;
}

export async function generateMetadata({ params }: WhyUsPageProps) {
    const { locale } = await params;

  const title = locale === 'fr'
    ? 'Pourquoi nous choisir | Agence web: Solutions Impact Web'
    : 'Why choose us | Web agency: Solutions Impact Web';

    const description = locale === 'fr'
        ? 'Découvrez ce qui nous distingue : livraison bilingue native, adoption responsable de l\'IA, impact mesurable et équipe basée au Québec.'
        : 'Discover what sets us apart: native bilingual delivery, responsible AI adoption, measurable impact, and Quebec-based team.';

    return generateSEOMetadata({
        title,
        description,
        locale
    });
}



export default async function WhyUsPage({ params }: WhyUsPageProps) {
    const { locale } = await params;

    if (!['fr', 'en'].includes(locale)) {
        notFound();
    }

    return <WhyUsPageContent locale={locale} />;
}
