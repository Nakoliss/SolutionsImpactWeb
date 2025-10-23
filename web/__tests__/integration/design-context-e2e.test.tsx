/**
 * End-to-end integration tests for design context persistence
 * Tests complete user journey from design selection to navigation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { DesignContextProvider } from '@/lib/designContext';
import BusinessCarousel from '@/components/BusinessCarousel';
import Header from '@/components/Header';
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
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockMessages}>
        <DesignContextProvider>
            {children}
        </DesignContextProvider>
    </NextIntlClientProvider>
);

describe('Design Context End-to-End Integration', () => {
    let mockNavigation: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        mockNavigation = await import('next/navigation');

        // Reset mock functions
        mockNavigation.__mockPush.mockClear();
        mockNavigation.__mockReplace.mockClear();
        mockNavigation.__mockGet.mockReturnValue(null);
    });

    describe('Complete User Journey Testing', () => {
        test('should maintain design context through complete navigation flow', async () => {
            const { container } = render(
                <TestWrapper>
                    <div data-testid="app-container" className="themed-page">
                        <BusinessCarousel locale="en" />
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Step 1: User selects a design (medical)
            const medicalButton = screen.getByRole('button', { name: /medical/i });
            fireEvent.click(medicalButton);

            // Verify URL was updated with design parameter
            await waitFor(() => {
                expect(mockNavigation.__mockReplace).toHaveBeenCalledWith(
                    expect.stringContaining('design=medical')
                );
            });

            // Step 2: Simulate URL state change
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'medical' : null
            );

            // Re-render to simulate navigation
            const { container: newContainer } = render(
                <TestWrapper>
                    <div data-testid="themed-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Step 3: Verify theme is applied
            await waitFor(() => {
                const themedElement = newContainer.querySelector('[data-testid="themed-content"]');
                expect(themedElement).toHaveClass('theme-medical');
            });
        });

        test('should handle design switching and maintain new context', async () => {
            render(
                <TestWrapper>
                    <BusinessCarousel locale="en" />
                </TestWrapper>
            );

            // Select initial design
            const restaurantButton = screen.getByRole('button', { name: /restaurant/i });
            fireEvent.click(restaurantButton);

            await waitFor(() => {
                expect(mockNavigation.__mockReplace).toHaveBeenCalledWith(
                    expect.stringContaining('design=restaurant')
                );
            });

            // Switch to different design
            const autoGarageButton = screen.getByRole('button', { name: /auto garage/i });
            fireEvent.click(autoGarageButton);

            await waitFor(() => {
                expect(mockNavigation.__mockReplace).toHaveBeenCalledWith(
                    expect.stringContaining('design=autoGarage')
                );
            });
        });

        test('should preserve design context across browser navigation', async () => {
            // Simulate direct page access with design parameter
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'fitness' : null
            );

            render(
                <TestWrapper>
                    <Header locale="en" currentPath="/en" />
                </TestWrapper>
            );

            // Verify all navigation links include the design context
            const navigationLinks = screen.getAllByRole('link');
            navigationLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    expect(href).toContain('design=fitness');
                }
            });
        });
    });

    describe('URL Sharing and Direct Access Testing', () => {
        test('should apply correct theme when accessing URL with design parameter', async () => {
            // Simulate direct access to URL with design parameter
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'medical' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="themed-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify theme class is applied to body
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-medical');
            });
        });

        test('should handle invalid design parameter gracefully', async () => {
            // Simulate URL with invalid design parameter
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'invalid-design' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="themed-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Should fallback to default theme
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-ai-agency');
            });
        });

        test('should generate shareable URLs with design context', async () => {
            render(
                <TestWrapper>
                    <BusinessCarousel locale="en" />
                </TestWrapper>
            );

            // Select a design - use a more specific selector
            const restaurantButton = screen.getByRole('button', { name: /restaurant/i });
            fireEvent.click(restaurantButton);

            // Verify URL includes design parameter for sharing
            await waitFor(() => {
                expect(mockNavigation.__mockReplace).toHaveBeenCalledWith(
                    expect.stringContaining('design=restaurant')
                );
            });

            // Simulate sharing this URL - when someone accesses it directly
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'restaurant' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="shared-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify shared URL applies correct theme
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-restaurant');
            });
        });
    });

    describe('Theme Consistency Verification', () => {
        test('should maintain consistent theme across all page components', async () => {
            // Set design context
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'autoGarage' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="page-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                        <div className="themed-card">Card Content</div>
                        <button className="themed-button">Button</button>
                    </div>
                </TestWrapper>
            );

            // Verify theme is consistently applied
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-autoGarage');

                // Check CSS variables are set on document root
                const computedStyle = window.getComputedStyle(document.documentElement);
                expect(computedStyle.getPropertyValue('--theme-accent')).toBeTruthy();
                expect(computedStyle.getPropertyValue('--theme-gradient')).toBeTruthy();
            });
        });

        test('should apply hover effects and interactive styles correctly', async () => {
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'fitness' : null
            );

            const { container } = render(
                <TestWrapper>
                    <div data-testid="interactive-content" className="themed-page">
                        <button className="themed-button" data-testid="themed-button">
                            Interactive Button
                        </button>
                    </div>
                </TestWrapper>
            );

            const button = screen.getByTestId('themed-button');

            // Simulate hover
            fireEvent.mouseEnter(button);

            await waitFor(() => {
                expect(document.body).toHaveClass('theme-fitness');

                // Verify hover-related CSS variables are set on document root
                const computedStyle = window.getComputedStyle(document.documentElement);
                expect(computedStyle.getPropertyValue('--theme-hover-shadow')).toBeTruthy();
                expect(computedStyle.getPropertyValue('--theme-border-hover')).toBeTruthy();
            });
        });
    });

    describe('Error Recovery and Fallback Testing', () => {
        test('should recover from lost design context', async () => {
            // Start with design context
            mockNavigation.__mockGet.mockImplementation((key: string) =>
                key === 'design' ? 'medical' : null
            );

            const { container, rerender } = render(
                <TestWrapper>
                    <div data-testid="recovery-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Verify initial theme
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-medical');
            });

            // Simulate context loss
            mockNavigation.__mockGet.mockReturnValue(null);

            rerender(
                <TestWrapper>
                    <div data-testid="recovery-content" className="themed-page">
                        <Header locale="en" currentPath="/en" />
                    </div>
                </TestWrapper>
            );

            // Should fallback to default theme
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-ai-agency');
            });
        });
    });
});
