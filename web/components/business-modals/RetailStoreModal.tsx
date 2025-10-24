'use client';

import {
  BarChart3,
  CreditCard,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from 'lucide-react';

import { getPrimaryPrice, getServiceById } from '@/lib/services';

import Modal from '../Modal';
import { type BusinessModalProps } from './types';

const SECTION_CLASS = 'rounded-2xl border border-white/15 bg-black/30 p-6 sm:p-8';
const CARD_CLASS = 'flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5';

const LOCALE_COPY = {
  en: {
    hero: {
      kicker: 'Retail and ecommerce',
      description:
        'Conversion driven storefronts for retailers with omni-channel fulfilment, loyalty, and product storytelling.',
      metrics: [
        {
          label: 'Storefront load',
          value: '<1.2s',
          caption: 'First contentful paint on mobile',
          icon: ShoppingBag,
        },
        {
          label: 'Cart recovery',
          value: '21%',
          caption: 'Average uplift with automation',
          icon: ShoppingCart,
        },
        {
          label: 'Return handling',
          value: 'Self serve',
          caption: 'Portal with bilingual workflows',
          icon: Package,
        },
      ],
    },
    servicesTitle: 'Commerce service lineup',
    services: [
      {
        id: 'websites',
        title: 'Retail storefronts',
        description: 'High performance ecommerce with merchandising and storytelling.',
        bullets: [
          'Collection and product storytelling modules',
          'In store pickup and local delivery flows',
          'Personalised recommendations blocks',
        ],
      },
      {
        id: 'maintenance',
        title: 'Operations maintenance',
        description: 'Catalogue updates, promotions, and inventory freshness.',
        bullets: [
          'Promo and bundle campaign launches',
          'Inventory feed validation nightly',
          'Alerting for conversion anomalies',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Commerce Google visibility + intelligent automation',
        description: 'Search and AI visibility for products, categories, and buying guides.',
        bullets: [
          'Schema for products, reviews, availability',
          'Buying guides and lookbooks for AI answers',
          'Content sprints for seasonal demand',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Lifecycle automation',
        description: 'Lifecycle journeys for cart recovery, loyalty, and replenishment.',
        bullets: [
          'Cart recovery and browse abandon',
          'Replenishment and subscription flows',
          'VIP loyalty journeys with perks',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Social proof engine',
        description: 'Capture reviews, UGC, and publish across channels.',
        bullets: [
          'Review syndication to PDP and ads',
          'Photo review capture with moderation',
          'Insights by product line and location',
        ],
      },
      {
        id: 'advertising',
        title: 'Performance media',
        description: 'Paid campaigns optimised to revenue and ROAS.',
        bullets: [
          'Shopping ads with product feed governance',
          'Dynamic remarketing across channels',
          'Landing pages aligned to campaigns',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Platform integrations',
        description: 'Unify POS, OMS, ERP, and marketing platforms.',
        bullets: [
          'Shopify, Magento, and Commercetools specialists',
          'OMS and WMS integration workflows',
          'Data pipelines feeding BI dashboards',
        ],
      },
    ],
    featuresTitle: 'Customer journey and operations',
    features: [
      {
        title: 'Customer journey',
        items: [
          'Guided discovery with shoppable content',
          'Checkout optimised for conversion and trust',
          'Self service returns and exchanges portal',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Inventory dashboards across channels',
          'Store associate tools for endless aisle',
          'Analytics on margin, AOV, and retention',
        ],
      },
    ],
    complianceTitle: 'Retail compliance and trust',
    compliancePoints: [
      'PCI DSS ready checkout and vaulting',
      'Privacy and consent governance per region',
      'Accessibility audits for every release',
    ],
    footerNote:
      'Sync digital and store operations with unified commerce data pipelines.',
  },
  fr: {
    hero: {
      kicker: 'Commerce omnicanal',
      description:
        'Vitrine ecommerce performante pour detail avec fulfillment omnicanal, fidelisation et narration produits.',
      metrics: [
        {
          label: 'Chargement vitrine',
          value: '<1.2 s',
          caption: 'First contentful paint mobile',
          icon: ShoppingBag,
        },
        {
          label: 'Recuperation panier',
          value: '21%',
          caption: 'Hausse moyenne via automation',
          icon: ShoppingCart,
        },
        {
          label: 'Gestion retours',
          value: 'Libre service',
          caption: 'Portail bilingue avec parcours',
          icon: Package,
        },
      ],
    },
    servicesTitle: 'Suite services commerce',
    services: [
      {
        id: 'websites',
        title: 'Vitrines retail',
        description: 'Ecommerce performant avec merchandising et narration.',
        bullets: [
          'Modules histoire produit et collection',
          'Ramassage magasin et livraison locale',
          'Recommandations personnalisees',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance operations',
        description: 'Mises a jour catalogue, promotions et stocks.',
        bullets: [
          'Lancements promos et bundles',
          'Validation flux inventaire nocturne',
          'Alertes anomalies conversion',
        ],
      },
      {
        id: 'seoOptimization',
        title: 'Visibilite Google commerce et automatisation intelligente',
        description: 'Visibilite recherche et reponses IA pour produits et guides.',
        bullets: [
          'Schema produits, avis, disponibilite',
          'Guides achat et lookbooks pour IA',
          'Sprints contenu saisons',
        ],
      },
      {
        id: 'marketingAutomation',
        title: 'Automatisation cycle client',
        description: 'Parcours panier, fidelite et reapprovisionnement.',
        bullets: [
          'Relances panier et navigation',
          'Flux reapprovisionnement et abonnement',
          'Parcours VIP avec avantages',
        ],
      },
      {
        id: 'reviewManagement',
        title: 'Moteur preuve sociale',
        description: 'Collecter avis, UGC et diffuser multi canaux.',
        bullets: [
          'Syndication avis vers PDP et pubs',
          'Collecte photo avis avec moderation',
          'Insights par gamme et succursale',
        ],
      },
      {
        id: 'advertising',
        title: 'Media performance',
        description: 'Campagnes payantes optimisées revenue et ROAS.',
        bullets: [
          'Shopping ads avec gouvernance flux',
          'Remarketing dynamique multi canaux',
          'Pages de destination alignees campagnes',
        ],
      },
      {
        id: 'additionalServices',
        title: 'Integrations plateformes',
        description: 'Unifier PDV, OMS, ERP et marketing.',
        bullets: [
          'Experts Shopify, Magento, Commercetools',
          'Workflows OMS et WMS',
          'Pipelines donnees vers BI',
        ],
      },
    ],
    featuresTitle: 'Parcours client et operations',
    features: [
      {
        title: 'Parcours client',
        items: [
          'Decouverte guidee avec contenu shoppable',
          'Checkout optimise conversion et confiance',
          'Portail retours et echanges libre service',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Tableaux inventaire multi canaux',
          'Outils vendeurs pour endless aisle',
          'Analyses marge, PM, retention',
        ],
      },
    ],
    complianceTitle: 'Conformite retail et confiance',
    compliancePoints: [
      'Checkout conforme PCI DSS',
      'Gouvernance vie privee par region',
      'Audits accessibilite a chaque release',
    ],
    footerNote:
      'Alignez operations digitales et magasin avec pipelines donnees unifies.',
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

export function RetailStoreModal({
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
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
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
                <CreditCard className="h-5 w-5 text-white/80" aria-hidden="true" />
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
              <Truck className="h-5 w-5" aria-hidden="true" />
              <h5 className="text-lg font-semibold sm:text-xl">{copy.complianceTitle}</h5>
            </div>
            <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              {copy.compliancePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <BarChart3 className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />
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

export default RetailStoreModal;



