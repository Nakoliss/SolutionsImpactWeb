import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Force French locale only - English is not ready
  const l = 'fr' as const;
  const messages = (await import(`./messages/${l}.json`)).default;
  return { locale: l, messages };
});