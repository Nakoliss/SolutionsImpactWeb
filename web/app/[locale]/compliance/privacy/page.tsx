import Link from 'next/link';

import { CookiePreferencesButton } from '@/components/CookieConsentBanner';
import type { SupportedLocale } from '@/content';
import { brandConfig } from '@/lib/brand';
import { getPrivacySections, getSubcontractors } from '@/lib/compliance';
import { generateMetadata as baseMetadata } from '@/lib/metadata';

interface PrivacyPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const title =
    locale === 'fr'
      ? 'Politique de confidentialite | Web Impact Solutions'
      : 'Privacy policy | Web Impact Solutions';

  const description =
    locale === 'fr'
      ? 'Decouvrez comment Web Impact Solutions respecte la Loi 25, protege vos donnees et gere ses sous-traitants.'
      : 'Learn how Web Impact Solutions complies with Quebec Law 25, protects your data, and manages subcontractors.';

  return baseMetadata({
    title,
    description,
    locale,
    canonical: '/compliance/privacy',
  });
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const sections = getPrivacySections(locale);
  const subcontractors = getSubcontractors(locale);

  return (
    <main className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
            {brandConfig.name}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === 'fr'
              ? 'Politique de confidentialite'
              : 'Privacy policy'}
          </h1>
          <p className="text-sm text-slate-300">
            {locale === 'fr'
              ? 'Derniere mise a jour : 18 decembre 2024'
              : 'Last updated: December 18, 2024'}
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-slate-200">
            {locale === 'fr'
              ? 'Cette politique decrie nos pratiques en matiere de confidentialite, la facon dont nous respectons la Loi 25 et les mesures que nous appliquons pour proteger vos renseignements personnels.'
              : 'This policy describes our privacy practices, how we comply with Law 25, and the safeguards in place to protect your personal information.'}
          </p>
        </header>

        <div className="mt-10 space-y-10 text-slate-100">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg sm:p-8"
            >
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section
          id="subcontractors"
          className="mt-10 rounded-3xl border border-sky-400/30 bg-sky-400/10 p-6 text-slate-100 shadow-lg sm:p-8"
        >
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {locale === 'fr'
              ? 'Registre des sous-traitants'
              : 'Subcontractor registry'}
          </h2>
          <p className="mt-3 text-sm text-slate-200">
            {locale === 'fr'
              ? 'Nous tenons a jour la liste des fournisseurs qui soutiennent nos operations. Chaque fournisseur est evalue selon la Loi 25 et le RGPD.'
              : 'We keep an up-to-date list of vendors that support our operations. Each vendor is reviewed against Law 25 and GDPR requirements.'}
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] divide-y divide-white/10 text-left text-sm">
              <thead className="text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    {locale === 'fr' ? 'Fournisseur' : 'Vendor'}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {locale === 'fr' ? 'Service' : 'Service'}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {locale === 'fr' ? 'Finalite' : 'Purpose'}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {locale === 'fr' ? 'Donnees traitees' : 'Data handled'}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {locale === 'fr' ? 'Localisation' : 'Location'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-100">
                {subcontractors.map((vendor) => (
                  <tr key={vendor.name}>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">
                      <div>{vendor.name}</div>
                      <Link
                        href={vendor.privacyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-xs font-medium text-sky-300 underline underline-offset-4"
                      >
                        {locale === 'fr'
                          ? 'Politique de confidentialite'
                          : 'Privacy policy'}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-200">
                      {vendor.service}
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-200">
                      {vendor.purpose}
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-200">
                      <ul className="list-disc pl-5">
                        {vendor.dataHandled.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-200">
                      {vendor.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-slate-100 shadow-lg sm:grid-cols-2 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {locale === 'fr' ? 'Formulaire de demande' : 'Request form'}
            </h2>
            <p className="mt-3 text-sm text-slate-200">
              {locale === 'fr'
                ? 'Utilisez le formulaire de demande de donnees pour acceder a vos renseignements, les corriger ou demander leur suppression. Nous accusons reception dans les 7 jours.'
                : 'Use the data request form to access, correct, or erase your information. We acknowledge every request within seven days.'}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href={
                locale === 'fr'
                  ? '/fr/compliance/data-request'
                  : '/en/compliance/data-request'
              }
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {locale === 'fr' ? 'Ouvrir le formulaire' : 'Open the form'}
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-slate-100 shadow-lg sm:p-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {locale === 'fr'
              ? 'Mettre a jour vos preferences'
              : 'Update your preferences'}
          </h2>
          <p className="mt-3 text-sm text-slate-200">
            {locale === 'fr'
              ? 'Vous pouvez modifier vos temoins optionnels en tout temps. Nous documentons votre consentement pour une duree maximale de 12 mois.'
              : 'You can adjust non-essential cookies at any time. We log your consent choices for a maximum of 12 months.'}
          </p>
          <div className="mt-4">
            <CookiePreferencesButton
              locale={locale}
              variant="button"
              className="bg-white text-slate-900 hover:bg-slate-100"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
