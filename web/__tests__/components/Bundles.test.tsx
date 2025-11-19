/**
 * Bundles Component Tests
 * 
 * Tests for the Bundles component including bundle rendering,
 * CTA clicks, checkout flow, and GA4 event tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Bundles from '@/components/Bundles';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

// Mock analytics
const mockTrack = vi.fn();
vi.mock('@/lib/analytics', () => ({
  analytics: {
    track: mockTrack,
  },
}));

// Mock localeRouting
vi.mock('@/lib/localeRouting', () => ({
  buildLocalePath: (locale: string, path: string) => `/${locale}${path}`,
}));

// Mock fetch for checkout API
global.fetch = vi.fn();

describe('Bundles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({ status: 'coming_soon' }),
      status: 501,
    });
  });

  it('should render all 3 bundles', () => {
    render(<Bundles locale="fr" />);

    expect(screen.getByText('Essentials')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Pro / AI Visibility')).toBeInTheDocument();
  });

  it('should display bundle prices correctly', () => {
    render(<Bundles locale="fr" />);

    // Check Essentials prices
    expect(screen.getByText('2 999 $')).toBeInTheDocument();
    expect(screen.getByText('299 $/mo')).toBeInTheDocument();

    // Check Growth prices
    expect(screen.getByText('3 999 $')).toBeInTheDocument();
    expect(screen.getByText('849 $/mo')).toBeInTheDocument();

    // Check Pro prices
    expect(screen.getByText('5 999 $')).toBeInTheDocument();
    expect(screen.getByText('1 599 $/mo')).toBeInTheDocument();
  });

  it('should display bundle features', () => {
    render(<Bundles locale="fr" />);

    expect(screen.getByText('Site de base 1–5 pages')).toBeInTheDocument();
    expect(screen.getByText('Site Premium')).toBeInTheDocument();
    expect(screen.getByText('Site Premium ou E‑commerce')).toBeInTheDocument();
  });

  it('should render "Planifier un diagnostic" links', () => {
    render(<Bundles locale="fr" />);

    const bookLinks = screen.getAllByText('Planifier un diagnostic');
    expect(bookLinks.length).toBe(3);

    bookLinks.forEach((link) => {
      expect(link.closest('a')).toHaveAttribute('href', '/fr/contact');
    });
  });

  it('should track select_item event when clicking "Planifier"', () => {
    render(<Bundles locale="fr" />);

    const bookLinks = screen.getAllByText('Planifier un diagnostic');
    fireEvent.click(bookLinks[0]);

    expect(mockTrack).toHaveBeenCalledWith('select_item', {
      item_list_name: 'bundles',
      item_name: 'essentials',
    });
  });

  it('should render checkout buttons for OT and Mensuel', () => {
    render(<Bundles locale="fr" />);

    const otButtons = screen.getAllByText('Commander OT');
    const mButtons = screen.getAllByText('Commander Mensuel');

    expect(otButtons.length).toBe(3);
    expect(mButtons.length).toBe(3);
  });

  it('should call checkout API and show "en construction" message when clicking checkout', async () => {
    render(<Bundles locale="fr" />);

    const otButtons = screen.getAllByText('Commander OT');
    fireEvent.click(otButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'essentials', mode: 'ot' }),
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Le paiement en ligne arrive bientôt/)
      ).toBeInTheDocument();
    });
  });

  it('should track begin_checkout event when clicking checkout buttons', async () => {
    render(<Bundles locale="fr" />);

    const otButtons = screen.getAllByText('Commander OT');
    fireEvent.click(otButtons[0]);

    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('begin_checkout', {
        bundle: 'essentials',
        modality: 'ot',
        item_list_name: 'bundles',
        item_name: 'essentials',
      });
    });
  });

  it('should render "Ce qui est inclus" section', () => {
    render(<Bundles locale="fr" />);

    expect(screen.getByText('Ce qui est inclus')).toBeInTheDocument();
    expect(screen.getByText(/Compliance Package – Loi 25 Essentials/)).toBeInTheDocument();
    expect(screen.getByText(/Quickstart Guide/)).toBeInTheDocument();
    expect(screen.getByText(/Rapport Maintenance \+ Rapport SEO\/AEO mensuel/)).toBeInTheDocument();
  });

  it('should include JSON-LD script tag', () => {
    const { container } = render(<Bundles locale="fr" />);

    const scriptTag = container.querySelector('script[type="application/ld+json"]');
    expect(scriptTag).toBeInTheDocument();
    expect(scriptTag).not.toBeNull();

    if (scriptTag) {
      const jsonContent = JSON.parse(scriptTag.textContent || '{}');
      expect(jsonContent['@type']).toBe('OfferCatalog');
      expect(jsonContent.itemListElement).toHaveLength(3);
    }
  });
});

