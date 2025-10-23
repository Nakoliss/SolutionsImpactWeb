'use client';

import {
  Building,
  CalendarCheck,
  FileText,
  Gavel,
  MessageSquare,
  Scale,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Trusted legal presence',
      description:
        'Professional storytelling for law firms with secure intake, practice area navigation, and bilingual governance.',
      metrics: [
        {
          label: 'Consultation booking',
          value: '29s',
          caption: 'Lead to scheduled discovery call',
          icon: CalendarCheck,
        },
        {
          label: 'Secure intake',
          value: 'Encrypted',
          caption: 'PIPEDA and Law 25 compliant forms',
          icon: ShieldCheck,
        },
        {
          label: 'Client portal',
          value: 'Docs + tasks',
          caption: 'Centralised updates per mandate',
          icon: FileText,
        },
      ],
    },
    servicesTitle: 'Legal specific service suite',
    services: [
      {
        id: 'websites',
        title: 'Law firm websites',
        description: 'Structured practice area pages with thought leadership and attorney bios.',
        bullets: [
          'Practice area navigation by need',
          'Attorney and team spotlight layouts',
          'Resource libraries for guides and alerts',
        ],
      },
      {
        id: 'maintenance',
        title: 'Governance maintenance',
        description: 'Keep disclaimers, lawyer profiles, and policies current.',
        bullets: [
          'Automatic updates for Barreau requirements',
          'Case alert banners and popups',
          'Disaster recovery for sensitive files',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Legal search and AI presence',
        description: 'Capture local search, jurisprudence topics, and AI legal answers.',
        bullets: [
          'Structured data for services and industries',
          'Content playbooks per mandate type',
          'AI snippet monitoring for legal queries',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Client automation',
        description: 'Intake triage, mandate updates, and nurture flows.',
        bullets: [
          'Conflict checks and assignment routing',
          'Matter status notifications',
          'Cross sell legal programme journeys',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation and testimonials',
        description: 'Collect and manage testimonials in compliance with ethics rules.',
        bullets: [
          'Ethics ready testimonial requests',
          'Approval workflow with compliance logs',
          'Sentiment dashboards by practice',
        ],
      },
      {
        id: 'advertising',
        title: 'Targeted legal campaigns',
        description: 'Lead programmes for corporate, family, immigration, and litigation.',
        bullets: [
          'Industry segmentation for B2B mandates',
          'Community outreach for family and immigration',
          'Landing pages with intake screening',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Legal tech integrations',
        description: 'Connect to case management, e-signature, and research systems.',
        bullets: [
          'API bridges with Clio and Terraview',
          'Secure links to e-discovery tools',
          'Knowledge base tagging and taxonomy',
        ],
      },
    ],
    featuresTitle: 'Client service and governance',
    features: [
      {
        title: 'Client experience',
        items: [
          'Dynamic intake built by practice area',
          'Secure document rooms with audit logs',
          'Client education hubs with bilingual resources',
        ],
      },
      {
        title: 'Governance and knowledge',
        items: [
          'Precedent libraries tied to marketing pages',
          'Risk management dashboards by department',
          'Accessibility and bilingual compliance audits',
        ],
      },
    ],
    complianceTitle: 'Professional responsibility',
    compliancePoints: [
      'Consent and conflict questionnaire archives',
      'Immediate breach response playbooks',
      'Audit history for all content changes',
    ],
    footerNote:
      'Align with your DMS, billing, and research stack while protecting confidentiality.',
  },
  fr: {
    hero: {
      kicker: 'Presence juridique fiable',
      description:
        'Narration professionnelle pour cabinets avec intake securise, navigation par pratique et gouvernance bilingue.',
      metrics: [
        {
          label: 'Prise consultation',
          value: '29 s',
          caption: 'Du lead au diagnostic planifie',
          icon: CalendarCheck,
        },
        {
          label: 'Formulaires securises',
          value: 'Chiffres',
          caption: 'Conformes PIPEDA et Loi 25',
          icon: ShieldCheck,
        },
        {
          label: 'Portail client',
          value: 'Docs + taches',
          caption: 'Mises a jour centralisees par mandat',
          icon: FileText,
        },
      ],
    },
    servicesTitle: 'Suite adaptee aux cabinets juridiques',
    services: [
      {
        id: 'websites',
        title: 'Sites cabinets',
        description: 'Pages domaines de pratique structurees avec profils avocats et contenus experts.',
        bullets: [
          'Navigation par type de mandat',
          'Mises en avant avocats et equipes',
          'Bibliotheques de ressources et alertes',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance gouvernance',
        description: 'Mettre a jour mentions legales, profils et politiques.',
        bullets: [
          'Mises a jour automatiques Barreau',
          'Bannieres alertes dossiers',
          'Plan reprise donnees sensibles',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite juridique',
        description: 'Captez recherche locale, sujets jurisprudence et reponses IA.',
        bullets: [
          'Donnees structurees services et industries',
          'Plans contenu par type de dossier',
          'Veille extraits IA pour questions legales',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation client',
        description: 'Triage intake, suivi mandats et nurture.',
        bullets: [
          'Questionnaires conflits et assignation',
          'Notifications statut de dossier',
          'Parcours programmes juridiques recurrents',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation et temoignages',
        description: 'Collecte et gestion des temoignages selon regles deontologie.',
        bullets: [
          'Demandes temoignages conformes',
          'Workflow approbation avec journal',
          'Tableaux sentiment par pratique',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes ciblees',
        description: 'Programmes leads pour droit des affaires, famille, immigration et litige.',
        bullets: [
          'Segmentation entreprises par industrie',
          'Rayonnement communautaire familles et immigration',
          'Pages capture avec prequalification',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations legal tech',
        description: 'Connexion a la gestion dossier, signature et recherche.',
        bullets: [
          'Passerelles API Clio et Terraview',
          'Liens securises vers outils e-discovery',
          'Taxonomie et knowledge base',
        ],
      },
    ],
    featuresTitle: 'Service client et gouvernance',
    features: [
      {
        title: 'Experience client',
        items: [
          'Intake dynamique par domaine',
          'Salles documents securisees avec journal',
          'Centre ressources bilingue',
        ],
      },
      {
        title: 'Gouvernance et savoir',
        items: [
          'Bibliotheques precedents reliees marketing',
          'Tableaux risques par departement',
          'Audits accessibilite et bilinguisme',
        ],
      },
    ],
    complianceTitle: 'Responsabilite professionnelle',
    compliancePoints: [
      'Archives consentements et conflits',
      'Plans reponse incidents immediats',
      'Historique complet des modifications',
    ],
    footerNote:
      'Alignez DMS, facturation et recherche tout en preservant la confidentialite.',
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

export function LawFirmModal({
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
              <Scale className="h-4 w-4" aria-hidden="true" />
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
                <Gavel className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <Building className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <UserCheck className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default LawFirmModal;
