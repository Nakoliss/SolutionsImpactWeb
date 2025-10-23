'use client';

import { useState, useCallback, useEffect } from 'react';
import { BusinessType } from '@/lib/businessDesigns';
import {
    DesignError,
    DesignErrorType,
    validateBusinessType
} from '@/lib/designValidation';
import {
    designErrorLogger,
    getDesignErrorStats,
    logValidationError,
    logThemeError,
    logContextError
} from '@/lib/designErrorLogger';
import {
    recoverDesignContext,
    RecoveryStrategy,
    RecoveryResult
} from '@/lib/designRecovery';

// Error handling state
interface ErrorHandlingState {
    hasError: boolean;
    currentError?: DesignError;
    isRecovering: boolean;
    recoveryAttempts: number;
    lastRecoveryResult?: RecoveryResult;
    userMessage?: string;
}

// User-friendly error messages
const getUserFriendlyMessage = (error: DesignError): string => {
    switch (error.type) {
        case DesignErrorType.INVALID_DESIGN_PARAMETER:
            return "The design theme you selected isn't available. We've switched to a default theme.";

        case DesignErrorType.MISSING_DESIGN_CONTEXT:
            return "No design theme was selected. Please choose a theme to continue.";

        case DesignErrorType.THEME_APPLICATION_FAILURE:
            return "There was a problem applying the design theme. We're using a backup theme instead.";

        case DesignErrorType.URL_PARSING_ERROR:
            return "There was an issue with the page URL. The design theme has been reset.";

        case DesignErrorType.CONTEXT_PROVIDER_ERROR:
            return "A technical issue occurred with the design system. Please refresh the page.";

        default:
            return "An unexpected issue occurred with the design theme. We've applied a default theme.";
    }
};

// Recovery action suggestions
const getRecoveryActions = (error: DesignError): Array<{
    label: string;
    action: string;
    primary?: boolean;
}> => {
    const baseActions = [
        { label: 'Refresh Page', action: 'refresh' },
        { label: 'Go to Home', action: 'home' },
    ];

    switch (error.type) {
        case DesignErrorType.INVALID_DESIGN_PARAMETER:
        case DesignErrorType.MISSING_DESIGN_CONTEXT:
            return [
                { label: 'Choose Design', action: 'select', primary: true },
                ...baseActions,
            ];

        case DesignErrorType.THEME_APPLICATION_FAILURE:
            return [
                { label: 'Try Again', action: 'retry', primary: true },
                { label: 'Use Default Theme', action: 'default' },
                ...baseActions,
            ];

        case DesignErrorType.URL_PARSING_ERROR:
            return [
                { label: 'Clear URL', action: 'clearUrl', primary: true },
                ...baseActions,
            ];

        default:
            return [
                { label: 'Try Again', action: 'retry', primary: true },
                ...baseActions,
            ];
    }
};

export const useDesignErrorHandling = (currentDesign?: BusinessType) => {
    const [state, setState] = useState<ErrorHandlingState>({
        hasError: false,
        isRecovering: false,
        recoveryAttempts: 0,
    });

    // Handle design errors
    const handleError = useCallback((error: DesignError) => {
        const userMessage = getUserFriendlyMessage(error);

        setState(prev => ({
            ...prev,
            hasError: true,
            currentError: error,
            userMessage,
        }));

        // Log the error
        designErrorLogger.logError(error);
    }, []);

    // Handle validation errors
    const handleValidationError = useCallback((
        value: string | null | undefined,
        fallback?: BusinessType
    ) => {
        const error = logValidationError(value, fallback);
        handleError(error);
        return error;
    }, [handleError]);

    // Handle theme errors
    const handleThemeError = useCallback((
        message: string,
        design: BusinessType,
        context?: Record<string, any>
    ) => {
        const error = logThemeError(message, design, context);
        handleError(error);
        return error;
    }, [handleError]);

    // Handle context errors
    const handleContextError = useCallback((
        message: string,
        context?: Record<string, any>
    ) => {
        const error = logContextError(message, context);
        handleError(error);
        return error;
    }, [handleError]);

    // Attempt recovery
    const attemptRecovery = useCallback(async (
        strategies?: RecoveryStrategy[]
    ): Promise<RecoveryResult> => {
        setState(prev => ({
            ...prev,
            isRecovering: true,
            recoveryAttempts: prev.recoveryAttempts + 1,
        }));

        try {
            const result = await recoverDesignContext(currentDesign, strategies);

            setState(prev => ({
                ...prev,
                isRecovering: false,
                lastRecoveryResult: result,
                hasError: !result.success,
                userMessage: result.success
                    ? 'Design theme has been recovered successfully.'
                    : 'Unable to recover design theme. Using default theme.',
            }));

            return result;
        } catch (error) {
            const contextError = logContextError(
                'Recovery attempt failed',
                { error: error instanceof Error ? error.message : error, currentDesign }
            );

            setState(prev => ({
                ...prev,
                isRecovering: false,
                currentError: contextError,
                userMessage: 'Recovery failed. Please try refreshing the page.',
            }));

            return {
                success: false,
                design: BusinessType.AI_AGENCY,
                strategy: RecoveryStrategy.DEFAULT_DESIGN,
                message: 'Recovery attempt failed',
            };
        }
    }, [currentDesign]);

    // Execute recovery action
    const executeRecoveryAction = useCallback(async (action: string) => {
        switch (action) {
            case 'retry':
                return attemptRecovery();

            case 'default':
                return attemptRecovery([RecoveryStrategy.DEFAULT_DESIGN]);

            case 'select':
                setState(prev => ({
                    ...prev,
                    userMessage: 'Please select a design theme to continue.',
                }));
                break;

            case 'clearUrl':
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('design');
                    window.history.replaceState({}, '', url.toString());
                }
                return attemptRecovery([RecoveryStrategy.DEFAULT_DESIGN]);

            case 'refresh':
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
                break;

            case 'home':
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
                break;

            default:
                console.warn(`Unknown recovery action: ${action}`);
        }
    }, [attemptRecovery]);

    // Clear error state
    const clearError = useCallback(() => {
        setState({
            hasError: false,
            isRecovering: false,
            recoveryAttempts: 0,
        });
    }, []);

    // Get recovery actions for current error
    const getAvailableActions = useCallback(() => {
        if (!state.currentError) return [];
        return getRecoveryActions(state.currentError);
    }, [state.currentError]);

    // Auto-recovery on mount if needed
    useEffect(() => {
        if (currentDesign) {
            const validation = validateBusinessType(currentDesign);
            if (!validation.isValid && validation.error) {
                handleError(validation.error);
                // Attempt automatic recovery
                attemptRecovery([
                    RecoveryStrategy.URL_FALLBACK,
                    RecoveryStrategy.LOCAL_STORAGE,
                    RecoveryStrategy.DEFAULT_DESIGN,
                ]);
            }
        }
    }, [currentDesign, handleError, attemptRecovery]);

    // Get error statistics
    const getErrorStats = useCallback(() => {
        return getDesignErrorStats();
    }, []);

    return {
        // State
        hasError: state.hasError,
        currentError: state.currentError,
        isRecovering: state.isRecovering,
        recoveryAttempts: state.recoveryAttempts,
        lastRecoveryResult: state.lastRecoveryResult,
        userMessage: state.userMessage,

        // Error handlers
        handleError,
        handleValidationError,
        handleThemeError,
        handleContextError,

        // Recovery
        attemptRecovery,
        executeRecoveryAction,
        clearError,

        // Utilities
        getAvailableActions,
        getErrorStats,
    };
};