import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchServicesForStaticProps } from '@/data/services';

describe('fetchServicesForStaticProps', () => {
  const originalEnv = process.env.SERVICES_API_URL;
  const originalToken = process.env.SERVICES_API_TOKEN;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.SERVICES_API_URL = originalEnv;
    process.env.SERVICES_API_TOKEN = originalToken;
    global.fetch = originalFetch;
  });

  it('returns local catalog when no API is configured', async () => {
    delete process.env.SERVICES_API_URL;
    const result = await fetchServicesForStaticProps('fr');

    expect(result.source).toBe('local');
    expect(result.catalog.services.length).toBeGreaterThan(0);
  });

  it('falls back to local catalog when remote fetch fails', async () => {
    process.env.SERVICES_API_URL = 'https://example.com/services';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch = mockFetch as typeof global.fetch;

    const result = await fetchServicesForStaticProps('fr');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.source).toBe('local');
    expect(result.catalog.services.length).toBeGreaterThan(0);
  });
});

