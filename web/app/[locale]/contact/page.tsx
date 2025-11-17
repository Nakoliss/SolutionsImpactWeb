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

function resolveCalLink(locale: SupportedLocale): string | undefined {
  try {
    const defaultCalLink = getEnv('NEXT_PUBLIC_CAL_BOOKING_URL');
    const frCalLink = getEnv('NEXT_PUBLIC_CAL_BOOKING_URL_FR');
    
    if (locale === 'fr') {
      return (frCalLink && frCalLink !== '') ? frCalLink : (defaultCalLink && defaultCalLink !== '') ? defaultCalLink : undefined;
    }
    return (defaultCalLink && defaultCalLink !== '') ? defaultCalLink : undefined;
  } catch (error) {
    console.error('Error resolving Cal.com link:', error);
    return undefined;
  }
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
  const numericPhone = phone.replace(/[^0-9]/g, '');
  const sanitizedPhone = phone.replace(/[^+\d]/g, '');
  const telHref = sanitizedPhone.startsWith('+')
    ? sanitizedPhone
    : numericPhone
      ? `+1${numericPhone}`
      : '';
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

            {calLink ? (
              <ContactBookingEmbed
                locale={locale}
                calLink={calLink}
                fallbackLabel={t('scheduler.fallbackLabel')}
                fallbackCta={t('scheduler.fallbackCta')}
              />
            ) : (
              <div className="rounded-3xl border border-yellow-400/40 bg-yellow-900/10 p-6 text-slate-100">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">
                  {t('scheduler.manualTitle')}
                </p>
                <p className="mt-3 text-base text-slate-100">
                  {t('scheduler.manualDescription')}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {hasPhone ? (
                    <a
                      href={`tel:${telHref}`}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                    >
                      {t('scheduler.manualCallCta')}
                    </a>
                  ) : null}
                  {hasEmail ? (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                    >
                      {t('scheduler.manualEmailCta')}
                    </a>
                  ) : null}
                </div>
              </div>
            )}

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
                  href={`tel:${telHref}`}
                  value={phone}
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
                  value={email}
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

