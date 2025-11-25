'use client';

import { getEnv } from '@/lib/env';
import type { SupportedLocale } from '@/content';

interface LeadFormEmbedProps {
  locale: SupportedLocale;
}

/**
 * LeadFormEmbed component
 * Embeds MailerLite form with double opt-in
 * Redirects to /fr/merci or /en/thank-you after confirmation
 */
export default function LeadFormEmbed({ locale }: LeadFormEmbedProps) {
  const embedUrl = locale === 'fr'
    ? getEnv('NEXT_PUBLIC_MAILERLITE_EMBED_FR')
    : getEnv('NEXT_PUBLIC_MAILERLITE_EMBED_EN');

  if (!embedUrl) {
    return (
      <p className="text-sm opacity-80 mt-6">
        {locale === 'fr' ? 'Formulaire non configuré.' : 'Form not configured yet.'}
      </p>
    );
  }

  return (
    <iframe
      title={locale === 'fr' ? 'Inscription' : 'Sign-up'}
      src={embedUrl}
      className="mt-6 h-[560px] w-full rounded-lg border border-gray-300 dark:border-gray-700"
      loading="lazy"
      allow="clipboard-read; clipboard-write"
    />
  );
}


