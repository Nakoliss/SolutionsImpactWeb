import type { SupportedLocale } from '@/content';

export interface LaunchPrice {
  original: string;
}

export interface ServiceTier {
  name: string;
  price?: string;
  setupCost?: string;
  bullets: string[];
  launchPrice?: LaunchPrice;
}

export interface LaunchSpecial {
  tag: string;
  message: string;
  specialHeadline: string;
  originalHeadline?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  headlinePrice?: string;
  tiers: ServiceTier[];
  launchSpecial?: LaunchSpecial;
}

export interface ServiceCatalog {
  services: ServiceCategory[];
  totalServices: number;
}

type RawServiceTier = {
  name: string;
  price?: string;
  setupCost?: string;
  bullets?: string[];
  launchPrice?: {
    original: string;
  };
};

type RawServiceCategory = {
  title: string;
  description?: string;
  shortDescription?: string;
  price?: string;
  tiers?: RawServiceTier[];
  launchSpecial?: {
    tag: string;
    message: string;
    specialHeadline: string;
    originalHeadline?: string;
  };
};

type RawServices = Record<string, RawServiceCategory>;

type ServicesModule = { default: RawServices };

async function importServices(locale: SupportedLocale): Promise<RawServices> {
  const module: ServicesModule =
    locale === 'fr'
      ? await import('@/content/services.fr.json')
      : await import('@/content/services.en.json');

  return module.default;
}

function sanitizeText(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPrice(value?: string): string | undefined {
  const sanitized = sanitizeText(value);
  if (!sanitized) {
    return undefined;
  }

  return sanitized
    .replace(/[-\u2014\u2212]/g, '\u2013')
    .replace(/\s*\u2013\s*/g, ' \u2013 ')
    .trim();
}

function normalizeTier(rawTier: RawServiceTier): ServiceTier {
  const bullets = Array.isArray(rawTier.bullets) ? rawTier.bullets : [];

  const price = formatPrice(rawTier.price);
  const setupCost = formatPrice(rawTier.setupCost);
  const launchOriginal = rawTier.launchPrice?.original
    ? sanitizeText(rawTier.launchPrice.original)
    : undefined;

  return {
    name: sanitizeText(rawTier.name) ?? 'Service',
    ...(price && { price }),
    ...(setupCost && { setupCost }),
    ...(launchOriginal && { launchPrice: { original: launchOriginal } }),
    bullets: bullets
      .map((item) => sanitizeText(item) ?? '')
      .filter(Boolean) as string[],
  };
}

function normalizeCategory(
  id: string,
  raw: RawServiceCategory
): ServiceCategory | null {
  if (!raw?.title) {
    console.warn(`Service category "${id}" is missing a title.`);
    return null;
  }

  const tiers = Array.isArray(raw.tiers) ? raw.tiers.map(normalizeTier) : [];

  if (!tiers.length) {
    console.warn(`Service category "${id}" has no tiers defined.`);
  }

  const description = sanitizeText(raw.description);
  const shortDescription = sanitizeText(raw.shortDescription);
  const headlinePrice = formatPrice(raw.price);
  const launchSpecial = raw.launchSpecial
    ? {
        tag: sanitizeText(raw.launchSpecial.tag) ?? 'Launch',
        message: sanitizeText(raw.launchSpecial.message) ?? '',
        specialHeadline:
          formatPrice(raw.launchSpecial.specialHeadline) ??
          sanitizeText(raw.launchSpecial.specialHeadline) ??
          '',
        originalHeadline:
          raw.launchSpecial.originalHeadline
            ? formatPrice(raw.launchSpecial.originalHeadline) ??
              sanitizeText(raw.launchSpecial.originalHeadline)
            : undefined,
      }
    : undefined;

  return {
    id,
    title: sanitizeText(raw.title) ?? id,
    ...(description && { description }),
    ...(shortDescription && { shortDescription }),
    ...(headlinePrice && { headlinePrice }),
    ...(launchSpecial && { launchSpecial }),
    tiers,
  };
}

function buildCatalog(source: RawServices): ServiceCatalog {
  const services: ServiceCategory[] = [];

  for (const [id, rawCategory] of Object.entries(source)) {
    const normalized = normalizeCategory(id, rawCategory);
    if (normalized) {
      services.push(normalized);
    }
  }

  return {
    services,
    totalServices: services.length,
  };
}

export async function loadServicesDynamic(
  locale: SupportedLocale
): Promise<ServiceCatalog> {
  try {
    const source = await importServices(locale);
    return buildCatalog(source);
  } catch (error) {
    console.error(`Failed to load services for locale "${locale}"`, error);

    if (locale !== 'fr') {
      const fallbackSource = await importServices('fr');
      return buildCatalog(fallbackSource);
    }

    throw error;
  }
}
