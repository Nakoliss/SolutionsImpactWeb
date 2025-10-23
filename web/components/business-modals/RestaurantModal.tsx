'use client';

import {
  CalendarCheck,
  ChefHat,
  Flame,
  MessageSquare,
  Sparkles,
  Star,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Hospitality showcase',
      description:
        'Menus, reservations, delivery, and events orchestrated in one bilingual experience for restaurants and catering teams.',
      metrics: [
        {
          label: 'Reservation lead time',
          value: '42s',
          caption: 'Hero click to confirmed table',
          icon: CalendarCheck,
        },
        {
          label: 'Menu conversions',
          value: '18%+',
          caption: 'Guests adding dishes before arrival',
          icon: UtensilsCrossed,
        },
        {
          label: 'Delivery sync',
          value: 'POS + 4 apps',
          caption: 'Unified menus and availability',
          icon: Truck,
        },
      ],
    },
    servicesTitle: 'Service stack for restaurants and bars',
    services: [
      {
        id: 'websites',
        title: 'Restaurant sites',
        description: 'Immersive menus, chef stories, and reservation flows with rapid updates.',
        bullets: [
          'Menu manager with daily specials',
          'Photo rich landing pages for events',
          'Embedded reservation widgets',
        ],
      },
      {
        id: 'maintenance',
        title: 'Menu maintenance',
        description: 'Fast menu edits, allergen notices, and uptime monitoring before peak hours.',
        bullets: [
          'Dinner and brunch menu scheduling',
          'Holiday and seasonal menu swaps',
          'Latency alerts before service windows',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Local and AI search',
        description: 'Visibility across maps, voice assistants, and foodie AI recommendations.',
        bullets: [
          'Structured menu data for AI answers',
          'Neighborhood and cuisine keyword focus',
          'PR and blogger outreach playbooks',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Guest journeys',
        description: 'Automated confirmations, waitlist updates, and loyalty journeys.',
        bullets: [
          'SMS and email confirmations with upsell',
          'Birthday and VIP nurture flows',
          'Post visit review and referral prompts',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation service',
        description: 'Monitor reviews, craft responses, and pulse guest sentiment daily.',
        bullets: [
          'Auto detection of food and service themes',
          'Bilingual response templates approved by owners',
          'Weekly sentiment scoreboard for staff',
        ],
      },
      {
        id: 'advertising',
        title: 'Campaigns and ads',
        description: 'Promote brunch, catering, delivery, and chef tables with measurable ROI.',
        bullets: [
          'Geo targeted seasonal campaigns',
          'Lookalike audiences for loyal guests',
          'Landing pages paired with reservations',
        ],
      },
      {
        id: 'additionalServices',
        title: 'POS & marketplace integrations',
        description: 'Sync menus, inventory, and orders across delivery partners and POS.',
        bullets: [
          'Lightspeed and Square synchronization',
          'Uber Eats, DoorDash, SkipTheDishes mapping',
          'Out of stock automation with alerts',
        ],
      },
    ],
    featuresTitle: 'Guest engagement and growth',
    features: [
      {
        title: 'Guest experience',
        items: [
          'Interactive tasting menus with wine pairing suggestions',
          'Private dining and catering inquiry flows with automation',
          'Live waitlist with bilingual status updates',
        ],
      },
      {
        title: 'Operations and insights',
        items: [
          'Kitchen dashboards aligned with digital orders',
          'Revenue tracking by service window and channel',
          '360 loyalty view combining POS and website data',
        ],
      },
    ],
    complianceTitle: 'Food service compliance and trust',
    compliancePoints: [
      'Allergen flags and bilingual labelling baked into menus',
      'Quebec signage and alcohol regulations checklists',
      'PCI compliant payment and reservation workflows',
    ],
    footerNote:
      'Connect your point of sale, delivery partners, and gift card programs without data entry.',
  },
  fr: {
    hero: {
      kicker: 'Vitrine gastronomique',
      description:
        'Menus, reservations, livraison et evenements reunis dans une experience bilingue pour restaurants et traiteurs.',
      metrics: [
        {
          label: 'Delai reservation',
          value: '42 s',
          caption: 'Du clic a la table confirmee',
          icon: CalendarCheck,
        },
        {
          label: 'Conversion menu',
          value: '18%+',
          caption: 'Clients ajoutant plats avant la visite',
          icon: UtensilsCrossed,
        },
        {
          label: 'Sync livraison',
          value: 'PDV + 4 apps',
          caption: 'Menus et disponibilites uniformes',
          icon: Truck,
        },
      ],
    },
    servicesTitle: 'Services pour restaurants et bars',
    services: [
      {
        id: 'websites',
        title: 'Sites restaurant',
        description: 'Menus immersifs, histoire du chef et reservations en quelques clics.',
        bullets: [
          'Gestion menus et plats du jour',
          'Pages evenements riches en photos',
          'Widgets de reservation integres',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance menus',
        description: 'Modifications rapides, allergenes et surveillance avant les rush.',
        bullets: [
          'Planification brunch et souper',
          'Menus saisonniers echanges en quelques minutes',
          'Alertes performance avant les services',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite locale et IA',
        description: 'Presence cartes, assistants vocaux et recommandations gourmandes IA.',
        bullets: [
          'Schema menu pour reponses IA',
          'Mots cles quartier et type de cuisine',
          'Plans RP et blogueurs gastronomie',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Parcours invites',
        description: 'Confirmations, liste d attente et fidelisation automatisee.',
        bullets: [
          'Confirmations SMS et courriel avec upsell',
          'Flux anniversaire et VIP',
          'Avis post visite et parrainage',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Reputation gourmande',
        description: 'Veille des avis, reponses bilingues et suivi du sentiment.',
        bullets: [
          'Detection automatique des themes service',
          'Gabarits valides par la direction',
          'Tableau sentiment hebdomadaire',
        ],
      },
      {
        id: 'advertising',
        title: 'Campagnes et publicite',
        description: 'Promouvoir brunch, traiteur, livraison et tables du chef avec ROI.',
        bullets: [
          'Campagnes geociblees saisonnieres',
          'Audiences similaires clients fideles',
          'Pages d atterrissage liees aux reservations',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations PDV et partenaires',
        description: 'Synchronisation menus, inventaires et commandes multi plateformes.',
        bullets: [
          'Synchronisation Lightspeed et Square',
          'Mapping Uber Eats, DoorDash, Skip',
          'Automatisation rupture de stock',
        ],
      },
    ],
    featuresTitle: 'Engagement et croissance',
    features: [
      {
        title: 'Experience invite',
        items: [
          'Menus degustation interactifs avec accords vins',
          'Demandes salles privees et traiteur automatisees',
          'Liste attente en direct bilingue',
        ],
      },
      {
        title: 'Operations et analyses',
        items: [
          'Tableaux cuisine alignes sur commandes numeriques',
          'Suivi revenus par service et canal',
          'Vue 360 fidelisation liant PDV et site',
        ],
      },
    ],
    complianceTitle: 'Conformite restauration',
    compliancePoints: [
      'Allergenes et etiquetage bilingue natifs',
      'Listes de verification affichage et alcool',
      'Paiements et reservations conformes PCI',
    ],
    footerNote:
      'Reliez point de vente, partenaires livraison et cartes cadeaux sans double saisie.',
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

export function RestaurantModal({
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
              <ChefHat className="h-4 w-4" aria-hidden="true" />
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
              <Flame className="h-5 w-5" aria-hidden="true" />
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

export default RestaurantModal;
