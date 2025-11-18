import { hasConsent } from '@/lib/consent';

/**
 * Analytics tracking interface for various events
 * Supports multiple providers with pluggable architecture
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

export interface AnalyticsProvider {
  name: string;
  track: (event: AnalyticsEvent) => Promise<void> | void;
  identify?: (userId: string, traits?: Record<string, string | number | boolean>) => Promise<void> | void;
  page?: (name: string, properties?: Record<string, string | number | boolean>) => Promise<void> | void;
  initialize?: () => Promise<void> | void;
}

// Event types for type safety
export const ANALYTICS_EVENTS = {
  // Assessment events
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_STEP_COMPLETED: 'assessment_step_completed',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  ASSESSMENT_RESULTS_VIEWED: 'assessment_results_viewed',
  CONSULTATION_REQUESTED: 'consultation_requested',
  ASSESSMENT_RETAKEN: 'assessment_retaken',
  
  // Lead generation events
  LEAD_FORM_SUBMITTED: 'lead_form_submitted',
  LEAD_FORM_VIEWED: 'lead_form_viewed',
  DOWNLOAD_REQUESTED: 'download_requested',
  
  // Navigation events
  PAGE_VIEWED: 'page_viewed',
  LINK_CLICKED: 'link_clicked',
  CTA_CLICKED: 'cta_clicked',
  
  // Engagement events
  CONTENT_SHARED: 'content_shared',
  VIDEO_PLAYED: 'video_played',
  SECTION_VIEWED: 'section_viewed',

  // Booking + contact events
  BOOKING_VIEWED: 'view_booking',
  BOOKING_STARTED: 'start_booking',
  BOOKING_CONFIRMED: 'book_call',
  CONTACT_CALL_CLICKED: 'click_call',
  CONTACT_EMAIL_CLICKED: 'click_email',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  FORM_ERROR: 'form_error',
  
  // Chatbot events
  CHAT_CONSENT_GRANTED: 'chat_consent_granted',
  CHAT_LOADED: 'chat_loaded',
  CHAT_BOOKING_CLICK: 'chat_booking_click'
} as const;

// Console provider for development
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'console';
  
  track(event: AnalyticsEvent): void {
    console.log('📊 Analytics Event:', {
      event: event.name,
      properties: event.properties,
      timestamp: event.timestamp || new Date(),
      userId: event.userId,
      sessionId: event.sessionId
    });
  }
  
  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    console.log('👤 User Identified:', { userId, traits });
  }
  
  page(name: string, properties?: Record<string, string | number | boolean>): void {
    console.log('📄 Page View:', { page: name, properties });
  }
}

// Google Analytics 4 provider (placeholder implementation)
class GA4AnalyticsProvider implements AnalyticsProvider {
  name = 'ga4';
  
  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId,
        session_id: event.sessionId
      });
    }
  }
  
  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        user_id: userId,
        custom_map: traits
      });
    }
  }
  
  page(name: string, properties?: Record<string, string | number | boolean>): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: name,
        ...properties
      });
    }
  }
}

// Plausible Analytics provider (privacy-focused)
class PlausibleAnalyticsProvider implements AnalyticsProvider {
  name = 'plausible';
  
  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(event.name, event.properties ? {
        props: event.properties
      } : undefined);
    }
  }
  
  page(name: string, properties?: Record<string, string | number | boolean>): void {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        u: window.location.href,
        props: { page_title: name, ...properties }
      });
    }
  }
}

// Main analytics manager
class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupProviders();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupProviders(): void {
    // Always include console provider in development
    if (process.env.NODE_ENV === 'development') {
      this.providers.push(new ConsoleAnalyticsProvider());
    }

    // Add production providers based on environment variables
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.providers.push(new GA4AnalyticsProvider());
    }

    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      this.providers.push(new PlausibleAnalyticsProvider());
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    const analyticsAllowed = hasConsent('analytics');

    this.providers.forEach(provider => {
      if (!analyticsAllowed && provider.name !== 'console') {
        return;
      }
      if (provider.identify) {
        try {
          provider.identify(userId);
        } catch (error) {
          console.error(`Analytics identify error in ${provider.name}:`, error);
        }
      }
    });
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  track(eventName: string, properties?: Record<string, string | number | boolean | null | undefined>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      ...(properties && { properties }),
      ...(this.userId && { userId: this.userId }),
      sessionId: this.sessionId,
      timestamp: new Date()
    };

    const analyticsAllowed = hasConsent('analytics');

    this.providers.forEach(provider => {
      if (!analyticsAllowed && provider.name !== 'console') {
        return;
      }
      try {
        provider.track(event);
      } catch (error) {
        console.error(`Analytics error in ${provider.name}:`, error);
      }
    });
  }

  page(name: string, properties?: Record<string, string | number | boolean>): void {
    if (!this.isEnabled) return;

    const analyticsAllowed = hasConsent('analytics');

    this.providers.forEach(provider => {
      if (!analyticsAllowed && provider.name !== 'console') {
        return;
      }
      try {
        if (provider.page) {
          provider.page(name, properties);
        }
      } catch (error) {
        console.error(`Analytics page error in ${provider.name}:`, error);
      }
    });
  }

  // Convenience methods for common events
  trackAssessmentStarted(locale: string, source?: string): void {
    this.track(ANALYTICS_EVENTS.ASSESSMENT_STARTED, {
      locale,
      ...(source && { source }),
      page: '/assessment'
    });
  }

  trackAssessmentStepCompleted(step: number, questionId: string, locale: string): void {
    this.track(ANALYTICS_EVENTS.ASSESSMENT_STEP_COMPLETED, {
      step,
      question_id: questionId,
      locale,
      progress: `${step + 1}/4`
    });
  }

  trackAssessmentCompleted(result: {
    overallScore: number;
    readinessLevel: string;
    categoryScores: Record<string, number>;
  }, locale: string, timeSpent?: number): void {
    this.track(ANALYTICS_EVENTS.ASSESSMENT_COMPLETED, {
      overall_score: result.overallScore,
      readiness_level: result.readinessLevel,
      business_score: result.categoryScores.business,
      technical_score: result.categoryScores.technical,
      data_score: result.categoryScores.data,
      culture_score: result.categoryScores.culture,
      locale,
      time_spent_seconds: timeSpent
    });
  }

  trackAssessmentResultsViewed(result: {
    overallScore: number;
    readinessLevel: string;
  }, activeTab: string, locale: string): void {
    this.track(ANALYTICS_EVENTS.ASSESSMENT_RESULTS_VIEWED, {
      overall_score: result.overallScore,
      readiness_level: result.readinessLevel,
      active_tab: activeTab,
      locale
    });
  }

  trackConsultationRequested(source: string, result?: {
    overallScore: number;
    readinessLevel: string;
  }, locale?: string): void {
    this.track(ANALYTICS_EVENTS.CONSULTATION_REQUESTED, {
      source,
      overall_score: result?.overallScore,
      readiness_level: result?.readinessLevel,
      locale
    });
  }

  trackLeadFormSubmitted(formType: string, fields: string, locale: string): void {
    this.track(ANALYTICS_EVENTS.LEAD_FORM_SUBMITTED, {
      form_type: formType,
      fields_completed: fields,
      fields_count: fields.split(',').length,
      locale
    });
  }

  trackDownloadRequested(contentType: string, contentId: string, locale: string): void {
    this.track(ANALYTICS_EVENTS.DOWNLOAD_REQUESTED, {
      content_type: contentType,
      content_id: contentId,
      locale
    });
  }

  trackCTAClicked(ctaText: string, ctaLocation: string, locale: string): void {
    this.track(ANALYTICS_EVENTS.CTA_CLICKED, {
      cta_text: ctaText,
      cta_location: ctaLocation,
      locale
    });
  }

  trackBookingViewed(locale: string, surface: string): void {
    this.track(ANALYTICS_EVENTS.BOOKING_VIEWED, {
      locale,
      surface,
    });
  }

  trackBookingStarted(locale: string, surface: string): void {
    this.track(ANALYTICS_EVENTS.BOOKING_STARTED, {
      locale,
      surface,
    });
  }

  trackBookingConfirmed(locale: string, surface: string): void {
    this.track(ANALYTICS_EVENTS.BOOKING_CONFIRMED, {
      locale,
      surface,
    });
  }

  trackContactChannelClick(channel: 'call' | 'email', locale: string, surface: string): void {
    const eventName = channel === 'call'
      ? ANALYTICS_EVENTS.CONTACT_CALL_CLICKED
      : ANALYTICS_EVENTS.CONTACT_EMAIL_CLICKED;

    this.track(eventName, {
      locale,
      surface,
      channel,
    });
  }

  trackError(error: string, context?: Record<string, string | number | boolean>): void {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_message: error,
      ...context
    });
  }
}

// Global analytics instance
export const analytics = new AnalyticsManager();

// Hook for easy usage in React components
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    trackAssessmentStarted: analytics.trackAssessmentStarted.bind(analytics),
    trackAssessmentStepCompleted: analytics.trackAssessmentStepCompleted.bind(analytics),
    trackAssessmentCompleted: analytics.trackAssessmentCompleted.bind(analytics),
    trackAssessmentResultsViewed: analytics.trackAssessmentResultsViewed.bind(analytics),
    trackConsultationRequested: analytics.trackConsultationRequested.bind(analytics),
    trackLeadFormSubmitted: (formType: string, fields: string, locale: string) => 
      analytics.trackLeadFormSubmitted(formType, fields, locale),
    trackDownloadRequested: analytics.trackDownloadRequested.bind(analytics),
    trackCTAClicked: analytics.trackCTAClicked.bind(analytics),
    trackBookingViewed: analytics.trackBookingViewed.bind(analytics),
    trackBookingStarted: analytics.trackBookingStarted.bind(analytics),
    trackBookingConfirmed: analytics.trackBookingConfirmed.bind(analytics),
    trackContactChannelClick: analytics.trackContactChannelClick.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  };
}

// Type augmentation for window object
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown>; u?: string }) => void;
  }
}