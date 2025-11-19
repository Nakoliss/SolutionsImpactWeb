import type { SupportedLocale } from '@/content';
import { buildLocalePath, buildLocaleUrl } from '@/lib/localeRouting';
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

export interface Article {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher: Organization;
  mainEntityOfPage: string;
  image?: string;
  articleSection?: string;
  keywords?: string[];
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

const SEO_FAQ: Record<SupportedLocale, FAQPage> = {
  fr: {
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Qu\'est-ce que le SEO local et pourquoi est-ce important pour les PME du Québec ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le SEO local (Search Engine Optimization local) est une stratégie de marketing numérique qui aide les entreprises à apparaître dans les résultats de recherche Google pour les requêtes locales. Pour les PME du Québec, c\'est essentiel car plus de 80% des recherches incluent des termes locaux comme "à Montréal" ou "près de moi". Un bon SEO local augmente votre visibilité, génère plus de trafic qualifié et améliore vos chances d\'attirer des clients locaux.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment optimiser mon profil Google Business Profile pour le marché québécois ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pour optimiser votre Google Business Profile au Québec : 1) Utilisez un NAP (Nom, Adresse, Téléphone) cohérent partout, 2) Ajoutez des catégories précises en français et en anglais, 3) Publiez régulièrement du contenu (posts, photos, vidéos), 4) Activez la messagerie et les réservations, 5) Répondez aux avis clients rapidement, 6) Assurez-vous que vos informations sont à jour et complètes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Dois-je avoir un site web bilingue (FR/EN) pour le SEO au Québec ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, un site bilingue est fortement recommandé pour le marché québécois. Cela vous permet de toucher à la fois les clients francophones et anglophones, d\'améliorer votre classement dans les résultats de recherche pour les deux langues, et de respecter les attentes du marché québécois. Utilisez des balises hreflang pour indiquer à Google les versions linguistiques de vos pages.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment la Loi 25 affecte-t-elle mon utilisation de Google Analytics et Google Business Profile ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La Loi 25 exige que vous obteniez le consentement explicite des visiteurs avant d\'activer Google Analytics ou d\'autres cookies non essentiels. Vous devez afficher une bannière de cookies conforme, offrir des choix granulaires (analytics, marketing, préférences), documenter votre utilisation dans votre politique de confidentialité, et permettre aux utilisateurs de retirer leur consentement à tout moment. Les statistiques Google Business Profile sont généralement agrégées et conformes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qu\'est-ce que l\'AEO (Answer Engine Optimization) et comment ça fonctionne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'L\'AEO (Answer Engine Optimization) est l\'optimisation de votre contenu pour apparaître dans les moteurs de réponses comme Google Assistant, les extraits enrichis et les résultats de recherche vocale. Pour optimiser l\'AEO, créez du contenu FAQ avec des réponses courtes et directes, utilisez le balisage FAQPage JSON-LD, structurez vos réponses avec des en-têtes clairs, et ciblez les questions que vos clients posent réellement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps faut-il pour voir des résultats SEO local ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les résultats SEO local varient généralement entre 3 à 6 mois pour voir des améliorations significatives, mais certains éléments comme l\'optimisation Google Business Profile peuvent montrer des résultats plus rapidement (1-2 mois). Les facteurs clés incluent la concurrence dans votre secteur, la qualité de votre contenu, la cohérence de vos citations locales (NAP), et la régularité de vos publications.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels sont les outils essentiels pour mesurer le succès de mon SEO local ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les outils essentiels incluent : Google Search Console (impressions, clics, positions), Google Analytics 4 (trafic organique local, conversions), Google Business Profile Insights (vues, recherches, actions), et des outils de suivi de citations comme BrightLocal ou Moz Local. Assurez-vous de respecter la Loi 25 en obtenant le consentement avant d\'activer Google Analytics.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment puis-je améliorer ma visibilité dans les résultats de recherche Google au Québec ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pour améliorer votre visibilité Google au Québec : 1) Optimisez votre Google Business Profile avec un NAP cohérent, 2) Créez du contenu bilingue (FR/EN) optimisé SEO, 3) Obtenez des avis clients authentiques, 4) Construisez des citations locales cohérentes, 5) Utilisez des mots-clés locaux dans votre contenu, 6) Publiez régulièrement du contenu de qualité, 7) Assurez-vous que votre site est rapide et mobile-friendly.',
        },
      },
    ],
  },
  en: {
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is local SEO and why is it important for Quebec SMEs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Local SEO (Local Search Engine Optimization) is a digital marketing strategy that helps businesses appear in Google search results for local queries. For Quebec SMEs, it\'s essential because more than 80% of searches include local terms like "in Montreal" or "near me". Good local SEO increases your visibility, generates more qualified traffic, and improves your chances of attracting local clients.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I optimize my Google Business Profile for the Quebec market?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To optimize your Google Business Profile in Quebec: 1) Use consistent NAP (Name, Address, Phone) everywhere, 2) Add precise categories in French and English, 3) Regularly publish content (posts, photos, videos), 4) Enable messaging and bookings, 5) Respond to customer reviews quickly, 6) Ensure your information is up-to-date and complete.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a bilingual website (FR/EN) for SEO in Quebec?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, a bilingual website is strongly recommended for the Quebec market. This allows you to reach both French and English-speaking clients, improve your ranking in search results for both languages, and meet Quebec market expectations. Use hreflang tags to indicate to Google the language versions of your pages.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Law 25 affect my use of Google Analytics and Google Business Profile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Law 25 requires you to obtain explicit consent from visitors before activating Google Analytics or other non-essential cookies. You must display a compliant cookie banner, offer granular choices (analytics, marketing, preferences), document your use in your privacy policy, and allow users to withdraw their consent at any time. Google Business Profile statistics are generally aggregated and compliant.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is AEO (Answer Engine Optimization) and how does it work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AEO (Answer Engine Optimization) is optimizing your content to appear in answer engines like Google Assistant, featured snippets, and voice search results. To optimize AEO, create FAQ content with short, direct answers, use FAQPage JSON-LD markup, structure your answers with clear headings, and target questions your clients actually ask.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take to see local SEO results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Local SEO results typically vary between 3 to 6 months to see significant improvements, but some elements like Google Business Profile optimization can show results more quickly (1-2 months). Key factors include competition in your sector, content quality, consistency of your local citations (NAP), and regularity of your publications.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the essential tools to measure the success of my local SEO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Essential tools include: Google Search Console (impressions, clicks, positions), Google Analytics 4 (local organic traffic, conversions), Google Business Profile Insights (views, searches, actions), and citation tracking tools like BrightLocal or Moz Local. Ensure you comply with Law 25 by obtaining consent before activating Google Analytics.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I improve my visibility in Google search results in Quebec?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To improve your Google visibility in Quebec: 1) Optimize your Google Business Profile with consistent NAP, 2) Create bilingual (FR/EN) SEO-optimized content, 3) Get authentic customer reviews, 4) Build consistent local citations, 5) Use local keywords in your content, 6) Regularly publish quality content, 7) Ensure your site is fast and mobile-friendly.',
        },
      },
    ],
  },
};

export function getSeoFaq(locale: SupportedLocale): FAQPage {
  return SEO_FAQ[locale];
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

export function generateArticleSchema(article: Article): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.mainEntityOfPage,
    },
    publisher: {
      '@type': article.publisher.contactPoint ? 'Organization' : 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
    ...(article.author && {
      author: {
        '@type': article.author['@type'],
        name: article.author.name,
      },
    }),
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image,
      },
    }),
    ...(article.articleSection && { articleSection: article.articleSection }),
    ...(article.keywords && article.keywords.length > 0 && { keywords: article.keywords.join(', ') }),
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
  const normalizedBase = baseUrl.replace(/\/$/, '');

  breadcrumbs.push({
    '@type': 'ListItem',
    position: 1,
    name: locale === 'fr' ? 'Accueil' : 'Home',
    item: buildLocaleUrl(baseUrl, locale, '/'),
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

  const relativeSegments: string[] = [];

  for (const segment of pathSegments) {
    if (segment === locale) continue;

    relativeSegments.push(segment);
    const position = breadcrumbs.length + 1;
    const dictionary = labels[locale];
    const label = dictionary[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
    const localizedPath = `/${relativeSegments.join('/')}`;

    breadcrumbs.push({
      '@type': 'ListItem',
      position,
      name: label,
      item: relativeSegments.length
        ? buildLocaleUrl(baseUrl, locale, localizedPath)
        : normalizedBase,
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
  article?: Article;
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

  if (options.article) {
    schemas.push(generateArticleSchema(options.article));
  }

  return schemas;
}
