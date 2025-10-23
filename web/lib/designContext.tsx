'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessType, BusinessDesignTheme, BusinessDesignConfig, getDesignConfig, getDesignTheme } from './businessDesigns';
import { applyGlobalTheme, createThemeStyleObject } from './themeUtils';
import { applyGlobalThemeOptimized, preloadThemeResources } from './themePerformance';
import { initializeThemeOptimizations, cleanupThemeOptimizations } from './themeOptimizations';
import { validateBusinessType, validateThemeConfig } from './designValidation';
import { logThemeError, logContextError, logValidationError } from './designErrorLogger';
import { recoverDesignContext, backupDesignContext, RecoveryStrategy } from './designRecovery';

// Enhanced theme configuration interface
export interface ThemeConfig extends BusinessDesignTheme {
    hoverEffects: {
        shadow: string;
        borderColor: string;
        transform: string;
    };
    buttonStyles: {
        primary: string;
        secondary: string;
        hover: string;
    };
}

// Design context type interface
export interface DesignContextType {
    currentDesign: BusinessType;
    setCurrentDesign: (design: BusinessType) => void;
    getDesignConfig: () => BusinessDesignConfig;
    getDesignTheme: () => ThemeConfig;
    applyTheme: () => void;
    getThemeStyleObject: () => React.CSSProperties;
}

// Create the context
const DesignContext = createContext<DesignContextType | undefined>(undefined);

// Provider props interface
interface DesignContextProviderProps {
    children: ReactNode;
    initialDesign?: BusinessType;
}

// Enhanced theme configuration generator
const createThemeConfig = (baseTheme: BusinessDesignTheme): ThemeConfig => {
    return {
        ...baseTheme,
        hoverEffects: {
            shadow: `0 10px 25px -3px ${baseTheme.accent}20, 0 4px 6px -2px ${baseTheme.accent}10`,
            borderColor: `${baseTheme.accent}60`,
            transform: 'translateY(-2px)',
        },
        buttonStyles: {
            primary: `background: ${baseTheme.gradient}; color: ${baseTheme.contrastText}; border: 1px solid ${baseTheme.accent}40`,
            secondary: `background: transparent; color: ${baseTheme.accent}; border: 1px solid ${baseTheme.accent}60`,
            hover: `filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 12px ${baseTheme.accent}30`,
        },
    };
};

// Design Context Provider component
export const DesignContextProvider: React.FC<DesignContextProviderProps> = ({
    children,
    initialDesign = BusinessType.AI_AGENCY,
}) => {
    // Validate initial design
    const validatedInitialDesign = (() => {
        const validation = validateBusinessType(initialDesign);
        if (validation.isValid && validation.value) {
            return validation.value;
        }
        logValidationError(initialDesign, BusinessType.AI_AGENCY);
        return BusinessType.AI_AGENCY;
    })();

    const [currentDesign, setCurrentDesign] = useState<BusinessType>(validatedInitialDesign);

    // Safe design setter with validation
    const setCurrentDesignSafe = (design: BusinessType): void => {
        try {
            const validation = validateBusinessType(design);
            if (validation.isValid && validation.value) {
                setCurrentDesign(validation.value);
            } else {
                logValidationError(design, currentDesign);
                // Don't change the design if validation fails
            }
        } catch (error) {
            logContextError(
                `Failed to set design to ${design}`,
                { error: error instanceof Error ? error.message : error, currentDesign }
            );
        }
    };

    // Apply theme when design changes and backup design (optimized)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Use optimized theme application for better performance
                applyGlobalThemeOptimized(currentDesign);
                backupDesignContext(currentDesign);
            } catch (error) {
                logThemeError(
                    `Failed to apply theme or backup design: ${currentDesign}`,
                    currentDesign,
                    { error: error instanceof Error ? error.message : error }
                );

                // Attempt recovery with fallback to non-optimized version
                recoverDesignContext(currentDesign, [
                    RecoveryStrategy.LOCAL_STORAGE,
                    RecoveryStrategy.DEFAULT_DESIGN
                ]).then((recovery) => {
                    if (recovery.success && recovery.design !== currentDesign) {
                        setCurrentDesign(recovery.design);
                    }
                }).catch(() => {
                    // Fallback to standard theme application
                    applyGlobalTheme(currentDesign);
                });
            }
        }
    }, [currentDesign]);

    // Initialize theme optimizations and preload resources on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize global theme optimizations
            initializeThemeOptimizations();

            // Preload all theme resources
            const allBusinessTypes = Object.values(BusinessType);
            preloadThemeResources(allBusinessTypes);

            // Cleanup on unmount
            return () => {
                cleanupThemeOptimizations();
            };
        }
    }, []);

    // Get design configuration with error handling
    const getDesignConfigValue = (): BusinessDesignConfig => {
        try {
            const validation = validateBusinessType(currentDesign);
            if (!validation.isValid) {
                logValidationError(currentDesign, BusinessType.AI_AGENCY);
                return getDesignConfig(BusinessType.AI_AGENCY);
            }
            return getDesignConfig(currentDesign);
        } catch (error) {
            logThemeError(
                `Failed to get design config for ${currentDesign}`,
                currentDesign,
                { error: error instanceof Error ? error.message : error }
            );
            return getDesignConfig(BusinessType.AI_AGENCY);
        }
    };

    // Get enhanced theme configuration with error handling
    const getDesignThemeValue = (): ThemeConfig => {
        try {
            const baseTheme = getDesignTheme(currentDesign);

            // Validate theme configuration
            const themeValidation = validateThemeConfig(baseTheme);
            if (!themeValidation.isValid) {
                logThemeError(
                    `Invalid theme configuration for ${currentDesign}`,
                    currentDesign,
                    { validationError: themeValidation.error }
                );
                // Fallback to AI_AGENCY theme
                const fallbackTheme = getDesignTheme(BusinessType.AI_AGENCY);
                return createThemeConfig(fallbackTheme);
            }

            return createThemeConfig(baseTheme);
        } catch (error) {
            logThemeError(
                `Failed to get design theme for ${currentDesign}`,
                currentDesign,
                { error: error instanceof Error ? error.message : error }
            );
            // Fallback to AI_AGENCY theme
            const fallbackTheme = getDesignTheme(BusinessType.AI_AGENCY);
            return createThemeConfig(fallbackTheme);
        }
    };

    // Apply theme manually with error handling
    const applyTheme = (): void => {
        try {
            if (typeof window !== 'undefined') {
                applyGlobalTheme(currentDesign);
            }
        } catch (error) {
            logThemeError(
                `Failed to apply theme for ${currentDesign}`,
                currentDesign,
                { error: error instanceof Error ? error.message : error }
            );
            // Try to apply fallback theme
            try {
                if (typeof window !== 'undefined') {
                    applyGlobalTheme(BusinessType.AI_AGENCY);
                }
            } catch (fallbackError) {
                logThemeError(
                    'Failed to apply fallback theme',
                    BusinessType.AI_AGENCY,
                    { error: fallbackError instanceof Error ? fallbackError.message : fallbackError }
                );
            }
        }
    };

    // Get theme style object for React components with error handling
    const getThemeStyleObject = (): React.CSSProperties => {
        try {
            return createThemeStyleObject(currentDesign);
        } catch (error) {
            logThemeError(
                `Failed to create theme style object for ${currentDesign}`,
                currentDesign,
                { error: error instanceof Error ? error.message : error }
            );
            // Return fallback style object
            try {
                return createThemeStyleObject(BusinessType.AI_AGENCY);
            } catch (fallbackError) {
                logThemeError(
                    'Failed to create fallback theme style object',
                    BusinessType.AI_AGENCY,
                    { error: fallbackError instanceof Error ? fallbackError.message : fallbackError }
                );
                // Return minimal safe styles
                return {
                    '--theme-primary': '#2563eb',
                    '--theme-accent': '#38bdf8',
                    '--theme-background': '#020617',
                    '--theme-text': '#f8fafc',
                } as React.CSSProperties;
            }
        }
    };

    // Context value
    const contextValue: DesignContextType = {
        currentDesign,
        setCurrentDesign: setCurrentDesignSafe,
        getDesignConfig: getDesignConfigValue,
        getDesignTheme: getDesignThemeValue,
        applyTheme,
        getThemeStyleObject,
    };

    return (
        <DesignContext.Provider value={contextValue}>
            {children}
        </DesignContext.Provider>
    );
};

// Custom hook for consuming design context with error handling
export const useDesignContext = (): DesignContextType => {
    const context = useContext(DesignContext);

    if (context === undefined) {
        logContextError(
            'useDesignContext called outside of DesignContextProvider',
            { fallbackUsed: true }
        );

        // Return a fallback context instead of throwing
        return {
            currentDesign: BusinessType.AI_AGENCY,
            setCurrentDesign: () => {
                console.warn('setCurrentDesign called outside of DesignContextProvider');
            },
            getDesignConfig: () => getDesignConfig(BusinessType.AI_AGENCY),
            getDesignTheme: () => createThemeConfig(getDesignTheme(BusinessType.AI_AGENCY)),
            applyTheme: () => {
                console.warn('applyTheme called outside of DesignContextProvider');
            },
            getThemeStyleObject: () => createThemeStyleObject(BusinessType.AI_AGENCY),
        };
    }

    return context;
};

// Helper hook for getting current theme
export const useDesignTheme = (): ThemeConfig => {
    const { getDesignTheme } = useDesignContext();
    return getDesignTheme();
};

// Helper hook for getting current design config
export const useDesignConfig = (): BusinessDesignConfig => {
    const { getDesignConfig } = useDesignContext();
    return getDesignConfig();
};
// Helper hook for applying theme to specific elements
export const useThemeApplication = () => {
    const { currentDesign, applyTheme, getThemeStyleObject } = useDesignContext();

    return {
        currentDesign,
        applyTheme,
        getThemeStyleObject,
        themeClassName: `theme-${currentDesign.toLowerCase().replace('_', '-')}`,
    };
};

// Helper hook for theme-aware styling
export const useThemeStyles = () => {
    const { getThemeStyleObject, getDesignTheme } = useDesignContext();
    const theme = getDesignTheme();

    return {
        themeStyles: getThemeStyleObject(),
        theme,
        // Common style patterns
        cardStyle: {
            background: `var(--theme-card-background)`,
            border: `1px solid var(--theme-card-border)`,
            color: `var(--theme-text)`,
        },
        buttonPrimaryStyle: {
            background: `var(--theme-button-primary)`,
            color: `var(--theme-contrast-text)`,
            border: `1px solid var(--theme-accent)`,
        },
        buttonSecondaryStyle: {
            background: `var(--theme-button-secondary)`,
            color: `var(--theme-accent)`,
            border: `1px solid var(--theme-border-hover)`,
        },
        linkStyle: {
            color: `var(--theme-link-color)`,
        },
        gradientStyle: {
            background: `var(--theme-gradient)`,
        },
    };
};