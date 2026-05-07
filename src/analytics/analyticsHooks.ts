/**
 * Analytics Hooks - React Integration
 *
 * React hooks for analytics tracking.
 * Provides type-safe, easy-to-use hooks for common analytics patterns.
 * Prevents analytics calls directly inside UI components.
 */

import { useEffect, useCallback, useRef } from 'react';
import { EventFactory, type AnalyticsEvent } from './analyticsEvents';
import * as Tracker from './eventTracker';

// ============================================================================
// USE ANALYTICS EVENT
// ============================================================================

/**
 * Hook to track an analytics event.
 * Prevents duplicate tracking with deduplication.
 */
export const useAnalyticsEvent = () => {
  const trackedEvents = useRef<Set<string>>(new Set());

  const track = useCallback((event: AnalyticsEvent) => {
    // Create unique key for deduplication
    const eventKey = JSON.stringify(event);
    
    // Skip if already tracked (prevents duplicate calls)
    if (trackedEvents.current.has(eventKey)) {
      return;
    }
    
    // Mark as tracked
    trackedEvents.current.add(eventKey);
    
    // Track the event
    Tracker.trackEvent(event);
  }, []);

  return { track };
};

// ============================================================================
// USE PAGE VIEW TRACKING
// ============================================================================

/**
 * Hook to track page views automatically.
 * Call this in your main app component or route components.
 */
export const usePageViewTracking = (path: string, properties?: Record<string, unknown>) => {
  useEffect(() => {
    Tracker.trackPageView(path, properties);
  }, [path, JSON.stringify(properties)]);
};

// ============================================================================
// ONBOARDING HOOKS
// ============================================================================

/**
 * Hook for onboarding analytics.
 * Tracks onboarding funnel events.
 */
export const useOnboardingAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const started = useCallback(() => {
    track(EventFactory.onboardingStarted());
  }, [track]);

  const stepViewed = useCallback((
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion',
    stepIndex: number,
    totalSteps: number
  ) => {
    track(EventFactory.onboardingStepViewed(step, stepIndex, totalSteps));
  }, [track]);

  const stepCompleted = useCallback((
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion',
    stepIndex: number,
    durationSeconds?: number
  ) => {
    track(EventFactory.onboardingStepCompleted(step, stepIndex, durationSeconds));
  }, [track]);

  const completed = useCallback((
    totalDurationSeconds: number,
    goalsSelectedCount: number,
    rhythmSelected: string,
    focusSelected: string,
    modulesSelectedCount: number
  ) => {
    track(EventFactory.onboardingCompleted(
      totalDurationSeconds,
      goalsSelectedCount,
      rhythmSelected,
      focusSelected,
      modulesSelectedCount
    ));
  }, [track]);

  const skipped = useCallback((
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion',
    stepIndex: number
  ) => {
    track(EventFactory.onboardingSkipped(step, stepIndex));
  }, [track]);

  return {
    started,
    stepViewed,
    stepCompleted,
    completed,
    skipped,
  };
};

// ============================================================================
// ROUTINE HOOKS
// ============================================================================

/**
 * Hook for routine analytics.
 * Tracks routine creation, completion, and engagement.
 */
export const useRoutineAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const created = useCallback((
    routineId: string,
    estimatedDurationMinutes: number,
    stepsCount: number,
    templateUsed?: string
  ) => {
    track(EventFactory.routineCreated(routineId, estimatedDurationMinutes, stepsCount, templateUsed));
  }, [track]);

  const started = useCallback((routineId: string, scheduledTime: string) => {
    track(EventFactory.routineStarted(routineId, scheduledTime));
  }, [track]);

  const completed = useCallback((
    routineId: string,
    durationSeconds: number,
    stepsCompleted: number,
    stepsTotal: number
  ) => {
    track(EventFactory.routineCompleted(routineId, durationSeconds, stepsCompleted, stepsTotal));
  }, [track]);

  const skipped = useCallback((routineId: string) => {
    track(EventFactory.routineSkipped(routineId));
  }, [track]);

  const templateSelected = useCallback((templateName: string, templateCategory: string) => {
    track(EventFactory.routineTemplateSelected(templateName, templateCategory));
  }, [track]);

  return {
    created,
    started,
    completed,
    skipped,
    templateSelected,
  };
};

// ============================================================================
// MOMENTUM HOOKS
// ============================================================================

/**
 * Hook for momentum analytics.
 * Tracks momentum score changes, level ups, and streaks.
 */
export const useMomentumAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const viewed = useCallback((currentScore: number, level: 'building' | 'maintaining' | 'growing' | 'excelling') => {
    track(EventFactory.momentumViewed(currentScore, level));
  }, [track]);

  const scoreChanged = useCallback((
    previousScore: number,
    newScore: number,
    trigger: 'task_completed' | 'routine_completed' | 'streak_broken' | 'manual'
  ) => {
    track(EventFactory.momentumScoreChanged(previousScore, newScore, trigger));
  }, [track]);

  const levelUp = useCallback((
    previousLevel: string,
    newLevel: string,
    scoreAtLevelUp: number
  ) => {
    track(EventFactory.momentumLevelUp(previousLevel, newLevel, scoreAtLevelUp));
  }, [track]);

  const streakStarted = useCallback((streakLength: number) => {
    track(EventFactory.momentumStreakStarted(streakLength));
  }, [track]);

  const streakBroken = useCallback((previousStreakLength: number, daysMissed: number) => {
    track(EventFactory.momentumStreakBroken(previousStreakLength, daysMissed));
  }, [track]);

  return {
    viewed,
    scoreChanged,
    levelUp,
    streakStarted,
    streakBroken,
  };
};

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

/**
 * Hook for dashboard analytics.
 * Tracks dashboard views, quick actions, and filter usage.
 */
export const useDashboardAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const viewed = useCallback((
    view: 'home' | 'tasks' | 'shopping' | 'insights',
    tasksPendingCount: number,
    tasksCompletedToday: number,
    momentumScore: number
  ) => {
    track(EventFactory.dashboardViewed(view, tasksPendingCount, tasksCompletedToday, momentumScore));
  }, [track]);

  const quickActionUsed = useCallback((
    actionType: 'add_task' | 'start_routine' | 'view_shopping' | 'view_insights',
    location: 'home' | 'tasks' | 'shopping' | 'insights'
  ) => {
    track(EventFactory.dashboardQuickActionUsed(actionType, location));
  }, [track]);

  const filterChanged = useCallback((
    filterType: 'category' | 'date' | 'status',
    filterValue: string
  ) => {
    track(EventFactory.dashboardFilterChanged(filterType, filterValue));
  }, [track]);

  return {
    viewed,
    quickActionUsed,
    filterChanged,
  };
};

// ============================================================================
// TASK HOOKS
// ============================================================================

/**
 * Hook for task analytics.
 * Tracks task creation, completion, deletion, and snoozing.
 */
export const useTaskAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const created = useCallback((
    taskId: string,
    category: string,
    priority: 'high' | 'medium' | 'low'
  ) => {
    track(EventFactory.taskCreated(taskId, category, priority));
  }, [track]);

  const completed = useCallback((
    taskId: string,
    category: string,
    priority: 'high' | 'medium' | 'low',
    completedOnTime: boolean
  ) => {
    track(EventFactory.taskCompleted(taskId, category, priority, completedOnTime));
  }, [track]);

  const deleted = useCallback((
    taskId: string,
    category: string,
    completionStatus: 'pending' | 'completed'
  ) => {
    track(EventFactory.taskDeleted(taskId, category, completionStatus));
  }, [track]);

  const snoozed = useCallback((
    taskId: string,
    snoozedTo: string,
    originalDueDate: string
  ) => {
    track(EventFactory.taskSnoozed(taskId, snoozedTo, originalDueDate));
  }, [track]);

  return {
    created,
    completed,
    deleted,
    snoozed,
  };
};

// ============================================================================
// EMPTY STATE HOOKS
// ============================================================================

/**
 * Hook for empty state analytics.
 * Tracks empty state views and CTA engagement.
 */
export const useEmptyStateAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const viewed = useCallback((
    context: 'tasks' | 'routines' | 'shopping' | 'insights',
    itemsCount: number
  ) => {
    track(EventFactory.emptyStateViewed(context, itemsCount));
  }, [track]);

  const ctaClicked = useCallback((
    context: 'tasks' | 'routines' | 'shopping' | 'insights',
    ctaText: string,
    actionType: 'create_first' | 'add_item' | 'browse_templates'
  ) => {
    track(EventFactory.emptyStateCTAClicked(context, ctaText, actionType));
  }, [track]);

  const dismissed = useCallback((context: 'tasks' | 'routines' | 'shopping' | 'insights') => {
    track(EventFactory.emptyStateDismissed(context));
  }, [track]);

  return {
    viewed,
    ctaClicked,
    dismissed,
  };
};

// ============================================================================
// NAVIGATION HOOKS
// ============================================================================

/**
 * Hook for navigation analytics.
 * Tracks tab changes and deep link usage.
 */
export const useNavigationAnalytics = () => {
  const { track } = useAnalyticsEvent();

  const tabChanged = useCallback((fromTab: string, toTab: string) => {
    track(EventFactory.navigationTabChanged(fromTab, toTab));
  }, [track]);

  const deepLinkOpened = useCallback((
    destination: string,
    source: 'notification' | 'widget' | 'external'
  ) => {
    track(EventFactory.navigationDeepLinkOpened(destination, source));
  }, [track]);

  return {
    tabChanged,
    deepLinkOpened,
  };
};

// ============================================================================
// USER IDENTIFICATION HOOK
// ============================================================================

/**
 * Hook for user identification.
 * Call this when user logs in or their ID becomes known.
 */
export const useUserIdentification = () => {
  const identify = useCallback((userId: string, properties?: Record<string, unknown>) => {
    Tracker.identifyUser(userId, properties);
  }, []);

  const reset = useCallback(() => {
    Tracker.resetUser();
  }, []);

  return { identify, reset };
};

// ============================================================================
// USER PROPERTIES HOOK
// ============================================================================

/**
 * Hook for user properties.
 * Use this to set persistent user properties.
 */
export const useUserProperties = () => {
  const setProperties = useCallback((properties: Record<string, unknown>) => {
    Tracker.setUserProperties(properties);
  }, []);

  const setPropertiesOnce = useCallback((properties: Record<string, unknown>) => {
    Tracker.setUserPropertiesOnce(properties);
  }, []);

  const incrementProperty = useCallback((propertyName: string, value?: number) => {
    Tracker.incrementUserProperty(propertyName, value);
  }, []);

  return {
    setProperties,
    setPropertiesOnce,
    incrementProperty,
  };
};

// ============================================================================
// CONSENT MANAGEMENT HOOK
// ============================================================================

/**
 * Hook for analytics consent management.
 * Use this to handle user opt-in/opt-out for analytics.
 */
export const useAnalyticsConsent = () => {
  const consent = Tracker.getAnalyticsConsent();
  const isEnabled = Tracker.isAnalyticsEnabled();

  const enable = useCallback(() => {
    Tracker.enableAnalytics();
  }, []);

  const disable = useCallback(() => {
    Tracker.disableAnalytics();
  }, []);

  return {
    consent,
    isEnabled,
    enable,
    disable,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useAnalyticsEvent,
  usePageViewTracking,
  useOnboardingAnalytics,
  useRoutineAnalytics,
  useMomentumAnalytics,
  useDashboardAnalytics,
  useTaskAnalytics,
  useEmptyStateAnalytics,
  useNavigationAnalytics,
  useUserIdentification,
  useUserProperties,
  useAnalyticsConsent,
};
