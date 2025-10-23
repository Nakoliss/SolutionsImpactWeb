import DataRequestForm from '@/components/DataRequestForm';
import type { SupportedLocale } from '@/content';
import { brandConfig } from '@/lib/brand';
import { generateMetadata as baseMetadata } from '@/lib/metadata';

interface DataRequestPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

export async function generateMetadata({ params }: DataRequestPageProps) {
  const { locale } = await params;
  const title = locale === 'fr'
    ? 'Formulaire de demande de renseignements'
    : 'Personal data request form';
  const description = locale === 'fr'
    ? 'Exercez vos droits d\'acces, de rectification, de portabilite ou de suppression conformement a la Loi 25.'
    : 'Exercise your Law 25 rights to access, correct, export, or delete your personal data.';

  return baseMetadata({
    title,
    description,
    locale,
    canonical: '/compliance/data-request',
    keywords: ['data request', 'law 25 rights', 'privacy form'],
  });
}

export default async function DataRequestPage({ params }: DataRequestPageProps) {
  const { locale } = await params;

  return (
    <main className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">{brandConfig.name}</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === 'fr' ? 'Formulaire de demande de renseignements personnels' : 'Personal data request form'}
          </h1>
          <p className="max-w-3xl text-sm text-slate-200">
            {locale === 'fr'
              ? 'Utilisez ce formulaire pour demander l acces, la correction, la portabilite ou la suppression de vos renseignements personnels. Notre equipe confirme chaque demande et assure un suivi dans un delai de 30 jours.'
              : 'Use this form to request access, correction, portability, or deletion of your personal information. Our team acknowledges every request and responds within 30 days.'}
          </p>
        </div>
        <DataRequestForm locale={locale} />
      </div>
    </main>
  );
}
