import { BusinessType } from './businessDesigns';

// Error types for design context
export enum DesignErrorType {
    INVALID_DESIGN_PARAMETER = 'INVALID_DESIGN_PARAMETER',
    MISSING_DESIGN_CONTEXT = 'MISSING_DESIGN_CONTEXT',
    THEME_APPLICATION_FAILURE = 'THEME_APPLICATION_FAILURE',
    URL_PARSING_ERROR = 'URL_PARSING_ERROR',
    CONTEXT_PROVIDER_ERROR = 'CONTEXT_PROVIDER_ERROR',
}

// Design error interface
export interface DesignError {
    type: DesignErrorType;
    message: string;
    originalValue?: string;
    fallbackUsed?: BusinessType;
    timestamp: Date;
    context?: Record<string, any>;
}

// Design validation result
export interface ValidationResult {
    isValid: boolean;
    value?: BusinessType;
    error?: DesignError;
}

// Validate if a string is a valid BusinessType
export const validateBusinessType = (value: string | null | undefined): ValidationResult => {
    // Handle null/undefined cases
    if (!value) {
        return {
            isValid: false,
            error: {
                type: DesignErrorType.MISSING_DESIGN_CONTEXT,
                message: 'Design parameter is missing or empty',
                originalValue: value || 'undefined',
                timestamp: new Date(),
            },
        };
    }

    // Check if value is a valid BusinessType
    if (Object.values(BusinessType).includes(value as BusinessType)) {
        return {
            isValid: true,
            value: value as BusinessType,
        };
    }

    // Invalid design parameter
    return {
        isValid: false,
        error: {
            type: DesignErrorType.INVALID_DESIGN_PARAMETER,
            message: `Invalid design parameter: ${value}. Must be one of: ${Object.values(BusinessType).join(', ')}`,
            originalValue: value,
            timestamp: new Date(),
        },
    };
};

// Validate design parameter with fallback
export const validateDesignWithFallback = (
    value: string | null | undefined,
    fallback: BusinessType = BusinessType.AI_AGENCY
): { design: BusinessType; error?: DesignError } => {
    const validation = validateBusinessType(value);

    if (validation.isValid && validation.value) {
        return { design: validation.value };
    }

    // Return fallback with error information
    const error: DesignError = {
        ...validation.error!,
        fallbackUsed: fallback,
    };

    return { design: fallback, error };
};

// Validate URL parameter specifically
export const validateURLDesignParameter = (url?: string): ValidationResult => {
    try {
        const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        if (!targetUrl) {
            return {
                isValid: false,
                error: {
                    type: DesignErrorType.URL_PARSING_ERROR,
                    message: 'No URL available for parsing design parameter',
                    timestamp: new Date(),
                },
            };
        }

        const urlObj = new URL(targetUrl);
        const designParam = urlObj.searchParams.get('design');

        return validateBusinessType(designParam);
    } catch (error) {
        return {
            isValid: false,
            error: {
                type: DesignErrorType.URL_PARSING_ERROR,
                message: `Failed to parse URL for design parameter: ${error instanceof Error ? error.message : 'Unknown error'}`,
                originalValue: url,
                timestamp: new Date(),
                context: { error: error instanceof Error ? error.stack : error },
            },
        };
    }
};

// Validate theme configuration
export const validateThemeConfig = (theme: any): ValidationResult => {
    const requiredProperties = [
        'primary', 'secondary', 'accent', 'background', 'surface',
        'gradient', 'text', 'border', 'muted', 'contrastText'
    ];

    if (!theme || typeof theme !== 'object') {
        return {
            isValid: false,
            error: {
                type: DesignErrorType.THEME_APPLICATION_FAILURE,
                message: 'Theme configuration is missing or invalid',
                timestamp: new Date(),
                context: { theme },
            },
        };
    }

    const missingProperties = requiredProperties.filter(prop => !theme[prop]);

    if (missingProperties.length > 0) {
        return {
            isValid: false,
            error: {
                type: DesignErrorType.THEME_APPLICATION_FAILURE,
                message: `Theme configuration is missing required properties: ${missingProperties.join(', ')}`,
                timestamp: new Date(),
                context: { theme, missingProperties },
            },
        };
    }

    return { isValid: true };
};

// Get all valid business types for validation
export const getValidBusinessTypes = (): BusinessType[] => {
    return Object.values(BusinessType);
};

// Check if design parameter exists in URL
export const hasValidDesignInURL = (url?: string): boolean => {
    const validation = validateURLDesignParameter(url);
    return validation.isValid;
};

// Sanitize design parameter (remove potentially harmful characters)
export const sanitizeDesignParameter = (value: string): string => {
    if (!value) return '';

    // Remove any characters that aren't alphanumeric, underscore, or hyphen
    return value.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
};

// Validate and sanitize design parameter
export const validateAndSanitizeDesign = (value: string | null | undefined): ValidationResult => {
    if (!value) {
        return validateBusinessType(value);
    }

    const sanitized = sanitizeDesignParameter(value);
    return validateBusinessType(sanitized);
};