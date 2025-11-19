/**
 * Utility functions for extracting UTM parameters from URL
 */

/**
 * Get UTM parameters from current URL or provided URL string
 */
export function getUTMParams(url?: string): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === 'undefined') {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    };
  }

  try {
    const urlObj = url ? new URL(url, window.location.origin) : new URL(window.location.href);
    return {
      utm_source: urlObj.searchParams.get('utm_source'),
      utm_medium: urlObj.searchParams.get('utm_medium'),
      utm_campaign: urlObj.searchParams.get('utm_campaign'),
    };
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    };
  }
}

/**
 * Get cookie ID or generate one for actor tracking
 */
export function getCookieId(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  try {
    const stored = localStorage.getItem('wis.cookieId');
    if (stored) {
      return stored;
    }

    const cookieId = `cookie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('wis.cookieId', cookieId);
    return cookieId;
  } catch {
    return 'unknown';
  }
}

