import { BusinessType } from './businessDesigns';
import {
    validateBusinessType,
    validateURLDesignParameter,
    validateDesignWithFallback,
    sanitizeDesignParameter
} from './designValidation';
import { logURLError, logValidationError } from './designErrorLogger';

// Design parameter key for URL
const DESIGN_PARAM_KEY = 'design';

// Validate if a string is a valid BusinessType
export const isValidBusinessType = (value: string): value is BusinessType => {
    const validation = validateBusinessType(value);
    return validation.isValid;
};

// Get design parameter from current URL with validation and error handling
export const getDesignFromURL = (): BusinessType | null => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return null;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const designParam = urlParams.get(DESIGN_PARAM_KEY);

        if (!designParam) {
            return null;
        }

        // Sanitize the parameter
        const sanitized = sanitizeDesignParameter(designParam);
        const validation = validateBusinessType(sanitized);

        if (validation.isValid && validation.value) {
            return validation.value;
        }

        // Log validation error
        if (validation.error) {
            logValidationError(designParam);
        }

        return null;
    } catch (error) {
        logURLError(
            typeof window !== 'undefined' ? window.location.href : 'unknown',
            error instanceof Error ? error.message : 'Unknown error'
        );
        return null;
    }
};

// Set design parameter in current URL
export const setDesignInURL = (design: BusinessType): void => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set(DESIGN_PARAM_KEY, design);

        // Update URL without triggering a page reload
        window.history.replaceState({}, '', url.toString());
    } catch (error) {
        console.warn('Failed to set design in URL:', error);
    }
};

// Remove design parameter from current URL
export const removeDesignFromURL = (): void => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.delete(DESIGN_PARAM_KEY);

        // Update URL without triggering a page reload
        window.history.replaceState({}, '', url.toString());
    } catch (error) {
        console.warn('Failed to remove design from URL:', error);
    }
};

// Build URL with design parameter
export const buildURLWithDesign = (path: string, design: BusinessType): string => {
    try {
        // Handle relative paths
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = new URL(path, baseUrl);
        url.searchParams.set(DESIGN_PARAM_KEY, design);

        return url.toString();
    } catch (error) {
        console.warn('Failed to build URL with design:', error);
        // Fallback: append design parameter manually
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}${DESIGN_PARAM_KEY}=${design}`;
    }
};

// Build relative URL with design parameter (for Next.js navigation)
export const buildRelativeURLWithDesign = (path: string, design: BusinessType): string => {
    try {
        const url = new URL(path, 'http://localhost'); // Use dummy base for relative URLs
        url.searchParams.set(DESIGN_PARAM_KEY, design);

        // Return pathname + search without the origin
        return url.pathname + url.search;
    } catch (error) {
        console.warn('Failed to build relative URL with design:', error);
        // Fallback: append design parameter manually
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}${DESIGN_PARAM_KEY}=${design}`;
    }
};

// Get design parameter with fallback to default and error logging
export const getDesignFromURLWithFallback = (fallback: BusinessType = BusinessType.AI_AGENCY): BusinessType => {
    try {
        if (typeof window === 'undefined') {
            return fallback;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const designParam = urlParams.get(DESIGN_PARAM_KEY);

        const { design, error } = validateDesignWithFallback(designParam, fallback);

        if (error) {
            // Error is already logged by validateDesignWithFallback
            console.info(`Using fallback design: ${design} (original: ${designParam})`);
        }

        return design;
    } catch (error) {
        logURLError(
            window.location.href,
            `Failed to get design with fallback: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        return fallback;
    }
};

// Update URL with design parameter and manage browser history
export const updateURLWithDesignHistory = (design: BusinessType, pushState: boolean = false): void => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set(DESIGN_PARAM_KEY, design);

        if (pushState) {
            // Add new entry to browser history
            window.history.pushState({}, '', url.toString());
        } else {
            // Replace current entry in browser history
            window.history.replaceState({}, '', url.toString());
        }
    } catch (error) {
        console.warn('Failed to update URL with design history:', error);
    }
};

// Check if current URL has design parameter
export const hasDesignInURL = (): boolean => {
    return getDesignFromURL() !== null;
};

// Get all URL parameters as an object
export const getAllURLParams = (): Record<string, string> => {
    try {
        if (typeof window === 'undefined') {
            return {};
        }

        const params: Record<string, string> = {};
        const urlParams = new URLSearchParams(window.location.search);

        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    } catch (error) {
        console.warn('Failed to get URL parameters:', error);
        return {};
    }
};

// Preserve existing URL parameters while adding/updating design
export const preserveURLParamsWithDesign = (design: BusinessType): string => {
    try {
        if (typeof window === 'undefined') {
            return `?${DESIGN_PARAM_KEY}=${design}`;
        }

        const url = new URL(window.location.href);
        url.searchParams.set(DESIGN_PARAM_KEY, design);

        return url.search;
    } catch (error) {
        console.warn('Failed to preserve URL params with design:', error);
        return `?${DESIGN_PARAM_KEY}=${design}`;
    }
};