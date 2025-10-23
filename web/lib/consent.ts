export type ConsentCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

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

function sanitizeConsent(value: Partial<ConsentState> | null | undefined): ConsentState | null {
  if (!value) return null;
  return {
    essential: true,
    analytics: Boolean(value.analytics),
    marketing: Boolean(value.marketing),
    preferences: Boolean(value.preferences),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
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
    return sanitizeConsent(parsed);
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

export function createConsent(partial?: Partial<Omit<ConsentState, 'updatedAt'>>): ConsentState {
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
