import type { SupportedLocale } from '@/content';

export interface Subcontractor {
  name: string;
  service: string;
  purpose: Record<SupportedLocale, string>;
  dataHandled: string[];
  location: string;
  privacyUrl: string;
}

export const SUBCONTRACTORS: Subcontractor[] = [
  {
    name: 'Vercel',
    service: 'Hosting and deployment',
    purpose: {
      en: 'Provides secure hosting, serverless functions, and edge caching for the public website.',
      fr: 'Assure hebergement securise, fonctions serverless et mise en cache edge pour le site public.',
    },
    dataHandled: ['Website traffic logs', 'Contact form submissions (transit only)', 'Error diagnostics'],
    location: 'United States (ISO certifications, SOC 2 compliant)',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },
  {
    name: 'Resend',
    service: 'Transactional email delivery',
    purpose: {
      en: 'Sends confirmation and follow-up emails requested by prospects or clients via contact forms.',
      fr: 'Envoie les courriels de confirmation et de suivi demandes par les prospects ou clients via les formulaires.',
    },
    dataHandled: ['Contact name', 'Contact email', 'Message content'],
    location: 'United States (SOC 2 Type II, GDPR commitments)',
    privacyUrl: 'https://resend.com/privacy',
  },
  {
    name: 'MailerLite',
    service: 'Email marketing automation',
    purpose: {
      en: 'Hosts optional newsletters and drip sequences activated only after explicit opt-in.',
      fr: 'Hebe les infolettres facultatives et sequences automatisees declenchees apres un consentement explicite.',
    },
    dataHandled: ['Email address', 'Company name', 'Engagement metrics'],
    location: 'European Union (GDPR compliant, ISO 27001)',
    privacyUrl: 'https://www.mailerlite.com/legal/privacy-policy',
  },
  {
    name: 'Cal.com',
    service: 'Consultation scheduling',
    purpose: {
      en: 'Handles booking slots for diagnostics and discovery workshops.',
      fr: 'Gere la reservation des rencontres de diagnostic et des ateliers decouverte.',
    },
    dataHandled: ['Name', 'Email', 'Selected time slot', 'Optional meeting notes'],
    location: 'United States and European Union data centers',
    privacyUrl: 'https://cal.com/privacy',
  },
  {
    name: 'Sentry',
    service: 'Application monitoring',
    purpose: {
      en: 'Collects anonymised error events to keep the platform reliable.',
      fr: 'Collecte des erreurs anonymisees afin de maintenir la fiabilite de la plateforme.',
    },
    dataHandled: ['Technical error traces', 'Browser metadata'],
    location: 'European Union data storage (Frankfurt) with US processing safeguards',
    privacyUrl: 'https://sentry.io/privacy/',
  },
];

export interface PrivacySection {
  id: string;
  title: Record<SupportedLocale, string>;
  paragraphs: Record<SupportedLocale, string[]>;
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'overview',
    title: {
      en: 'Purpose of this policy',
      fr: 'Objet de cette politique',
    },
    paragraphs: {
      en: [
        'This policy explains how Web Impact Solutions collects, uses, stores, and protects personal information in compliance with Quebec Law 25 and Canadian privacy legislation.',
        'We only collect the data required to provide our bilingual web agency services, perform diagnostics, and communicate with clients or prospects.',
      ],
      fr: [
        'Cette politique explique comment Web Impact Solutions recueille, utilise, conserve et protege les renseignements personnels en conformite avec la Loi 25 et les lois canadiennes.',
        'Nous recueillons uniquement les donnees necessaires pour offrir nos services bilingues, realiser les diagnostics et communiquer avec les clients ou prospects.',
      ],
    },
  },
  {
    id: 'data-collected',
    title: {
      en: 'Personal information collected',
      fr: 'Renseignements personnels recueillis',
    },
    paragraphs: {
      en: [
        'Contact forms: name, email, company, phone (optional), project details, and consent preferences.',
        'Scheduling: preferred time slot, meeting agenda, and optional notes to prepare our consultation.',
        'Analytics: aggregated traffic metrics captured only when visitors accept analytics cookies.',
      ],
      fr: [
        'Formulaires de contact : nom, courriel, entreprise, telephone (facultatif), details du projet et preferences de consentement.',
        'Prise de rendez-vous : plage horaire souhaitee, objectifs de la rencontre et notes optionnelles pour la preparation.',
        'Analytiques : mesures de trafic agregees uniquement lorsque les visiteurs acceptent les temoins analytiques.',
      ],
    },
  },
  {
    id: 'legal-basis',
    title: {
      en: 'Legal bases and use of data',
      fr: 'Fondements legaux et utilisation',
    },
    paragraphs: {
      en: [
        'We process personal information on the basis of consent, contractual necessity, and legitimate interest when assisting existing clients.',
        'Data is used to schedule consultations, deliver proposals, execute projects, send agreed-upon communications, and maintain platform security.',
      ],
      fr: [
        'Nous traitons les renseignements personnels sur la base du consentement, de la necessite contractuelle et de l interet legitime pour assister nos clients existants.',
        'Les donnees servent a planifier les rencontres, preparer les offres, executer les projets, envoyer les communications convenues et assurer la securite de la plateforme.',
      ],
    },
  },
  {
    id: 'retention',
    title: {
      en: 'Retention and safeguards',
      fr: 'Conservation et mesures de protection',
    },
    paragraphs: {
      en: [
        'Project records are retained for seven years to satisfy legal, tax, and audit obligations. Lead records without engagement are purged after eighteen months.',
        'We apply encryption at rest, access controls, and least-privilege administration across our infrastructure and subcontractors.',
      ],
      fr: [
        'Les dossiers de projet sont conserves pendant sept ans afin de respecter les obligations legales, fiscales et d audit. Les dossiers de prospects sans engagement sont supprimes apres dix-huit mois.',
        'Nous appliquons le chiffrement au repos, des controles d acces et le principe du moindre privilege pour notre infrastructure et nos sous-traitants.',
      ],
    },
  },
  {
    id: 'individual-rights',
    title: {
      en: 'Your rights and how to exercise them',
      fr: 'Vos droits et la facon de les exercer',
    },
    paragraphs: {
      en: [
        'You may request access, rectification, portability, or deletion of your personal information at any time. Contact us via privacy@solutionsimpactweb.com or by using the data request form below.',
        'We respond to formal requests within 30 days. Identity verification may be required to protect your information.',
      ],
      fr: [
        'Vous pouvez demander l acces, la rectification, la portabilite ou la suppression de vos renseignements personnels en tout temps. Communiquez avec nous a privacy@solutionsimpactweb.com ou via le formulaire ci-dessous.',
        'Nous repondons aux demandes officielles dans un delai de 30 jours. Une verification d identite peut etre requise pour proteger vos informations.',
      ],
    },
  },
  {
    id: 'international',
    title: {
      en: 'Data transfers outside Quebec',
      fr: 'Transferts de donnees hors Québec',
    },
    paragraphs: {
      en: [
        'Some subcontractors operate infrastructure in the United States or the European Union. Contracts include standard contractual clauses and security reviews to guarantee equivalent protection.',
        'We maintain an updated assessment of vendors to confirm their compliance with Law 25, GDPR, and applicable data protection frameworks.',
      ],
      fr: [
        'Certains sous-traitants exploitent une infrastructure aux Etats-Unis ou dans l Union europeenne. Nos contrats incluent des clauses contractuelles types et des revues de securite pour assurer une protection equivalente.',
        'Nous tenons a jour une evaluation des fournisseurs afin de confirmer leur conformite a la Loi 25, au RGPD et aux cadres applicables.',
      ],
    },
  },
  {
    id: 'contact',
    title: {
      en: 'Contact the privacy officer',
      fr: 'Contacter le responsable de la protection des renseignements personnels',
    },
    paragraphs: {
      en: [
        'Privacy Officer: Daniel Germain, Founder.',
        'Email: privacy@solutionsimpactweb.com',
        'Postal address: 400 Rue Montfort, Suite 220, Montreal, QC, H3C 4J8, Canada.',
      ],
      fr: [
        'Responsable de la protection des renseignements personnels : Daniel Germain, Fondateur.',
        'Courriel : privacy@solutionsimpactweb.com',
        'Adresse postale : 400 Rue Montfort, Bureau 220, Montreal (QC) H3C 4J8, Canada.',
      ],
    },
  },
];

export function getPrivacySections(locale: SupportedLocale) {
  return PRIVACY_SECTIONS.map(section => ({
    id: section.id,
    title: section.title[locale] ?? section.title.en,
    paragraphs: section.paragraphs[locale] ?? section.paragraphs.en,
  }));
}

export function getSubcontractors(locale: SupportedLocale) {
  return SUBCONTRACTORS.map(subcontractor => ({
    ...subcontractor,
    purpose: subcontractor.purpose[locale] ?? subcontractor.purpose.en,
  }));
}
