'use client';

import type { ReactNode } from 'react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';
import { useConsent } from '@/components/CookieConsentBanner';

type ContactChannelType = 'call' | 'email';

interface ContactChannelCardProps {
  type: ContactChannelType;
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: ReactNode;
  locale: SupportedLocale;
  surface?: string;
}

export default function ContactChannelCard({
  type,
  href,
  title,
  description,
  ctaLabel,
  icon,
  locale,
  surface = 'contact_page',
}: ContactChannelCardProps) {
  const { trackContactChannelClick } = useAnalytics();
  const { consent } = useConsent();
  const analyticsAllowed = Boolean(consent?.analytics);

  const handleClick = () => {
    if (!analyticsAllowed) {
      return;
    }
    trackContactChannelClick(type, locale, surface);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl transition hover:border-sky-400/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl text-sky-300">
          {icon}
        </span>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{title}</p>
          <p className="text-lg font-semibold text-white">{ctaLabel}</p>
        </div>
      </div>
      <p className="text-sm text-slate-200">{description}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
        {type === 'call' ? 'tel' : 'mailto'} — {href.replace(`${type === 'call' ? 'tel:' : 'mailto:'}`, '')}
        <span
          aria-hidden="true"
          className="transition group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </a>
  );
}

