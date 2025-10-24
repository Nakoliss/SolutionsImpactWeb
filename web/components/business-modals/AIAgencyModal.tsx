'use client';

import {
  BrainCircuit,
  Cpu,
  MessageSquare,
  Network,
  Satellite,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'AI agency blueprint',
      description:
        'Launch pads for AI consultancies with modular storytelling, compliance ready funnels, and automation showcases.',
      metrics: [
        {
          label: 'Proposal velocity',
          value: '48h',
          caption: 'Average time from lead to strategy deck',
          icon: BrainCircuit,
        },
        {
          label: 'Automation demos',
          value: '6 modules',
          caption: 'Interactive walkthroughs per vertical',
          icon: Network,
        },
        {
          label: 'Compliance readiness',
          value: 'Built in',
          caption: 'Security, privacy, and governance panels',
          icon: ShieldCheck,
        },
      ],
    },
    servicesTitle: 'Offer suite for AI agencies',
    services: [
      {
        id: 'websites',
        title: 'AI agency websites',
        description: 'Modular landing systems for go to market, services, and case studies.',
        bullets: [
          'Industry specific solution pages',
          'Interactive automation roadmap blocks',
          'Case studies with measurable outcomes',
        ],
      },
      {
        id: 'maintenance',
        title: 'Platform maintenance',
        description: 'Keep product updates, integrations, and compliance statements fresh.',
        bullets: [
          'Release notes hub and changelog',
          'Security status page updates',
          'Component library refreshes',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'AI search authority',
        description: 'Own AI, automation, and data governance keywords plus AI answer engines.',
        bullets: [
          'Thought leadership content programmes',
          'Structured data for models and stacks',
          'Monitoring of AI generated citations',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Growth automations',
        description: 'Lead nurture, onboarding flows, and product qualified journeys.',
        bullets: [
          'Lead scoring tied to demo activity',
          'Onboarding drip with product tours',
          'Expansion campaigns for existing clients',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Proof and trust',
        description: 'Publish testimonials, analyst quotes, and compliance badges.',
        bullets: [
          'Client stories with ROI metrics',
          'Analyst mention curation',
          'Security and compliance evidence hub',
        ],
      },
      {
        id: 'advertising',
        title: 'Demand programmes',
        description: 'Performance media for workshops, pilots, and retainers.',
        bullets: [
          'Account based advertising frameworks',
          'Webinar and workshop funnels',
          'Retargeting with personalised offers',
        ],
      },
      {
        id: 'additionalServices',
        title: 'AI stack integrations',
        description: 'Connect to data warehouses, model ops, and observability tools.',
        bullets: [
          'Integration pages for data stack partners',
          'Demo sandboxes with secure access',
          'Telemetry dashboards highlighting KPIs',
        ],
      },
    ],
    featuresTitle: 'Product storytelling and delivery',
    features: [
      {
        title: 'Product storytelling',
        items: [
          'Use case explorers grouped by industry',
          'Live automation demos embedded with safeguards',
          'Outcome calculators with bilingual copy',
        ],
      },
      {
        title: 'Delivery excellence',
        items: [
          'Project methodology timelines and assets',
          'Security and risk management dashboards',
          'Resource hubs for compliance teams',
        ],
      },
    ],
    complianceTitle: 'AI governance and trust',
    compliancePoints: [
      'Model governance overview templates',
      'Privacy impact and risk assessment libraries',
      'Service level and escalation playbooks',
    ],
    footerNote:
      'Accelerate pilot launch and enterprise trust with a modular AI agency experience.',
  },
  fr: {
    hero: {
      kicker: 'Plan agence IA',
      description:
        'Vitrine modulaire pour agences IA avec narration sectorielle, tunnels conformes et demos automatisees.',
      metrics: [
        {
          label: 'Delai proposition',
          value: '48 h',
          caption: 'Lead a deck strategique',
          icon: BrainCircuit,
        },
        {
          label: 'Demos automation',
          value: '6 modules',
          caption: 'Par vertical et cas usage',
          icon: Network,
        },
        {
          label: 'Conformite',
          value: 'Integree',
          caption: 'Securite, vie privee, gouvernance',
          icon: ShieldCheck,
        },
      ],
    },
    servicesTitle: 'Offre agence IA',
    services: [
      {
        id: 'websites',
        title: 'Sites agence IA',
        description: 'Systeme de pages modulaires pour services, industries et cas clients.',
        bullets: [
          'Pages solutions par industrie',
          'Blocs feuille de route automatisation',
          'Etudes cas avec indicateurs ROI',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance plateforme',
        description: 'Mises a jour produit, integrations et sections conformite.',
        bullets: [
          'Journal versions et nouveautes',
          'Page statut securite et dispo',
          'Actualisation librairie composants',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Autorite IA et visibilite Google',
        description: 'Referencement IA, automatisation et gouvernance des donnees.',
        bullets: [
          'Programmes contenu leadership',
          'Donnees structurees stack et modeles',
          'Veille citations IA generatives',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation croissance',
        description: 'Nurture leads, onboarding et parcours expansion.',
        bullets: [
          'Scoring leads lie aux demos',
          'Onboarding produit avec tutoriels',
          'Campagnes expansion clients actifs',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Preuves et confiance',
        description: 'Temoignages, analystes et badges conformite.',
        bullets: [
          'Recits clients avec resultats',
          'Curation mentions analystes',
          'Hub evidences securite et conformite',
        ],
      },
      {
        id: 'advertising',
        title: 'Programmes demande',
        description: 'Media performance pour ateliers, pilotes et retainers.',
        bullets: [
          'Publicite ABM structuree',
          'Entonnoirs webinaires et ateliers',
          'Reciblage offres personnalisees',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations stack IA',
        description: 'Connexions data, model ops et observabilite.',
        bullets: [
          'Pages integration partenaires data',
          'Bacs a sable demos securises',
          'Tableaux telemetry et KPIs',
        ],
      },
    ],
    featuresTitle: 'Narration produit et delivery',
    features: [
      {
        title: 'Narration produit',
        items: [
          'Explorateurs cas usage par secteur',
          'Demos automations en direct avec garde fous',
          'Calculateurs ROI bilingues',
        ],
      },
      {
        title: 'Delivery',
        items: [
          'Chronologies methodologie et livrables',
          'Tableaux securite et gestion risques',
          'Hubs ressources pour equipes conformite',
        ],
      },
    ],
    complianceTitle: 'Gouvernance IA et confiance',
    compliancePoints: [
      'Gabarits gouvernance modele',
      'Bibliotheques analyse impact et risques',
      'Playbooks SLA et escalade',
    ],
    footerNote:
      'Accelez les pilotes et la confiance enterprise avec une experience agence IA modulaire.',
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

export function AIAgencyModal({
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
              <Cpu className="h-4 w-4" aria-hidden="true" />
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
                <Satellite className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default AIAgencyModal;

