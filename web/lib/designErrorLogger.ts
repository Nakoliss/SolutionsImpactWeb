import { DesignError, DesignErrorType } from './designValidation';
import { BusinessType } from './businessDesigns';

// Error logging configuration
interface LoggingConfig {
    enableConsoleLogging: boolean;
    enableLocalStorage: boolean;
    maxStoredErrors: number;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
}

// Default logging configuration
const DEFAULT_CONFIG: LoggingConfig = {
    enableConsoleLogging: true,
    enableLocalStorage: true,
    maxStoredErrors: 50,
    logLevel: 'warn',
};

// Local storage key for design errors
const DESIGN_ERRORS_STORAGE_KEY = 'design_context_errors';

// Error statistics
interface ErrorStats {
    totalErrors: number;
    errorsByType: Record<DesignErrorType, number>;
    lastError?: DesignError;
    firstError?: DesignError;
}

class DesignErrorLogger {
    private config: LoggingConfig;
    private errors: DesignError[] = [];

    constructor(config: Partial<LoggingConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.loadStoredErrors();
    }

    // Log a design error
    logError(error: DesignError): void {
        // Add to internal array
        this.errors.push(error);

        // Console logging
        if (this.config.enableConsoleLogging) {
            this.logToConsole(error);
        }

        // Local storage logging
        if (this.config.enableLocalStorage && typeof window !== 'undefined') {
            this.saveToLocalStorage();
        }

        // Cleanup old errors
        this.cleanupOldErrors();
    }

    // Log error with context
    logErrorWithContext(
        type: DesignErrorType,
        message: string,
        context?: Record<string, any>
    ): DesignError {
        const error: DesignError = {
            type,
            message,
            timestamp: new Date(),
            context,
        };

        this.logError(error);
        return error;
    }

    // Log design parameter validation error
    logValidationError(
        originalValue: string | null | undefined,
        fallbackUsed?: BusinessType
    ): DesignError {
        const error: DesignError = {
            type: DesignErrorType.INVALID_DESIGN_PARAMETER,
            message: `Invalid design parameter "${originalValue}", using fallback: ${fallbackUsed}`,
            originalValue: originalValue || 'undefined',
            fallbackUsed,
            timestamp: new Date(),
        };

        this.logError(error);
        return error;
    }

    // Log theme application error
    logThemeError(
        message: string,
        design: BusinessType,
        context?: Record<string, any>
    ): DesignError {
        const error: DesignError = {
            type: DesignErrorType.THEME_APPLICATION_FAILURE,
            message,
            timestamp: new Date(),
            context: { design, ...context },
        };

        this.logError(error);
        return error;
    }

    // Log URL parsing error
    logURLError(url: string, errorMessage: string): DesignError {
        const error: DesignError = {
            type: DesignErrorType.URL_PARSING_ERROR,
            message: `URL parsing failed: ${errorMessage}`,
            originalValue: url,
            timestamp: new Date(),
        };

        this.logError(error);
        return error;
    }

    // Log context provider error
    logContextError(message: string, context?: Record<string, any>): DesignError {
        const error: DesignError = {
            type: DesignErrorType.CONTEXT_PROVIDER_ERROR,
            message,
            timestamp: new Date(),
            context,
        };

        this.logError(error);
        return error;
    }

    // Get error statistics
    getErrorStats(): ErrorStats {
        const errorsByType = Object.values(DesignErrorType).reduce((acc, type) => {
            acc[type] = this.errors.filter(error => error.type === type).length;
            return acc;
        }, {} as Record<DesignErrorType, number>);

        return {
            totalErrors: this.errors.length,
            errorsByType,
            lastError: this.errors[this.errors.length - 1],
            firstError: this.errors[0],
        };
    }

    // Get recent errors
    getRecentErrors(count: number = 10): DesignError[] {
        return this.errors.slice(-count);
    }

    // Get errors by type
    getErrorsByType(type: DesignErrorType): DesignError[] {
        return this.errors.filter(error => error.type === type);
    }

    // Clear all errors
    clearErrors(): void {
        this.errors = [];
        if (typeof window !== 'undefined') {
            localStorage.removeItem(DESIGN_ERRORS_STORAGE_KEY);
        }
    }

    // Export errors for debugging
    exportErrors(): string {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            stats: this.getErrorStats(),
            errors: this.errors,
        }, null, 2);
    }

    // Private methods
    private logToConsole(error: DesignError): void {
        const logMethod = this.getConsoleMethod(error.type);
        const prefix = `[DesignContext ${error.type}]`;

        logMethod(`${prefix} ${error.message}`, {
            timestamp: error.timestamp,
            originalValue: error.originalValue,
            fallbackUsed: error.fallbackUsed,
            context: error.context,
        });
    }

    private getConsoleMethod(errorType: DesignErrorType): typeof console.error {
        switch (errorType) {
            case DesignErrorType.THEME_APPLICATION_FAILURE:
            case DesignErrorType.CONTEXT_PROVIDER_ERROR:
                return console.error;
            case DesignErrorType.INVALID_DESIGN_PARAMETER:
            case DesignErrorType.URL_PARSING_ERROR:
                return console.warn;
            case DesignErrorType.MISSING_DESIGN_CONTEXT:
                return console.info;
            default:
                return console.log;
        }
    }

    private saveToLocalStorage(): void {
        try {
            const errorsToStore = this.errors.slice(-this.config.maxStoredErrors);
            localStorage.setItem(DESIGN_ERRORS_STORAGE_KEY, JSON.stringify(errorsToStore));
        } catch (error) {
            console.warn('Failed to save design errors to localStorage:', error);
        }
    }

    private loadStoredErrors(): void {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(DESIGN_ERRORS_STORAGE_KEY);
            if (stored) {
                const parsedErrors = JSON.parse(stored);
                if (Array.isArray(parsedErrors)) {
                    this.errors = parsedErrors.map(error => ({
                        ...error,
                        timestamp: new Date(error.timestamp),
                    }));
                }
            }
        } catch (error) {
            console.warn('Failed to load stored design errors:', error);
        }
    }

    private cleanupOldErrors(): void {
        if (this.errors.length > this.config.maxStoredErrors) {
            this.errors = this.errors.slice(-this.config.maxStoredErrors);
        }
    }
}

// Create singleton instance
export const designErrorLogger = new DesignErrorLogger();

// Convenience functions
export const logDesignError = (error: DesignError): void => {
    designErrorLogger.logError(error);
};

export const logValidationError = (
    originalValue: string | null | undefined,
    fallbackUsed?: BusinessType
): DesignError => {
    return designErrorLogger.logValidationError(originalValue, fallbackUsed);
};

export const logThemeError = (
    message: string,
    design: BusinessType,
    context?: Record<string, any>
): DesignError => {
    return designErrorLogger.logThemeError(message, design, context);
};

export const logURLError = (url: string, errorMessage: string): DesignError => {
    return designErrorLogger.logURLError(url, errorMessage);
};

export const logContextError = (message: string, context?: Record<string, any>): DesignError => {
    return designErrorLogger.logContextError(message, context);
};

export const getDesignErrorStats = (): ErrorStats => {
    return designErrorLogger.getErrorStats();
};

export const clearDesignErrors = (): void => {
    designErrorLogger.clearErrors();
};

export const exportDesignErrors = (): string => {
    return designErrorLogger.exportErrors();
};