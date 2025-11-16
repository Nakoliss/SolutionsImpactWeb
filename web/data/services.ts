import type { SupportedLocale } from '@/content';
import type { RawServices, ServiceCatalog } from '@/lib/serviceLoader';
import { buildCatalog } from '@/lib/serviceLoader';

import servicesEn from '@/content/services.en.json';
import servicesFr from '@/content/services.fr.json';

const RAW_SERVICES_BY_LOCALE: Record<SupportedLocale, RawServices> = {
  fr: servicesFr as RawServices,
  en: servicesEn as RawServices,
};

const FALLBACK_CATALOG_BY_LOCALE: Record<SupportedLocale, ServiceCatalog> = {
  fr: buildCatalog(RAW_SERVICES_BY_LOCALE.fr),
  en: buildCatalog(RAW_SERVICES_BY_LOCALE.en),
};

const DEFAULT_FALLBACK_LOCALE: SupportedLocale = 'fr';

export type ServicesSource = 'remote' | 'local';

export interface ServicesFetchResult {
  catalog: ServiceCatalog;
  source: ServicesSource;
}

export const SERVICES = FALLBACK_CATALOG_BY_LOCALE;

export function getLocalServicesCatalog(locale: SupportedLocale): ServiceCatalog {
  return (
    FALLBACK_CATALOG_BY_LOCALE[locale] ??
    FALLBACK_CATALOG_BY_LOCALE[DEFAULT_FALLBACK_LOCALE]
  );
}

function normalizeRemotePayload(
  payload: ServiceCatalog | RawServices,
): ServiceCatalog {
  if ('services' in payload && Array.isArray(payload.services)) {
    return {
      services: payload.services,
      totalServices: payload.totalServices ?? payload.services.length,
    };
  }

  return buildCatalog(payload as RawServices);
}

export async function fetchServicesForStaticProps(
  locale: SupportedLocale,
): Promise<ServicesFetchResult> {
  const apiUrl = process.env.SERVICES_API_URL;
  const apiToken = process.env.SERVICES_API_TOKEN;
  const fallback = (): ServicesFetchResult => ({
    catalog: getLocalServicesCatalog(locale),
    source: 'local',
  });

  if (!apiUrl) {
    return fallback();
  }

  try {
    const response = await fetch(`${apiUrl}?locale=${locale}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      },
      cache: 'force-cache',
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Services API responded with status ${response.status}`);
    }

    const payload = (await response.json()) as ServiceCatalog | RawServices;
    const catalog = normalizeRemotePayload(payload);

    if (!catalog.services.length) {
      return fallback();
    }

    return {
      catalog,
      source: 'remote',
    };
  } catch (error) {
    console.error(
      `Failed to fetch remote services for locale "${locale}"`,
      error,
    );
    return fallback();
  }
}

