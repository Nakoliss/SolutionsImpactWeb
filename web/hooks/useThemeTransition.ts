/**
 * Hook for managing theme transition states and loading indicators
 * Provides smooth user experience during theme switching
 */

import { useState, useEffect, useCallback } from 'react';
import { BusinessType } from '@/lib/businessDesigns';
import { getThemePerformanceMetrics } from '@/lib/themePerformance';

interface ThemeTransitionState {
    isTransitioning: boolean;
    isLoading: boolean;
    progress: number;
    error: string | null;
}

interface UseThemeTransitionReturn extends ThemeTransitionState {
    startTransition: (newTheme: BusinessType) => void;
    completeTransition: () => void;
    resetTransition: () => void;
    getPerformanceMetrics: () => any;
}

const TRANSITION_DURATION = 300; // ms
const LOADING_STEPS = 3; // Number of loading steps

export const useThemeTransition = (): UseThemeTransitionReturn => {
    const [state, setState] = useState<ThemeTransitionState>({
        isTransitioning: false,
        isLoading: false,
        progress: 0,
        error: null,
    });

    // Start theme transition with loading state
    const startTransition = useCallback((newTheme: BusinessType) => {
        setState(prev => ({
            ...prev,
            isTransitioning: true,
            isLoading: true,
            progress: 0,
            error: null,
        }));

        // Simulate loading progress for better UX
        let currentStep = 0;
        const progressInterval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / LOADING_STEPS) * 100;

            setState(prev => ({
                ...prev,
                progress: Math.min(progress, 90), // Keep at 90% until completion
            }));

            if (currentStep >= LOADING_STEPS) {
                clearInterval(progressInterval);
            }
        }, TRANSITION_DURATION / LOADING_STEPS);

        // Auto-complete after transition duration
        setTimeout(() => {
            clearInterval(progressInterval);
            completeTransition();
        }, TRANSITION_DURATION);
    }, []);

    // Complete theme transition
    const completeTransition = useCallback(() => {
        setState(prev => ({
            ...prev,
            isTransitioning: false,
            isLoading: false,
            progress: 100,
        }));

        // Reset progress after a short delay
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                progress: 0,
            }));
        }, 500);
    }, []);

    // Reset transition state
    const resetTransition = useCallback(() => {
        setState({
            isTransitioning: false,
            isLoading: false,
            progress: 0,
            error: null,
        });
    }, []);

    // Get performance metrics
    const getPerformanceMetrics = useCallback(() => {
        return getThemePerformanceMetrics();
    }, []);

    // Handle errors during transition
    useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            if (state.isTransitioning) {
                setState(prev => ({
                    ...prev,
                    error: 'Theme transition failed',
                    isTransitioning: false,
                    isLoading: false,
                }));
            }
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, [state.isTransitioning]);

    return {
        ...state,
        startTransition,
        completeTransition,
        resetTransition,
        getPerformanceMetrics,
    };
};

/**
 * Hook for optimizing component re-renders during theme transitions
 */
export const useThemeOptimization = (dependencies: any[] = []) => {
    const [isOptimized, setIsOptimized] = useState(false);

    useEffect(() => {
        // Enable optimization during theme transitions
        setIsOptimized(true);

        const timeout = setTimeout(() => {
            setIsOptimized(false);
        }, TRANSITION_DURATION + 100);

        return () => clearTimeout(timeout);
    }, dependencies);

    return {
        isOptimized,
        shouldSkipRender: isOptimized,
    };
};

/**
 * Hook for managing theme preloading
 */
export const useThemePreloader = () => {
    const [preloadedThemes, setPreloadedThemes] = useState<Set<BusinessType>>(new Set());
    const [isPreloading, setIsPreloading] = useState(false);

    const preloadTheme = useCallback(async (theme: BusinessType) => {
        if (preloadedThemes.has(theme)) {
            return;
        }

        setIsPreloading(true);

        try {
            // Simulate theme resource preloading
            await new Promise(resolve => setTimeout(resolve, 50));

            setPreloadedThemes(prev => new Set([...prev, theme]));
        } catch (error) {
            console.warn(`Failed to preload theme: ${theme}`, error);
        } finally {
            setIsPreloading(false);
        }
    }, [preloadedThemes]);

    const preloadAllThemes = useCallback(async () => {
        const allThemes = Object.values(BusinessType);
        setIsPreloading(true);

        try {
            await Promise.all(
                allThemes.map(theme => preloadTheme(theme))
            );
        } finally {
            setIsPreloading(false);
        }
    }, [preloadTheme]);

    return {
        preloadedThemes,
        isPreloading,
        preloadTheme,
        preloadAllThemes,
        isThemePreloaded: (theme: BusinessType) => preloadedThemes.has(theme),
    };
};