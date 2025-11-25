'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import { useConsent } from './CookieConsentBanner';
import { getEnv } from '@/lib/env';

const META_PIXEL_ID = getEnv('NEXT_PUBLIC_META_PIXEL_ID');

/**
 * MetaPixelGate component
 * Implements Meta Pixel (Facebook Pixel) with consent gate
 * - Only loads Meta Pixel script if marketing consent is granted
 * - Tracks PageView after initialization
 * - Follows Loi 25 compliance (no tracking before consent)
 */
export default function MetaPixelGate() {
  const { consent } = useConsent();
  const marketingAllowed = Boolean(consent?.marketing);

  // Don't render anything if Meta Pixel is not configured
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {/* Load Meta Pixel script only if marketing consent is granted */}
      {marketingAllowed && (
        <>
          {/* Meta Pixel base code */}
          <Script
            id="meta-pixel-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
              `,
            }}
          />
          {/* Initialize Meta Pixel with ID and track PageView */}
          <Script
            id="meta-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window.fbq !== 'undefined') {
                  window.fbq('init', '${META_PIXEL_ID}');
                  window.fbq('track', 'PageView');
                }
              `,
            }}
          />
        </>
      )}
    </>
  );
}

/**
 * Track Meta Pixel Lead event
 * Call this function when a user completes a lead action (e.g., clicks "Planifier un diagnostic")
 * Only tracks if marketing consent is granted and Meta Pixel is loaded
 */
export function trackMetaLead(source?: string) {
  if (typeof window === 'undefined') return;
  
  // Check if fbq is available (pixel loaded and consent granted)
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Lead', {
      source: source || 'cta',
      content_name: 'Planifier un diagnostic',
    });
  }
}

/**
 * Track Meta Pixel Custom Event
 * Generic function to track custom events
 */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, params);
  }
}


