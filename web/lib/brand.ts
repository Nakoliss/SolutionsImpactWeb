import type { SupportedLocale } from '@/content';

export interface BrandConfig {
  name: string;
  legalName: string;
  tagline: Record<SupportedLocale, string>;
  heroTitle: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  mission: Record<SupportedLocale, string>;
  keywords: Record<SupportedLocale, string[]>;
  values: Record<SupportedLocale, string[]>;
  meta: {
    defaultTitle: Record<SupportedLocale, string>;
    titleTemplate: Record<SupportedLocale, string>;
    description: Record<SupportedLocale, string>;
  };
  contact: {
    email: string;
    phone?: string;
    calendar?: string;
  };
  location: {
    city: string;
    region: string;
    country: string;
    serviceArea: string[];
  };
  social: {
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  foundedYear: number;
}

export const brandConfig: BrandConfig = {
  name: 'Agence web: Solutions Impact Web',
  legalName: '',
  tagline: {
    fr: 'Sites web modernes, visibilité Google et moteurs de réponses propulsés par l’intelligence artificielle, avec conformité Loi 25.',
    en: 'Modern websites, Google visibility and AI-powered answer engine coverage, plus Law 25 compliance.',
  },
  heroTitle: {
    fr: 'Sites web stratégiques et marketing automatisé',
    en: 'Strategic websites and automated marketing',
  },
  description: {
    fr: 'Solutions Impact Web conçoit des expériences web performantes qui respectent la Loi 25 et soutiennent votre croissance.',
    en: 'Solutions Impact Web builds high-performing web experiences that stay Law 25 compliant and support long-term growth.',
  },
  mission: {
    fr: 'Accompagner les équipes marketing du Québec avec des plateformes web efficaces et des automatisations responsables.',
    en: 'Support marketing teams across Quebec with effective web platforms and responsible automation.',
  },
  keywords: {
    fr: [
      'solutions impact web',
      'stratégie web intelligence artificielle',
      'visibilité Google Québec',
      'marketing automatisé',
      'conformité loi 25',
      'agence numérique montréal',
    ],
    en: [
      'solutions impact web',
      'Quebec Google visibility',
      'Québec google visibility',
      'marketing automation',
      'law 25 compliance',
      'montreal digital agency',
    ],
  },
  values: {
    fr: [
      'Performance et transparence',
      'Collaboration proactive',
      'Innovation responsable',
    ],
    en: [
      'Performance and transparency',
      'Bilingual collaboration',
      'Responsible innovation',
    ],
  },
  meta: {
    defaultTitle: {
      fr: 'Solutions Impact Web - Agence web et marketing automatisé',
      en: 'Solutions Impact Web - Web agency and marketing automation',
    },
    titleTemplate: {
      fr: '%s | Solutions Impact Web',
      en: '%s | Solutions Impact Web',
    },
    description: {
      fr: 'Agence web spécialisée en conception de sites, visibilité Google locale, automatisations intelligentes et conformité Loi 25.',
      en: 'Web agency specialized in websites, local Google visibility, smart automation, and Law 25 compliance.',
    },
  },
  contact: {
    email: 'contact@example.com',
    phone: '+1-555-555-5555',
    calendar: '',
  },
  location: {
    city: 'Montreal',
    region: 'QC',
    country: 'Canada',
    serviceArea: ['Québec', 'Ontario', 'North America'],
  },
  social: {
    linkedin: '',
    instagram: '',
  },
  foundedYear: 2018,
};

export function pickBrandLocale<T>(
  locale: SupportedLocale,
  content: Record<SupportedLocale, T>,
): T {
  return content[locale] ?? content.fr;
}
