'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import type { SupportedLocale } from '@/content';
import type { ConsentState } from '@/lib/consent';
import { createConsent, initializeConsentFromStorage, writeConsent } from '@/lib/consent';

interface CookieConsentProviderProps {
  locale: SupportedLocale;
  children: React.ReactNode;
}

type ConsentContextValue = {
  consent: ConsentState | null;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

interface LocalizedCopy {
  bannerTitle: string;
  bannerDescription: string;
  buttons: {
    acceptAll: string;
    reject: string;
    manage: string;
  };
  categories: Record<'essential' | 'analytics' | 'preferences' | 'marketing', {
    title: string;
    description: string;
  }>;
  modal: {
    title: string;
    description: string;
    save: string;
    cancel: string;
    acceptAll: string;
    policyLabel: string;
    openLabel: string;
    alwaysOn: string;
    toggleOn: string;
    toggleOff: string;
  };
}

const COPY: Record<SupportedLocale, LocalizedCopy> = {
  en: {
    bannerTitle: 'Respecting your privacy matters to us',
    bannerDescription:
      'We use essential cookies to run our website and optional analytics, preference, and marketing cookies to improve your experience. Under Quebec Law 25, we only activate non-essential cookies after you make a choice.',
    buttons: {
      acceptAll: 'Accept all',
      reject: 'Reject non-essential',
      manage: 'Manage preferences',
    },
    categories: {
      essential: {
        title: 'Essential',
        description: 'Required to deliver the website, keep you signed in, and secure your session.',
      },
      analytics: {
        title: 'Analytics',
        description: 'Help us measure performance, debug issues, and improve the experience.',
      },
      preferences: {
        title: 'Preferences',
        description: 'Remember language, location, and personalization settings.',
      },
      marketing: {
        title: 'Marketing',
        description: 'Enable remarketing audiences and conversion tracking when you interact with our campaigns.',
      },
    },
    modal: {
      title: 'Cookie preferences',
      description: 'Toggle the categories you would like to allow. You can update your choices at any time.',
      save: 'Save preferences',
      cancel: 'Cancel',
      acceptAll: 'Accept all cookies',
      policyLabel: 'Read the cookie policy',
      openLabel: 'Cookie preferences',
      alwaysOn: 'Always on',
      toggleOn: 'On',
      toggleOff: 'Off',
    },
  },
  fr: {
    bannerTitle: 'Nous respectons votre vie privée',
    bannerDescription:
      'Nous utilisons des témoins essentiels pour assurer le fonctionnement du site et des témoins optionnels (analyse, préférences, marketing) pour améliorer votre expérience. Conformément à la Loi 25, nous activons seulement les cookies non essentiels après votre consentement.',
    buttons: {
      acceptAll: 'Tout accepter',
      reject: 'Refuser le non essentiel',
      manage: 'Gérer les préférences',
    },
    categories: {
      essential: {
        title: 'Essentiels',
        description: 'Nécessaires pour afficher le site, maintenir la session et assurer la sécurité.',
      },
      analytics: {
        title: 'Analytiques',
        description: 'Mesurent la performance, détectent les anomalies et guident les améliorations.',
      },
      preferences: {
        title: 'Préférences',
        description: 'Retiennent vos choix de langue, de localisation et de personnalisation.',
      },
      marketing: {
        title: 'Marketing',
        description: 'Activent le remarketing et le suivi des conversions lorsque vous interagissez avec nos campagnes.',
      },
    },
    modal: {
      title: 'Paramètres des cookies',
      description: 'Activez les catégories qui vous conviennent. Vous pouvez modifier vos choix en tout temps.',
      save: 'Enregistrer mes choix',
      cancel: 'Annuler',
      acceptAll: 'Accepter tous les cookies',
      policyLabel: 'Consulter la politique des cookies',
      openLabel: 'Paramètres des cookies',
      alwaysOn: 'Toujours actif',
      toggleOn: 'Activé',
      toggleOff: 'Désactivé',
    },
  },
};

const CONSENT_CATEGORIES = ['essential', 'analytics', 'preferences', 'marketing'] as const;

type ManageableCategory = Extract<typeof CONSENT_CATEGORIES[number], 'analytics' | 'preferences' | 'marketing'>;

export function CookieConsentProvider({ locale, children }: CookieConsentProviderProps) {
  const copy = COPY[locale] ?? COPY.en;

  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isInitialized, setInitialized] = useState(false);
  const [isBannerVisible, setBannerVisible] = useState(false);
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(createConsent());

  useEffect(() => {
    const stored = initializeConsentFromStorage();
    if (stored) {
      setConsent(stored);
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }
    setInitialized(true);
  }, []);

  const updateConsent = useCallback((state: ConsentState) => {
    const next: ConsentState = {
      essential: true,
      analytics: state.analytics,
      marketing: state.marketing,
      preferences: state.preferences,
      updatedAt: new Date().toISOString(),
    };
    writeConsent(next);
    setConsent(next);
    setDraft(next);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent(createConsent({ analytics: true, marketing: true, preferences: true }));
    setBannerVisible(false);
    setPreferencesOpen(false);
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent(createConsent({ analytics: false, marketing: false, preferences: false }));
    setBannerVisible(false);
    setPreferencesOpen(false);
  }, [updateConsent]);

  const openPreferences = useCallback(() => {
    setDraft(consent ? { ...consent } : createConsent());
    setPreferencesOpen(true);
    setBannerVisible(false);
  }, [consent]);

  const closePreferences = useCallback(() => {
    if (!consent) {
      setBannerVisible(true);
    }
    setPreferencesOpen(false);
  }, [consent]);

  const toggleCategory = useCallback((category: ManageableCategory) => {
    setDraft((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const savePreferences = useCallback(() => {
    updateConsent(draft);
    setPreferencesOpen(false);
    setBannerVisible(false);
  }, [draft, updateConsent]);

  const policyHref = `/${locale}/compliance/cookies`;

  const contextValue = useMemo<ConsentContextValue>(
    () => ({
      consent,
      openPreferences,
      closePreferences,
    }),
    [consent, openPreferences, closePreferences],
  );

  const showBanner = isInitialized && isBannerVisible;
  const showPreferences = isInitialized && isPreferencesOpen;

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}

      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[1000] flex justify-center px-4 pb-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-100/10 bg-slate-900 text-white shadow-xl">
            <div className="px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold">{copy.bannerTitle}</h2>
              <p className="mt-3 text-sm text-slate-200">{copy.bannerDescription}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <Link href={policyHref} className="underline underline-offset-4 hover:text-white">
                  {copy.modal.policyLabel}
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {copy.buttons.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {copy.buttons.reject}
                </button>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {copy.buttons.manage}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreferences && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/70 px-4 py-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="w-full max-w-xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8"
          >
            <div className="space-y-3">
              <h2 id="cookie-preferences-title" className="text-2xl font-semibold text-slate-900">
                {copy.modal.title}
              </h2>
              <p className="text-sm text-slate-600">{copy.modal.description}</p>
            </div>

            <div className="mt-6 space-y-4">
              {CONSENT_CATEGORIES.map((category) => {
                const item = copy.categories[category];
                if (!item) return null;
                const isEssential = category === 'essential';
                const checked = isEssential ? true : draft[category];
                return (
                  <div
                    key={category}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      {isEssential && (
                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{copy.modal.alwaysOn}</p>
                      )}
                    </div>
                    <div className="pt-1">
                      {isEssential ? (
                        <span className="text-xs font-semibold uppercase text-slate-500">{copy.modal.toggleOn}</span>
                      ) : (
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            checked={checked}
                            onChange={() => toggleCategory(category)}
                          />
                          <span>{checked ? copy.modal.toggleOn : copy.modal.toggleOff}</span>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white"
              >
                {copy.modal.acceptAll}
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="inline-flex items-center justify-center rounded-full border border-sky-500 px-5 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {copy.modal.save}
              </button>
              <button
                type="button"
                onClick={closePreferences}
                className="ml-auto inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {copy.modal.cancel}
              </button>
            </div>

            <div className="mt-4 text-sm">
              <Link href={policyHref} className="text-sky-600 underline underline-offset-4 hover:text-sky-500">
                {copy.modal.policyLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within CookieConsentProvider');
  }
  return context;
}

interface CookiePreferencesButtonProps {
  locale: SupportedLocale;
  variant?: 'link' | 'button';
  className?: string;
}

export function CookiePreferencesButton({ locale, variant = 'link', className = '' }: CookiePreferencesButtonProps) {
  const { openPreferences } = useConsent();
  const copy = COPY[locale] ?? COPY.en;

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={openPreferences}
        className={`inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 ${className}`.trim()}
      >
        {copy.modal.openLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={`text-sm font-semibold underline underline-offset-4 hover:text-sky-600 ${className}`.trim()}
    >
      {copy.modal.openLabel}
    </button>
  );
}
