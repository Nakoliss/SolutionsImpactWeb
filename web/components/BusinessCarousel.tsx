'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Globe, Sparkles } from 'lucide-react';

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
import HomePackagesSection from './HomePackagesSection';
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
  const serviceSubtitleLines = servicesMessages.subtitle.split('\n').filter(Boolean);
  const contactMessages = locale === 'fr' ? frMessages.contact : enMessages.contact;
  const whyMessages = locale === 'fr' ? frMessages.why : enMessages.why;
  // Content borrowed from the Why Us page (strengths grid)
  const strengths = locale === 'fr'
    ? [
        {
          icon: '\u{1F310}',
          title: 'Cohérence de contenu',
          description:
            "Équipe qui harmonise stratégie, design et rédaction dès le départ",
        },
        {
          icon: '\u{1F916}',
          title: 'IA éthique et responsable',
          description:
            'Automatisations alignées avec vos valeurs et objectifs',
        },
        {
          icon: '\u{1F4CA}',
          title: 'Métriques et ROI mesurables',
          description:
            'Résultats concrets et transparents à chaque étape',
        },
        {
          icon: '\u269C',
          title: 'Équipe locale au Québec',
          description:
            'Compréhension profonde du marché et de la culture',
        },
        {
          icon: '\u{1F680}',
          title: 'Support continu et proactif',
          description:
            'Accompagnement personnalisé pour votre croissance',
        },
      ]
    : [
        {
          icon: '\u{1F310}',
          title: 'Content consistency',
          description:
            'Team aligning strategy, design, and copy from day one',
        },
        {
          icon: '\u{1F916}',
          title: 'Ethical and responsible AI',
          description:
            'Automations aligned with your values and objectives',
        },
        {
          icon: '\u{1F4CA}',
          title: 'Measurable metrics and ROI',
          description:
            'Concrete and transparent results at every step',
        },
        {
          icon: '\u269C',
          title: 'Local Quebec team',
          description: 'Deep understanding of the market and culture',
        },
        {
          icon: '\u{1F680}',
          title: 'Continuous and proactive support',
          description: 'Personalized support for your growth',
        },
      ];
  // Adjust phrasing for FR: keep it simple
  const strengthsDisplay =
    locale === 'fr'
      ? strengths.map((s) =>
          s.icon === '\\u269C'
            ? { ...s, description: 'On connaît le marché et la culture d’ici.' }
            : s,
        )
      : strengths;

  const eyebrow = pickBrandLocale(locale, brandConfig.tagline);
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

  const highlights = locale === 'fr'
    ? [
        {
          icon: '\u269C',
          title: 'Équipe au Québec',
          description:
            'Des gens d’ici qui comprennent votre réalité et la Loi 25.',
        },
        {
          icon: '\u{1F916}',
          title: 'IA responsable',
          description:
            'Automatiser ce qui compte, avec des règles claires.',
        },
        {
          icon: '\u{1F4C8}',
          title: 'Impact mesurable',
          description:
            'Vos résultats suivis sur vos indicateurs, avec tableaux de bord et points réguliers.',
        },
      ]
    : [
        {
          icon: '\u269C',
          title: whyMessages.support.title,
          description: whyMessages.support.description,
        },
        {
          icon: '\u{1F916}',
          title: whyMessages.technology.title,
          description: whyMessages.technology.description,
        },
        {
          icon: '\u{1F4C8}',
          title: whyMessages.results.title,
          description: whyMessages.results.description,
        },
      ];

  // Simplified FR copy for the three highlights
  const highlightsDisplay =
    locale === 'fr'
      ? [
          { icon: '\u269C', title: 'Équipe locale au Québec', description: 'On connaît le marché local et la Loi 25.' },
          { icon: '\u{1F916}', title: 'IA responsable', description: 'Automatiser ce qui compte, avec des règles claires.' },
          { icon: '\u{1F4C8}', title: 'Impact mesurable', description: 'Vos résultats suivis sur vos indicateurs, avec tableaux de bord et points réguliers.' },
        ]
      : highlights;

  const processSteps = locale === 'fr' ? [
    {
      title: 'Découverte & Évaluation',
      description: 'Analyse complète de vos besoins, objectifs et contraintes.',
    },
    {
      title: 'Stratégie & Planification',
      description: 'Architecture, plan de projet et critères de succès détaillés.',
    },
    {
      title: 'Développement & Tests',
      description: 'Nous avançons par étapes et validons chaque livrable avec vous.',
    },
    {
      title: 'Déploiement & Lancement',
      description: 'Mise en production sécurisée accompagnée d’un support actif.',
    },
    {
      title: 'Optimisation & Croissance',
      description: 'Améliorations continues guidées par vos données et retours.',
    },
  ] : [
    {
      title: 'Discovery & Assessment',
      description: 'Complete review of your needs, goals, and constraints.',
    },
    {
      title: 'Strategy & Planning',
      description: 'Architecture, project plan, and detailed success criteria.',
    },
    {
      title: 'Development & Testing',
      description: 'Sprint delivery backed by validation and quality checks.',
    },
    {
      title: 'Deployment & Launch',
      description: 'Secure go-live with guided rollout and active support.',
    },
    {
      title: 'Optimization & Growth',
      description: 'Continuous improvements driven by data and feedback.',
    },
  ];

  // Display overrides for simpler, client-friendly FR copy
  const displayedSteps =
    locale === 'fr'
      ? [
          { title: 'Découverte & évaluation', description: 'On cerne vos besoins et contraintes.' },
          { title: 'Stratégie & planification', description: 'Un plan clair et des critères de succès partagés.' },
          { title: 'Réalisation', description: 'Nous construisons par petites étapes et vérifions avec vous que tout fonctionne.' },
          { title: 'Déploiement & lancement', description: 'Mise en production encadrée et sécurisée.' },
          { title: 'Optimisation & croissance', description: 'Améliorations continues guidées par vos données.' },
        ]
      : processSteps;

  const compliancePoints = locale === 'fr' ? [
    'Politiques de confidentialité et registre des fournisseurs tenus à jour.',
    'Bannière de consentement bloquante et gestion granulaire des cookies.',
    'Formulaires d’accès et suppression des données avec suivi interne.',
  ] : [
    'Privacy policies and vendor registry kept current.',
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
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 text-left leading-tight whitespace-normal">
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
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-8 shadow-xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105">
              <h3 className="text-lg font-semibold text-white">
                {contactMessages.title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {[contactMessages.subtitle, whyMessages.results.title, whyMessages.support.title].map((item) => (
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
            <div className="mt-4 space-y-4 text-base text-slate-300">
              {serviceSubtitleLines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
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
          <div className="mt-16 space-y-16">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center shadow-lg shadow-cyan-500/10">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {locale === 'fr' ? 'Notre Méthodologie' : 'Our Methodology'}
              </h3>
              <p className="mt-4 text-base text-slate-300">
                {locale === 'fr'
                  ? 'Une méthode claire et efficace pour faire avancer votre projet, étape par étape.'
                  : 'We combine agile best practices with technical expertise to ensure your projects succeed.'}
              </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(locale === 'fr'
              ? [
                      {
                        title: 'Agilité',
                        description: 'Nous avançons par petites étapes, avec des retours fréquents, pour nous adapter vite.',
                      },
                      {
                        title: 'Transparence',
                        description: 'Vous savez toujours où en est le projet : échanges clairs, points réguliers et accès au suivi.',
                      },
                      {
                        title: 'Qualité',
                        description: 'Des livrables fiables : contrôles qualité soignés et respect de standards reconnus.',
                      },
                      {
                        title: 'Collaboration',
                        description: 'Nous travaillons main dans la main avec vos équipes et parties prenantes.',
                      },
                    ]
                  : [
                      {
                        title: 'Agility',
                        description: 'Short sprints, regular feedback, and continuous adaptation to changing needs.',
                      },
                      {
                        title: 'Transparency',
                        description: 'Open communication, regular reporting, and shared tracking tools.',
                      },
                      {
                        title: 'Quality',
                        description: 'Rigorous testing, code reviews, and adherence to industry standards.',
                      },
                      {
                        title: 'Collaboration',
                        description: 'Integrated teamwork with your internal stakeholders.',
                      },
                    ]).map((principle) => (
                  <div
                    key={principle.title}
                    className="rounded-2xl border border-white/10 bg-black/20 px-6 py-5 text-left transition-all duration-300 hover:border-sky-400/30 hover:bg-black/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/20 sm:px-8 sm:py-6"
                  >
                    <h4 className="text-lg font-semibold text-white">{principle.title}</h4>
                    <p className="mt-2 text-sm text-slate-300">{principle.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-center shadow-lg shadow-cyan-500/10 sm:px-10 sm:py-12">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {locale === 'fr' ? 'Prêt à Commencer Votre Projet ?' : 'Ready to Start Your Project?'}
              </h3>
              <p className="mt-4 text-base text-slate-300">
                {locale === 'fr'
                  ? 'Discutons de vos besoins et voyons comment notre processus peut vous aider à atteindre vos objectifs.'
                  : 'Let’s discuss your goals and see how our process can help you achieve them.'}
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {locale === 'fr' ? 'Démarrer un Projet' : 'Start a Project'}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
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
                {highlightsDisplay.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 px-6 py-5 transition-all duration-300 hover:border-sky-400/30 hover:bg-gradient-to-br hover:from-sky-950/20 hover:via-black/30 hover:to-black/20 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:scale-105 sm:px-7 sm:py-6"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-500/20 text-sky-300 ring-1 ring-sky-400/20 transition-all duration-300 group-hover:from-sky-400/30 group-hover:to-cyan-400/30 group-hover:text-sky-200 group-hover:ring-sky-400/40 group-hover:shadow-lg group-hover:shadow-sky-400/20">
                      <span className="text-3xl leading-none" aria-hidden="true">
                        {highlight.icon}
                      </span>
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
                {locale === 'fr' ? 'Un parcours en cinq phases pour passer de la vision à la croissance.' : 'Five phases to move from vision to measurable impact.'}
              </p>
              <ol className="mt-8 space-y-6">
                {displayedSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-black/20 px-5 py-5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105 sm:px-7 sm:py-6"
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

      {/* Distinctive strengths grid (from Why Us page) */}
      <section
        id="distinctives"
        className="border-t border-white/10 bg-slate-950 scroll-mt-16"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {locale === 'fr' ? 'Nos Forces Distinctives' : 'Our Distinctive Strengths'}
            </h2>
            <p className="mt-3 text-slate-300">
              {locale === 'fr'
                ? 'Ce qui fait notre succès et celui de nos clients'
                : 'What drives our success and that of our clients'}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strengthsDisplay.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-black/30 p-6 text-center transition-all duration-300 hover:border-cyan-400/30 hover:bg-black/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-500/20 text-sky-300 ring-1 ring-sky-400/20">
                  <span className="text-3xl leading-none" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="border-t border-white/10 bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 place-items-center lg:gap-16">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-8 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105 max-w-3xl w-full mx-auto">
              <h2 className="text-3xl font-semibold sm:text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {locale === 'fr' ? 'Conformité Loi 25 intégrée' : 'Law 25 compliance built in'}
              </h2>
              <p className="mt-4 text-base text-slate-300">
                {locale === 'fr' ? 'Des modèles et processus internes pour opérer en toute transparence.' : 'Internal templates and processes keep operations transparent.'}
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
            <div className="hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-lg transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105">
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
            <ul className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200">
              {(
                locale === 'fr'
                  ? ['IA responsable', 'Impact mesurable', 'Équipe au Québec']
                  : [
                      whyMessages.technology.title,
                      whyMessages.results.title,
                      whyMessages.support.title,
                    ]
              ).map((point) => (
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

      <HomePackagesSection locale={locale} />

      <ClientOnlyContactForm locale={locale} className="bg-white text-slate-900" id="contact" />


    </div>
  );
}

// Main component (design context now provided at layout level)
export default function BusinessCarousel({ locale }: BusinessCarouselProps) {
  return <BusinessCarouselContent locale={locale} />;
}
