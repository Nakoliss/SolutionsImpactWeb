'use client';

import React, { useState, useEffect } from 'react';
import { DesignError } from '@/lib/designValidation';
import { useDesignErrorHandling } from '@/hooks/useDesignErrorHandling';

interface DesignErrorNotificationProps {
    error?: DesignError;
    onDismiss?: () => void;
    onAction?: (action: string) => void;
    autoHide?: boolean;
    autoHideDelay?: number;
    position?: 'top' | 'bottom';
    showActions?: boolean;
}

export const DesignErrorNotification: React.FC<DesignErrorNotificationProps> = ({
    error,
    onDismiss,
    onAction,
    autoHide = true,
    autoHideDelay = 5000,
    position = 'top',
    showActions = true,
}) => {
    const [isVisible, setIsVisible] = useState(!!error);
    const [isAnimating, setIsAnimating] = useState(false);
    const { getAvailableActions, executeRecoveryAction } = useDesignErrorHandling();

    useEffect(() => {
        if (error) {
            setIsVisible(true);
            setIsAnimating(true);

            if (autoHide) {
                const timer = setTimeout(() => {
                    handleDismiss();
                }, autoHideDelay);

                return () => clearTimeout(timer);
            }
        }
    }, [error, autoHide, autoHideDelay]);

    const handleDismiss = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onDismiss?.();
        }, 300);
    };

    const handleAction = async (action: string) => {
        if (onAction) {
            onAction(action);
        } else {
            await executeRecoveryAction(action);
        }

        // Auto-dismiss after action
        if (action !== 'select') {
            handleDismiss();
        }
    };

    if (!isVisible || !error) {
        return null;
    }

    const availableActions = getAvailableActions();
    const positionClasses = position === 'top'
        ? 'top-4'
        : 'bottom-4';

    const getErrorIcon = () => {
        switch (error.type) {
            case 'INVALID_DESIGN_PARAMETER':
            case 'MISSING_DESIGN_CONTEXT':
                return (
                    <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );

            case 'THEME_APPLICATION_FAILURE':
            case 'CONTEXT_PROVIDER_ERROR':
                return (
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );

            default:
                return (
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getErrorTypeLabel = () => {
        switch (error.type) {
            case 'INVALID_DESIGN_PARAMETER':
                return 'Invalid Design';
            case 'MISSING_DESIGN_CONTEXT':
                return 'Missing Design';
            case 'THEME_APPLICATION_FAILURE':
                return 'Theme Error';
            case 'URL_PARSING_ERROR':
                return 'URL Error';
            case 'CONTEXT_PROVIDER_ERROR':
                return 'System Error';
            default:
                return 'Design Error';
        }
    };

    return (
        <div className={`fixed left-4 right-4 ${positionClasses} z-50 flex justify-center pointer-events-none`}>
            <div
                className={`
          max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg pointer-events-auto
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'}
        `}
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getErrorIcon()}
                        </div>

                        <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-white">
                                    {getErrorTypeLabel()}
                                </h3>

                                <button
                                    onClick={handleDismiss}
                                    className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="mt-1 text-sm text-slate-300">
                                {error.message}
                            </p>

                            {error.fallbackUsed && (
                                <p className="mt-1 text-xs text-slate-400">
                                    Using fallback: {error.fallbackUsed.replace('_', ' ').toLowerCase()}
                                </p>
                            )}
                        </div>
                    </div>

                    {showActions && availableActions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {availableActions.map((action) => (
                                <button
                                    key={action.action}
                                    onClick={() => handleAction(action.action)}
                                    className={`
                    px-3 py-1 text-xs font-medium rounded transition-colors
                    ${action.primary
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }
                  `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Hook for managing error notifications
export const useDesignErrorNotification = () => {
    const [currentError, setCurrentError] = useState<DesignError | undefined>();
    const [isVisible, setIsVisible] = useState(false);

    const showError = (error: DesignError) => {
        setCurrentError(error);
        setIsVisible(true);
    };

    const hideError = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentError(undefined);
        }, 300);
    };

    const NotificationComponent = (
        <DesignErrorNotification
            error={isVisible ? currentError : undefined}
            onDismiss={hideError}
        />
    );

    return {
        showError,
        hideError,
        currentError,
        isVisible,
        NotificationComponent,
    };
};