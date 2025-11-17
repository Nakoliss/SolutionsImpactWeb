'use client';

import { useCallback, useEffect, useState } from 'react';

import type { SupportedLocale } from '@/content';
import CalScheduler from '@/components/CalScheduler';
import { useAnalytics } from '@/lib/analytics';
import { useConsent } from '@/components/CookieConsentBanner';

interface ContactBookingEmbedProps {
  locale: SupportedLocale;
  calLink?: string;
  fallbackLabel: string;
  fallbackCta: string;
  className?: string;
}

export default function ContactBookingEmbed({
  locale,
  calLink,
  fallbackLabel,
  fallbackCta,
  className,
}: ContactBookingEmbedProps) {
  const {
    trackBookingViewed,
    trackBookingStarted,
    trackBookingConfirmed,
  } = useAnalytics();
  const { consent } = useConsent();

  const analyticsAllowed = Boolean(consent?.analytics);

  const [viewSeen, setViewSeen] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);

  const [startSeen, setStartSeen] = useState(false);
  const [startLogged, setStartLogged] = useState(false);

  const [bookSeen, setBookSeen] = useState(false);
  const [bookLogged, setBookLogged] = useState(false);

  useEffect(() => {
    if (analyticsAllowed && viewSeen && !viewLogged) {
      trackBookingViewed(locale, 'contact_page');
      setViewLogged(true);
    }
  }, [analyticsAllowed, viewLogged, viewSeen, locale, trackBookingViewed]);

  useEffect(() => {
    if (analyticsAllowed && startSeen && !startLogged) {
      trackBookingStarted(locale, 'contact_page');
      setStartLogged(true);
    }
  }, [analyticsAllowed, startLogged, startSeen, locale, trackBookingStarted]);

  useEffect(() => {
    if (analyticsAllowed && bookSeen && !bookLogged) {
      trackBookingConfirmed(locale, 'contact_page');
      setBookLogged(true);
    }
  }, [analyticsAllowed, bookLogged, bookSeen, locale, trackBookingConfirmed]);

  const handleView = useCallback(() => {
    setViewSeen(true);
  }, []);

  const handleStart = useCallback(() => {
    setStartSeen(true);
  }, []);

  const handleBooked = useCallback(() => {
    setBookSeen(true);
  }, []);

  return (
    <CalScheduler
      calLink={calLink}
      locale={locale}
      fallbackLabel={fallbackLabel}
      fallbackCta={fallbackCta}
      className={className}
      onView={handleView}
      onStart={handleStart}
      onBooked={handleBooked}
    />
  );
}

