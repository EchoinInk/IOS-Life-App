/**
 * Analytics Event Definitions
 *
 * Centralized event schema for deterministic naming and type safety.
 * Events are organized by feature area with clear naming conventions:
 * - feature:action (e.g., onboarding:started)
 * - Use past tense for completed actions
 * - Use present tense for in-progress actions
 */

// ============================================================================
// EVENT CATEGORIES
// ============================================================================

export type EventCategory =
  | 'onboarding'
  | 'routine'
  | 'momentum'
  | 'dashboard'
  | 'task'
  | 'empty_state'
  | 'navigation'
  | 'error';

// ============================================================================
// ONBOARDING EVENTS
// ============================================================================

export interface OnboardingStartedEvent {
  category: 'onboarding';
  action: 'started';
  properties: {
    timestamp: number;
  };
}

export interface OnboardingStepViewedEvent {
  category: 'onboarding';
  action: 'step_viewed';
  properties: {
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion';
    step_index: number;
    total_steps: number;
  };
}

export interface OnboardingStepCompletedEvent {
  category: 'onboarding';
  action: 'step_completed';
  properties: {
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion';
    step_index: number;
    duration_seconds?: number;
  };
}

export interface OnboardingCompletedEvent {
  category: 'onboarding';
  action: 'completed';
  properties: {
    total_duration_seconds: number;
    goals_selected_count: number;
    rhythm_selected: string;
    focus_selected: string;
    modules_selected_count: number;
  };
}

export interface OnboardingSkippedEvent {
  category: 'onboarding';
  action: 'skipped';
  properties: {
    step: 'goals' | 'rhythm' | 'focus' | 'modules' | 'completion';
    step_index: number;
  };
}

// ============================================================================
// ROUTINE EVENTS
// ============================================================================

export interface RoutineCreatedEvent {
  category: 'routine';
  action: 'created';
  properties: {
    routine_id: string;
    template_used?: string;
    estimated_duration_minutes: number;
    steps_count: number;
  };
}

export interface RoutineStartedEvent {
  category: 'routine';
  action: 'started';
  properties: {
    routine_id: string;
    scheduled_time: string;
  };
}

export interface RoutineCompletedEvent {
  category: 'routine';
  action: 'completed';
  properties: {
    routine_id: string;
    duration_seconds: number;
    steps_completed: number;
    steps_total: number;
    completion_rate: number;
  };
}

export interface RoutineSkippedEvent {
  category: 'routine';
  action: 'skipped';
  properties: {
    routine_id: string;
    reason?: string;
  };
}

export interface RoutineTemplateSelectedEvent {
  category: 'routine';
  action: 'template_selected';
  properties: {
    template_name: string;
    template_category: string;
  };
}

// ============================================================================
// MOMENTUM EVENTS
// ============================================================================

export interface MomentumViewedEvent {
  category: 'momentum';
  action: 'viewed';
  properties: {
    current_score: number;
    level: 'building' | 'maintaining' | 'growing' | 'excelling';
  };
}

export interface MomentumScoreChangedEvent {
  category: 'momentum';
  action: 'score_changed';
  properties: {
    previous_score: number;
    new_score: number;
    change_delta: number;
    trigger: 'task_completed' | 'routine_completed' | 'streak_broken' | 'manual';
  };
}

export interface MomentumLevelUpEvent {
  category: 'momentum';
  action: 'level_up';
  properties: {
    previous_level: string;
    new_level: string;
    score_at_level_up: number;
  };
}

export interface MomentumStreakStartedEvent {
  category: 'momentum';
  action: 'streak_started';
  properties: {
    streak_length: number;
  };
}

export interface MomentumStreakBrokenEvent {
  category: 'momentum';
  action: 'streak_broken';
  properties: {
    previous_streak_length: number;
    days_missed: number;
  };
}

// ============================================================================
// DASHBOARD EVENTS
// ============================================================================

export interface DashboardViewedEvent {
  category: 'dashboard';
  action: 'viewed';
  properties: {
    view: 'home' | 'tasks' | 'shopping' | 'insights';
    tasks_pending_count: number;
    tasks_completed_today: number;
    momentum_score: number;
  };
}

export interface DashboardQuickActionUsedEvent {
  category: 'dashboard';
  action: 'quick_action_used';
  properties: {
    action_type: 'add_task' | 'start_routine' | 'view_shopping' | 'view_insights';
    location: 'home' | 'tasks' | 'shopping' | 'insights';
  };
}

export interface DashboardFilterChangedEvent {
  category: 'dashboard';
  action: 'filter_changed';
  properties: {
    filter_type: 'category' | 'date' | 'status';
    filter_value: string;
  };
}

// ============================================================================
// TASK EVENTS
// ============================================================================

export interface TaskCreatedEvent {
  category: 'task';
  action: 'created';
  properties: {
    task_id: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    due_date?: string;
  };
}

export interface TaskCompletedEvent {
  category: 'task';
  action: 'completed';
  properties: {
    task_id: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    completed_on_time: boolean;
    time_to_complete_seconds?: number;
  };
}

export interface TaskDeletedEvent {
  category: 'task';
  action: 'deleted';
  properties: {
    task_id: string;
    category: string;
    completion_status: 'pending' | 'completed';
  };
}

export interface TaskSnoozedEvent {
  category: 'task';
  action: 'snoozed';
  properties: {
    task_id: string;
    snoozed_to: string;
    original_due_date: string;
  };
}

// ============================================================================
// EMPTY STATE EVENTS
// ============================================================================

export interface EmptyStateViewedEvent {
  category: 'empty_state';
  action: 'viewed';
  properties: {
    context: 'tasks' | 'routines' | 'shopping' | 'insights';
    items_count: number;
  };
}

export interface EmptyStateCTAClickedEvent {
  category: 'empty_state';
  action: 'cta_clicked';
  properties: {
    context: 'tasks' | 'routines' | 'shopping' | 'insights';
    cta_text: string;
    action_type: 'create_first' | 'add_item' | 'browse_templates';
  };
}

export interface EmptyStateDismissedEvent {
  category: 'empty_state';
  action: 'dismissed';
  properties: {
    context: 'tasks' | 'routines' | 'shopping' | 'insights';
  };
}

// ============================================================================
// ERROR EVENTS
// ============================================================================

export interface ErrorBoundaryTriggeredEvent {
  category: 'error';
  action: 'boundary_triggered';
  properties: {
    error_message: string;
    error_name: string;
  };
}

// ============================================================================
// NAVIGATION EVENTS
// ============================================================================

export interface NavigationTabChangedEvent {
  category: 'navigation';
  action: 'tab_changed';
  properties: {
    from_tab: string;
    to_tab: string;
  };
}

export interface NavigationDeepLinkOpenedEvent {
  category: 'navigation';
  action: 'deep_link_opened';
  properties: {
    destination: string;
    source: 'notification' | 'widget' | 'external';
  };
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type AnalyticsEvent =
  | OnboardingStartedEvent
  | OnboardingStepViewedEvent
  | OnboardingStepCompletedEvent
  | OnboardingCompletedEvent
  | OnboardingSkippedEvent
  | RoutineCreatedEvent
  | RoutineStartedEvent
  | RoutineCompletedEvent
  | RoutineSkippedEvent
  | RoutineTemplateSelectedEvent
  | MomentumViewedEvent
  | MomentumScoreChangedEvent
  | MomentumLevelUpEvent
  | MomentumStreakStartedEvent
  | MomentumStreakBrokenEvent
  | DashboardViewedEvent
  | DashboardQuickActionUsedEvent
  | DashboardFilterChangedEvent
  | TaskCreatedEvent
  | TaskCompletedEvent
  | TaskDeletedEvent
  | TaskSnoozedEvent
  | EmptyStateViewedEvent
  | EmptyStateCTAClickedEvent
  | EmptyStateDismissedEvent
  | ErrorBoundaryTriggeredEvent
  | NavigationTabChangedEvent
  | NavigationDeepLinkOpenedEvent;

// ============================================================================
// EVENT NAME MAPPING
// ============================================================================

export const getEventName = (event: AnalyticsEvent): string => {
  return `${event.category}:${event.action}`;
};

// ============================================================================
// EVENT FACTORIES
// ============================================================================

export const EventFactory = {
  // Onboarding
  onboardingStarted: (): OnboardingStartedEvent => ({
    category: 'onboarding',
    action: 'started',
    properties: { timestamp: Date.now() },
  }),

  onboardingStepViewed: (
    step: OnboardingStepViewedEvent['properties']['step'],
    stepIndex: number,
    totalSteps: number
  ): OnboardingStepViewedEvent => ({
    category: 'onboarding',
    action: 'step_viewed',
    properties: {
      step,
      step_index: stepIndex,
      total_steps: totalSteps,
    },
  }),

  onboardingStepCompleted: (
    step: OnboardingStepCompletedEvent['properties']['step'],
    stepIndex: number,
    durationSeconds?: number
  ): OnboardingStepCompletedEvent => ({
    category: 'onboarding',
    action: 'step_completed',
    properties: {
      step,
      step_index: stepIndex,
      duration_seconds: durationSeconds,
    },
  }),

  onboardingCompleted: (
    totalDurationSeconds: number,
    goalsSelectedCount: number,
    rhythmSelected: string,
    focusSelected: string,
    modulesSelectedCount: number
  ): OnboardingCompletedEvent => ({
    category: 'onboarding',
    action: 'completed',
    properties: {
      total_duration_seconds: totalDurationSeconds,
      goals_selected_count: goalsSelectedCount,
      rhythm_selected: rhythmSelected,
      focus_selected: focusSelected,
      modules_selected_count: modulesSelectedCount,
    },
  }),

  onboardingSkipped: (
    step: OnboardingSkippedEvent['properties']['step'],
    stepIndex: number
  ): OnboardingSkippedEvent => ({
    category: 'onboarding',
    action: 'skipped',
    properties: { step, step_index: stepIndex },
  }),

  // Routine
  routineCreated: (
    routineId: string,
    estimatedDurationMinutes: number,
    stepsCount: number,
    templateUsed?: string
  ): RoutineCreatedEvent => ({
    category: 'routine',
    action: 'created',
    properties: {
      routine_id: routineId,
      template_used: templateUsed,
      estimated_duration_minutes: estimatedDurationMinutes,
      steps_count: stepsCount,
    },
  }),

  routineStarted: (
    routineId: string,
    scheduledTime: string
  ): RoutineStartedEvent => ({
    category: 'routine',
    action: 'started',
    properties: { routine_id: routineId, scheduled_time: scheduledTime },
  }),

  routineCompleted: (
    routineId: string,
    durationSeconds: number,
    stepsCompleted: number,
    stepsTotal: number
  ): RoutineCompletedEvent => ({
    category: 'routine',
    action: 'completed',
    properties: {
      routine_id: routineId,
      duration_seconds: durationSeconds,
      steps_completed: stepsCompleted,
      steps_total: stepsTotal,
      completion_rate: stepsCompleted / stepsTotal,
    },
  }),

  routineSkipped: (
    routineId: string
  ): RoutineSkippedEvent => ({
    category: 'routine',
    action: 'skipped',
    properties: { routine_id: routineId },
  }),

  routineTemplateSelected: (
    templateName: string,
    templateCategory: string
  ): RoutineTemplateSelectedEvent => ({
    category: 'routine',
    action: 'template_selected',
    properties: {
      template_name: templateName,
      template_category: templateCategory,
    },
  }),

  // Momentum
  momentumViewed: (
    currentScore: number,
    level: MomentumViewedEvent['properties']['level']
  ): MomentumViewedEvent => ({
    category: 'momentum',
    action: 'viewed',
    properties: { current_score: currentScore, level },
  }),

  momentumScoreChanged: (
    previousScore: number,
    newScore: number,
    trigger: MomentumScoreChangedEvent['properties']['trigger']
  ): MomentumScoreChangedEvent => ({
    category: 'momentum',
    action: 'score_changed',
    properties: {
      previous_score: previousScore,
      new_score: newScore,
      change_delta: newScore - previousScore,
      trigger,
    },
  }),

  momentumLevelUp: (
    previousLevel: string,
    newLevel: string,
    scoreAtLevelUp: number
  ): MomentumLevelUpEvent => ({
    category: 'momentum',
    action: 'level_up',
    properties: {
      previous_level: previousLevel,
      new_level: newLevel,
      score_at_level_up: scoreAtLevelUp,
    },
  }),

  momentumStreakStarted: (streakLength: number): MomentumStreakStartedEvent => ({
    category: 'momentum',
    action: 'streak_started',
    properties: { streak_length: streakLength },
  }),

  momentumStreakBroken: (
    previousStreakLength: number,
    daysMissed: number
  ): MomentumStreakBrokenEvent => ({
    category: 'momentum',
    action: 'streak_broken',
    properties: {
      previous_streak_length: previousStreakLength,
      days_missed: daysMissed,
    },
  }),

  // Dashboard
  dashboardViewed: (
    view: DashboardViewedEvent['properties']['view'],
    tasksPendingCount: number,
    tasksCompletedToday: number,
    momentumScore: number
  ): DashboardViewedEvent => ({
    category: 'dashboard',
    action: 'viewed',
    properties: {
      view,
      tasks_pending_count: tasksPendingCount,
      tasks_completed_today: tasksCompletedToday,
      momentum_score: momentumScore,
    },
  }),

  dashboardQuickActionUsed: (
    actionType: DashboardQuickActionUsedEvent['properties']['action_type'],
    location: DashboardQuickActionUsedEvent['properties']['location']
  ): DashboardQuickActionUsedEvent => ({
    category: 'dashboard',
    action: 'quick_action_used',
    properties: { action_type: actionType, location },
  }),

  dashboardFilterChanged: (
    filterType: DashboardFilterChangedEvent['properties']['filter_type'],
    filterValue: string
  ): DashboardFilterChangedEvent => ({
    category: 'dashboard',
    action: 'filter_changed',
    properties: { filter_type: filterType, filter_value: filterValue },
  }),

  // Task
  taskCreated: (
    taskId: string,
    category: string,
    priority: TaskCreatedEvent['properties']['priority']
  ): TaskCreatedEvent => ({
    category: 'task',
    action: 'created',
    properties: {
      task_id: taskId,
      category,
      priority,
    },
  }),

  taskCompleted: (
    taskId: string,
    category: string,
    priority: TaskCompletedEvent['properties']['priority'],
    completedOnTime: boolean
  ): TaskCompletedEvent => ({
    category: 'task',
    action: 'completed',
    properties: {
      task_id: taskId,
      category,
      priority,
      completed_on_time: completedOnTime,
    },
  }),

  taskDeleted: (
    taskId: string,
    category: string,
    completionStatus: TaskDeletedEvent['properties']['completion_status']
  ): TaskDeletedEvent => ({
    category: 'task',
    action: 'deleted',
    properties: {
      task_id: taskId,
      category,
      completion_status: completionStatus,
    },
  }),

  taskSnoozed: (
    taskId: string,
    snoozedTo: string,
    originalDueDate: string
  ): TaskSnoozedEvent => ({
    category: 'task',
    action: 'snoozed',
    properties: {
      task_id: taskId,
      snoozed_to: snoozedTo,
      original_due_date: originalDueDate,
    },
  }),

  // Empty State
  emptyStateViewed: (
    context: EmptyStateViewedEvent['properties']['context'],
    itemsCount: number
  ): EmptyStateViewedEvent => ({
    category: 'empty_state',
    action: 'viewed',
    properties: { context, items_count: itemsCount },
  }),

  emptyStateCTAClicked: (
    context: EmptyStateCTAClickedEvent['properties']['context'],
    ctaText: string,
    actionType: EmptyStateCTAClickedEvent['properties']['action_type']
  ): EmptyStateCTAClickedEvent => ({
    category: 'empty_state',
    action: 'cta_clicked',
    properties: {
      context,
      cta_text: ctaText,
      action_type: actionType,
    },
  }),

  emptyStateDismissed: (
    context: EmptyStateDismissedEvent['properties']['context']
  ): EmptyStateDismissedEvent => ({
    category: 'empty_state',
    action: 'dismissed',
    properties: { context },
  }),

  // Navigation
  navigationTabChanged: (
    fromTab: string,
    toTab: string
  ): NavigationTabChangedEvent => ({
    category: 'navigation',
    action: 'tab_changed',
    properties: { from_tab: fromTab, to_tab: toTab },
  }),

  navigationDeepLinkOpened: (
    destination: string,
    source: NavigationDeepLinkOpenedEvent['properties']['source']
  ): NavigationDeepLinkOpenedEvent => ({
    category: 'navigation',
    action: 'deep_link_opened',
    properties: { destination, source },
  }),
};
