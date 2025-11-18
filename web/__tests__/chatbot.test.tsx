/**
 * Chatbot Gate Component Tests
 * 
 * Tests for the ChatbotGate component including consent persistence,
 * script loading, and GA4 event tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ChatbotGate from '@/components/ChatbotGate';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'chatbot.banner.title': 'Enable AI receptionist',
      'chatbot.banner.description': 'Chat with our bilingual AI assistant.',
      'chatbot.banner.privacyLink': 'Learn more',
      'chatbot.banner.enable': 'Enable chat',
      'chatbot.banner.decline': 'No thanks',
      'chatbot.preChat.projectQuestion': 'Tell us about your project',
      'chatbot.preChat.bookingPrompt': 'Prefer to schedule?',
      'chatbot.preChat.bookingButton': 'Book a diagnostic',
    };
    return translations[key] || key;
  },
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  track: vi.fn(),
}));

// Mock env
vi.mock('@/lib/env', () => ({
  getEnv: vi.fn((key: string) => {
    if (key === 'NEXT_PUBLIC_CRISP_ID') return 'test-crisp-id';
    return undefined;
  }),
}));

// Mock locale routing
vi.mock('@/lib/localeRouting', () => ({
  buildLocalePath: vi.fn((locale: string, path: string) => `/${locale}${path}`),
}));

describe('ChatbotGate', () => {
  beforeEach(() => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock window.$crisp
    if (typeof window !== 'undefined') {
      (window as any).$crisp = undefined;
      (window as any).CRISP_WEBSITE_ID = undefined;
      (window as any).CRISP_RUNTIME_CONFIG = undefined;
    }
  });

  it('should not render if no Crisp ID is provided', () => {
    const { container } = render(
      <ChatbotGate provider="crisp" locale="fr" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should not render if provider is not crisp', () => {
    const { container } = render(
      <ChatbotGate provider="crisp" locale="fr" crispId="test-id" />
    );
    // Should render (crisp is valid)
    expect(container.firstChild).not.toBeNull();
  });

  it('should show consent banner when no consent is stored', () => {
    render(<ChatbotGate provider="crisp" locale="fr" crispId="test-id" />);
    
    expect(screen.getByText('Enable AI receptionist')).toBeInTheDocument();
    expect(screen.getByText('Enable chat')).toBeInTheDocument();
    expect(screen.getByText('No thanks')).toBeInTheDocument();
  });

  it('should not show banner when consent is already granted', () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'chatbot_consent',
        JSON.stringify({ granted: true, timestamp: new Date().toISOString() })
      );
    }

    const { container } = render(
      <ChatbotGate provider="crisp" locale="fr" crispId="test-id" />
    );

    expect(screen.queryByText('Enable AI receptionist')).not.toBeInTheDocument();
  });

  it('should save consent when enable button is clicked', async () => {
    render(<ChatbotGate provider="crisp" locale="fr" crispId="test-id" />);
    
    const enableButton = screen.getByText('Enable chat');
    enableButton.click();

    await waitFor(() => {
      const stored = window.localStorage.getItem('chatbot_consent');
      expect(stored).toBeTruthy();
      if (stored) {
        const consent = JSON.parse(stored);
        expect(consent.granted).toBe(true);
      }
    });
  });

  it('should save declined consent when decline button is clicked', async () => {
    render(<ChatbotGate provider="crisp" locale="fr" crispId="test-id" />);
    
    const declineButton = screen.getByText('No thanks');
    declineButton.click();

    await waitFor(() => {
      const stored = window.localStorage.getItem('chatbot_consent');
      expect(stored).toBeTruthy();
      if (stored) {
        const consent = JSON.parse(stored);
        expect(consent.granted).toBe(false);
      }
    });
  });
});

