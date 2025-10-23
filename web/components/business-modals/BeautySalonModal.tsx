'use client';

import {
  CalendarCheck,
  Heart,
  MessageSquare,
  Palette,
  Scissors,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Beauty & wellness journeys',
      description:
        'Refined salon and spa layouts with bilingual booking, stylist portfolios, and membership programmes.',
      metrics: [
        {
          label: 'Booking flow',
          value: '24s',
          caption: 'From service selection to confirmed slot',
          icon: CalendarCheck,
        },
        {
          label: 'Membership retention',
          value: '74%',
          caption: 'Average renewal rate with automation',
          icon: Heart,
        },
        {
          label: 'Gallery engagement',
          value: '3.8x',
          caption: 'More taps on before and after carousels',
          icon: Sparkles,
        },
      ],
    },
    servicesTitle: 'Beauty service stack',
    services: [
      {
        id: 'websites',
        title: 'Salon websites',
        description: 'Signature branding, treatment pages, and stylist spotlights.',
        bullets: [
          'Treatment library with duration and pricing',
          'Stylist bios and availability badges',
          'Gallery layouts for before and after',
        ],
      },
      {
        id: 'maintenance',
        title: 'Lookbook maintenance',
        description: 'Update promotions, seasonal looks, and menu changes effortlessly.',
        bullets: [
          'Seasonal campaigns for hair and spa',
          'Rapid updates for product launches',
          'Performance monitoring before weekends',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Beauty search optimisation',
        description: 'Dominate local beauty search and AI beauty queries.',
        bullets: [
          'Schema for treatments and products',
          'Content playbooks for hair, nails, spa',
          'AI snippet governance for beauty trends',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Clienteling automation',
        description: 'Personalised reminders, memberships, and retail follow ups.',
        bullets: [
          'Automated rebooking journeys',
          'Membership renewal nudges',
          'Retail upsell sequences post visit',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation glow',
        description: 'Collect reviews and user generated content with ease.',
        bullets: [
          'Review prompts after treatments',
          'Content capture workflows for social',
          'Weekly sentiment dashboards',
        ],
      },
      {
        id: 'advertising',
        title: 'Beauty campaigns',
        description: 'Paid media for services, memberships, and product drops.',
        bullets: [
          'Geo targeted campaigns for new openings',
          'Influencer and creator collaborations',
          'Landing pages tuned for membership signups',
        ],
      },
      {
        id: 'additionalServices',
        title: 'POS & product integrations',
        description: 'Sync POS, retail inventory, and treatment booking tools.',
        bullets: [
          'MindBody and Fresha synchronisation',
          'Retail inventory with low stock alerts',
          'Gift card and loyalty integrations',
        ],
      },
    ],
    featuresTitle: 'Guest experience and operations',
    features: [
      {
        title: 'Guest journey',
        items: [
          'Visual booking wizard with service combinations',
          'Mobile friendly consultation forms',
          'Automated prep instructions per treatment',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Stylist dashboards aligned with bookings',
          'Retail and service performance reporting',
          'Team scheduling with utilisation alerts',
        ],
      },
    ],
    complianceTitle: 'Wellness compliance',
    compliancePoints: [
      'Consent forms with secure storage',
      'Product ingredient disclosures',
      'Accessibility and bilingual experience checks',
    ],
    footerNote:
      'Bring POS, scheduling, retail, and marketing together to delight every guest.',
  },
  fr: {
    hero: {
      kicker: 'Parcours beaute et bien-etre',
      description:
        'Design raffine pour salons et spas avec reservation bilingue, portfolios stylistes et programmes membres.',
      metrics: [
        {
          label: 'Parcours reservation',
          value: '24 s',
          caption: 'Selection service a plage confirme',
          icon: CalendarCheck,
        },
        {
          label: 'Retention membres',
          value: '74%',
          caption: 'Taux de renouvellement automatise',
          icon: Heart,
        },
        {
          label: 'Engagement galerie',
          value: '3.8x',
          caption: 'Interactions avant apres multipliees',
          icon: Sparkles,
        },
      ],
    },
    servicesTitle: 'Suite services beaute',
    services: [
      {
        id: 'websites',
        title: 'Sites salon',
        description: 'Branding signature, pages soins et mises en avant stylistes.',
        bullets: [
          'Bibliotheque soins avec duree et tarif',
          'Profils stylistes et disponibilite',
          'Galeries avant apres immersives',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance lookbook',
        description: 'Promotions, looks saisonniers et menu en quelques minutes.',
        bullets: [
          'Campagnes saison cheveux et spa',
          'Mises a jour rapides lancements produits',
          'Surveillance performance avant week-end',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite beaute',
        description: 'Dominer recherche locale et requetes IA beaute.',
        bullets: [
          'Schema traitements et produits',
          'Plans contenu cheveux, ongles, spa',
          'Controle extraits IA pour tendances',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Clienteling automatise',
        description: 'Rappels personnalises, membres et suivi retail.',
        bullets: [
          'Relances rebooking automatisees',
          'Relance renouvellement programmes',
          'Upsell retail apres visite',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation eclat',
        description: 'Collecter avis et contenus generes par clients.',
        bullets: [
          'Prompts avis apres chaque soin',
          'Processus collecte contenus sociaux',
          'Tableaux sentiment hebdomadaires',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes beaute',
        description: 'Media payant pour services, membres et lancements.',
        bullets: [
          'Campagnes geociblees nouvelles succursales',
          'Collaborations influenceurs',
          'Pages conversion membres optimisées',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations PDV et produits',
        description: 'Synchroniser PDV, inventaire retail et outils reservation.',
        bullets: [
          'Synchronisation MindBody et Fresha',
          'Inventaire retail avec alertes stocks',
          'Integrations cartes cadeau et fidelite',
        ],
      },
    ],
    featuresTitle: 'Experience invitee et operations',
    features: [
      {
        title: 'Parcours invitee',
        items: [
          'Assistant reservation visuel pour combinaisons services',
          'Formulaires consultation mobiles',
          'Instructions preparation automatisees',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Tableaux stylistes alignes sur rendez-vous',
          'Rapports performance services et retail',
          'Planifications equipe avec alertes charge',
        ],
      },
    ],
    complianceTitle: 'Conformite bien-etre',
    compliancePoints: [
      'Formulaires consentement stockes',
      'Transparence ingredients produits',
      'Verifications accessibilite et bilinguisme',
    ],
    footerNote:
      'Reunissez PDV, horaires, retail et marketing pour une experience memorables.',
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

export function BeautySalonModal({
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
              <Scissors className="h-4 w-4" aria-hidden="true" />
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
                <Palette className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <Wand2 className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Star className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default BeautySalonModal;
