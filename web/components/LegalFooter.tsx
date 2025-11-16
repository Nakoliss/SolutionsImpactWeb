import Link from 'next/link';

import { CookiePreferencesButton } from '@/components/CookieConsentBanner';
import type { SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { brandConfig, pickBrandLocale } from '@/lib/brand';

interface LegalFooterProps {
  locale: SupportedLocale;
}

interface LinkItem {
  href: string;
  label: string;
}

interface BadgeItem {
  title: string;
  description: string;
}

interface FooterCopy {
  legalHeading: string;
  complianceHeading: string;
  updatePreferences: string;
  rights: string;
  contact: {
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
  };
  legalLinks: LinkItem[];
  complianceBadges: BadgeItem[];
  bottomLinks: LinkItem[];
}

const FOOTER_COPY: Record<SupportedLocale, FooterCopy> = {
  fr: {
    legalHeading: 'Pages legales',
    complianceHeading: 'Conformite',
    updatePreferences: 'Mettez a jour vos preferences de consentement quand vous le souhaitez.',
    rights: '{year} Web Impact Solutions Inc. Tous droits reserves.',
    contact: {
      emailLabel: 'Courriel',
      phoneLabel: 'Telephone',
      addressLabel: 'Adresse',
    },
    legalLinks: [
      { href: '/compliance', label: 'Centre de conformite' },
      { href: '/compliance/privacy', label: 'Politique de confidentialite' },
      { href: '/compliance/cookies', label: 'Politique des cookies' },
      { href: '/compliance/data-request', label: 'Demande de donnees' },
      { href: '/compliance/heatmap', label: 'Audit et heatmap' },
    ],
    complianceBadges: [
      { title: 'Loi 25', description: 'Registre et politiques à jour' },
      { title: 'PIPEDA', description: 'Aligné sur la LPRPDE (PIPEDA)' },
      { title: 'Consentement', description: 'Gestion dynamique des préférences' },
    ],
    bottomLinks: [
      { href: '/compliance/privacy', label: 'Confidentialite' },
      { href: '/compliance/cookies', label: 'Cookies' },
      { href: '/compliance/data-request', label: 'Demandes de donnees' },
    ],
  },
  en: {
    legalHeading: 'Legal pages',
    complianceHeading: 'Compliance',
    updatePreferences: 'Update or withdraw consent at any time.',
    rights: '{year} Web Impact Solutions Inc. All rights reserved.',
    contact: {
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
    },
    legalLinks: [
      { href: '/compliance', label: 'Compliance hub' },
      { href: '/compliance/privacy', label: 'Privacy policy' },
      { href: '/compliance/cookies', label: 'Cookie policy' },
      { href: '/compliance/data-request', label: 'Data request form' },
      { href: '/compliance/heatmap', label: 'Audit & heatmap' },
    ],
    complianceBadges: [
      { title: 'Law 25', description: 'Updated registry and procedures' },
      { title: 'PIPEDA', description: 'Aligned with PIPEDA principles' },
      { title: 'Consent', description: 'Granular preference management' },
    ],
    bottomLinks: [
      { href: '/compliance/privacy', label: 'Privacy' },
      { href: '/compliance/cookies', label: 'Cookies' },
      { href: '/compliance/data-request', label: 'Data requests' },
    ],
  },
};

export default function LegalFooter({ locale }: LegalFooterProps) {
  const copy = FOOTER_COPY[locale];
  const basePath = buildLocalePath(locale);
  const contactEmail = brandConfig.contact.email;
  const contactPhone = brandConfig.contact.phone;
  const address = `${brandConfig.location.city}, ${brandConfig.location.region} ${brandConfig.location.country}`;
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            {brandConfig.legalName ? (
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {brandConfig.legalName}
              </p>
            ) : null}
            <h2 className="mt-3 text-lg font-semibold text-white">
              {brandConfig.name}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {locale === 'fr'
                ? 'Une division de Nakoliss Studios — Fondé par Daniel Germain'
                : 'A division of Nakoliss Studios — Founded by Daniel Germain'}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {pickBrandLocale(locale, brandConfig.tagline)}
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              {contactEmail ? (
                <p>
                  <span className="font-medium text-slate-200">{copy.contact.emailLabel}:</span>{' '}
                  <Link className="hover:text-white" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </Link>
                </p>
              ) : null}
              {contactPhone ? (
                <p>
                  <span className="font-medium text-slate-200">{copy.contact.phoneLabel}:</span>{' '}
                  <Link className="hover:text-white" href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}>
                    {contactPhone}
                  </Link>
                </p>
              ) : null}
              <p>
                <span className="font-medium text-slate-200">{copy.contact.addressLabel}:</span>{' '}
                {address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {copy.legalHeading}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {copy.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-white" href={`${basePath}${link.href}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {copy.complianceHeading}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {copy.complianceBadges.map((badge) => (
                <li key={badge.title} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-white">{badge.title}</span>
                    <span className="text-slate-400">{badge.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2">
              <p className="text-xs text-slate-500">{copy.updatePreferences}</p>
              <CookiePreferencesButton
                locale={locale}
                variant="button"
                className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{copy.rights.replace('{year}', currentYear)}</span>
          <div className="flex flex-wrap gap-4">
            {copy.bottomLinks.map((link) => (
              <Link key={link.href} className="transition hover:text-white" href={`${basePath}${link.href}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
