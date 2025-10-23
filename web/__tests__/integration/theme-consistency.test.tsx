/**
 * Theme consistency integration tests
 * Tests that design themes are applied consistently across all components and pages
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';

import { DesignContextProvider } from '@/lib/designContext';
import Header from '@/components/Header';
import PricingTable from '@/components/PricingTable';
import BusinessCarousel from '@/components/BusinessCarousel';
import { beforeEach } from 'node:test';

// Mock next/navigation with proper factory function
vi.mock('next/navigation', () => {
    const mockPush = vi.fn();
    const mockReplace = vi.fn();
    const mockGet = vi.fn();

    return {
        useRouter: () => ({
            push: mockPush,
            replace: mockReplace,
            pathname: '/en',
        }),
        useSearchParams: () => ({
            get: mockGet,
            toString: () => mockGet('design') ? `design=${mockGet('design')}` : '',
        }),
        usePathname: () => '/en',
        // Export mocks for test access
        __mockPush: mockPush,
        __mockReplace: mockReplace,
        __mockGet: mockGet,
    };
});

// Mock messages for NextIntl
const mockMessages = {
    nav: {
        services: 'Services',
        packages: 'Packages',
        pricing: 'Pricing',
        process: 'Process',
        whyUs: 'Why Us',
    },
    BusinessCarousel: {
        title: 'Choose Your Business Type',
        subtitle: 'Select your industry to see customized solutions',
    },
    PricingTable: {
        title: 'Pricing Plans',
        subtitle: 'Choose the perfect plan for your business',
    },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockMessages}>
        <DesignContextProvider>
            {children}
        </DesignContextProvider>
    </NextIntlClientProvider>
);

describe('Theme Consistency Integration Tests', () => {
    let mockNavigation: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        mockNavigation = await import('next/navigation');

        // Reset mock functions
        mockNavigation.__mockPush.mockClear();
        mockNavigation.__mockReplace.mockClear();
        mockNavigation.__mockGet.mockReturnValue(null);
    });

    describe('Cross-Component Theme Application', () => {
        test('should apply consistent theme across Header and PricingTable components', async () => {
            // Mock URL with design parameter
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'medical' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="themed-page" className="themed-page">
                        <Header locale="en" currentPath="/en/pricing" />
                        <PricingTable />
                    </div>
                </TestWrapper>
            );

            await waitFor(() => {
                const themedPage = container.querySelector('[data-testid="themed-page"]');
                expect(themedPage).toHaveClass('theme-medical');

                // Verify CSS variables are consistently applied
                const computedStyle = window.getComputedStyle(themedPage!);
                const accentColor = computedStyle.getPropertyValue('--theme-accent');
                const gradient = computedStyle.getPropertyValue('--theme-gradient');

                expect(accentColor).toContain('#10b981'); // Medical theme accent
                expect(gradient).toContain('linear-gradient');
            });
        });

        test('should maintain theme consistency when switching between designs', async () => {
            let currentDesign = 'restaurant';

            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? currentDesign : null
            );

            const { container, rerender } = render(
                <TestWrapper>
                    <div data-testid="switchable-theme" className="themed-page">
                        <BusinessCarousel locale="en" />
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify initial restaurant theme
            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="switchable-theme"]');
                expect(themedElement).toHaveClass('theme-restaurant');
            });

            // Switch to fitness theme
            currentDesign = 'fitness';
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? currentDesign : null
            );

            rerender(
                <TestWrapper>
                    <div data-testid="switchable-theme" className="themed-page">
                        <BusinessCarousel locale="en" />
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify theme switched to fitness
            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="switchable-theme"]');
                expect(themedElement).toHaveClass('theme-fitness');

                // Verify CSS variables updated
                const computedStyle = window.getComputedStyle(themedElement!);
                const accentColor = computedStyle.getPropertyValue('--theme-accent');
                expect(accentColor).toContain('#f59e0b'); // Fitness theme accent
            });
        });
    });

    describe('CSS Variables and Theme Properties', () => {
        test('should set all required CSS variables for each business type', async () => {
            const businessTypes = [
                { type: 'medical', expectedAccent: '#10b981' },
                { type: 'restaurant', expectedAccent: '#f59e0b' },
                { type: 'autoGarage', expectedAccent: '#ef4444' },
                { type: 'fitness', expectedAccent: '#f59e0b' },
                { type: 'aiAgency', expectedAccent: '#06b6d4' },
            ];

            for (const { type, expectedAccent } of businessTypes) {
                mockNavigation.__mockGet.mockImplementation((key: string) =>
                    key === 'design' ? type : null
                );

                const { container } = render(
                    <TestWrapper>
                        <div data-testid={`theme-${type}`} className="themed-page">
                            <Header locale="en" currentPath="/en" />
                        </div>
                    </TestWrapper>
                );

                await waitFor(() => {
                    const themedElement = container.querySelector(`[data-testid="theme-${type}"]`);
                    expect(themedElement).toHaveClass(`theme-${type}`);

                    const computedStyle = window.getComputedStyle(themedElement!);

                    // Check all required CSS variables are set
                    expect(computedStyle.getPropertyValue('--theme-accent')).toContain(expectedAccent);
                    expect(computedStyle.getPropertyValue('--theme-gradient')).toBeTruthy();
                    expect(computedStyle.getPropertyValue('--theme-hover-shadow')).toBeTruthy();
                    expect(computedStyle.getPropertyValue('--theme-border-hover')).toBeTruthy();
                });
            }
        });

        test('should apply hover effects with correct theme colors', async () => {
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'autoGarage' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="hover-test" className="themed-page">
                        <button
                            className="themed-button hover:shadow-lg transition-all duration-300"
                            data-testid="hover-button"
                        >
                            Hover Me
                        </button>
                    </div>
                </TestWrapper>
            );

            const button = screen.getByTestId('hover-button');
            const themedPage = container.querySelector('[data-testid="hover-test"]');

            // Verify theme is applied
            await waitFor(() => {
                expect(themedPage).toHaveClass('theme-autoGarage');
            });

            // Simulate hover
            fireEvent.mouseEnter(button);

            await waitFor(() => {
                const computedStyle = window.getComputedStyle(themedPage!);
                const hoverShadow = computedStyle.getPropertyValue('--theme-hover-shadow');

                // Auto garage theme should have red-based hover shadow
                expect(hoverShadow).toContain('239, 68, 68'); // RGB for #ef4444
            });
        });
    });

    describe('Fallback Theme Behavior', () => {
        test('should apply default theme when no design parameter is provided', async () => {
            mockNavigation.__mockGet.mockReturnValue(null);

            const { container } = render(
                <TestWrapper>
                    <div data-testid="default-theme" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="default-theme"]');
                expect(themedElement).toHaveClass('theme-ai-agency');

                const computedStyle = window.getComputedStyle(themedElement!);
                const accentColor = computedStyle.getPropertyValue('--theme-accent');
                expect(accentColor).toContain('#06b6d4'); // AI Agency default accent
            });
        });

        test('should fallback to default theme for invalid design parameter', async () => {
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'invalid-business-type' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="fallback-theme" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="fallback-theme"]');
                expect(themedElement).toHaveClass('theme-ai-agency');

                const computedStyle = window.getComputedStyle(themedElement!);
                const accentColor = computedStyle.getPropertyValue('--theme-accent');
                expect(accentColor).toContain('#06b6d4'); // Fallback to AI Agency
            });
        });
    });

    describe('Theme Persistence Across Navigation', () => {
        test('should maintain theme when navigating between pages', async () => {
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'medical' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="navigation-theme" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify theme is applied
            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="navigation-theme"]');
                expect(themedElement).toHaveClass('theme-medical');
            });

            // Click on a navigation link
            const pricingLink = screen.getByRole('link', { name: /pricing/i });
            fireEvent.click(pricingLink);

            // Verify navigation includes design parameter
            await waitFor(() => {
                expect(mockNavigation.__mockPush).toHaveBeenCalledWith(
                    expect.stringContaining('design=medical')
                );
            });
        });

        test('should preserve theme across page reloads with URL parameters', async () => {
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'restaurant' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="reload-theme" className="themed-page">
                        <Header locale="en" currentPath="/en/pricing" />
                        <PricingTable />
                    </div>
                </TestWrapper>
            );

            await waitFor(() => {
                const themedElement = container.querySelector('[data-testid="reload-theme"]');
                expect(themedElement).toHaveClass('theme-restaurant');

                const computedStyle = window.getComputedStyle(themedElement!);
                const accentColor = computedStyle.getPropertyValue('--theme-accent');
                expect(accentColor).toContain('#f59e0b'); // Restaurant theme accent
            });
        });
    });
});
