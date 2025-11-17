'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import type { SupportedLocale } from '@/content';

interface CalSchedulerProps {
  calLink?: string;
  locale: SupportedLocale;
  className?: string;
  fallbackLabel: string;
  fallbackCta: string;
  onView?: () => void;
  onStart?: () => void;
  onBooked?: () => void;
}

const CAL_SCRIPT_SRC = 'https://app.cal.com/embed.js';
const CAL_ORIGIN = 'https://app.cal.com';

let calEmbedPromise: Promise<void> | null = null;

declare global {
  interface Window {
    Cal?: (command: string, payload?: Record<string, unknown>) => void;
  }
}

function loadCalEmbedScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (calEmbedPromise) {
    return calEmbedPromise;
  }

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-cal-embed]');
  if (existingScript) {
    calEmbedPromise = Promise.resolve();
    return calEmbedPromise;
  }

  calEmbedPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CAL_SCRIPT_SRC;
    script.async = true;
    script.dataset.calEmbed = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cal.com scheduler'));
    document.body.appendChild(script);
  });

  return calEmbedPromise;
}

function isBookingSuccessEvent(event: MessageEvent<unknown>): boolean {
  if (!event?.origin || !event.data) {
    return false;
  }

  // Cal.com messages originate from cal.com domains
  if (!event.origin.includes('cal.com')) {
    return false;
  }

  if (typeof event.data === 'string') {
    return event.data.includes('bookingSuccessful') || event.data.includes('event_scheduled');
  }

  if (typeof event.data !== 'object') {
    return false;
  }

  const payload = event.data as Record<string, unknown>;
  const possibleKeys = [
    payload.event,
    payload.action,
    payload.type,
    (payload.detail as Record<string, unknown>)?.event,
    (payload.detail as Record<string, unknown>)?.type,
    payload.fullType,
  ];

  return possibleKeys
    .filter((value): value is string => typeof value === 'string')
    .some(value =>
      value.includes('booking') ||
      value.includes('eventScheduled') ||
      value.includes('event_scheduled')
    );
}

export default function CalScheduler({
  calLink,
  locale,
  className = '',
  fallbackLabel,
  fallbackCta,
  onView,
  onStart,
  onBooked,
}: CalSchedulerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const embedRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasStartedRef = useRef(false);
  const hasBookedRef = useRef(false);
  const hasViewedRef = useRef(false);

  const fallbackHref = useMemo(() => calLink ?? '#', [calLink]);

  const initializeEmbed = useCallback(async () => {
    if (!calLink) {
      return;
    }

    try {
      await loadCalEmbedScript();

      if (!window.Cal || !embedRef.current) {
        return;
      }

      window.Cal('init', {
        origin: CAL_ORIGIN,
      });

      window.Cal('inline', {
        elementOrSelector: embedRef.current,
        calLink,
        layout: 'month_view',
      });

      window.Cal('ui', {
        theme: 'dark',
        styles: {
          branding: {
            brandColor: '#38bdf8',
          },
        },
      });

      setReady(true);
    } catch (error) {
      console.error('Failed to initialize Cal.com embed', error);
      setHasError(true);
    }
  }, [calLink]);

  useEffect(() => {
    initializeEmbed();
  }, [initializeEmbed]);

  useEffect(() => {
    if (!onView || typeof window === 'undefined' || !wrapperRef.current) {
      return;
    }

    const triggerView = () => {
      if (hasViewedRef.current) {
        return;
      }
      hasViewedRef.current = true;
      onView();
    };

    const node = wrapperRef.current;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              triggerView();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );

      observer.observe(node);

      return () => observer.disconnect();
    }

    triggerView();

    return undefined;
  }, [onView]);

  useEffect(() => {
    if (!onBooked) {
      return;
    }

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (isBookingSuccessEvent(event) && !hasBookedRef.current) {
        hasBookedRef.current = true;
        onBooked();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onBooked]);

  if (!calLink) {
    return (
      <div className={`rounded-3xl border border-yellow-400/40 bg-yellow-50 p-6 text-yellow-900 shadow-sm dark:bg-yellow-900/10 dark:text-yellow-200 ${className}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
          {locale === 'fr' ? 'Configuration requise' : 'Configuration required'}
        </p>
        <p className="mt-2 text-base">
          {locale === 'fr'
            ? 'Ajoutez la variable NEXT_PUBLIC_CAL_BOOKING_URL pour activer la prise de rendez-vous.'
            : 'Set NEXT_PUBLIC_CAL_BOOKING_URL to enable inline booking.'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-4 shadow-xl sm:p-6 ${className}`}
      onPointerDown={() => {
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          onStart?.();
        }
      }}
      onKeyDown={() => {
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          onStart?.();
        }
      }}
    >
      {!isReady && !hasError ? (
        <div className="flex h-[520px] flex-col items-center justify-center gap-3 text-slate-300">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" aria-hidden="true" />
          <p className="text-sm font-medium">
            {locale === 'fr'
              ? 'Initialisation du planificateur sécurisé...'
              : 'Preparing secure scheduler...'}
          </p>
        </div>
      ) : null}

      {hasError ? (
        <div className="flex h-[520px] flex-col items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/5 p-6 text-center text-sm text-red-200">
          <p>
            {locale === 'fr'
              ? 'Impossible de charger Cal.com pour le moment.'
              : 'We could not load the Cal.com scheduler right now.'}
          </p>
          <p className="mt-2">
            {locale === 'fr'
              ? 'Utilisez plutôt le lien de réservation.'
              : 'Use the booking link instead.'}
          </p>
        </div>
      ) : null}

      <div ref={embedRef} className={isReady ? 'min-h-[600px]' : 'sr-only'} />

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-sm text-slate-200">
        <span>{fallbackLabel}</span>
        <Link
          href={fallbackHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400 hover:text-sky-300"
        >
          <span aria-hidden="true" className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
          {fallbackCta}
        </Link>
      </div>
    </div>
  );
}

