import { notFound } from 'next/navigation';

import PackagesPageContent from '@/components/PackagesPageContent';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface PackagesPageProps {
    params: Promise<{
        locale: SupportedLocale;
    }>;
}

export async function generateMetadata({ params }: PackagesPageProps) {
    const { locale } = await params;

    const title = locale === 'fr'
        ? 'Forfaits Signature | AI Web Agency'
        : 'Signature Packages | AI Web Agency';

    const description = locale === 'fr'
        ? 'Découvrez nos forfaits signature conçus pour répondre aux besoins spécifiques de votre entreprise. Solutions complètes et personnalisées.'
        : 'Discover our signature packages designed to meet your business specific needs. Complete and customized solutions.';

    return generateSEOMetadata({
        title,
        description,
        locale
    });
}



export default async function PackagesPage({ params }: PackagesPageProps) {
    const { locale } = await params;

    if (!['fr', 'en'].includes(locale)) {
        notFound();
    }

    return <PackagesPageContent locale={locale} />;
}