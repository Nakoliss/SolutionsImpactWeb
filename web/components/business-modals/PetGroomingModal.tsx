'use client';

import {
  Bone,
  CalendarCheck,
  Heart,
  MessageSquare,
  PawPrint,
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
      kicker: 'Pet care journeys',
      description:
        'Friendly, playful design for grooming studios and pet spas with pet profiles, care packages, and bilingual communications.',
      metrics: [
        {
          label: 'Booking speed',
          value: '27s',
          caption: 'Pet selected to confirmed appointment',
          icon: CalendarCheck,
        },
        {
          label: 'Pet profile completion',
          value: '92%',
          caption: 'Owners add health info and preferences',
          icon: PawPrint,
        },
        {
          label: 'Membership uplift',
          value: '2.4x',
          caption: 'Increase in grooming plan renewals',
          icon: Heart,
        },
      ],
    },
    servicesTitle: 'Pet grooming service suite',
    services: [
      {
        id: 'websites',
        title: 'Pet grooming sites',
        description: 'Highlight grooming services, care tips, and adorable galleries.',
        bullets: [
          'Pet profile driven booking',
          'Service bundles for spa days',
          'Gallery layouts with before after slider',
        ],
      },
      {
        id: 'maintenance',
        title: 'Schedule maintenance',
        description: 'Keep openings, seasonal services, and policies refreshed.',
        bullets: [
          'Seasonal coat care promotions',
          'Holiday boarding announcements',
          'Automatic downtime alerts overnight',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Pet search + AI visibility',
        description: 'Appear in local search, maps, and AI pet care answers.',
        bullets: [
          'Structured data for breeds and services',
          'Content playbooks for seasonal care',
          'AI snippet tracking for pet health queries',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Pet parent automation',
        description: 'Reminders, grooming plans, and tailored care guides.',
        bullets: [
          'Grooming reminder sequences',
          'Plan upgrades with loyalty perks',
          'Birthday surprises and retention campaigns',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation and trust',
        description: 'Collect story driven reviews and respond with heart.',
        bullets: [
          'Review prompts with photo requests',
          'Response templates highlighting safety',
          'Sentiment dashboards for each location',
        ],
      },
      {
        id: 'advertising',
        title: 'Pet campaigns',
        description: 'Acquire new pet parents with targeted social and search.',
        bullets: [
          'Geo targeting around parks and vets',
          'Lookalike audiences from loyalty data',
          'Landing pages tuned for first groom offers',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Vet & retail integrations',
        description: 'Connect to vet clinics, retail, and daycare partners.',
        bullets: [
          'Vaccination check integrations',
          'Retail inventory with auto reorder',
          'Daycare scheduling and handoff logs',
        ],
      },
    ],
    featuresTitle: 'Pet experience and operations',
    features: [
      {
        title: 'Pet experience',
        items: [
          'Onboarding with temperament and care notes',
          'Live updates with photo drops during grooming',
          'Care tips sent after each appointment',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Team scheduling by groomer skill',
          'Sanitation and checklist tracking',
          'Retail performance tied to services',
        ],
      },
    ],
    complianceTitle: 'Safety and care compliance',
    compliancePoints: [
      'Vaccination and consent record storage',
      'Sanitation protocols with checklists',
      'Incident logging with owner notifications',
    ],
    footerNote:
      'Extend to mobile grooming vans and daycare locations with unified experience.',
  },
  fr: {
    hero: {
      kicker: 'Parcours toilettage',
      description:
        'Design chaleureux pour salons toilettage et spas animaux avec profils, forfaits soins et communications bilingues.',
      metrics: [
        {
          label: 'Vitesse booking',
          value: '27 s',
          caption: 'Du profil pet a la plage confirme',
          icon: CalendarCheck,
        },
        {
          label: 'Profils completes',
          value: '92%',
          caption: 'Infos sante et preferences ajoutees',
          icon: PawPrint,
        },
        {
          label: 'Plan fidelite',
          value: '2.4x',
          caption: 'Hausse renouvellements forfaits',
          icon: Heart,
        },
      ],
    },
    servicesTitle: 'Suite services toilettage',
    services: [
      {
        id: 'websites',
        title: 'Sites toilettage',
        description: 'Mettre en avant soins, conseils et galeries adorables.',
        bullets: [
          'Reservation guidee par profil animal',
          'Forfaits spa et soins saisonniers',
          'Galeries avant apres interactives',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance horaire',
        description: 'Mettre a jour disponibilites, services saisonniers et politiques.',
        bullets: [
          'Promotions soins de mue',
          'Annonces gardiennage et pension',
          'Alertes performance de nuit',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite pet et IA',
        description: 'Presence recherche locale, cartes et reponses IA soins animaux.',
        bullets: [
          'Schema races et services',
          'Contenu conseils selon saisons',
          'Suivi extraits IA questions sante',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation pet parents',
        description: 'Rappels, plans toilettage et guides personnalises.',
        bullets: [
          'Sequences rappel toilettage',
          'Upsell plans avec avantages fidelite',
          'Surprises anniversaires animaux',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation confiance',
        description: 'Collecter avis histoires et repondre avec empathie.',
        bullets: [
          'Prompts avis avec photos',
          'Gabarits reponse securite et soin',
          'Tableaux sentiment par succursale',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes pet',
        description: 'Acquerir nouveaux clients via social et recherche ciblee.',
        bullets: [
          'Ciblage par parcs et cliniques vetos',
          'Audiences similaires donnees fidelite',
          'Pages offre premier toilettage',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations veto et retail',
        description: 'Connexion cliniques vetos, retail et partenaires garderie.',
        bullets: [
          'Verification vaccination integree',
          'Inventaire retail avec reorder auto',
          'Planification garderie et remises',
        ],
      },
    ],
    featuresTitle: 'Experience animal et operations',
    features: [
      {
        title: 'Experience animal',
        items: [
          'Onboarding temperament et notes soins',
          'Mises a jour photos durant toilettage',
          'Conseils post rendez-vous',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Planification equipe selon competences',
          'Suivi sanitation et listes verif',
          'Performance retail liee aux services',
        ],
      },
    ],
    complianceTitle: 'Conformite securite animaux',
    compliancePoints: [
      'Archivage vaccins et consentements',
      'Protocoles hygiene avec listes',
      'Journal incidents avec notification proprietaire',
    ],
    footerNote:
      'Etendez l experience aux camions mobiles et garderies via plateforme unifiee.',
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

export function PetGroomingModal({
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
              <PawPrint className="h-4 w-4" aria-hidden="true" />
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
                <Bone className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default PetGroomingModal;
