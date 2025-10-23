/**
 * Performance optimizations for theme switching
 * Implements caching, batching, and smooth transitions
 */

import { BusinessType, getThemeCSSVariables, getThemeClassName } from './businessDesigns';

// Cache for theme CSS variables to avoid repeated calculations
const themeVariablesCache = new Map<BusinessType, Record<string, string>>();

// Cache for theme class names
const themeClassCache = new Map<BusinessType, string>();

// Current theme state to avoid unnecessary updates
let currentTheme: BusinessType | null = null;

// Transition state management
let isTransitioning = false;
const TRANSITION_DURATION = 300; // ms

/**
 * Get cached theme CSS variables
 */
export const getCachedThemeVariables = (businessType: BusinessType): Record<string, string> => {
    if (!themeVariablesCache.has(businessType)) {
        const variables = getThemeCSSVariables(businessType);
        themeVariablesCache.set(businessType, variables);
    }
    return themeVariablesCache.get(businessType)!;
};

/**
 * Get cached theme class name
 */
export const getCachedThemeClassName = (businessType: BusinessType): string => {
    if (!themeClassCache.has(businessType)) {
        const className = getThemeClassName(businessType);
        themeClassCache.set(businessType, className);
    }
    return themeClassCache.get(businessType)!;
};

/**
 * Optimized theme variable application with batching
 */
export const applyThemeVariablesOptimized = (element: HTMLElement, businessType: BusinessType): void => {
    // Skip if same theme is already applied
    if (currentTheme === businessType) {
        return;
    }

    const cssVariables = getCachedThemeVariables(businessType);

    // Batch DOM updates using requestAnimationFrame
    requestAnimationFrame(() => {
        // Use CSS custom property batch update for better performance
        const cssText = Object.entries(cssVariables)
            .map(([property, value]) => `${property}: ${value}`)
            .join('; ');

        // Apply all variables at once
        element.style.cssText += `; ${cssText}`;
    });
};

/**
 * Optimized theme class application with smooth transitions
 */
export const applyThemeClassOptimized = (element: HTMLElement, businessType: BusinessType): void => {
    const newThemeClass = getCachedThemeClassName(businessType);
    const currentThemeClass = getCurrentThemeClass(element);

    // Skip if same theme class is already applied
    if (currentThemeClass === newThemeClass) {
        return;
    }

    // Add transition class for smooth switching
    element.classList.add('theme-transitioning');

    // Batch class updates
    requestAnimationFrame(() => {
        // Remove old theme classes efficiently
        if (currentThemeClass) {
            element.classList.remove(currentThemeClass);
        }

        // Add new theme class
        element.classList.add(newThemeClass);

        // Remove transition class after animation completes
        setTimeout(() => {
            element.classList.remove('theme-transitioning');
        }, TRANSITION_DURATION);
    });
};

/**
 * Get current theme class efficiently
 */
const getCurrentThemeClass = (element: HTMLElement): string | null => {
    // Use cached class names for faster lookup
    for (const [businessType, className] of themeClassCache.entries()) {
        if (element.classList.contains(className)) {
            return className;
        }
    }

    // Fallback to DOM search if not in cache
    const themeClass = Array.from(element.classList).find(className =>
        className.startsWith('theme-')
    );
    return themeClass || null;
};

/**
 * Optimized global theme application with debouncing
 */
export const applyGlobalThemeOptimized = (businessType: BusinessType): void => {
    // Prevent multiple rapid theme changes
    if (isTransitioning) {
        return;
    }

    // Skip if same theme is already applied
    if (currentTheme === businessType) {
        return;
    }

    isTransitioning = true;
    currentTheme = businessType;

    const rootElement = document.documentElement;
    const bodyElement = document.body;

    // Apply optimized theme variables and classes
    applyThemeVariablesOptimized(rootElement, businessType);
    applyThemeClassOptimized(bodyElement, businessType);

    // Reset transition state
    setTimeout(() => {
        isTransitioning = false;
    }, TRANSITION_DURATION);
};

/**
 * Preload theme resources for faster switching
 */
export const preloadThemeResources = (businessTypes: BusinessType[]): void => {
    businessTypes.forEach(businessType => {
        // Preload theme variables and class names into cache
        getCachedThemeVariables(businessType);
        getCachedThemeClassName(businessType);
    });
};

/**
 * Clear theme caches (useful for development/testing)
 */
export const clearThemeCaches = (): void => {
    themeVariablesCache.clear();
    themeClassCache.clear();
    currentTheme = null;
    isTransitioning = false;
};

/**
 * Get performance metrics for theme switching
 */
export const getThemePerformanceMetrics = () => {
    return {
        cachedThemes: themeVariablesCache.size,
        cachedClasses: themeClassCache.size,
        currentTheme,
        isTransitioning,
        transitionDuration: TRANSITION_DURATION,
    };
};

/**
 * Optimize theme switching for reduced layout thrashing
 */
export const optimizeThemeTransition = (element: HTMLElement): void => {
    // Add CSS properties to minimize reflow/repaint
    element.style.willChange = 'background-color, color, border-color';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';

    // Clean up optimization after transition
    setTimeout(() => {
        element.style.willChange = 'auto';
        element.style.backfaceVisibility = 'visible';
        element.style.perspective = 'none';
    }, TRANSITION_DURATION + 100);
};