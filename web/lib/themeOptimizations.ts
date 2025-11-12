/**
 * Final performance optimizations for theme system
 * Implements advanced techniques for minimal re-renders and smooth transitions
 */

import { BusinessType } from './businessDesigns';

// Performance optimization flags
const OPTIMIZATION_FLAGS = {
    USE_RAF_BATCHING: true,
    USE_CSS_CONTAINMENT: true,
    USE_WILL_CHANGE: true,
    USE_TRANSFORM_OPTIMIZATION: true,
    DEBOUNCE_THEME_CHANGES: true,
};

// Debounce utility for theme changes
let themeChangeTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 50; // ms

/**
 * Debounced theme change to prevent rapid switching
 */
export const debouncedThemeChange = (
    callback: () => void,
    delay: number = DEBOUNCE_DELAY
): void => {
    if (!OPTIMIZATION_FLAGS.DEBOUNCE_THEME_CHANGES) {
        callback();
        return;
    }

    if (themeChangeTimeout) {
        clearTimeout(themeChangeTimeout);
    }

    themeChangeTimeout = setTimeout(callback, delay);
};

/**
 * Optimize element for theme transitions
 */
export const optimizeElementForThemeTransition = (element: HTMLElement): void => {
    if (!element) return;

    // CSS containment for better performance
    if (OPTIMIZATION_FLAGS.USE_CSS_CONTAINMENT) {
        element.style.contain = 'layout style paint';
    }

    // Will-change optimization
    if (OPTIMIZATION_FLAGS.USE_WILL_CHANGE) {
        element.style.willChange = 'background-color, color, border-color';
    }

    // Transform optimization for GPU acceleration
    if (OPTIMIZATION_FLAGS.USE_TRANSFORM_OPTIMIZATION) {
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
    }
};

/**
 * Clean up element optimizations after transition
 */
export const cleanupElementOptimizations = (element: HTMLElement): void => {
    if (!element) return;

    // Reset optimization properties
    element.style.contain = '';
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.backfaceVisibility = '';
};

/**
 * Batch DOM updates using RequestAnimationFrame
 */
export const batchDOMUpdates = (updates: (() => void)[]): void => {
    if (!OPTIMIZATION_FLAGS.USE_RAF_BATCHING) {
        updates.forEach(update => update());
        return;
    }

    requestAnimationFrame(() => {
        updates.forEach(update => {
            try {
                update();
            } catch (error) {
                console.warn('Theme update failed:', error);
            }
        });
    });
};

/**
 * Optimize theme switching for specific component types
 */
export const optimizeComponentForTheme = (
    element: HTMLElement,
    componentType: 'card' | 'button' | 'page' | 'text'
): void => {
    if (!element) return;

    const optimizations = {
        card: () => {
            element.style.isolation = 'isolate';
            element.style.contain = 'layout style';
        },
        button: () => {
            element.style.contain = 'layout style paint';
            element.style.willChange = 'transform, background-color';
        },
        page: () => {
            element.style.contain = 'layout';
            element.style.isolation = 'isolate';
        },
        text: () => {
            element.style.contain = 'style';
        },
    };

    optimizations[componentType]?.();
};

/**
 * Monitor theme performance and provide recommendations
 */
export const analyzeThemePerformance = (): {
    recommendations: string[];
    score: number;
} => {
    const recommendations: string[] = [];
    let score = 100;

    // Check if CSS containment is supported
    if (!CSS.supports('contain', 'layout')) {
        recommendations.push('Browser does not support CSS containment - consider polyfill');
        score -= 10;
    }

    // Check if will-change is supported
    if (!CSS.supports('will-change', 'transform')) {
        recommendations.push('Browser does not support will-change - transitions may be slower');
        score -= 5;
    }

    // Check memory usage if available
    const memory = (performance as any).memory;
    if (memory && memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        recommendations.push('High memory usage detected - consider clearing theme caches');
        score -= 15;
    }

    // Check for active animations
    const animatingElements = document.querySelectorAll('[style*="transition"]');
    if (animatingElements.length > 10) {
        recommendations.push('Many elements are animating - consider reducing transition complexity');
        score -= 10;
    }

    return { recommendations, score };
};

/**
 * Preload critical theme resources
 */
export const preloadCriticalThemeResources = async (): Promise<void> => {
    // In development, skip preloading to avoid noisy console errors and SSL-mismatch warnings
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    // Preload theme CSS if not already loaded
    const themeStylesheets = [
        '/styles/themes.css',
        '/styles/theme-transitions.css',
    ];

    const loadPromises = themeStylesheets.map(href => {
        return new Promise<void>((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load ${href}`));

            document.head.appendChild(link);
        });
    });

    try {
        await Promise.all(loadPromises);
    } catch (error) {
        console.warn('Failed to preload some theme resources:', error);
    }
};

/**
 * Initialize theme system optimizations
 */
export const initializeThemeOptimizations = (): void => {
    // Set up global CSS optimizations
    const style = document.createElement('style');
    style.textContent = `
    /* Global theme optimization styles */
    .theme-optimized {
      contain: layout style paint;
      will-change: background-color, color, border-color;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    .theme-optimized-card {
      contain: layout style;
      isolation: isolate;
    }
    
    .theme-optimized-button {
      contain: layout style paint;
      will-change: transform, background-color;
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .theme-optimized,
      .theme-optimized-card,
      .theme-optimized-button {
        transition: none !important;
        animation: none !important;
        will-change: auto !important;
      }
    }
  `;

    document.head.appendChild(style);

    // Preload critical resources
    preloadCriticalThemeResources().catch(console.warn);
};

/**
 * Clean up theme optimizations on unmount
 */
export const cleanupThemeOptimizations = (): void => {
    // Clear any pending timeouts
    if (themeChangeTimeout) {
        clearTimeout(themeChangeTimeout);
        themeChangeTimeout = null;
    }

    // Remove optimization styles
    const optimizationStyles = document.querySelectorAll('style[data-theme-optimization]');
    optimizationStyles.forEach(style => style.remove());
};

/**
 * Get theme optimization status
 */
export const getThemeOptimizationStatus = () => {
    return {
        flags: OPTIMIZATION_FLAGS,
        browserSupport: {
            cssContainment: CSS.supports('contain', 'layout'),
            willChange: CSS.supports('will-change', 'transform'),
            requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
        },
        performance: analyzeThemePerformance(),
    };
};
