import type { SupportedLocale } from '@/content';
import { brandConfig, pickBrandLocale } from '@/lib/brand';
import { SITE_URL } from '@/lib/metadata';

/**
 * Structured Data helpers for SEO
 * Generates JSON-LD markup for search engines
 */

export interface Organization {
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint?: ContactPoint[];
  address?: PostalAddress;
  sameAs?: string[];
  foundingDate?: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  contactType: string;
  telephone?: string;
  email?: string;
  availableLanguage: string[];
  areaServed: string;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface LocalBusiness {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  image?: string;
  address: PostalAddress;
  areaServed?: string[];
  sameAs?: string[];
  priceRange?: string;
}

export interface Service {
  name: string;
  description: string;
  provider: Organization;
  serviceType: string;
  areaServed: string;
  offers?: Offer[];
}

export interface Offer {
  '@type': 'Offer';
  name: string;
  description: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  category?: string;
}

export interface BreadcrumbList {
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface FAQPage {
  mainEntity: Question[];
}

export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  '@type': 'Answer';
  text: string;
}

const ORGANIZATION_LOGO = `${SITE_URL.replace(/\/$/, '')}/favicon.ico`;
const ORGANIZATION_ADDRESS: PostalAddress = {
  '@type': 'PostalAddress',
  streetAddress: '400 Rue Montfort Suite 220',
  addressLocality: brandConfig.location.city,
  addressRegion: brandConfig.location.region,
  postalCode: 'H3C 4J8',
  addressCountry: 'CA',
};

const CONTACT_LANGUAGES = ['French', 'English'];
const SOCIAL_LINKS = [
  brandConfig.social.linkedin,
  brandConfig.social.instagram,
  brandConfig.social.facebook,
  brandConfig.social.youtube,
].filter(Boolean) as string[];

const BASE_AREA_SERVED = 'Québec, Canada';
const CONTACT_POINTS: ContactPoint[] = [
  {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: brandConfig.contact.email,
    ...(brandConfig.contact.phone && { telephone: brandConfig.contact.phone }),
    availableLanguage: CONTACT_LANGUAGES,
    areaServed: BASE_AREA_SERVED,
  },
];

interface ServiceDefinition {
  id: 'diagnostic' | 'website' | 'automation' | 'enterprise' | 'compliance';
  serviceType: string;
  category: string;
  price?: string;
}


const SERVICE_CATALOG: Record<SupportedLocale, Array<ServiceDefinition & {
  name: string;
  description: string;
  offerName: string;
  offerDescription: string;
}>> = {
  fr: [
    {
      id: 'diagnostic',
      name: 'Diagnostic et feuille de route',
      description: 'Audit bilingue, atelier strategique et plan couvrant automatisations intelligentes et visibilite Google conforme a la Loi 25.',
      serviceType: 'Consulting',
      category: 'Diagnostic',
      price: '4500',
      offerName: 'Programme diagnostic et feuille de route',
      offerDescription: 'Evaluation FR/EN, priorisation UX et checklist de conformite Loi 25.',
    },
    {
      id: 'website',
      name: 'Site bilingue + operations IA',
      description: 'Conception web personnalisee avec contenus FR/EN, consentement et analytics fiables.',
      serviceType: 'Web Development',
      category: 'Web Development',
      price: '18500',
      offerName: 'Lancement de site bilingue',
      offerDescription: 'UX personnalisee, bibliotheque de composants, contenu FR/EN et mise en conformite.',
    },
    {
      id: 'automation',
      name: 'Cycles de croissance',
      description: "Optimisation continue de la visibilite Google/CRO avec automatisations d'acquisition et nurturing IA.",
      serviceType: 'Marketing Automation',
      category: 'Marketing Automation',
      price: '3200',
      offerName: "Cycle d'automatisation et d'optimisation",
      offerDescription: "Itérations visibilité Google/CRO, séquences d'engagement et suivi du pipeline.",
    },
    {
      id: 'compliance',
      name: 'Programme de conformite Loi 25',
      description: 'Audit de confidentialite, registre des sous-traitants et plan de mise en oeuvre.',
      serviceType: 'Compliance Consulting',
      category: 'Compliance',
      price: '5400',
      offerName: "Plan d'acceleration conformite",
      offerDescription: 'Audit de conformite, mise a jour des politiques et ateliers pour votre equipe.',
    },
    {
      id: 'enterprise',
      name: 'Partenariat entreprise',
      description: 'Equipe numerique fractionnaire pour ecosystemes complexes et multi-marques.',
      serviceType: 'Digital Strategy',
      category: 'Enterprise Services',
      offerName: 'Partenariat enterprise',
      offerDescription: 'Equipe pluridisciplinaire, gouvernance et soutien conforme Loi 25.',
    },
  ],
  en: [
    {
      id: 'diagnostic',
      name: 'Diagnostic and roadmap',
      description: 'Bilingual audit, stakeholder workshop, and plan covering automation and Google visibility work built for Law 25 compliance.',
      serviceType: 'Consulting',
      category: 'Diagnostic',
      price: '4500',
      offerName: 'Diagnostic and roadmap program',
      offerDescription: 'FR/EN assessment, UX prioritisation, and Law 25 compliance checklist.',
    },
    {
      id: 'website',
      name: 'Bilingual site + AI ops',
      description: 'Custom website build with FR/EN content, consent governance, and analytics integrations.',
      serviceType: 'Web Development',
      category: 'Web Development',
      price: '18500',
      offerName: 'Bilingual website launch',
      offerDescription: 'Tailored UX, component library, bilingual copy, and Law 25 compliant setup.',
    },
    {
      id: 'automation',
      name: 'Growth sprints',
      description: 'Ongoing Google visibility and CRO optimisation with AI-driven nurture and automation workflows.',
      serviceType: 'Marketing Automation',
      category: 'Marketing Automation',
      price: '3200',
      offerName: 'Automation sprint',
      offerDescription: 'Iterative optimisation, engagement sequences, and funnel reporting.',
    },
    {
      id: 'compliance',
      name: 'Law 25 compliance program',
      description: 'Privacy audit, subcontractor registry, and implementation roadmap.',
      serviceType: 'Compliance Consulting',
      category: 'Compliance',
      price: '5400',
      offerName: 'Compliance acceleration plan',
      offerDescription: 'Policy updates, governance playbook, and team training.',
    },
    {
      id: 'enterprise',
      name: 'Enterprise partnership',
      description: 'Fractional digital team designed for complex, multi-brand ecosystems.',
      serviceType: 'Digital Strategy',
      category: 'Enterprise Services',
      offerName: 'Enterprise partnership',
      offerDescription: 'Embedded advisors, governance support, and law-compliant delivery.',
    },
  ],
};
const COMPLIANCE_FAQ: Record<SupportedLocale, FAQPage> = {
  fr: {
    mainEntity: [
      {
        '@type': 'Question',
        name: "Qu'est-ce que la Loi 25 ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La Loi 25 modernise la reglementation québécoise (ancien Projet de loi 64) et impose des exigences renforcees en matiere de gouvernance des donnees, de consentement et de notification des incidents.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quels registres devons-nous maintenir ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Conservez un registre des sous-traitants, documentez les finalites de traitement, archivez les decisions de consentement et fournissez des procedures pour l'acces, la rectification et la suppression des renseignements personnels.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelles sont les penalites en cas de non-conformite ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La Commission d'acces a l'information peut imposer des amendes allant jusqu'a 25 millions $ CA ou 4 % du chiffre d'affaires mondial pour les violations graves, d'ou l'importance d'une strategie proactive.",
        },
      },
    ],
  },
  en: {
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Quebec Law 25?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Law 25 modernises Quebec privacy rules (formerly Bill 64) and requires stronger data governance, consent controls, and incident reporting for organisations handling Quebec resident data.",
        },
      },
      {
        '@type': 'Question',
        name: 'What records do we need to keep?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Maintain a subcontractor registry, document processing purposes, store consent decisions, and publish procedures for individuals to access, correct, port, or delete their personal information.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the penalties for non-compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "The Commission d'acces a l'information can issue fines up to CAD 25 million or four percent of worldwide revenue for severe violations, so proactive compliance is critical.",
        },
      },
    ],
  },
};
export function buildOrganization(locale: SupportedLocale): Organization {
  return {
    name: brandConfig.name,
    description: pickBrandLocale(locale, brandConfig.description),
    url: SITE_URL,
    logo: ORGANIZATION_LOGO,
    contactPoint: CONTACT_POINTS,
    address: ORGANIZATION_ADDRESS,
    ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS }),
    foundingDate: `${brandConfig.foundedYear}-01-01`,
  };
}

export function buildLocalBusiness(locale: SupportedLocale): LocalBusiness {
  return {
    name: brandConfig.name,
    description: pickBrandLocale(locale, brandConfig.description),
    url: SITE_URL,
    ...(brandConfig.contact.phone && { telephone: brandConfig.contact.phone }),
    image: ORGANIZATION_LOGO,
    address: ORGANIZATION_ADDRESS,
    areaServed: brandConfig.location.serviceArea,
    ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS }),
    priceRange: '$$-$$$',
  };
}

export function buildServices(locale: SupportedLocale): Service[] {
  const provider = buildOrganization(locale);
  return SERVICE_CATALOG[locale].map((service) => ({
    name: service.name,
    description: service.description,
    provider,
    serviceType: service.serviceType,
    areaServed: BASE_AREA_SERVED,
    offers: [
      {
        '@type': 'Offer',
        name: service.offerName,
        description: service.offerDescription,
        ...(service.price && { price: service.price, priceCurrency: 'CAD' }),
        availability: 'https://schema.org/InStock',
        category: service.category,
      },
    ],
  }));
}

export function getComplianceFaq(locale: SupportedLocale): FAQPage {
  return COMPLIANCE_FAQ[locale];
}

export function generateOrganizationSchema(org: Organization): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url,
    logo: {
      '@type': 'ImageObject',
      url: org.logo,
    },
    ...(org.contactPoint && { contactPoint: org.contactPoint }),
    ...(org.address && { address: org.address }),
    ...(org.sameAs && org.sameAs.length > 0 && { sameAs: org.sameAs }),
    ...(org.foundingDate && { foundingDate: org.foundingDate }),
  };

  return JSON.stringify(schema, null, 2);
}

export function generateLocalBusinessSchema(business: LocalBusiness): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.image && { image: business.image }),
    address: business.address,
    ...(business.areaServed && { areaServed: business.areaServed }),
    ...(business.sameAs && business.sameAs.length > 0 && { sameAs: business.sameAs }),
    ...(business.priceRange && { priceRange: business.priceRange }),
  };

  return JSON.stringify(schema, null, 2);
}

export function generateServiceSchema(service: Service): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider.name,
      url: service.provider.url,
    },
    serviceType: service.serviceType,
    areaServed: {
      '@type': 'Place',
      name: service.areaServed,
    },
    ...(service.offers && { offers: service.offers }),
  };

  return JSON.stringify(schema, null, 2);
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbList): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.itemListElement,
  };

  return JSON.stringify(schema, null, 2);
}

export function generateFAQSchema(faq: FAQPage): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.mainEntity,
  };

  return JSON.stringify(schema, null, 2);
}

export function generateBreadcrumbsFromPath(
  path: string,
  locale: SupportedLocale = 'fr',
  baseUrl: string = SITE_URL,
): BreadcrumbList {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  breadcrumbs.push({
    '@type': 'ListItem',
    position: 1,
    name: locale === 'fr' ? 'Accueil' : 'Home',
    item: `${baseUrl.replace(/\/$/, '')}/${locale}`,
  });

  const labels: Record<SupportedLocale, Record<string, string>> = {
    fr: {
      content: 'Contenu',
      compliance: 'Conformite',
      pricing: 'Tarification',
      guides: 'Guides',
      services: 'Services',
      contact: 'Contact',
    },
    en: {
      content: 'Content',
      compliance: 'Compliance',
      pricing: 'Pricing',
      guides: 'Guides',
      services: 'Services',
      contact: 'Contact',
    },
  };

  let currentPath = `/${locale}`;

  for (const segment of pathSegments) {
    if (segment === locale) continue;

    currentPath += `/${segment}`;
    const position = breadcrumbs.length + 1;
    const dictionary = labels[locale];
    const label = dictionary[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      '@type': 'ListItem',
      position,
      name: label,
      item: `${baseUrl.replace(/\/$/, '')}${currentPath}`,
    });
  }

  return { itemListElement: breadcrumbs };
}

export function generatePageStructuredData(options: {
  locale?: SupportedLocale;
  organization?: boolean | Organization;
  localBusiness?: boolean | LocalBusiness;
  services?: Service[];
  breadcrumbs?: BreadcrumbList;
  faq?: FAQPage;
}): string[] {
  const locale = options.locale ?? 'fr';
  const schemas: string[] = [];

  if (options.organization) {
    const organizationData = options.organization === true
      ? buildOrganization(locale)
      : options.organization;
    schemas.push(generateOrganizationSchema(organizationData));
  }

  if (options.localBusiness) {
    const localBusinessData = options.localBusiness === true
      ? buildLocalBusiness(locale)
      : options.localBusiness;
    schemas.push(generateLocalBusinessSchema(localBusinessData));
  }

  if (options.services) {
    for (const service of options.services) {
      schemas.push(generateServiceSchema(service));
    }
  }

  if (options.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(options.breadcrumbs));
  }

  if (options.faq) {
    schemas.push(generateFAQSchema(options.faq));
  }

  return schemas;
}
