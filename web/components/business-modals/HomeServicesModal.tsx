'use client';

import {
  CalendarCheck,
  Hammer,
  Home,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Thermometer,
  Wrench,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Home services operations',
      description:
        'Neighbourhood ready presence for contractors and residential service brands with bilingual scheduling and service routes.',
      metrics: [
        {
          label: 'Dispatch time',
          value: 'Under 2 min',
          caption: 'From request to routed technician',
          icon: CalendarCheck,
        },
        {
          label: 'Service coverage',
          value: '40+ zones',
          caption: 'Dynamic maps with availability',
          icon: Home,
        },
        {
          label: 'Emergency intake',
          value: '24/7',
          caption: 'On call workflows with escalation',
          icon: ShieldCheck,
        },
      ],
    },
    servicesTitle: 'Service catalogue mapped to your crews',
    services: [
      {
        id: 'websites',
        title: 'Home service websites',
        description: 'Conversion optimised landing pages for each service line and territory.',
        bullets: [
          'Service selectors for plumbing, HVAC, electrical',
          'Zone based pricing modules',
          'Before and after project galleries',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance programmes',
        description: 'Seasonal tune ups, membership plans, and preventative maintenance flows.',
        bullets: [
          'Seasonal inspections and tune up calendars',
          'Membership portals with self serve scheduling',
          'Automated reminders for filter and equipment care',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Local search and AI visibility',
        description: 'Own neighbourhood search, Google Business, and AI home care answers.',
        bullets: [
          'Service area pages with structured data',
          'Content hubs for DIY and maintenance tips',
          'AI snippet monitoring for emergency queries',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Customer automation',
        description: 'Quotes, follow ups, maintenance reminders, and satisfaction loops.',
        bullets: [
          'Quote and proposal workflows with e-sign',
          'Automated follow ups after each visit',
          'Maintenance renewal and upsell journeys',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation engine',
        description: 'Capture reviews, NPS scores, and crew level feedback.',
        bullets: [
          'Geo targeted review prompts',
          'Crew scoreboards for quality assurance',
          'Public testimonial blocks with filters',
        ],
      },
      {
        id: 'advertising',
        title: 'Lead generation campaigns',
        description: 'Always on media for emergency, renovation, and maintenance leads.',
        bullets: [
          'Search and map ads by service line',
          'Storm or seasonal surge playbooks',
          'Landing pages tied to dispatch availability',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Field integrations',
        description: 'Connect dispatch, inventory, and customer platforms.',
        bullets: [
          'Bridges to ServiceTitan, Jobber, Housecall Pro',
          'Inventory sync for parts and materials',
          'Dashboards combining CRM and field data',
        ],
      },
    ],
    featuresTitle: 'Customer experience and crew operations',
    features: [
      {
        title: 'Customer experience',
        items: [
          'Quote builder with bilingual explanations',
          'Real time technician tracking and updates',
          'Resource library for homeowners by season',
        ],
      },
      {
        title: 'Crew operations',
        items: [
          'Route optimisation with buffer times',
          'Safety checklists with photo confirmation',
          'Performance analytics per crew and service line',
        ],
      },
    ],
    complianceTitle: 'Safety, permits, and quality',
    compliancePoints: [
      'Permit tracking per municipality',
      'Work order documentation with photos',
      'Insurance and licence records kept current',
    ],
    footerNote:
      'Coordinate emergency calls, planned projects, and maintenance plans in one bilingual platform.',
  },
  fr: {
    hero: {
      kicker: 'Services maison coordonnes',
      description:
        'Presence locale pour entrepreneurs et marques residentiales avec horaires bilingues et cartes de couverture.',
      metrics: [
        {
          label: 'Delai repartition',
          value: '<2 min',
          caption: 'De la requete a l assignation',
          icon: CalendarCheck,
        },
        {
          label: 'Zones desservies',
          value: '40+ zones',
          caption: 'Cartes dynamiques avec disponibilite',
          icon: Home,
        },
        {
          label: 'Urgence 24/7',
          value: 'Escalade',
          caption: 'Workflow garde et interventions',
          icon: ShieldCheck,
        },
      ],
    },
    servicesTitle: 'Catalogue services adapte a vos equipes',
    services: [
      {
        id: 'websites',
        title: 'Sites services maison',
        description: 'Pages qui convertissent pour chaque service et territoire.',
        bullets: [
          'Selecteur plomberie, HVAC, electricite',
          'Modules tarifaires selon zone',
          'Galeries projets avant apres',
        ],
      },
      {
        id: 'maintenance',
        title: 'Programmes entretien',
        description: 'Plans saisonniers, membres et maintenance preventive.',
        bullets: [
          'Calendriers inspections et ajustements',
          'Portail membre avec auto planification',
          'Rappels filtres et entretien equipements',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite locale et IA',
        description: 'Dominer recherche quartier, fiches Google et reponses IA maison.',
        bullets: [
          'Pages zones avec donnees structurees',
          'Hubs conseils bricolage et entretien',
          'Veille extraits IA requetes urgence',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation client',
        description: 'Soumissions, suivis, rappels et satisfaction.',
        bullets: [
          'Soumissions avec signature numerique',
          'Suivi automatise post visite',
          'Renouvellements maintenance et upsell',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation equipes',
        description: 'Collecter avis, NPS et retours par equipe.',
        bullets: [
          'Prompts avis geolocalises',
          'Tableaux scores equipes',
          'Temoignages publics filtrables',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes generation leads',
        description: 'Media toujours actifs pour urgence, renovation et entretien.',
        bullets: [
          'Pubs recherche par ligne service',
          'Playbooks tempetes et saison chaude',
          'Pages capture reliees a la repartition',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations terrain',
        description: 'Connexion repartition, inventaire et plateformes clients.',
        bullets: [
          'Passerelles ServiceTitan, Jobber, Housecall',
          'Synchronisation inventaire pieces',
          'Tableaux combinant CRM et terrain',
        ],
      },
    ],
    featuresTitle: 'Experience client et equipes',
    features: [
      {
        title: 'Experience client',
        items: [
          'Configurateur de soumission bilingue',
          'Suivi technicien en temps reel',
          'Bibliotheque conseils proprietaires par saison',
        ],
      },
      {
        title: 'Operations equipes',
        items: [
          'Optimisation parcours avec marges tampon',
          'Listes securite avec preuves photo',
          'Analyses performance par equipe et service',
        ],
      },
    ],
    complianceTitle: 'Securite, permis et qualite',
    compliancePoints: [
      'Suivi permis par municipalite',
      'Dossiers travaux avec photos',
      'Assurances et licences a jour',
    ],
    footerNote:
      'Coordonnez urgence, projets planifies et plans entretien sur une plateforme bilingue.',
  },
} as const;

function getCopy(locale: BusinessModalProps['locale'], designCopy: BusinessModalProps['designCopy']) {
  const base = LOCALE_COPY[locale] ?? LOCALE_COPY.en;

  return {
    ...base,
    hero: {
      ...base.hero,
      headline: designCopy.heroTitle,
      badge: designCopy.heroBadge,
      cta: designCopy.ctaText,
    },
  };
}

export function HomeServicesModal({
  isOpen,
  onClose,
  locale,
  services,
  theme,
  designCopy,
  modalCopy,
}: BusinessModalProps) {
  const copy = getCopy(locale, designCopy);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      title={modalCopy.title}
      subtitle={modalCopy.subtitle}
      closeLabel={modalCopy.closeButton}
    >
      <div className="space-y-10 text-white">
        <section className={SECTION_CLASS}>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">
              {copy.hero.kicker}
            </span>
            <h3 className="text-3xl font-semibold text-white sm:text-4xl">
              {copy.hero.headline}
            </h3>
            <p className="text-sm text-white/80 sm:text-base">{copy.hero.description}</p>
            <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              <Wrench className="h-4 w-4" aria-hidden="true" />
              {copy.hero.badge}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {copy.hero.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col gap-1 rounded-xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  <metric.icon className="h-4 w-4" aria-hidden="true" />
                  {metric.label}
                </div>
                <p className="text-lg font-semibold text-white">{metric.value}</p>
                <p className="text-xs text-white/70">{metric.caption}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-semibold text-white sm:text-2xl">
              {copy.servicesTitle}
            </h4>
            <p className="text-sm text-white/80 sm:text-base">
              {copy.hero.cta}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.services.map((serviceInfo) => {
              const service = getServiceById(services, serviceInfo.id);
              const price = getPrimaryPrice(service);

              return (
                <div key={serviceInfo.title} className={CARD_CLASS}>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-white"
                      style={{ color: theme.accent }}
                    >
                      {serviceInfo.title}
                    </span>
                    {price ? (
                      <span className="text-xs text-white/70">{price}</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-white/80">{serviceInfo.description}</p>
                  <ul className="flex flex-col gap-2 text-sm text-white/70">
                    {serviceInfo.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span
                          className="mt-1 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {copy.features.map((feature) => (
            <div key={feature.title} className={CARD_CLASS}>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-white/80" aria-hidden="true" />
                <h5 className="text-lg font-semibold text-white">{feature.title}</h5>
              </div>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-white/75">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={SECTION_CLASS}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white">
              <Thermometer className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Hammer className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/60">{copy.footerNote}</p>
          </div>
        </section>
      </div>
    </Modal>
  );
}

export default HomeServicesModal;
