'use client';

import { useEffect } from 'react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';
import { useConsent } from './CookieConsentBanner';

interface BlogPostClientProps {
  locale: SupportedLocale;
  slug: string;
  title: string;
}

export default function BlogPostClient({ locale, slug, title }: BlogPostClientProps) {
  const { track } = useAnalytics();
  const { consent } = useConsent();
  const analyticsAllowed = Boolean(consent?.analytics);

  useEffect(() => {
    if (analyticsAllowed) {
      track('view_content', {
        content_type: 'blog',
        content_slug: slug,
        content_title: title,
        locale,
      });
    }
  }, [analyticsAllowed, locale, slug, title, track]);

  return null;
}

