export type ConsentCategory =
  | 'essential'
  | 'analytics'
  | 'marketing'
  | 'preferences';

export interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'wis.consent.v1';

type ConsentListener = (consent: ConsentState | null) => void;

let consentState: ConsentState | null = null;
const listeners = new Set<ConsentListener>();

function sanitizeConsent(
  value: Partial<ConsentState> | null | undefined
): ConsentState | null {
  if (!value) return null;
  return {
    essential: true,
    analytics: Boolean(value.analytics),
    marketing: Boolean(value.marketing),
    preferences: Boolean(value.preferences),
    updatedAt:
      typeof value.updatedAt === 'string'
        ? value.updatedAt
        : new Date().toISOString(),
  };
}

function updateDomAttributes(consent: ConsentState | null): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.consentAnalytics = consent?.analytics ? 'granted' : 'denied';
  root.dataset.consentMarketing = consent?.marketing ? 'granted' : 'denied';
  root.dataset.consentPreferences = consent?.preferences ? 'granted' : 'denied';
}

function persistConsent(consent: ConsentState): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(consent.updatedAt)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to persist consent state:', error);
  }
}

export function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    const sanitized = sanitizeConsent(parsed);

    // Check expiry (12 months)
    if (sanitized) {
      const lastUpdated = new Date(sanitized.updatedAt).getTime();
      const now = new Date().getTime();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;

      if (now - lastUpdated > oneYearMs) {
        console.log('Consent expired (older than 1 year), clearing storage.');
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }

    return sanitized;
  } catch (error) {
    console.warn('Failed to parse stored consent, clearing value.', error);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writeConsent(consent: ConsentState): void {
  consentState = consent;
  persistConsent(consent);
  updateDomAttributes(consent);
  listeners.forEach((listener) => listener(consent));

  // Log consent changes to Supabase for Loi 25 compliance
  if (typeof window !== 'undefined') {
    // Log each category change
    const categories = ['analytics', 'marketing', 'preferences'] as const;
    categories.forEach((category) => {
      // Map our consent categories to Supabase categories
      const supabaseCategory =
        category === 'analytics'
          ? 'analytics'
          : category === 'marketing'
            ? 'ads'
            : 'email';

      // Get cookie ID for actor tracking
      import('@/lib/utmUtils')
        .then(({ getCookieId }) => {
          const actor = getCookieId();
          fetch('/api/consent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category: supabaseCategory,
              granted: consent[category],
              actor,
              meta: {
                userAgent: navigator.userAgent,
                timestamp: consent.updatedAt,
              },
            }),
          }).catch((error) => {
            // Don't fail consent if logging fails
            console.warn('Failed to log consent to Supabase:', error);
          });
        })
        .catch(() => {
          // Fallback if utmUtils fails
          fetch('/api/consent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category: supabaseCategory,
              granted: consent[category],
              actor: 'unknown',
              meta: {
                timestamp: consent.updatedAt,
              },
            }),
          }).catch(() => {
            // Silent fail
          });
        });
    });
  }
}

export function clearStoredConsent(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }
  consentState = null;
  updateDomAttributes(null);
  listeners.forEach((listener) => listener(null));
}

export function getConsentState(): ConsentState | null {
  return consentState;
}

export function setConsentState(consent: ConsentState | null): void {
  consentState = consent;
  updateDomAttributes(consent);
  listeners.forEach((listener) => listener(consent));
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'essential') return true;
  return Boolean(consentState && consentState[category]);
}

export function onConsentChange(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createConsent(
  partial?: Partial<Omit<ConsentState, 'updatedAt'>>
): ConsentState {
  return sanitizeConsent({
    essential: true,
    analytics: partial?.analytics ?? false,
    marketing: partial?.marketing ?? false,
    preferences: partial?.preferences ?? false,
    updatedAt: new Date().toISOString(),
  }) as ConsentState;
}

export function initializeConsentFromStorage(): ConsentState | null {
  const stored = readStoredConsent();
  if (stored) {
    consentState = stored;
    updateDomAttributes(stored);
  }
  return stored;
}
