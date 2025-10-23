import { CookiePreferencesButton } from '@/components/CookieConsentBanner';
import type { SupportedLocale } from '@/content';
import { brandConfig } from '@/lib/brand';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';

interface CookiePolicyProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

const POLICY_CONTENT = {
  en: {
    headline: 'Cookie policy',
    updated: 'Last updated: September 24, 2025',
    lead: 'Web Impact Solutions uses cookies and similar technologies to deliver, measure, and improve our bilingual digital services. This page explains how we apply Quebec Law 25 requirements, which cookies we rely on, and how you can update your preferences at any time.',
    sections: [
      {
        title: 'Categories of cookies we use',
        bullets: [
          {
            name: 'Essential',
            description: 'Required to display the website, maintain secure sessions, prevent fraud, and remember your language selection during a visit. These cookies are always on.',
          },
          {
            name: 'Analytics',
            description: 'Help us understand what content is useful, measure conversions, and detect issues. We only activate analytics after you opt-in.',
          },
          {
            name: 'Preferences',
            description: 'Store choices such as locale, accessibility preferences, and saved forms so that returning visits feel consistent.',
          },
          {
            name: 'Marketing',
            description: 'Used on campaign landing pages to build remarketing audiences and attribute conversions. Disabled by default for Law 25 compliance.',
          },
        ],
      },
      {
        title: 'How consent is collected and recorded',
        paragraphs: [
          'We present a banner on your first visit and only load non-essential cookies after you select Accept or configure your preferences.',
          'Your selection is stored in localStorage and a first-party cookie on our domain for a maximum of 12 months. We keep a timestamp so that we can prove consent if required by the Commission d access a l information (CAI).',
          'If you ignore the banner, only essential cookies remain active. You can re-open the preferences tray at any time using the button below.',
        ],
      },
      {
        title: 'Retention and audits',
        paragraphs: [
          'We review our cookie inventory every quarter and document any new subcontractors in our privacy registry. Non-essential cookies are automatically disabled if a vendor cannot confirm compliance with Law 25 and GDPR.',
          'Logs that record your consent decision are encrypted at rest and destroyed after 13 months.',
        ],
      },
      {
        title: 'Managing your preferences',
        paragraphs: [
          'You can use the button below to adjust your consent at any time. The banner will reappear if you revoke analytics or marketing cookies so that you can reconsider your choice later.',
          'Deleting cookies from your browser will remove your saved decision and the banner will return during your next visit.',
        ],
      },
    ],
    contactIntro: 'Questions about our cookie program or Law 25 compliance can be sent to:',
    cta: 'Open cookie preferences',
  },
  fr: {
    headline: 'Politique sur les cookies',
    updated: 'Derniere mise a jour : 24 septembre 2025',
    lead: 'Web Impact Solutions utilise des cookies et technologies semblables pour livrer, mesurer et optimiser ses services numeriques bilingues. Cette page explique notre application de la Loi 25, les cookies utilises et la facon de modifier vos preferences en tout temps.',
    sections: [
      {
        title: 'Categories de cookies utilises',
        bullets: [
          {
            name: 'Essentiels',
            description: 'Indispensables pour afficher le site, maintenir une session securisee, prevenir la fraude et retenir votre langue durant une visite. Toujours actifs.',
          },
          {
            name: 'Analytiques',
            description: 'Mesurent la performance des contenus, le taux de conversion et detectent les anomalies. Activees uniquement apres consentement.',
          },
          {
            name: 'Preferences',
            description: 'Retiennent la langue, les preferences d accessibilite et certains formulaires pour offrir une experience coherente.',
          },
          {
            name: 'Marketing',
            description: 'Servent sur nos pages de campagne pour constituer des audiences de remarketing et attribuer les conversions. Desactives par defaut pour respecter la Loi 25.',
          },
        ],
      },
      {
        title: 'Collecte et preuve du consentement',
        paragraphs: [
          'Une banniere apparait lors de votre premiere visite et aucun cookie non essentiel nest active sans votre choix explicite.',
          'Votre decision est enregistree dans le stockage local et dans un cookie de premiere partie pour un maximum de 12 mois. Un horodatage est conserve afin de repondre aux demandes de la Commission d access a l information (CAI).',
          'Si vous ignorez la banniere, seuls les cookies essentiels demeurent actifs. Vous pouvez rouvrir le panneau de preferences a tout moment grace au bouton ci-dessous.',
        ],
      },
      {
        title: 'Duree de conservation et audits',
        paragraphs: [
          'Nous revisons notre inventaire de cookies chaque trimestre et mettons a jour le registre des sous-traitants. Les cookies non essentiels sont desactives si un fournisseur ne peut confirmer sa conformite a la Loi 25 et au RGPD.',
          'Les journaux des decisions de consentement sont chiffrés au repos et detruits apres 13 mois.',
        ],
      },
      {
        title: 'Gestion de vos preferences',
        paragraphs: [
          'Utilisez le bouton ci-dessous pour ajuster vos choix en tout temps. La banniere reapparaitra si vous retirez lanalyse ou le marketing afin que vous puissiez confirmer votre decision plus tard.',
          'La suppression des cookies dans votre navigateur retire aussi votre decision enregistree et la banniere reviendra lors de votre prochaine visite.',
        ],
      },
    ],
    contactIntro: 'Pour toute question sur notre programme de cookies ou la Loi 25, ecrivez-nous a :',
    cta: 'Ouvrir les parametres de cookies',
  },
} as const;

export async function generateMetadata({ params }: CookiePolicyProps) {
  const { locale } = await params;
  const title = locale === 'fr' ? 'Politique sur les cookies | Web Impact Solutions' : 'Cookie policy | Web Impact Solutions';
  const description = locale === 'fr'
    ? 'Decouvrez comment Web Impact Solutions respecte la Loi 25 pour la gestion des cookies, du consentement et de la protection des donnees.'
    : 'Learn how Web Impact Solutions complies with Quebec Law 25 for cookies, consent, and data protection.';

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: '/compliance/cookies',
  });
}

export default async function CookiePolicyPage({ params }: CookiePolicyProps) {
  const { locale } = await params;
  const content = POLICY_CONTENT[locale] ?? POLICY_CONTENT.en;

  return (
    <main className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Web Impact Solutions</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{content.headline}</h1>
          <p className="text-sm text-slate-300">{content.updated}</p>
          <p className="max-w-3xl text-base leading-relaxed text-slate-200">{content.lead}</p>
        </header>

        <div className="mt-10 space-y-10 text-slate-100">
          {content.sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg sm:p-8">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{section.title}</h2>
              {'bullets' in section && section.bullets ? (
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {section.bullets.map((item) => (
                    <li key={item.name} className="rounded-2xl bg-slate-900/70 px-4 py-3">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {'paragraphs' in section && section.paragraphs ? (
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6 text-slate-950 shadow-lg sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {locale === 'fr' ? 'Mettre a jour vos choix' : 'Update your choices'}
          </h2>
          <p className="mt-3 text-sm text-slate-700">{content.contactIntro}</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{brandConfig.contact.email}</p>
          <div className="mt-6">
            <CookiePreferencesButton locale={locale} variant="button" className="bg-white text-slate-900 hover:bg-slate-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
