import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BusinessCarousel from '@/components/BusinessCarousel';
import { DesignContextProvider } from '@/lib/designContext';
import frMessages from '@/messages/fr.json';
import { NextIntlClientProvider } from 'next-intl';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={frMessages}>
    <DesignContextProvider>{children}</DesignContextProvider>
  </NextIntlClientProvider>
);

describe('BusinessCarousel SSR services', () => {
  it('renders service cards immediately when initial catalog is provided', () => {
    const initialCatalog = {
      services: [
        {
          id: 'test-service',
          title: 'Service démo',
          description: 'Description détaillée du service pour test.',
          shortDescription: 'Résumé du service.',
          headlinePrice: '700 $',
          tiers: [
            {
              name: 'Essentiel',
              bullets: ['Bullet 1'],
            },
          ],
        },
      ],
      totalServices: 1,
    };

    render(
      <BusinessCarousel
        locale="fr"
        initialServiceCatalog={initialCatalog}
        disableClientPrefetch
      />,
      { wrapper },
    );

    expect(screen.getByText('Service démo')).toBeInTheDocument();
    expect(
      screen.queryByText('Chargement des services...'),
    ).not.toBeInTheDocument();
  });
});

