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
      en: 'Hosts optional newsletters and drip sequences activated only after explicit double opt-in confirmation. We use double opt-in to ensure consent is verified before adding contacts to our email lists.',
      fr: 'Héberge les infolettres facultatives et séquences automatisées déclenchées après un double opt-in explicite. Nous utilisons le double opt-in pour garantir que le consentement est vérifié avant d\'ajouter des contacts à nos listes d\'email.',
    },
    dataHandled: ['Email address', 'Company name', 'Engagement metrics', 'Consent timestamp'],
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
    name: 'Supabase',
    service: 'Database and authentication services',
    purpose: {
      en: 'Provides secure database storage for leads, bookings, payments, consent logs, and operational tasks. All data is stored in Canada Central region to comply with Law 25 requirements. Consent logs are retained for at least one year as required by Law 25.',
      fr: 'Fournit un stockage de base de donnees securise pour les leads, reservations, paiements, journaux de consentement et taches operationnelles. Toutes les donnees sont stockees dans la region Canada Central pour respecter les exigences de la Loi 25. Les journaux de consentement sont conserves pendant au moins un an tel que requis par la Loi 25.',
    },
    dataHandled: ['Lead information (name, email, phone, UTM parameters)', 'Booking details (name, email, time slots)', 'Payment records (amount, bundle, modality, customer email)', 'Consent logs (category, granted status, actor, metadata)', 'Operational tasks'],
    location: 'Canada Central (SOC 2 Type II, GDPR compliant)',
    privacyUrl: 'https://supabase.com/privacy',
  },
  {
    name: 'Stripe',
    service: 'Payment processing',
    purpose: {
      en: 'Processes secure online payments for our service packages (one-time and monthly subscriptions). Stripe handles payment card data in compliance with PCI-DSS standards. Payment records are logged to our internal database for operational tracking.',
      fr: 'Traite les paiements en ligne securises pour nos forfaits de services (paiements uniques et abonnements mensuels). Stripe gere les donnees de cartes de paiement en conformite avec les normes PCI-DSS. Les enregistrements de paiement sont journalises dans notre base de donnees interne pour le suivi operationnel.',
    },
    dataHandled: ['Payment card data (PCI-DSS compliant)', 'Customer email', 'Transaction amounts', 'Bundle and modality information'],
    location: 'United States (PCI-DSS Level 1 certified, SOC 2 Type II)',
    privacyUrl: 'https://stripe.com/privacy',
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
  {
    name: 'Crisp',
    service: 'AI chatbot and live chat support',
    purpose: {
      en: 'Provides bilingual AI receptionist and live chat functionality. Processes chat messages and contact information only after explicit user consent.',
      fr: 'Fournit une receptionniste IA bilingue et fonctionnalite de chat en direct. Traite les messages de chat et les coordonnees uniquement apres consentement explicite de l utilisateur.',
    },
    dataHandled: ['Name', 'Email', 'Chat messages', 'IP address', 'Browser metadata'],
    location: 'European Union (GDPR compliant, ISO 27001)',
    privacyUrl: 'https://crisp.chat/en/privacy/',
  },
  {
    name: 'Google LLC',
    service: 'Google Analytics 4, Google Business Profile, Google Search Console',
    purpose: {
      en: 'Google Analytics 4 provides website traffic analysis and user behavior insights. Google Business Profile manages our local presence and customer interactions. Google Search Console monitors search performance and indexing. All analytics services are activated only after explicit user consent to analytics cookies.',
      fr: 'Google Analytics 4 fournit l\'analyse du trafic du site et des insights sur le comportement des utilisateurs. Google Business Profile gere notre presence locale et les interactions clients. Google Search Console surveille la performance de recherche et l\'indexation. Tous les services analytiques sont actives uniquement apres consentement explicite des utilisateurs aux temoins analytiques.',
    },
    dataHandled: ['Page views', 'User interactions', 'Conversion events', 'IP address (anonymized)', 'Browser metadata', 'Search queries', 'Profile interactions', 'Messaging data'],
    location: 'United States (with equivalent protection guarantees, GDPR commitments)',
    privacyUrl: 'https://policies.google.com/privacy',
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
        'Chatbot: name, email, chat messages, and project information (collected only after explicit consent to enable chat).',
        'Google Analytics 4: aggregated traffic metrics, page views, user interactions, and conversion events captured only when visitors accept analytics cookies. We use Google Analytics to measure website performance, understand user behavior, and improve our services.',
        'Google Business Profile: profile views, search queries, actions (calls, directions, website clicks), and messaging interactions. These statistics are aggregated and used to improve our local presence and service delivery.',
        'Google Search Console: search performance data including impressions, clicks, and indexing status. This helps us monitor and improve our website\'s visibility in search results.',
        'Published content: blog posts, FAQ pages, and other public content may reference general industry practices or anonymized case studies. Personal information is never published without explicit consent.',
      ],
      fr: [
        'Formulaires de contact : nom, courriel, entreprise, telephone (facultatif), details du projet et preferences de consentement.',
        'Prise de rendez-vous : plage horaire souhaitee, objectifs de la rencontre et notes optionnelles pour la preparation.',
        'Chatbot : nom, courriel, messages de chat et informations sur le projet (recueillis uniquement apres consentement explicite pour activer le chat).',
        'Google Analytics 4 : mesures de trafic agregees, pages vues, interactions utilisateur et evenements de conversion captures uniquement lorsque les visiteurs acceptent les temoins analytiques. Nous utilisons Google Analytics pour mesurer la performance du site, comprendre le comportement des utilisateurs et ameliorer nos services.',
        'Google Business Profile : vues de profil, requetes de recherche, actions (appels, demandes d\'itineraire, clics sur le site) et interactions de messagerie. Ces statistiques sont agregees et utilisees pour ameliorer notre presence locale et la prestation de nos services.',
        'Google Search Console : donnees de performance de recherche incluant les impressions, les clics et le statut d\'indexation. Cela nous aide a surveiller et ameliorer la visibilite de notre site dans les resultats de recherche.',
        'Contenu publie : articles de blog, pages FAQ et autres contenus publics peuvent faire reference a des pratiques generales de l\'industrie ou a des etudes de cas anonymisees. Les renseignements personnels ne sont jamais publies sans consentement explicite.',
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
        'Consent logs are retained for at least one year as required by Law 25. After one year, logs may be anonymized or deleted unless required for legal purposes.',
        'We apply encryption at rest, access controls, and least-privilege administration across our infrastructure and subcontractors.',
      ],
      fr: [
        'Les dossiers de projet sont conserves pendant sept ans afin de respecter les obligations legales, fiscales et d audit. Les dossiers de prospects sans engagement sont supprimes apres dix-huit mois.',
        'Les journaux de consentement sont conserves pendant au moins un an tel que requis par la Loi 25. Apres un an, les journaux peuvent etre anonymises ou supprimes sauf s\'ils sont requis a des fins legales.',
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
        'We respond to all formal data requests within 30 days as required by Law 25. Identity verification may be required to protect your information.',
        'For Google Analytics data: You can request access to or deletion of your analytics data. We will process these requests within 30 days and coordinate with Google to ensure your data is handled according to your request.',
        'For Google Business Profile data: Profile interaction data is generally aggregated, but you can request information about how your interactions are processed. We respond to these requests within 30 days.',
        'For chatbot data (Crisp): You can request access or deletion of your chat history and contact information. We process these requests within 30 days and will coordinate with Crisp to ensure your data is removed from their systems as well.',
        'For email marketing data (MailerLite): You can request access or deletion of your email subscription data at any time. We use double opt-in confirmation, and you can unsubscribe directly from any email using the unsubscribe link. We process deletion requests within 30 days and coordinate with MailerLite to ensure your data is removed.',
        'For operational data (Supabase): Leads, bookings, payments, and consent logs are stored in our internal database. You can request access or deletion of your data at any time. We process these requests within 30 days and will remove your data from our systems. Consent logs are retained for at least one year as required by Law 25, but can be anonymized upon request.',
        'For payment data (Stripe): Payment information is processed by Stripe in compliance with PCI-DSS standards. You can request information about your payment transactions. We process these requests within 30 days and coordinate with Stripe as needed.',
      ],
      fr: [
        'Vous pouvez demander l acces, la rectification, la portabilite ou la suppression de vos renseignements personnels en tout temps. Communiquez avec nous a privacy@solutionsimpactweb.com ou via le formulaire ci-dessous.',
        'Nous repondons a toutes les demandes officielles de donnees dans un delai de 30 jours tel que requis par la Loi 25. Une verification d identite peut etre requise pour proteger vos informations.',
        'Pour les donnees Google Analytics : Vous pouvez demander l acces ou la suppression de vos donnees analytiques. Nous traitons ces demandes dans un delai de 30 jours et coordonnerons avec Google pour garantir que vos donnees sont traitees selon votre demande.',
        'Pour les donnees Google Business Profile : Les donnees d\'interaction de profil sont generalement agregees, mais vous pouvez demander des informations sur la facon dont vos interactions sont traitees. Nous repondons a ces demandes dans un delai de 30 jours.',
        'Pour les donnees du chatbot (Crisp) : Vous pouvez demander l acces ou la suppression de votre historique de chat et de vos coordonnees. Nous traitons ces demandes dans un delai de 30 jours et coordonnerons avec Crisp pour garantir que vos donnees sont egalement supprimees de leurs systemes.',
        'Pour les donnees de marketing par email (MailerLite) : Vous pouvez demander l acces ou la suppression de vos donnees d abonnement email en tout temps. Nous utilisons une confirmation par double opt-in, et vous pouvez vous desabonner directement de tout email en utilisant le lien de desabonnement. Nous traitons les demandes de suppression dans un delai de 30 jours et coordonnerons avec MailerLite pour garantir que vos donnees sont supprimees.',
        'Pour les donnees operationnelles (Supabase) : Les leads, reservations, paiements et journaux de consentement sont stockes dans notre base de donnees interne. Vous pouvez demander l acces ou la suppression de vos donnees en tout temps. Nous traitons ces demandes dans un delai de 30 jours et supprimerons vos donnees de nos systemes. Les journaux de consentement sont conserves pendant au moins un an tel que requis par la Loi 25, mais peuvent etre anonymises sur demande.',
        'Pour les donnees de paiement (Stripe) : Les informations de paiement sont traitees par Stripe en conformite avec les normes PCI-DSS. Vous pouvez demander des informations sur vos transactions de paiement. Nous traitons ces demandes dans un delai de 30 jours et coordonnerons avec Stripe au besoin.',
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
