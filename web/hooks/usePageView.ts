'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useAnalytics } from '@/lib/analytics';

interface PageViewOptions {
  locale?: string;
  category?: string;
  title?: string;
  properties?: Record<string, string | number | boolean>;
}

export function usePageView(options: PageViewOptions = {}) {
  const pathname = usePathname();
  const analytics = useAnalytics();

  useEffect(() => {
    // Track page view
    analytics.page(options.title || pathname, {
      path: pathname,
      ...(options.locale && { locale: options.locale }),
      ...(options.category && { category: options.category }),
      ...options.properties
    });
  }, [pathname, analytics, options.title, options.locale, options.category, options.properties]);

  return {
    trackCTA: (ctaText: string, ctaLocation: string) => {
      analytics.trackCTAClicked(ctaText, ctaLocation, options.locale || 'unknown');
    },
    trackEvent: analytics.track
  };
}