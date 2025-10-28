import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Make React available globally
global.React = React;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/fr',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/head
vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));