'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import { useConsent } from './CookieConsentBanner';
import { getEnv } from '@/lib/env';

const GA_MEASUREMENT_ID = getEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID');

/**
 * ConsentGate component
 * Implements Google Analytics 4 with Consent Mode (Basic)
 * - Sets default consent to DENIED
 * - Only loads GA4 script if analytics consent is granted
 * - Updates consent when user grants analytics permission
 */
export default function ConsentGate() {
  const { consent } = useConsent();
  const analyticsAllowed = Boolean(consent?.analytics);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
      return;
    }

    // If consent is granted and gtag is already loaded, update consent
    if (analyticsAllowed && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      });
    }
  }, [analyticsAllowed]);

  // Don't render anything if GA4 is not configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Set default consent to DENIED (Consent Mode Basic) */}
      <Script
        id="ga-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `,
        }}
      />

      {/* Load GA4 script only if analytics consent is granted */}
      {analyticsAllowed && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  anonymize_ip: true,
                  page_path: window.location.pathname
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}

