import StructuredData from '@/components/StructuredData';
import FAQPageClient from '@/components/FAQPageClient';
import type { SupportedLocale } from '@/content';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { getSeoFaq } from '@/lib/seo/structuredData';

interface FAQPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;
  const title = locale === 'fr'
    ? 'FAQ SEO Local, Google et Loi 25 | Solutions Impact Web'
    : 'Local SEO, Google and Law 25 FAQ | Solutions Impact Web';
  const description = locale === 'fr'
    ? 'Réponses aux questions fréquentes sur le SEO local, Google Business Profile, l\'AEO et la conformité Loi 25 pour les PME du Québec.'
    : 'Answers to frequently asked questions about local SEO, Google Business Profile, AEO, and Law 25 compliance for Quebec SMEs.';

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: '/faq',
    keywords: locale === 'fr'
      ? ['FAQ SEO', 'SEO local', 'Google Business Profile', 'Loi 25', 'AEO', 'Québec']
      : ['SEO FAQ', 'local SEO', 'Google Business Profile', 'Law 25', 'AEO', 'Quebec'],
  });
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const faq = getSeoFaq(locale);

  const copy = {
    fr: {
      title: 'FAQ SEO Local, Google et Loi 25',
      subtitle: 'Réponses aux questions fréquentes sur le SEO local, Google Business Profile, l\'AEO et la conformité Loi 25',
      ctaTitle: 'Besoin d\'aide avec votre SEO local ?',
      ctaDescription: 'Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons améliorer votre visibilité Google.',
      ctaButton: 'Consultation gratuite',
    },
    en: {
      title: 'Local SEO, Google and Law 25 FAQ',
      subtitle: 'Answers to frequently asked questions about local SEO, Google Business Profile, AEO, and Law 25 compliance',
      ctaTitle: 'Need help with your local SEO?',
      ctaDescription: 'Contact us for a free consultation and discover how we can improve your Google visibility.',
      ctaButton: 'Free consultation',
    },
  };

  const currentCopy = copy[locale];

  return (
    <>
      <StructuredData locale={locale} faq={faq} organization localBusiness />
      <FAQPageClient locale={locale} faq={faq} copy={currentCopy} />
    </>
  );
}

