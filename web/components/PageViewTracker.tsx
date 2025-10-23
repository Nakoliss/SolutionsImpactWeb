'use client';

import { usePageView } from '@/hooks/usePageView';

interface PageViewTrackerProps {
  locale: string;
  title: string;
  category?: string;
  properties?: Record<string, string | number | boolean>;
}

export default function PageViewTracker({ 
  locale, 
  title, 
  category, 
  properties 
}: PageViewTrackerProps) {
  usePageView({ 
    locale, 
    title, 
    ...(category && { category }),
    ...(properties && { properties })
  });
  return null;
}