import Script from 'next/script';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { ServiceGrid } from '@/components/ServiceGrid';
import ResourcesSection from '@/components/ResourcesSection';
import { fetchServicesForStaticProps } from '@/data/services';
import { buildLocalePath, buildLocaleUrl } from '@/lib/localeRouting';
import { buildServicesItemListJsonLd } from '@/lib/seo/servicesJsonLd';
import { SITE_URL, generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

interface ServicesPageProps {
  params: {
    locale: SupportedLocale;
  };
}

const SERVICES_COPY = {
  fr: frMessages.services,
  en: enMessages.services,
};

const SERVICE_GRID_MESSAGES = {
  fr: {
    loading: 'Chargement des services...',
    empty: 'Aucun service disponible pour le moment. Revenez bientot.',
    tiersAria: 'Paliers du service',
    detailsSoon: 'Les details de ce service arrivent bientot.',
    priceAria: 'Prix',
    setupCostAria: 'Frais de configuration',
    closeButton: 'Fermer',
    clickForDetails: 'Cliquez pour voir les détails',
  },
  en: {
    loading: 'Loading services...',
    empty: 'No services available at the moment. Please check back soon.',
    tiersAria: 'Service tiers',
    detailsSoon: 'Details for this service are coming soon.',
    priceAria: 'Price',
    setupCostAria: 'Setup cost',
    closeButton: 'Close',
    clickForDetails: 'Click for details',
  },
};

export const revalidate = 3600;

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const servicesResult = await fetchServicesForStaticProps(locale);
  const servicesCopy = SERVICES_COPY[locale] ?? SERVICES_COPY.fr;
  const serviceSubtitleLines = servicesCopy.subtitle
    .split('\n')
    .filter(Boolean);
  const gridMessages =
    SERVICE_GRID_MESSAGES[locale] ?? SERVICE_GRID_MESSAGES.fr;

  const jsonLd = buildServicesItemListJsonLd({
    locale,
    services: servicesResult.catalog.services,
    pageUrl: buildLocaleUrl(SITE_URL, locale, '/services'),
    sectionId: 'service',
  });
  const homePath = buildLocalePath(locale);

  return (
    <>
      <div className="bg-slate-950 text-slate-100">
        <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              {locale === 'fr' ? 'Nos services' : 'Our services'}
            </span>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {servicesCopy.title}
            </h1>
            <div className="mt-4 space-y-4 text-base text-slate-300">
              {serviceSubtitleLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${homePath}#contact`}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-slate-950 transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                {locale === 'fr' ? 'Parler à l’équipe' : 'Talk to the team'}
              </Link>
              <Link
                href={`${homePath}#services`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-cyan-400/60 hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                {locale === 'fr'
                  ? 'Voir la section de la page d’accueil'
                  : 'Jump to home section'}
              </Link>
            </div>
          </div>
        </section>

        <section
          id="service-list"
          className="border-b border-white/10 bg-slate-950"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <ServiceGrid
              services={servicesResult.catalog.services}
              isLoading={false}
              messages={gridMessages}
            />
          </div>
        </section>
      </div>
      <ResourcesSection locale={locale} />
      <Script
        id={`services-page-jsonld-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </>
  );
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const title =
    locale === 'fr'
      ? 'Nos services bilingues | Solutions Impact Web'
      : 'Our bilingual services | Solutions Impact Web';
  const description =
    locale === 'fr'
      ? 'Découvrez la liste complète de nos services web et marketing bilingues, optimisés pour la Loi 25 et la performance.'
      : 'Explore the full catalog of bilingual web and marketing services optimized for Law 25 compliance and measurable performance.';

  return generateSEOMetadata({
    title,
    description,
    locale,
    canonical: buildLocalePath(locale, '/services'),
    alternateLocales: SUPPORTED_LOCALES,
  });
}

