'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDesignContext } from './designContext';
import { buildRelativeURLWithDesign, setDesignInURL, getDesignFromURL } from './urlUtils';
import { BusinessType } from './businessDesigns';

// Navigation options interface
export interface NavigationOptions {
    preserveDesign?: boolean;
    newDesign?: BusinessType;
    replace?: boolean;
    scroll?: boolean;
}

// Design navigation hook interface
export interface UseDesignNavigationReturn {
    navigate: (href: string, options?: NavigationOptions) => void;
    getCurrentDesignParam: () => BusinessType | null;
    updateURLWithDesign: (design: BusinessType) => void;
    buildDesignAwareURL: (href: string, design?: BusinessType) => string;
    navigateWithDesign: (href: string, design: BusinessType, replace?: boolean) => void;
    navigatePreservingDesign: (href: string, replace?: boolean) => void;
}

/**
 * Custom hook for design-aware navigation
 * Handles navigation while preserving or updating design context
 */
export const useDesignNavigation = (): UseDesignNavigationReturn => {
    const router = useRouter();
    const { currentDesign, setCurrentDesign } = useDesignContext();

    /**
     * Get current design parameter from URL
     */
    const getCurrentDesignParam = useCallback((): BusinessType | null => {
        return getDesignFromURL();
    }, []);

    /**
     * Update current URL with design parameter
     */
    const updateURLWithDesign = useCallback((design: BusinessType): void => {
        setDesignInURL(design);
        setCurrentDesign(design);
    }, [setCurrentDesign]);

    /**
     * Build URL with design parameter
     */
    const buildDesignAwareURL = useCallback((href: string, design?: BusinessType): string => {
        const designToUse = design || currentDesign;
        return buildRelativeURLWithDesign(href, designToUse);
    }, [currentDesign]);

    /**
     * Navigate to a URL with specific design context
     */
    const navigateWithDesign = useCallback((
        href: string,
        design: BusinessType,
        replace: boolean = false
    ): void => {
        const urlWithDesign = buildRelativeURLWithDesign(href, design);

        // Update context state
        setCurrentDesign(design);

        // Navigate using Next.js router
        if (replace) {
            router.replace(urlWithDesign);
        } else {
            router.push(urlWithDesign);
        }
    }, [router, setCurrentDesign]);

    /**
     * Navigate while preserving current design context
     */
    const navigatePreservingDesign = useCallback((
        href: string,
        replace: boolean = false
    ): void => {
        navigateWithDesign(href, currentDesign, replace);
    }, [navigateWithDesign, currentDesign]);

    /**
     * Main navigation function with flexible options
     */
    const navigate = useCallback((href: string, options: NavigationOptions = {}): void => {
        const {
            preserveDesign = true,
            newDesign,
            replace = false,
            scroll = true
        } = options;

        let finalURL = href;
        let designToSet = currentDesign;

        // Determine which design to use
        if (newDesign) {
            designToSet = newDesign;
            finalURL = buildRelativeURLWithDesign(href, newDesign);
        } else if (preserveDesign) {
            finalURL = buildRelativeURLWithDesign(href, currentDesign);
        }

        // Update context state if design changed
        if (designToSet !== currentDesign) {
            setCurrentDesign(designToSet);
        }

        // Navigate using Next.js router
        const routerOptions = { scroll };

        if (replace) {
            router.replace(finalURL, routerOptions);
        } else {
            router.push(finalURL, routerOptions);
        }
    }, [router, currentDesign, setCurrentDesign, buildRelativeURLWithDesign]);

    return {
        navigate,
        getCurrentDesignParam,
        updateURLWithDesign,
        buildDesignAwareURL,
        navigateWithDesign,
        navigatePreservingDesign,
    };
};

/**
 * Hook for getting design-aware link URLs
 * Useful for Link components that need href with design context
 */
export const useDesignAwareLinks = () => {
    const { currentDesign } = useDesignContext();

    const getLinkWithDesign = useCallback((href: string, design?: BusinessType): string => {
        if (href.includes('#')) {
            return href;
        }
        const designToUse = design || currentDesign;
        return buildRelativeURLWithDesign(href, designToUse);
    }, [currentDesign]);

    const getCurrentDesignLinks = useCallback(() => {
        return {
            services: '/#services',
            packages: '/#home-packages',
            pricing: getLinkWithDesign('/pricing'),
            process: getLinkWithDesign('/process'),
            whyUs: getLinkWithDesign('/why-us'),
            contact: getLinkWithDesign('/contact'),
        };
    }, [getLinkWithDesign]);

    return {
        getLinkWithDesign,
        getCurrentDesignLinks,
        currentDesign,
    };
};

export default useDesignNavigation;
