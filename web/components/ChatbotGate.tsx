'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { getEnv } from '@/lib/env';
import { analytics } from '@/lib/analytics';

interface ChatbotGateProps {
  provider: 'crisp';
  locale: SupportedLocale;
  crispId?: string;
}

const STORAGE_KEY = 'chatbot_consent';
const CRISP_SCRIPT_URL = 'https://client.crisp.chat/l.js';

interface ChatbotConsent {
  granted: boolean;
  timestamp: string;
}

declare global {
  interface Window {
    $crisp?: any;
    CRISP_WEBSITE_ID?: string;
    CRISP_RUNTIME_CONFIG?: {
      locale?: string;
    };
  }
}

export default function ChatbotGate({ provider, locale, crispId }: ChatbotGateProps) {
  const t = useTranslations('chatbot');
  // null = still loading, undefined = no consent stored (show banner), true = granted, false = declined
  const [hasConsent, setHasConsent] = useState<boolean | null | undefined>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showDemoSuccess, setShowDemoSuccess] = useState(false);

  // Get Crisp ID from env or prop
  const websiteId = crispId || getEnv('NEXT_PUBLIC_CRISP_ID');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDemoMode = isDevelopment && !websiteId;

  // Don't render if wrong provider
  if (provider !== 'crisp') {
    return null;
  }

  // In production, require Crisp ID. In development, allow demo mode for testing UI
  if (!isDemoMode && !websiteId) {
    return null;
  }

  const configureCrisp = useCallback(() => {
    if (typeof window === 'undefined' || !websiteId) return;
    
    const doConfigure = () => {
      if (!window.$crisp) return;

    try {
      // Set website ID (must be set before any Crisp API calls)
      window.CRISP_WEBSITE_ID = websiteId;

      // Configure locale
      if (!window.CRISP_RUNTIME_CONFIG) {
        window.CRISP_RUNTIME_CONFIG = {};
      }
      window.CRISP_RUNTIME_CONFIG.locale = locale === 'fr' ? 'fr' : 'en';

      // Track chat loaded event when chat opens
      window.$crisp.push([
        'on',
        'chat:opened',
        () => {
          analytics.track('chat_loaded', {
            provider: 'crisp',
            locale,
          });
        },
      ]);

      // Track booking-related messages
      window.$crisp.push([
        'on',
        'message:composed',
        (message: { content?: string }) => {
          const content = message.content?.toLowerCase() || '';
          if (content.includes('book') || content.includes('réservation') || content.includes('diagnostic')) {
            analytics.track('chat_booking_click', {
              provider: 'crisp',
              locale,
            });
          }
        },
      ]);

      // Configure pre-chat form fields (Name + Email)
      // These will be requested before the chat starts
      window.$crisp.push(['set', 'user:nickname', '']);
      window.$crisp.push(['set', 'user:email', '']);

      // Set session data for project question
      // This can be used in Crisp's pre-chat form configuration
      window.$crisp.push([
        'set',
        'session:data',
        [
          ['project_question', t('preChat.projectQuestion')],
          ['locale', locale],
        ],
      ]);

      // Note: Pre-chat form configuration (Name + Email fields and project question)
      // should be configured in the Crisp dashboard under Settings > Pre-chat form
      // The booking button link to /{locale}/contact should be added as a custom
      // message or via Crisp's automation rules in the dashboard

    } catch (error) {
      console.error('Failed to configure Crisp:', error);
    }
    };

    // Wait for Crisp to be ready (max 5 seconds)
    if (!window.$crisp) {
      let attempts = 0;
      const checkCrisp = setInterval(() => {
        attempts++;
        if (window.$crisp) {
          clearInterval(checkCrisp);
          doConfigure();
        } else if (attempts > 50) {
          clearInterval(checkCrisp);
        }
      }, 100);
    } else {
      doConfigure();
    }
  }, [websiteId, locale, t]);

  const loadCrispScript = useCallback(() => {
    if (typeof window === 'undefined' || isScriptLoaded) return;
    
    // Don't load script in demo mode without a valid ID
    if (!websiteId) {
      console.warn('[ChatbotGate] Cannot load Crisp script: No website ID provided');
      return;
    }

    // Check if script already exists
    if (document.querySelector(`script[src="${CRISP_SCRIPT_URL}"]`)) {
      setIsScriptLoaded(true);
      configureCrisp();
      return;
    }

    // Create and inject script
    const script = document.createElement('script');
    script.src = CRISP_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      configureCrisp();
    };
    script.onerror = () => {
      console.error('Failed to load Crisp script');
    };

    document.head.appendChild(script);
  }, [isScriptLoaded, websiteId, configureCrisp]);

  // Check for existing consent on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const consent: ChatbotConsent = JSON.parse(stored);
        if (consent.granted) {
          setHasConsent(true);
          if (websiteId) {
            loadCrispScript();
          }
        } else {
          // Explicitly declined - hide banner
          setHasConsent(false);
        }
      } else {
        // No consent stored - show banner (first visit)
        setHasConsent(undefined);
      }
    } catch (error) {
      console.error('Failed to read chatbot consent:', error);
      // On error, show banner to let user decide
      setHasConsent(undefined);
    }
  }, [websiteId, loadCrispScript]);

  const saveConsent = useCallback((granted: boolean) => {
    if (typeof window === 'undefined') return;

    const consent: ChatbotConsent = {
      granted,
      timestamp: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      setHasConsent(granted);

      if (granted) {
        // Track consent granted event (only after user consent)
        analytics.track('chat_consent_granted', {
          provider: 'crisp',
          locale,
        });

        // Only load script if we have a valid Crisp ID
        if (websiteId) {
          loadCrispScript();
        } else if (isDemoMode) {
          // In demo mode, show success message and log
          console.log('[ChatbotGate Demo] Consent granted. In production, Crisp script would load here.');
          setShowDemoSuccess(true);
          // Hide success message after 5 seconds
          setTimeout(() => setShowDemoSuccess(false), 5000);
        }
      }
    } catch (error) {
      console.error('Failed to save chatbot consent:', error);
    }
  }, [locale, websiteId, isDemoMode, loadCrispScript]);

  // Don't render banner if still initializing
  if (hasConsent === null) {
    return null;
  }
  
  // Hide banner if consent was explicitly declined
  if (hasConsent === false) {
    return null;
  }
  
  // In production: hide banner if consent already granted (chat widget will be visible)
  if (!isDemoMode && hasConsent === true) {
    return null;
  }
  
  // In demo mode with consent granted: show success message for a few seconds, then hide
  if (isDemoMode && hasConsent === true && !showDemoSuccess) {
    return null;
  }
  
  // Show the banner if:
  // - hasConsent === undefined (no consent stored, first visit)
  // - hasConsent === true in demo mode with success message showing

  const privacyHref = buildLocalePath(locale, '/compliance/privacy');
  
  // Show demo mode indicator in development
  const demoModeIndicator = isDemoMode ? (
    <div className="mb-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-3 py-2 text-xs text-yellow-200">
      🧪 Demo Mode: Banner visible for testing. Set NEXT_PUBLIC_CRISP_ID to enable full functionality.
    </div>
  ) : null;

  // Show demo success message
  const demoSuccessMessage = showDemoSuccess ? (
    <div className="mb-2 rounded-lg bg-green-500/20 border border-green-500/40 px-3 py-2 text-xs text-green-200">
      ✅ Chat enabled! In production, the Crisp chat widget would appear here. Set NEXT_PUBLIC_CRISP_ID to test the real widget.
    </div>
  ) : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1001] flex justify-center px-4 pb-4">
      <div className="w-full max-w-2xl rounded-2xl border border-sky-400/40 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
        {demoModeIndicator}
        {demoSuccessMessage}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-white">
              {t('banner.title')}
            </h3>
            <p className="text-sm text-slate-200">
              {t('banner.description')}{' '}
              <Link
                href={privacyHref}
                className="font-semibold text-sky-300 underline underline-offset-4 hover:text-sky-200"
              >
                {t('banner.privacyLink')}
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => saveConsent(false)}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              {t('banner.decline')}
            </button>
            <button
              onClick={() => saveConsent(true)}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-purple-600 hover:to-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              {t('banner.enable')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

