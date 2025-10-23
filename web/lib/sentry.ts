/**
 * Sentry Error Tracking Configuration
 * Feature-flagged for production environments
 */

import * as Sentry from '@sentry/nextjs';
type SentryUser = { id?: string | number; email?: string };

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
const isSentryEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true';
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if explicitly enabled and DSN is provided
export const initSentry = () => {
  if (!isSentryEnabled || !sentryDsn) {
    if (isDevelopment) {
      console.log('[Sentry] Disabled - Set NEXT_PUBLIC_SENTRY_ENABLED=true and NEXT_PUBLIC_SENTRY_DSN to enable');
    }
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    
    // Adjust sampling rates for performance monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    
    // Session replay sampling
    replaysSessionSampleRate: isProduction ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Enhanced error tracking
    beforeSend(event, hint) {
      // Filter out development errors in production
      if (isProduction && hint.originalException) {
        const error = hint.originalException;
        
        // Skip common development/build errors
        if (
          typeof error === 'object' && 
          error !== null && 
          'message' in error && 
          typeof error.message === 'string'
        ) {
          const message = error.message.toLowerCase();
          if (
            message.includes('hydration') ||
            message.includes('webpack') ||
            message.includes('development') ||
            message.includes('hot reload')
          ) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // Environment and release information
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    
    // Additional context
    initialScope: {
      tags: {
        component: 'web-app',
        locale: 'fr-CA', // Default Quebec locale
        market: 'quebec'
      }
    },
    
    // Integration configuration
    integrations: [
      // Session Replay integration would go here when available
      // new Sentry.Replay({
      //   maskAllText: isProduction,
      //   blockAllMedia: true,
      // }),
    ],
    
    // Debug mode for development
    debug: isDevelopment,
    
    // Disable in development unless explicitly enabled
    enabled: isSentryEnabled && (isProduction || process.env.SENTRY_DEV_MODE === 'true'),
  });

  if (isDevelopment && isSentryEnabled) {
    console.log('[Sentry] Initialized in development mode');
  }
};

/**
 * Enhanced error tracking with context
 */
export const trackError = (
  error: Error,
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    locale?: string;
    additionalData?: Record<string, unknown>;
  }
) => {
  if (!isSentryEnabled) {
    // Fallback to console in development
    if (isDevelopment) {
      console.error('[Error Tracking]', error, context);
    }
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      if (context.component) scope.setTag('component', context.component);
      if (context.action) scope.setTag('action', context.action);
      if (context.userId) scope.setUser({ id: context.userId });
      if (context.locale) scope.setTag('locale', context.locale);
      if (context.additionalData) {
        Object.entries(context.additionalData).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
    }
    
    Sentry.captureException(error);
  });
};

/**
 * Track user interactions and business events
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean>,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  if (!isSentryEnabled) {
    if (isDevelopment) {
      console.log('[Event Tracking]', eventName, properties);
    }
    return;
  }

  Sentry.addBreadcrumb({
    message: eventName,
    level,
    data: properties ?? {},
    category: 'user-interaction',
    timestamp: Date.now() / 1000,
  });
};

/**
 * Track performance metrics
 */
export const trackPerformance = (
  metricName: string,
  value: number,
  unit: string = 'ms',
  tags?: Record<string, string>
) => {
  if (!isSentryEnabled) {
    if (isDevelopment) {
      console.log('[Performance]', metricName, value, unit, tags);
    }
    return;
  }

  // Metrics integration would be used here when available
  // Sentry.metrics.gauge(metricName, value, {
  //   unit,
  //   tags: {
  //     environment: process.env.NODE_ENV || 'unknown',
  //     ...tags,
  //   },
  // });
  
  // Fallback to breadcrumb tracking
  Sentry.addBreadcrumb({
    message: `Performance metric: ${metricName}`,
    data: { value, unit, ...(tags ?? {}) },
    category: 'performance',
    level: 'info'
  });
};

/**
 * Quebec-specific error tracking for compliance issues
 */
export const trackComplianceError = (
  error: Error,
  complianceType: 'loi-25' | 'pipeda' | 'gdpr' | 'ccpa',
  context?: {
    userLocale?: string;
    dataType?: string;
    action?: string;
  }
) => {
  trackError(error, {
    component: 'compliance',
    action: `${complianceType}_violation`,
    locale: context?.userLocale || 'fr-CA',
    additionalData: {
      complianceType,
      dataType: context?.dataType,
      complianceAction: context?.action,
      market: 'quebec',
    },
  });
};

/**
 * Track business-critical events
 */
export const trackBusinessEvent = (
  eventType: 'lead_generated' | 'quote_requested' | 'assessment_completed' | 'export_downloaded',
  properties?: Record<string, unknown>
) => {
  if (!isSentryEnabled) {
    if (isDevelopment) {
      console.log('[Business Event]', eventType, properties);
    }
    return;
  }

  Sentry.addBreadcrumb({
    message: `Business Event: ${eventType}`,
    level: 'info',
    data: properties ?? {},
    category: 'business',
    timestamp: Date.now() / 1000,
  });

  // Metrics integration would be used here when available
  // Sentry.metrics.increment('business_events', 1, {
  //   tags: {
  //     event_type: eventType,
  //     environment: process.env.NODE_ENV || 'unknown',
  //     market: 'quebec',
  //   },
  // });
};

/**
 * Set user context for better error tracking
 */
export const setUserContext = (user: {
  id?: string;
  email?: string;
  locale?: string;
  companySize?: string;
  sector?: string;
}) => {
  if (!isSentryEnabled) return;

  const sentryUser: SentryUser = {};
  if (user.id) {
    sentryUser.id = user.id;
  }
  if (user.email) {
    sentryUser.email = user.email;
  }
  Sentry.setUser(sentryUser);

  Sentry.setTags({
    user_locale: user.locale || 'fr-CA',
    company_size: user.companySize || 'unknown',
    business_sector: user.sector || 'unknown',
    market: 'quebec',
  });
};

/**
 * Error boundary integration
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Export Sentry for direct usage if needed
export { Sentry };

// Re-export useful Sentry functions
export const { 
  captureException, 
  captureMessage, 
  withScope
} = Sentry;

// Legacy functions - use alternatives
// configureScope is deprecated, use withScope instead
// startTransaction is deprecated, use startSpan instead