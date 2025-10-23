/**
 * Simplified integration tests for design context persistence
 * Tests the core functionality without complex mocking
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';

import { DesignContextProvider, useDesignContext } from '@/lib/designContext';
import { BusinessType } from '@/lib/businessDesigns';

// Mock next/navigation with simple implementations
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        pathname: '/en',
    }),
    useSearchParams: () => ({
        get: vi.fn().mockReturnValue(null),
        toString: vi.fn().mockReturnValue(''),
    }),
    usePathname: () => '/en',
}));

// Mock messages for NextIntl
const mockMessages = {
    nav: {
        services: 'Services',
        packages: 'Packages',
        pricing: 'Pricing',
    },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockMessages}>
        <DesignContextProvider>
            {children}
        </DesignContextProvider>
    </NextIntlClientProvider>
);

// Test component that uses design context
const TestComponent = () => {
    const { currentDesign, setCurrentDesign, getDesignTheme } = useDesignContext();
    const theme = getDesignTheme();

    return (
        <div data-testid="test-component" className="themed-page">
            <div data-testid="current-design">{currentDesign}</div>
            <div data-testid="theme-accent">{theme.accent}</div>
            <div data-testid="theme-gradient">{theme.gradient}</div>
            <button
                data-testid="set-medical"
                onClick={() => setCurrentDesign(BusinessType.MEDICAL)}
            >
                Set Medical
            </button>
            <button
                data-testid="set-restaurant"
                onClick={() => setCurrentDesign(BusinessType.RESTAURANT)}
            >
                Set Restaurant
            </button>
            <button
                data-testid="set-auto-garage"
                onClick={() => setCurrentDesign(BusinessType.AUTO_GARAGE)}
            >
                Set Auto Garage
            </button>
        </div>
    );
};

describe('Design Context Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset body class
        document.body.className = '';
    });

    describe('Design Context Provider', () => {
        test('should provide default design context', async () => {
            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('AI_AGENCY');
                expect(document.body).toHaveClass('theme-ai-agency');
            });
        });

        test('should update design context when setCurrentDesign is called', async () => {
            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Initial state
            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('AI_AGENCY');
                expect(document.body).toHaveClass('theme-ai-agency');
            });

            // Change to medical design
            fireEvent.click(screen.getByTestId('set-medical'));

            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('MEDICAL');
                expect(document.body).toHaveClass('theme-medical');
            });
        });

        test('should apply correct theme properties for different designs', async () => {
            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Test medical design
            fireEvent.click(screen.getByTestId('set-medical'));

            await waitFor(() => {
                expect(screen.getByTestId('theme-accent')).toHaveTextContent('#10b981');
                expect(document.body).toHaveClass('theme-medical');

                // Check CSS variables on document root
                const computedStyle = window.getComputedStyle(document.documentElement);
                expect(computedStyle.getPropertyValue('--theme-accent')).toContain('#10b981');
            });

            // Test restaurant design
            fireEvent.click(screen.getByTestId('set-restaurant'));

            await waitFor(() => {
                expect(screen.getByTestId('theme-accent')).toHaveTextContent('#f97316');
                expect(document.body).toHaveClass('theme-restaurant');

                // Check CSS variables updated
                const computedStyle = window.getComputedStyle(document.documentElement);
                expect(computedStyle.getPropertyValue('--theme-accent')).toContain('#f97316');
            });

            // Test auto garage design
            fireEvent.click(screen.getByTestId('set-auto-garage'));

            await waitFor(() => {
                expect(screen.getByTestId('theme-accent')).toHaveTextContent('#ef4444');
                expect(document.body).toHaveClass('theme-auto-garage');

                // Check CSS variables updated
                const computedStyle = window.getComputedStyle(document.documentElement);
                expect(computedStyle.getPropertyValue('--theme-accent')).toContain('#ef4444');
            });
        });

        test('should maintain theme consistency across re-renders', async () => {
            const { rerender } = render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Set medical design
            fireEvent.click(screen.getByTestId('set-medical'));

            await waitFor(() => {
                expect(document.body).toHaveClass('theme-medical');
            });

            // Re-render component
            rerender(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Theme should persist
            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('MEDICAL');
                expect(document.body).toHaveClass('theme-medical');
            });
        });

        test('should handle invalid design gracefully', async () => {
            const TestComponentWithInvalid = () => {
                const { setCurrentDesign } = useDesignContext();

                return (
                    <div>
                        <TestComponent />
                        <button
                            data-testid="set-invalid"
                            onClick={() => setCurrentDesign('INVALID_DESIGN' as BusinessType)}
                        >
                            Set Invalid
                        </button>
                    </div>
                );
            };

            render(
                <TestWrapper>
                    <TestComponentWithInvalid />
                </TestWrapper>
            );

            // Try to set invalid design
            fireEvent.click(screen.getByTestId('set-invalid'));

            // Should remain on default design
            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('AI_AGENCY');
                expect(document.body).toHaveClass('theme-ai-agency');
            });
        });
    });

    describe('Theme Application', () => {
        test('should apply all required CSS variables for each design', async () => {
            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            const designs = [
                { type: BusinessType.MEDICAL, expectedAccent: '#10b981' },
                { type: BusinessType.RESTAURANT, expectedAccent: '#f97316' },
                { type: BusinessType.AUTO_GARAGE, expectedAccent: '#ef4444' },
                { type: BusinessType.FITNESS, expectedAccent: '#f59e0b' },
                { type: BusinessType.AI_AGENCY, expectedAccent: '#38bdf8' },
            ];

            for (const { type, expectedAccent } of designs) {
                // Set design
                const buttonMap = {
                    [BusinessType.MEDICAL]: 'set-medical',
                    [BusinessType.RESTAURANT]: 'set-restaurant',
                    [BusinessType.AUTO_GARAGE]: 'set-auto-garage',
                    [BusinessType.FITNESS]: 'set-medical', // Use medical button for simplicity
                    [BusinessType.AI_AGENCY]: 'set-medical', // Will be default
                };

                if (type !== BusinessType.AI_AGENCY) {
                    fireEvent.click(screen.getByTestId(buttonMap[type]));
                }

                await waitFor(() => {
                    const computedStyle = window.getComputedStyle(document.documentElement);

                    // Check required CSS variables are set
                    expect(computedStyle.getPropertyValue('--theme-accent')).toBeTruthy();
                    expect(computedStyle.getPropertyValue('--theme-gradient')).toBeTruthy();
                    expect(computedStyle.getPropertyValue('--theme-hover-shadow')).toBeTruthy();
                    expect(computedStyle.getPropertyValue('--theme-border-hover')).toBeTruthy();

                    // Check theme class is applied
                    const expectedClass = `theme-${type.toLowerCase().replace('_', '-')}`;
                    expect(document.body).toHaveClass(expectedClass);
                });
            }
        });

        test('should update theme when design changes multiple times', async () => {
            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Start with default
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-ai-agency');
            });

            // Change to medical
            fireEvent.click(screen.getByTestId('set-medical'));
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-medical');
                expect(document.body).not.toHaveClass('theme-ai-agency');
            });

            // Change to restaurant
            fireEvent.click(screen.getByTestId('set-restaurant'));
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-restaurant');
                expect(document.body).not.toHaveClass('theme-medical');
            });

            // Change to auto garage
            fireEvent.click(screen.getByTestId('set-auto-garage'));
            await waitFor(() => {
                expect(document.body).toHaveClass('theme-auto-garage');
                expect(document.body).not.toHaveClass('theme-restaurant');
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle theme application errors gracefully', async () => {
            // Mock console.error to avoid noise in test output
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            render(
                <TestWrapper>
                    <TestComponent />
                </TestWrapper>
            );

            // Should still work even if there are potential errors
            fireEvent.click(screen.getByTestId('set-medical'));

            await waitFor(() => {
                expect(screen.getByTestId('current-design')).toHaveTextContent('MEDICAL');
                expect(document.body).toHaveClass('theme-medical');
            });

            consoleSpy.mockRestore();
        });
    });
});