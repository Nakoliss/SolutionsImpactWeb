import Link from 'next/link';

import type { Metadata } from 'next';
import type { SupportedLocale } from '@/content';
import LeadFormEmbed from '@/components/LeadFormEmbed';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { buildLocalePath } from '@/lib/localeRouting';

interface Loi25EssentialsPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({ params }: Loi25EssentialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fr'
    ? 'Loi 25 Essentials — Guide & Checklist (PDF)'
    : 'Law 25 Essentials — Guide & Checklist (PDF)';
  const description = locale === 'fr'
    ? 'Téléchargez le pack Loi 25 et recevez 4 emails utiles (double opt-in).'
    : 'Download the Law 25 package and receive 4 useful emails (double opt-in).';

  return generateBaseMetadata({
    title,
    description,
    locale,
    canonical: '/lp/loi-25-essentials',
    keywords: locale === 'fr'
      ? ['Loi 25', 'conformité', 'PDF', 'guide', 'checklist', 'Québec']
      : ['Law 25', 'compliance', 'PDF', 'guide', 'checklist', 'Quebec'],
  });
}

export default async function Loi25EssentialsPage({ params }: Loi25EssentialsPageProps) {
  const { locale } = await params;

  const copy = {
    fr: {
      title: 'Loi 25 Essentials — Guide & Checklist',
      description: 'Recevez le PDF + 4 emails courts pour devenir conforme (cookies, politique FR/EN, accès/suppression, registre sous-traitants). Désabonnement en 1 clic.',
      privacyText: 'En vous inscrivant, vous acceptez notre',
      privacyLink: 'Politique de confidentialité',
    },
    en: {
      title: 'Law 25 Essentials — Guide & Checklist',
      description: 'Receive the PDF + 4 short emails to become compliant (cookies, FR/EN policy, access/deletion, subcontractor registry). Unsubscribe in 1 click.',
      privacyText: 'By signing up, you agree to our',
      privacyLink: 'Privacy Policy',
    },
  };

  const currentCopy = copy[locale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">{currentCopy.title}</h1>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300 mb-6">
        {currentCopy.description}
      </p>
      
      <LeadFormEmbed locale={locale} />

      <p className="mt-4 text-xs opacity-70">
        {currentCopy.privacyText}{' '}
        <Link
          href={buildLocalePath(locale, '/compliance/privacy')}
          className="underline hover:opacity-80"
        >
          {currentCopy.privacyLink}
        </Link>.
      </p>
    </main>
  );
}


