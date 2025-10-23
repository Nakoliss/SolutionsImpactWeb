'use client';

import {
  Archive,
  CalendarCheck,
  Feather,
  Gem,
  MessageSquare,
  Scroll,
  Stamp,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Collector storytelling',
      description:
        'Heritage inspired layouts for antique shops, galleries, and curators with provenance records and appraisal bookings.',
      metrics: [
        {
          label: 'Catalog updates',
          value: 'Under 5 min',
          caption: 'Add new pieces with provenance tags',
          icon: CalendarCheck,
        },
        {
          label: 'Provenance dossier',
          value: 'Digital + PDF',
          caption: 'Automatically assembled per item',
          icon: Scroll,
        },
        {
          label: 'Collector retention',
          value: '68%',
          caption: 'Returning clients per quarter',
          icon: Gem,
        },
      ],
    },
    servicesTitle: 'Services for antique shops and dealers',
    services: [
      {
        id: 'websites',
        title: 'Antique catalogues',
        description: 'Showcase collections with high resolution photography and storytelling.',
        bullets: [
          'Collection templates with provenance timeline',
          'Wishlist and hold requests for collectors',
          'In situ photography galleries',
        ],
      },
      {
        id: 'maintenance',
        title: 'Collection maintenance',
        description: 'Keep catalogues, pricing, and certificates current across devices.',
        bullets: [
          'Batch uploads from appraisal spreadsheets',
          'Seasonal highlight rotations',
          'Redundancy backups for imagery',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Heritage search visibility',
        description: 'Own niche keywords, provenance searches, and AI art discovery.',
        bullets: [
          'Schema for artists, periods, and materials',
          'Long form essays optimised for collectors',
          'AI snippet governance for signature pieces',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Collector journeys',
        description: 'Alerts for new arrivals, private previews, and appraisal programmes.',
        bullets: [
          'Saved search notifications',
          'Private sale invitations with RSVP',
          'Appraisal follow up automation',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation and trust',
        description: 'Reassure collectors with transparent reviews and testimonials.',
        bullets: [
          'Testimonial curation by period or artist',
          'Response guides for high value transactions',
          'Trust badges for conservation partners',
        ],
      },
      {
        id: 'advertising',
        title: 'Curated campaigns',
        description: 'Reach collectors, museums, and designers with targeted media.',
        bullets: [
          'Audience building by era or medium',
          'Spotlight campaigns for fairs and shows',
          'Lead capture landing pages with provenance forms',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Appraisal & auction integrations',
        description: 'Bridge to appraisal systems, insurance, and auction catalogues.',
        bullets: [
          'API connections to insurance providers',
          'Auction syndication with live updates',
          'Digital certificates with tamper seals',
        ],
      },
    ],
    featuresTitle: 'Collector experience and operations',
    features: [
      {
        title: 'Collector experience',
        items: [
          'Virtual salons with immersive storytelling',
          'Live chat with experts and appraisers',
          'Personalised lookbooks by taste profile',
        ],
      },
      {
        title: 'Operations and heritage care',
        items: [
          'Inventory dashboards with conservation notes',
          'Loan and exhibition tracking workflows',
          'Analytics on interest by collection period',
        ],
      },
    ],
    complianceTitle: 'Authenticity and documentation',
    compliancePoints: [
      'Chain of ownership logs per item',
      'Condition reports with restoration history',
      'Insurance grade documentation packages',
    ],
    footerNote:
      'Partner with museums and auction houses via secure data exchanges managed by our team.',
  },
  fr: {
    hero: {
      kicker: 'Recits pour collectionneurs',
      description:
        'Une vitrine heritage pour antiquaires et galeristes avec dossiers provenance et rendez-vous d expertise.',
      metrics: [
        {
          label: 'Mise a jour catalogue',
          value: 'Sous 5 min',
          caption: 'Ajouter piece et balises provenance',
          icon: CalendarCheck,
        },
        {
          label: 'Dossier provenance',
          value: 'Numerique + PDF',
          caption: 'Assemble automatiquement par item',
          icon: Scroll,
        },
        {
          label: 'Fidelite collectionneur',
          value: '68%',
          caption: 'Clients recurrents trimestriels',
          icon: Gem,
        },
      ],
    },
    servicesTitle: 'Services pour antiquaires et galeristes',
    services: [
      {
        id: 'websites',
        title: 'Catalogues antiquites',
        description: 'Mettre en scene les collections avec photos haute resolution et narration.',
        bullets: [
          'Gabarits collection avec frise provenance',
          'Listes souhaits et reservations collectors',
          'Galeries in situ mises en ambiance',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance collection',
        description: 'Tenir a jour prix, certificats et disponibilites sur tous ecrans.',
        bullets: [
          'Import en lot depuis tableaux expertise',
          'Rotations saisonnieres des vitrines',
          'Sauvegardes redondantes des visuels',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite heritage',
        description: 'Dominer mots cles rares, recherches provenance et decouverte IA.',
        bullets: [
          'Schema artistes, periodes et materiaux',
          'Essais longs formats pour amateurs',
          'Controle extraits IA pour pieces phare',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Parcours collectionneur',
        description: 'Alertes nouveaux arrivages, apercus prives et programmes expertise.',
        bullets: [
          'Notifications recherches sauvegardees',
          'Invitations ventes privees avec RSVP',
          'Suivi automatises des expertises',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation et confiance',
        description: 'Rassurer avec temoignages et reponses transparentes.',
        bullets: [
          'Temoignages tries par artiste ou style',
          'Guides de reponse haute valeur',
          'Insignes partenaires conservation',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes ciblees',
        description: 'Toucher collectionneurs, musees et designers avec media precis.',
        bullets: [
          'Audiences par epoque ou materiau',
          'Campagnes salons et foires',
          'Pages capture avec formulaires provenance',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations expertise et ventes',
        description: 'Reliage aux systemes expertise, assureurs et maisons d enchere.',
        bullets: [
          'Connexions API assureurs œuvres',
          'Syndication enchere mise a jour',
          'Certificats numeriques scelles',
        ],
      },
    ],
    featuresTitle: 'Experience collectionneur et operations',
    features: [
      {
        title: 'Experience collectionneur',
        items: [
          'Salons virtuels et narration immersive',
          'Clavardage avec experts et commissaires',
          'Lookbooks personnalises selon gouts',
        ],
      },
      {
        title: 'Operations heritage',
        items: [
          'Tableaux inventaire avec notes conservation',
          'Suivi prêts et expositions',
          'Analyses interets par periode',
        ],
      },
    ],
    complianceTitle: 'Authenticite et documentation',
    compliancePoints: [
      'Chaine proprietaires par piece',
      'Rapports etat et restauration',
      'Dossiers assurances complets',
    ],
    footerNote:
      'Collaborez avec musees et maisons d enchere via echanges securises administres par notre equipe.',
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

export function AntiqueModal({
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
              <Gem className="h-4 w-4" aria-hidden="true" />
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
                <Feather className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <Stamp className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Archive className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default AntiqueModal;
