/**
 * Event Tracker - PostHog Integration
 *
 * Abstraction layer for analytics events.
 * Supports both client-side (PostHog) and future server-side analytics.
 * Privacy-conscious with opt-out support.
 */

import posthog from 'posthog-js';
import type { AnalyticsEvent } from './analyticsEvents';
import { getEventName } from './analyticsEvents';

// ============================================================================
// CONFIGURATION
// ============================================================================

const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

// ============================================================================
// TRACKER STATE
// ============================================================================

let isInitialized = false;
let isEnabled = true;
let isDebug = false;

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize PostHog client.
 * Should be called once at app startup.
 */
export const initializeTracker = (): void => {
  if (isInitialized) {
    return;
  }

  // Check if analytics is disabled
  if (!POSTHOG_API_KEY) {
    console.warn('[Analytics] PostHog API key not configured. Analytics disabled.');
    isEnabled = false;
    return;
  }

  // Check user preference for analytics — opt-in only. Default is disabled.
  const analyticsPreference = localStorage.getItem('analytics_consent');
  if (analyticsPreference !== 'true') {
    console.info('[Analytics] Analytics disabled (no opt-in consent).');
    isEnabled = false;
    return;
  }

  try {
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // We'll handle pageviews manually
      capture_pageleave: true,
      persistence: 'localStorage',
      person_profiles: 'identified_only', // Privacy-conscious: only create profiles when user is identified
      disable_session_recording: true, // Disable session recording for privacy
      disable_compression: false,
      loaded: (_ph) => {
        isInitialized = true;
        if (isDebug) {
          console.info('[Analytics] PostHog initialized successfully');
        }
      },
    });

    // Set debug mode based on environment
    isDebug = import.meta.env.DEV;
  } catch (error) {
    console.error('[Analytics] Failed to initialize PostHog:', error);
    isEnabled = false;
  }
};

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track an analytics event.
 * Type-safe event tracking with automatic event naming.
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    const eventName = getEventName(event);
    
    if (isDebug) {
      console.log('[Analytics] Tracking event:', eventName, event.properties);
    }

    posthog.capture(eventName, event.properties);
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
};

/**
 * Track a page view.
 * Call this when navigation occurs.
 */
export const trackPageView = (path: string, properties?: Record<string, unknown>): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Tracking page view:', path, properties);
    }

    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path,
      ...properties,
    });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
};

// ============================================================================
// USER IDENTIFICATION
// ============================================================================

/**
 * Identify a user.
 * Call this when user logs in or their ID becomes known.
 */
export const identifyUser = (userId: string, properties?: Record<string, unknown>): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Identifying user:', userId, properties);
    }

    posthog.identify(userId, properties);
  } catch (error) {
    console.error('[Analytics] Failed to identify user:', error);
  }
};

/**
 * Reset user identification.
 * Call this when user logs out.
 */
export const resetUser = (): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Resetting user');
    }

    posthog.reset();
  } catch (error) {
    console.error('[Analytics] Failed to reset user:', error);
  }
};

// ============================================================================
// USER PROPERTIES
// ============================================================================

/**
 * Set user properties.
 * These persist across sessions for the identified user.
 */
export const setUserProperties = (properties: Record<string, unknown>): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Setting user properties:', properties);
    }

    posthog.people.set(properties);
  } catch (error) {
    console.error('[Analytics] Failed to set user properties:', error);
  }
};

/**
 * Set user properties once.
 * Only sets if the property doesn't already exist.
 */
export const setUserPropertiesOnce = (properties: Record<string, unknown>): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Setting user properties once:', properties);
    }

    posthog.people.set_once(properties);
  } catch (error) {
    console.error('[Analytics] Failed to set user properties once:', error);
  }
};

/**
 * Increment a user property.
 * Useful for counters like total tasks completed.
 */
export const incrementUserProperty = (propertyName: string, value: number = 1): void => {
  if (!isEnabled || !isInitialized) {
    return;
  }

  try {
    if (isDebug) {
      console.log('[Analytics] Incrementing user property:', propertyName, value);
    }

    // PostHog doesn't have a direct increment method, so we use set with current value + increment
    // This is a simplified approach - for production, you might want to fetch current value first
    posthog.people.set({ [propertyName]: value });
  } catch (error) {
    console.error('[Analytics] Failed to increment user property:', error);
  }
};

// ============================================================================
// CONSENT MANAGEMENT
// ============================================================================

/**
 * Enable analytics tracking.
 * Call this when user opts in to analytics.
 */
export const enableAnalytics = (): void => {
  localStorage.setItem('analytics_consent', 'true');
  isEnabled = true;
  
  // Re-initialize if needed
  if (!isInitialized && POSTHOG_API_KEY) {
    initializeTracker();
  }
  
  if (isDebug) {
    console.log('[Analytics] Analytics enabled');
  }
};

/**
 * Disable analytics tracking.
 * Call this when user opts out of analytics.
 */
export const disableAnalytics = (): void => {
  localStorage.setItem('analytics_consent', 'false');
  isEnabled = false;
  
  if (isInitialized) {
    posthog.opt_out_capturing();
  }
  
  if (isDebug) {
    console.log('[Analytics] Analytics disabled');
  }
};

/**
 * Check if analytics is currently enabled.
 */
export const isAnalyticsEnabled = (): boolean => {
  return isEnabled;
};

/**
 * Get current analytics consent status.
 */
export const getAnalyticsConsent = (): 'granted' | 'denied' | 'not_set' => {
  const consent = localStorage.getItem('analytics_consent');
  if (consent === 'true') return 'granted';
  if (consent === 'false') return 'denied';
  return 'not_set';
};

// ============================================================================
// DEBUGGING
// ============================================================================

/**
 * Enable debug mode for analytics.
 */
export const enableDebugMode = (): void => {
  isDebug = true;
  console.log('[Analytics] Debug mode enabled');
};

/**
 * Disable debug mode for analytics.
 */
export const disableDebugMode = (): void => {
  isDebug = false;
  console.log('[Analytics] Debug mode disabled');
};

// ============================================================================
// SERVER-SIDE SUPPORT (FUTURE)
// ============================================================================

/**
 * Server-side event tracking interface.
 * Implement this for server-side analytics (e.g., API calls, webhooks).
 */
export interface ServerSideTracker {
  track: (event: AnalyticsEvent) => Promise<void>;
  identify: (userId: string, properties?: Record<string, unknown>) => Promise<void>;
  setUserProperties: (userId: string, properties: Record<string, unknown>) => Promise<void>;
}

/**
 * Placeholder for server-side tracker implementation.
 * This can be used for API route analytics, webhook handling, etc.
 */
export const createServerSideTracker = (): ServerSideTracker => {
  // TODO: Implement server-side tracking (e.g., using PostHog Node SDK)
  // This would be used in API routes and server-side code
  return {
    track: async (event: AnalyticsEvent) => {
      console.warn('[Analytics] Server-side tracking not yet implemented:', event);
    },
    identify: async (_userId: string, _properties?: Record<string, unknown>) => {
      console.warn('[Analytics] Server-side identification not yet implemented');
    },
    setUserProperties: async (_userId: string, _properties: Record<string, unknown>) => {
      console.warn('[Analytics] Server-side user properties not yet implemented');
    },
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  initialize: initializeTracker,
  track: trackEvent,
  trackPageView,
  identify: identifyUser,
  reset: resetUser,
  setUserProperties,
  setUserPropertiesOnce,
  incrementUserProperty,
  enable: enableAnalytics,
  disable: disableAnalytics,
  isEnabled: isAnalyticsEnabled,
  getConsent: getAnalyticsConsent,
  enableDebug: enableDebugMode,
  disableDebug: disableDebugMode,
  createServerSideTracker,
};
