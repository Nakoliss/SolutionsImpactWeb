'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BusinessType } from '@/lib/businessDesigns';
import { logContextError } from '@/lib/designErrorLogger';

interface Props {
    children: ReactNode;
    fallbackDesign?: BusinessType;
    showErrorDetails?: boolean;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
    fallbackApplied: boolean;
}

export class DesignErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            fallbackApplied: false,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            fallbackApplied: false,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error
        logContextError(
            `Design context error boundary caught error: ${error.message}`,
            {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                fallbackDesign: this.props.fallbackDesign,
            }
        );

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            fallbackApplied: true,
        });
    };

    handleResetToDefault = () => {
        // Reset to default design and clear error state
        this.setState({
            hasError: false,
            fallbackApplied: true,
        });

        // Redirect to home page to reset design context
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-8 w-8 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-white">
                                    Design Theme Error
                                </h3>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-slate-300">
                                There was an issue loading the design theme. This might be due to an invalid design parameter or a temporary issue.
                            </p>
                        </div>

                        {this.props.showErrorDetails && this.state.error && (
                            <div className="mb-4 p-3 bg-slate-700 rounded border border-slate-600">
                                <h4 className="text-sm font-medium text-red-400 mb-2">Error Details:</h4>
                                <p className="text-xs text-slate-400 font-mono break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={this.handleRetry}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={this.handleResetToDefault}
                                className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                            >
                                Reset to Default Theme
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-xs text-slate-500 text-center">
                                If this problem persists, please refresh the page or contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for wrapping components with error boundary
export function withDesignErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WithErrorBoundaryComponent = (props: P) => (
        <DesignErrorBoundary {...errorBoundaryProps}>
            <WrappedComponent {...props} />
        </DesignErrorBoundary>
    );

    WithErrorBoundaryComponent.displayName = `withDesignErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithErrorBoundaryComponent;
}

// Hook for handling design errors in functional components
export const useDesignErrorHandler = () => {
    const handleError = React.useCallback((error: Error, context?: Record<string, any>) => {
        logContextError(
            `Design error in component: ${error.message}`,
            { error: error.message, stack: error.stack, ...context }
        );
    }, []);

    return { handleError };
};