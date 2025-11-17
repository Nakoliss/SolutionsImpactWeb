import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import type { SupportedLocale } from '@/content';
import { SUPPORTED_LOCALES } from '@/content';
import ContactBookingEmbed from '@/components/ContactBookingEmbed';
import ContactChannelCard from '@/components/ContactChannelCard';
import { brandConfig } from '@/lib/brand';
import { buildLocalePath } from '@/lib/localeRouting';
import { getEnv } from '@/lib/env';

interface ContactPageProps {
  params: Promise<{ locale: SupportedLocale }>;
}

const DEFAULT_CAL_LINK = getEnv('NEXT_PUBLIC_CAL_BOOKING_URL');
const FR_CAL_LINK = getEnv('NEXT_PUBLIC_CAL_BOOKING_URL_FR');

function resolveCalLink(locale: SupportedLocale): string | undefined {
  if (locale === 'fr') {
    return FR_CAL_LINK || DEFAULT_CAL_LINK;
  }
  return DEFAULT_CAL_LINK;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'contactPage' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: buildLocalePath(locale, '/contact'),
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const calLink = resolveCalLink(locale);

  const phone = brandConfig.contact.phone ?? '';
  const sanitizedPhone = phone.replace(/[^+\d]/g, '');
  const email = brandConfig.contact.email ?? '';
  const hasPhone = Boolean(sanitizedPhone);
  const hasEmail = Boolean(email);

  const privacyHref = buildLocalePath(locale, '/compliance/privacy');

  return (
    <main className="bg-slate-950 py-16 text-white sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
            Solutions Impact Web
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-200">{t('subtitle')}</p>
          <p className="text-base text-slate-300">{t('lead')}</p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                {t('scheduler.title')}
              </p>
              <p className="mt-2 text-base text-slate-200">
                {t('scheduler.description')}
              </p>
            </div>

            <ContactBookingEmbed
              locale={locale}
              calLink={calLink}
              fallbackLabel={t('scheduler.fallbackLabel')}
              fallbackCta={t('scheduler.fallbackCta')}
            />

            <p className="mt-4 rounded-2xl border border-sky-400/40 bg-sky-400/10 p-4 text-sm text-slate-100">
              {t('law25.notice')}{' '}
              <Link
                href={privacyHref}
                className="font-semibold text-sky-300 underline underline-offset-4 hover:text-sky-200"
              >
                {t('law25.link')}
              </Link>
              .
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                {t('channels.introTitle')}
              </p>
              <p className="mt-3 text-base text-slate-200">
                {t('channels.introDescription')}
              </p>
            </div>
            <div className="grid gap-4">
              {hasPhone ? (
                <ContactChannelCard
                  type="call"
                  locale={locale}
                  href={`tel:${sanitizedPhone}`}
                  title={t('channels.call.title')}
                  description={t('channels.call.description')}
                  ctaLabel={t('channels.call.cta')}
                  icon="☎️"
                />
              ) : null}
              {hasEmail ? (
                <ContactChannelCard
                  type="email"
                  locale={locale}
                  href={`mailto:${email}`}
                  title={t('channels.email.title')}
                  description={t('channels.email.description')}
                  ctaLabel={t('channels.email.cta')}
                  icon="✉️"
                />
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

