'use client';

import {
  BatteryCharging,
  CalendarCheck,
  FileText,
  Gauge,
  MessageSquare,
  ShieldCheck,
  Sparkles,
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
      kicker: 'Automotive service hub',
      description:
        'Industrial styling for garages, performance shops, and dealerships with instant booking, repair tracking, and fleet visibility.',
      metrics: [
        {
          label: 'Booking time',
          value: '35s',
          caption: 'From lead to scheduled service',
          icon: CalendarCheck,
        },
        {
          label: 'Inspection reports',
          value: 'Photo + PDF',
          caption: 'Delivered directly from tech tablets',
          icon: FileText,
        },
        {
          label: 'Fleet visibility',
          value: 'Live bays',
          caption: 'Bay availability synced hourly',
          icon: Gauge,
        },
      ],
    },
    servicesTitle: 'Programs built for garages and auto brands',
    services: [
      {
        id: 'websites',
        title: 'Auto service sites',
        description: 'Conversion focused service pages with brand compliant parts catalogues.',
        bullets: [
          'Service selectors for repairs and maintenance',
          'VIN ready intake forms with uploads',
          'Parts catalogue with availability indicators',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance retainers',
        description: 'Keeping uptime, recalls, and pricing updated across seasons.',
        bullets: [
          'Snow tire and seasonal swap campaigns',
          'Recall alerts with landing pages',
          '24/7 status monitoring before opening hours',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Search and AI visibility',
        description: 'Own local search, voice requests, and AI generated recommendations.',
        bullets: [
          'Structured data for services and brands',
          'How to content for vehicle maintenance',
          'AI snippet governance for dealer territories',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Driver automation',
        description: 'Reminders, fleet notifications, and warranty follow ups.',
        bullets: [
          'Automated oil change and inspection reminders',
          'Warranty expiry nurture journeys',
          'Fleet dashboards with custom SLAs',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation and CSI',
        description: 'Boost review velocity while meeting manufacturer CSI targets.',
        bullets: [
          'VIN level feedback and sentiment tagging',
          'Bilingual response templates with escalation',
          'Monthly CSI and NPS reporting',
        ],
      },
      {
        id: 'advertising',
        title: 'Performance ads',
        description: 'Lead campaigns for repairs, accessories, and seasonal offers.',
        bullets: [
          'Inventory retargeting for accessories',
          'Emergency repair search coverage',
          'Dynamic landing pages tied to ad groups',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Diagnostics & DMS integrations',
        description: 'Link to diagnostics, DMS, and parts suppliers securely.',
        bullets: [
          'API bridges with Dealertrack and Tekion',
          'Live service board displays in waiting rooms',
          'Parts supplier availability sync',
        ],
      },
    ],
    featuresTitle: 'Customer experience and workshop performance',
    features: [
      {
        title: 'Driver experience',
        items: [
          'Real time status board for vehicle progress',
          'Photo and video approvals via SMS or email',
          'Upgrade prompts for detailing and accessories',
        ],
      },
      {
        title: 'Workshop operations',
        items: [
          'Technician dashboards tied to website bookings',
          'Reporting on bay utilization and technician hours',
          'Integrated safety checklists and torque logs',
        ],
      },
    ],
    complianceTitle: 'Safety and warranty governance',
    compliancePoints: [
      'CSA and Quebec safety checklist templates',
      'Archiving of torque specs and repair history',
      'Warranty documentation automatically stored',
    ],
    footerNote:
      'Need fleet integrations? We connect telematics, DMS, and marketing in one flow.',
  },
  fr: {
    hero: {
      kicker: 'Hub garage automobile',
      description:
        'Une experience robuste pour garages, ateliers performance et concessions avec reservation instantanee et suivi atelier.',
      metrics: [
        {
          label: 'Temps de prise',
          value: '35 s',
          caption: 'Du lead au rendez-vous planifie',
          icon: CalendarCheck,
        },
        {
          label: 'Rapports inspection',
          value: 'Photo + PDF',
          caption: 'Transmis depuis les tablettes techniciens',
          icon: FileText,
        },
        {
          label: 'Visibilite atelier',
          value: 'Baies en direct',
          caption: 'Disponibilite synchronisee chaque heure',
          icon: Gauge,
        },
      ],
    },
    servicesTitle: 'Offre pour garages et marques auto',
    services: [
      {
        id: 'websites',
        title: 'Sites services auto',
        description: 'Pages services qui convertissent avec catalogue pieces conforme marque.',
        bullets: [
          'Selecteur de services et reparations',
          'Formulaires VIN avec depot de photos',
          'Catalogue pieces avec disponibilite',
        ],
      },
      {
        id: 'maintenance',
        title: 'Entretien continue',
        description: 'Mises a jour disponibilite, rappels et tarifs selon saisons.',
        bullets: [
          'Campagnes pneus et changements saisonniers',
          'Pages rappel securite automatisees',
          'Surveillance 24/7 avant ouverture',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite recherche et IA',
        description: 'Dominer recherche locale, assistants vocaux et recommandations IA.',
        bullets: [
          'Donnees structurees services et marques',
          'Contenu conseils entretien vehicule',
          'Controle des extraits IA par territoire',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation conducteurs',
        description: 'Rappels, notifications flotte et suivi garanties.',
        bullets: [
          'Rappels changement huile et inspection',
          'Flux expiration garantie constructeurs',
          'Tableaux flotte avec SLA personnalises',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation et CSI',
        description: 'Accroitre avis tout en respectant objectifs CSI manufacturier.',
        bullets: [
          'Feedback avec etiquettes par VIN',
          'Reponses bilingues avec escalade',
          'Rapports mensuels CSI et NPS',
        ],
      },
      {
        id: 'advertising',
        title: 'Publicite performance',
        description: 'Campagnes pour reparations, accessoires et promotions saisonnieres.',
        bullets: [
          'Reciblage inventaire accessoires',
          'Couverture urgence pour depannage',
          'Pages dynamiques selon groupes annonces',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations diagnostics et DMS',
        description: 'Connexions securisees aux diagnostics, DMS et fournisseurs pieces.',
        bullets: [
          'Connecteurs API Dealertrack et Tekion',
          'Affichage temps reel en salle attente',
          'Synchronisation disponibilite fournisseurs',
        ],
      },
    ],
    featuresTitle: 'Experience client et performance atelier',
    features: [
      {
        title: 'Parcours conducteur',
        items: [
          'Tableau statut temps reel des reparations',
          'Approbation photo video via SMS ou courriel',
          'Suggestions detail et accessoires',
        ],
      },
      {
        title: 'Operations atelier',
        items: [
          'Tableaux techniciens lies aux reservations web',
          'Rapports utilisation baies et heures',
          'Listes securite et couples forces integres',
        ],
      },
    ],
    complianceTitle: 'Conformite securite et garanties',
    compliancePoints: [
      'Gabarits CSA et securite Quebec',
      'Archivage couples et historique reparations',
      'Documents garanties stockes automatiquement',
    ],
    footerNote:
      'Besoin integrations flotte? Nous relions telematique, DMS et marketing.',
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

export function AutoGarageModal({
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
                <Sparkles className="h-5 w-5 text-white/80" aria-hidden="true" />
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
                  <BatteryCharging className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default AutoGarageModal;
