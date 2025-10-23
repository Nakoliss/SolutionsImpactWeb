'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { BusinessType } from '@/lib/businessDesigns';
import { useDesignContext } from '@/lib/designContext';
import { useDesignErrorHandling } from '@/hooks/useDesignErrorHandling';
import { DesignErrorNotification } from './DesignErrorNotification';
import { DesignErrorBoundary } from './DesignErrorBoundary';
import { DesignFallbackUI } from './DesignFallbackUI';

// Error recovery context
interface ErrorRecoveryContextType {
    hasError: boolean;
    isRecovering: boolean;
    userMessage?: string;
    attemptRecovery: () => Promise<void>;
    clearError: () => void;
}

const ErrorRecoveryContext = createContext<ErrorRecoveryContextType | undefined>(undefined);

interface DesignErrorRecoveryProviderProps {
    children: ReactNode;
    showNotifications?: boolean;
    showFallbackUI?: boolean;
    autoRecovery?: boolean;
}

export const DesignErrorRecoveryProvider: React.FC<DesignErrorRecoveryProviderProps> = ({
    children,
    showNotifications = true,
    showFallbackUI = true,
    autoRecovery = true,
}) => {
    const { currentDesign } = useDesignContext();
    const {
        hasError,
        currentError,
        isRecovering,
        userMessage,
        attemptRecovery,
        clearError,
        handleValidationError,
    } = useDesignErrorHandling(currentDesign);

    // Auto-recovery effect
    useEffect(() => {
        if (autoRecovery && hasError && !isRecovering) {
            const timer = setTimeout(() => {
                attemptRecovery();
            }, 1000); // Wait 1 second before auto-recovery

            return () => clearTimeout(timer);
        }
    }, [hasError, isRecovering, autoRecovery, attemptRecovery]);

    // Monitor design changes for validation
    useEffect(() => {
        if (currentDesign && !Object.values(BusinessType).includes(currentDesign)) {
            handleValidationError(currentDesign, BusinessType.AI_AGENCY);
        }
    }, [currentDesign, handleValidationError]);

    const contextValue: ErrorRecoveryContextType = {
        hasError,
        isRecovering,
        userMessage,
        attemptRecovery,
        clearError,
    };

    // If there's a critical error and fallback UI is enabled, show fallback
    if (hasError && showFallbackUI && currentError?.type === 'CONTEXT_PROVIDER_ERROR') {
        return (
            <DesignFallbackUI
                message={userMessage || 'A critical error occurred with the design system'}
                onDesignSelect={(design) => {
                    // Handle design selection and clear error
                    clearError();
                }}
            />
        );
    }

    return (
        <ErrorRecoveryContext.Provider value={contextValue}>
            <DesignErrorBoundary
                fallbackDesign={BusinessType.AI_AGENCY}
                onError={(error, errorInfo) => {
                    console.error('Design Error Boundary caught error:', error, errorInfo);
                }}
            >
                {children}

                {/* Error notification */}
                {showNotifications && currentError && (
                    <DesignErrorNotification
                        error={currentError}
                        onDismiss={clearError}
                        autoHide={!isRecovering}
                        autoHideDelay={isRecovering ? 0 : 5000}
                    />
                )}

                {/* Recovery loading indicator */}
                {isRecovering && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                <div>
                                    <h3 className="text-white font-medium">Recovering Design</h3>
                                    <p className="text-slate-300 text-sm">
                                        {userMessage || 'Attempting to restore the design theme...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DesignErrorBoundary>
        </ErrorRecoveryContext.Provider>
    );
};

// Hook for using error recovery context
export const useErrorRecovery = (): ErrorRecoveryContextType => {
    const context = useContext(ErrorRecoveryContext);

    if (context === undefined) {
        throw new Error('useErrorRecovery must be used within a DesignErrorRecoveryProvider');
    }

    return context;
};

// Higher-order component for wrapping pages with error recovery
export function withErrorRecovery<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: {
        showNotifications?: boolean;
        showFallbackUI?: boolean;
        autoRecovery?: boolean;
    }
) {
    const WithErrorRecoveryComponent = (props: P) => (
        <DesignErrorRecoveryProvider {...options}>
            <WrappedComponent {...props} />
        </DesignErrorRecoveryProvider>
    );

    WithErrorRecoveryComponent.displayName = `withErrorRecovery(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithErrorRecoveryComponent;
}