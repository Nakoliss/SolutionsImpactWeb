'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Brain,
  CheckCircle,
  Globe,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import type { SupportedLocale } from '@/content';
import { brandConfig, pickBrandLocale } from '@/lib/brand';
import {
  getDesignConfig,
} from '@/lib/businessDesigns';
import { scrollToContact } from '@/lib/scrollToContact';
import type { ServiceCatalog } from '@/lib/serviceLoader';
import { loadServicesDynamic } from '@/lib/serviceLoader';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';


import ClientOnlyContactForm from './ClientOnlyContactForm';
// Design selector hidden for launch (kept in repo)
// import DesignSelector from './DesignSelector';
import { ServiceGrid } from './ServiceGrid';
import { useDesignContext } from '@/lib/designContext';
import { useThemeTransition } from '@/hooks/useThemeTransition';
import { InlineThemeLoader } from './ThemeTransitionLoader';
import { setDesignInURL } from '@/lib/urlUtils';

interface BusinessCarouselProps {
  locale: SupportedLocale;
}

type BusinessMessages = typeof enMessages.business;

const BUSINESS_MESSAGES: Record<SupportedLocale, BusinessMessages> = {
  en: enMessages.business,
  fr: frMessages.business,
};



const EMPTY_CATALOG: ServiceCatalog = { services: [], totalServices: 0 };

// Internal component that uses design context
function BusinessCarouselContent({ locale }: BusinessCarouselProps) {
  const businessMessages = BUSINESS_MESSAGES[locale] ?? BUSINESS_MESSAGES.fr;
  const { currentDesign, setCurrentDesign } = useDesignContext();
  const { startTransition, isTransitioning } = useThemeTransition();

  const [serviceCatalog, setServiceCatalog] =
    useState<ServiceCatalog>(EMPTY_CATALOG);

  useEffect(() => {
    let isMounted = true;
    loadServicesDynamic(locale)
      .then((catalog) => {
        if (isMounted) {
          setServiceCatalog(catalog);
        }
      })
      .catch((error) => {
        console.error('Failed to load services catalog', error);
        if (isMounted) {
          setServiceCatalog(EMPTY_CATALOG);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);



  const designConfig = useMemo(
    () => getDesignConfig(currentDesign),
    [currentDesign],
  );


  const designMessages = businessMessages[designConfig.i18nKey as keyof typeof businessMessages] as Record<string, any>;
  const selectorMessages = businessMessages.designSelector;


  const servicesLoaded = serviceCatalog.totalServices > 0;

  const heroMessages = locale === 'fr' ? frMessages.hero : enMessages.hero;
  const servicesMessages = locale === 'fr' ? frMessages.services : enMessages.services;
  const contactMessages = locale === 'fr' ? frMessages.contact : enMessages.contact;
  const whyMessages = locale === 'fr' ? frMessages.why : enMessages.why;

  const eyebrow = pickBrandLocale(locale, brandConfig.tagline);
  const stats = [
    {
      value: servicesLoaded ? String(serviceCatalog.totalServices) : '...',
      label: heroMessages.stats.expertiseLabel,
    },
    { value: heroMessages.stats.clients, label: heroMessages.stats.clientsLabel },
    { value: heroMessages.stats.growth, label: heroMessages.stats.growthLabel },
  ];

  const heroStyle = {
    background: designConfig.theme.gradient,
    color: designConfig.theme.text,
  } as const;
  const heroOverlayStyle = {
    background: designConfig.theme.background,
    opacity: 0.72,
  } as const;



  const serviceEntries = Object.entries(designMessages.services);
  const catalogServices = serviceCatalog.services;

  const highlights = [
    {
      icon: Globe,
      title: whyMessages.bilingual.title,
      description: whyMessages.bilingual.description,
    },
    {
      icon: Brain,
      title: whyMessages.technology.title,
      description: whyMessages.technology.description,
    },
    {
      icon: TrendingUp,
      title: whyMessages.results.title,
      description: whyMessages.results.description,
    },
    {
      icon: Award,
      title: whyMessages.support.title,
      description: whyMessages.support.description,
    },
  ];

  const processSteps = locale === 'fr' ? [
    {
      title: 'Diagnostic 360',
      description: 'Audit du site, des parcours clients et des outils deja en place.',
    },
    {
      title: 'Co-creation strategique',
      description: 'Atelier bilingue pour aligner objectifs, audiences et offres.',
    },
    {
      title: 'Production et integration',
      description: 'Design, contenu, developpement et automatisations delivres en sprints courts.',
    },
    {
      title: 'Activation continue',
      description: 'Campagnes, experimentation et optimisation avec rapports mensuels.',
    },
  ] : [
    {
      title: '360 diagnostic',
      description: 'Audit of your digital presence, journeys, data, and compliance posture.',
    },
    {
      title: 'Strategy co-design',
      description: 'Bilingual workshop to align goals, audiences, and success metrics.',
    },
    {
      title: 'Production sprints',
      description: 'Design, content, development, and automation delivered in focused sprints.',
    },
    {
      title: 'Continuous activation',
      description: 'Campaigns, experimentation, and optimization with monthly reporting.',
    },
  ];

  const compliancePoints = locale === 'fr' ? [
    'Politiques de confidentialite bilingues et registre des fournisseurs tenus a jour.',
    'Banniere de consentement bloquante et gestion granulaire des cookies.',
    'Formulaires d acces et suppression des donnees avec suivi interne.',
  ] : [
    'Bilingual privacy policies and vendor registry kept current.',
    'Blocking consent banner with granular cookie controls.',
    'Documented data access and deletion workflows.',
  ];

  const testimonial = null;

  const svcMessages =
    locale === 'fr'
      ? {
        loading: 'Chargement des services...',
        empty: 'Aucun service disponible pour le moment. Revenez bientot.',
        tiersAria: 'Paliers du service',
        detailsSoon: 'Les details de ce service arrivent bientot.',
        priceAria: 'Prix',
        setupCostAria: "Frais de configuration",
        closeButton: 'Fermer',
        clickForDetails: 'Cliquez pour voir les détails',
      }
      : {
        loading: 'Loading services...',
        empty: 'No services available at the moment. Please check back soon.',
        tiersAria: 'Service tiers',
        detailsSoon: 'Details for this service are coming soon.',
        priceAria: 'Price',
        setupCostAria: 'Setup cost',
        closeButton: 'Close',
        clickForDetails: 'Click for details',
      };

  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="border-b border-white/10 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Design selector disabled for launch */}

            {/* Theme transition loading indicator */}
            {isTransitioning && (
              <div className="absolute top-4 right-4">
                <InlineThemeLoader size="sm" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="hero" className="relative overflow-hidden border-b border-white/10 scroll-mt-16">
        <div className="absolute inset-0" style={heroStyle} />
        <div className="absolute inset-0" style={heroOverlayStyle} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                {eyebrow}
              </span>
              <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {designMessages.heroTitle}
              </h1>
              <p className="text-base text-white/85 sm:text-lg">
                {designMessages.tagline}
              </p>
              <p className="text-sm text-white/70 sm:text-base">{heroMessages.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {designMessages.heroBadge}
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-slate-950 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {heroMessages.ctaPrimary}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <Link
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-cyan-400/60 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 hover:scale-105"
                >
                  {heroMessages.ctaSecondary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <dl className="mt-8 grid grid-cols-1 gap-4 text-sm text-white/90 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/20 bg-black/30 p-4"
                  >
                    <dt className="text-xs uppercase tracking-[0.3em] text-white/60">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-8 shadow-xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105">
              <h3 className="text-lg font-semibold text-white">
                {contactMessages.title}
              </h3>
              <p className="mt-3 text-sm text-white/80">
                {contactMessages.subtitle}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {[contactMessages.subtitle, whyMessages.bilingual.title, whyMessages.results.title].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={scrollToContact}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 hover:scale-105"
              >
                {contactMessages.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Removed duplicate summary grid to unify services presentation */}

      <section id="services" className="border-b border-white/10 bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {servicesMessages.title}
            </h2>
            <p className="mt-4 text-base text-slate-300">{servicesMessages.subtitle}</p>
            <div className="mt-6 flex items-center gap-3 rounded-3xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 shadow-[0_0_22px_rgba(251,191,36,0.25)] animate-pulse">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>
                {locale === 'fr'
                  ? "Offre de lancement : tarifs d'entrée réduits pour une durée limitée. Profitez-en avant qu'ils ne disparaissent."
                  : "Launch special pricing: entry tiers are reduced for a limited time. Grab it before it's gone."}
              </span>
            </div>
          </div>
          <ServiceGrid
            services={catalogServices}
            isLoading={!servicesLoaded}
            messages={svcMessages}
          />
        </div>
      </section>

      <section id="why" className="relative border-t border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 scroll-mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/10 via-transparent to-cyan-950/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {locale === 'fr' ? 'Nos avantages' : 'Our advantages'}
                </span>
              </div>
              <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {whyMessages.title}
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-6 transition-all duration-300 hover:border-sky-400/30 hover:bg-gradient-to-br hover:from-sky-950/20 hover:via-black/30 hover:to-black/20 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-500/20 text-sky-300 ring-1 ring-sky-400/20 transition-all duration-300 group-hover:from-sky-400/30 group-hover:to-cyan-400/30 group-hover:text-sky-200 group-hover:ring-sky-400/40 group-hover:shadow-lg group-hover:shadow-sky-400/20">
                      <highlight.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-sky-100 transition-colors duration-300">
                        {highlight.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 id="process" className="text-3xl font-semibold sm:text-4xl scroll-mt-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {locale === 'fr' ? 'Notre approche' : 'Our delivery approach'}
              </h2>
              <p className="mt-4 text-base text-slate-300">
                {locale === 'fr' ? 'Un parcours en quatre phases pour passer de la vision a la croissance.' : 'Four phases to move from vision to measurable impact.'}
              </p>
              <ol className="mt-8 space-y-6">
                {processSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-300">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="border-t border-white/10 bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-16">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-8 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105">
              <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {locale === 'fr' ? 'Conformite Loi 25 integree' : 'Law 25 compliance built in'}
              </h2>
              <p className="mt-4 text-base text-slate-300">
                {locale === 'fr' ? 'Des modeles et processus internes pour operer en toute transparence.' : 'Internal templates and processes keep operations transparent.'}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {compliancePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-sky-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Testimonials card (right column) */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-lg transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105">
              <h3 className="text-2xl font-semibold text-white">{locale === 'fr' ? 'Témoignages' : 'Testimonials'}</h3>
              <blockquote className="mt-4 text-slate-200">
                {locale === 'fr'
                  ? 'Pas encore de témoignages — nos clients sont trop occupés à réussir. Revenez bientôt!'
                  : 'No testimonials yet — our clients are busy succeeding. Check back soon!'}
              </blockquote>
              <p className="mt-3 text-sm text-slate-300">
                {locale === 'fr'
                  ? 'Psst : si vous lisez ceci après votre projet, on prendrait volontiers votre avis (promis, on fournit le café).'
                  : 'Psst: if you’re reading this after your project, we’d love your thoughts (coffee on us).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="assessment" className="border-t border-white/10 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {contactMessages.title}
          </h2>
          <p className="mt-4 text-base text-slate-100 sm:text-lg">
            {contactMessages.subtitle}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200">
            {[whyMessages.bilingual.title, whyMessages.results.title, whyMessages.support.title].map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2"
              >
                <CheckCircle className="h-4 w-4 text-white" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {contactMessages.cta} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <a
              href={`mailto:${brandConfig.contact.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
            >
              <Globe className="h-4 w-4" aria-hidden="true" /> {brandConfig.contact.email}
            </a>
          </div>
        </div>
      </section>

      <ClientOnlyContactForm locale={locale} className="bg-white text-slate-900" id="contact" />


    </div>
  );
}

// Main component (design context now provided at layout level)
export default function BusinessCarousel({ locale }: BusinessCarouselProps) {
  return <BusinessCarouselContent locale={locale} />;
}
