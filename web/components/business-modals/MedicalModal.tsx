'use client';

import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  HeartPulse,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Healthcare journeys',
      description:
        'We orchestrate calm bilingual portals, secure intake, and triage automation for clinics and private practices.',
      metrics: [
        {
          label: 'Avg booking time',
          value: '58s',
          caption: 'From landing to confirmed visit',
          icon: CalendarCheck,
        },
        {
          label: 'Privacy posture',
          value: 'Law 25 + PIPEDA (aligned)',
          caption: 'Consent logs and audit trail included',
          icon: ShieldCheck,
        },
        {
          label: 'Care programs',
          value: 'Telehealth & follow up',
          caption: 'Configurable patient flows',
          icon: HeartPulse,
        },
      ],
    },
    servicesTitle: 'Service lineup for medical organizations',
    services: [
      {
        id: 'websites',
        title: 'Medical websites',
        description: 'Accessible clinic portals with multilingual navigation and calming visuals.',
        bullets: [
          'Symptom and triage forms with alerts',
          'Doctor and program microsites',
          'Telehealth and patient portal integrations',
        ],
      },
      {
        id: 'maintenance',
        title: 'Compliance maintenance',
        description: 'Round the clock monitoring of uptime, privacy policies, and cookie experiences.',
        bullets: [
          'Automated Law 25 evidence logs',
          'Failover and SLA monitoring',
          'Clinical content updates inside 48h',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Health search visibility',
        description: 'Community search and AI answer optimization for clinics and specialists.',
        bullets: [
          'Bilingual Google visibility for local care teams',
          'Structured FAQ for symptom keywords',
          'AI snippet governance for health boards',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Patient automation journeys',
        description: 'Reminders, recalls, and education flows that follow consent logic.',
        bullets: [
          'Appointment and lab reminders',
          'Post visit care plans by segment',
          'Secure file delivery with tracking',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation and patient feedback',
        description: 'Monitor and respond to reviews with bilingual compliance templates.',
        bullets: [
          'Real time review alerts to staff',
          'AI assisted replies validated by care teams',
          'Satisfaction dashboards across clinics',
        ],
      },
      {
        id: 'advertising',
        title: 'Healthcare acquisition ads',
        description: 'Target programs, telemedicine, and specialty clinics with precise media.',
        bullets: [
          'Geo fenced campaigns with compliant copy',
          'Landing pages optimized for triage',
          'Weekly KPI reviews with medical leads',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Specialized integrations',
        description: 'Secure connections to EMR, PMS, and insurance tooling.',
        bullets: [
          'HL7 friendly data sync',
          'PMS appointment sync and reporting',
          'Insurance eligibility automation',
        ],
      },
    ],
    featuresTitle: 'Operational enhancements',
    features: [
      {
        title: 'Patient experience modules',
        items: [
          'Intake questionnaires with red flag escalation',
          'Secure family and caregiver access flows',
          'Virtual waiting room updates in both languages',
        ],
      },
      {
        title: 'Clinical operations',
        items: [
          'Dashboards for wait times and capacity',
          'Automated post visit surveys with outcome tags',
          'Monthly analytics ready for accreditation reviews',
        ],
      },
    ],
    complianceTitle: 'Healthcare compliance and safeguards',
    compliancePoints: [
      'Consent logs attached to each patient record',
      'Retention schedules and secure export workflows',
      'Privacy impact mapping and vendor registry upkeep',
    ],
    footerNote:
      'Need deeper integrations? We connect to PMS and EMR partners through secure APIs.',
  },
  fr: {
    hero: {
      kicker: 'Parcours sante',
      description:
        'Nous livrons des portails bilingues apaisants avec formulaires securises et triage automatise pour cliniques et cabinets.',
      metrics: [
        {
          label: 'Temps rendez-vous',
          value: '58 s',
          caption: 'De la page a la confirmation',
          icon: CalendarCheck,
        },
        {
          label: 'Cadre juridique',
          value: 'Loi 25 + PIPEDA (aligné)',
          caption: 'Registre de consentement integre',
          icon: ShieldCheck,
        },
        {
          label: 'Programmes de soins',
          value: 'Telemedecine et suivi',
          caption: 'Parcours patients configurables',
          icon: HeartPulse,
        },
      ],
    },
    servicesTitle: 'Services adaptes aux organisations medicales',
    services: [
      {
        id: 'websites',
        title: 'Sites medicaux',
        description: 'Portails de clinique accessibles avec navigation bilingue et visuels rassurants.',
        bullets: [
          'Formulaires symptomes et triage avec alertes',
          'Microsites medecins et programmes',
          'Integrations telemedecine et portail patient',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance conformite',
        description: 'Surveillance continue de la disponibilite, des politiques et des banniere cookies.',
        bullets: [
          'Journal automatises Loi 25',
          'Monitoring SLA et reprise',
          'Mises a jour contenu clinique sous 48 h',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite sante',
        description: 'Optimisation locale et IA pour cliniques, specialistes et GMF.',
        bullets: [
          'Visibilite Google bilingue pour les territoires desservis',
          'FAQ structurees selon symptomes',
          'Gouvernance des extraits IA sante',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation patient',
        description: 'Rappels, suivi et education selon consentements et protocoles.',
        bullets: [
          'Rappels rendez-vous et analyses',
          'Plans de soins post visite par segment',
          'Livraison securisee de documents',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation medicale',
        description: 'Veille et reponses bilingues avec gabarits conformes.',
        bullets: [
          'Alertes temps reel pour les equipes',
          'Reponses assistees validees par personnel',
          'Tableaux satisfaction multi cliniques',
        ],
      },
      {
        id: 'advertising',
        title: 'Acquisition sante',
        description: 'Campagnes ciblees pour programmes, telemedecine et cliniques specialisees.',
        bullets: [
          'Campagnes geofence avec messages conformes',
          'Pages d atterrissage optimisees pour triage',
          'Revue hebdomadaire des indicateurs cliniques',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations specialisees',
        description: 'Connexions securisees aux outils DME, PMS et assureurs.',
        bullets: [
          'Synchronisation de donnees compatible HL7',
          'Synchro rendez-vous PMS et rapports',
          'Automatisation admissibilite assurance',
        ],
      },
    ],
    featuresTitle: 'Optimisations operationnelles',
    features: [
      {
        title: 'Experience patient',
        items: [
          'Questionnaires d entree avec alerte drapeau rouge',
          'Acces famille et proches avec controles',
          'Salle d attente virtuelle bilingue',
        ],
      },
      {
        title: 'Operations cliniques',
        items: [
          'Tableaux d attente, absences et capacite',
          'Sondages post visite avec etiquettes resultats',
          'Analytique mensuelle pour inspections',
        ],
      },
    ],
    complianceTitle: 'Conformite sante et securite',
    compliancePoints: [
      'Journal des consentements par dossier patient',
      'Calendrier de retention avec export securise',
      'Cartographie PIA et registre fournisseurs',
    ],
    footerNote:
      'Besoin d integrations avancees? Nous connectons PMS et DME via API securisee.',
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

export function MedicalModal({
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
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
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
                <ClipboardCheck className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <FileText className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Activity className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default MedicalModal;

