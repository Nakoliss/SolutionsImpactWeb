'use client';

import React, { Component } from 'react';
import Link from 'next/link';
import type { ErrorInfo, ReactNode } from 'react';

import { trackError } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enhanced Error Boundary with Sentry integration
 * Provides graceful error handling and reporting
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error in Sentry with context
    trackError(error, {
      component: 'ErrorBoundary',
      action: 'component_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Une erreur est survenue
            </h3>
            
            <p className="text-gray-600 mb-6">
              Nous sommes désolés, quelque chose s&apos;est mal passé. 
              L&apos;erreur a été signalée automatiquement.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Réessayer
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Recharger la page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Détails de l&apos;erreur (développement)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} {...(onError ? { onError } : {})}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

/**
 * Specialized error boundaries for different contexts
 */

// Page-level error boundary
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de page
          </h1>
          <p className="text-gray-600 mb-6">
            Cette page a rencontré une erreur inattendue. 
            Veuillez recharger la page ou revenir à l&apos;accueil.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Recharger la page
            </button>
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      trackError(error, {
        component: 'PageErrorBoundary',
        action: 'page_error',
        additionalData: {
          componentStack: errorInfo.componentStack,
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        },
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

// Component-level error boundary
export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode; 
  componentName?: string;
}> = ({ children, componentName = 'Unknown' }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Composant indisponible
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Le composant {componentName} a rencontré une erreur.
            </p>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      trackError(error, {
        component: componentName,
        action: 'component_error',
        additionalData: {
          componentStack: errorInfo.componentStack,
        },
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

// Form-specific error boundary
export const FormErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-800">
              Erreur de formulaire
            </h4>
            <p className="text-sm text-red-700 mt-1">
              Le formulaire a rencontré une erreur. Veuillez recharger la page.
            </p>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      trackError(error, {
        component: 'FormErrorBoundary',
        action: 'form_error',
        additionalData: {
          componentStack: errorInfo.componentStack,
        },
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;