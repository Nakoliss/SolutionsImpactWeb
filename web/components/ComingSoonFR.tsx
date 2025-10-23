'use client';

import Link from 'next/link';

interface ComingSoonFRProps {
  title?: string;
  message?: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

export default function ComingSoonFR({
  title = 'En construction… bientôt disponible',
  message = 'Cette section est en cours de finalisation. Revenez très bientôt — entre‑temps, contactez‑nous pour une estimation gratuite.',
  ctaHref = '/fr#contact',
  ctaLabel = 'Contactez‑nous',
  className,
}: ComingSoonFRProps) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-slate-100 shadow-lg sm:p-8 ${className ?? ''}`}>
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm text-slate-200">{message}</p>
      <div className="mt-5">
        <Link href={ctaHref} className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

