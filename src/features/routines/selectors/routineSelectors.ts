/**
 * Routine Selectors - Deterministic selectors for routine data
 * Memoized selectors that compute derived state
 */

import type {
  RoutineInstance,
  RoutineTemplate,
  FocusSession,
  RoutineProgress,
  RoutineStats,
  RoutineType
} from '../types/routineTypes';
import { getTodayString } from '../utils/dateUtils';
import { 
  generateRoutineStats,
  calculateCompletionRate
} from '../domain/completionEngine';
import { 
  calculateAllStreaks,
  isStreakAtRisk
} from '../domain/streakEngine';

/**
 * Select today's routine instances
 */
export const selectTodayRoutines = (instances: Record<string, RoutineInstance>): RoutineInstance[] => {
  const today = getTodayString();
  return Object.values(instances).filter(routine => routine.date === today);
};

/**
 * Select active routine instances
 */
export const selectActiveRoutines = (instances: Record<string, RoutineInstance>): RoutineInstance[] => {
  return Object.values(instances).filter(routine => routine.status === 'in_progress');
};

/**
 * Select completed routine instances
 */
export const selectCompletedRoutines = (instances: Record<string, RoutineInstance>): RoutineInstance[] => {
  return Object.values(instances).filter(routine => routine.status === 'completed');
};

/**
 * Select routines by type
 */
export const selectRoutinesByType = (
  instances: Record<string, RoutineInstance>,
  type: RoutineType
): RoutineInstance[] => {
  return Object.values(instances).filter(routine => routine.type === type);
};

/**
 * Select active templates
 */
export const selectActiveTemplates = (templates: Record<string, RoutineTemplate>): RoutineTemplate[] => {
  return Object.values(templates).filter(template => template.isActive);
};

/**
 * Select templates by type
 */
export const selectTemplatesByType = (
  templates: Record<string, RoutineTemplate>,
  type: RoutineType
): RoutineTemplate[] => {
  return Object.values(templates).filter(template => template.type === type);
};

/**
 * Select active focus sessions
 */
export const selectActiveFocusSessions = (sessions: Record<string, FocusSession>): FocusSession[] => {
  return Object.values(sessions).filter(session => session.status === 'active');
};

/**
 * Select today's focus sessions
 */
export const selectTodayFocusSessions = (sessions: Record<string, FocusSession>): FocusSession[] => {
  const today = getTodayString();
  return Object.values(sessions).filter(session => {
    const sessionDate = session.actualStart?.split('T')[0] || session.scheduledStart.split('T')[0];
    return sessionDate === today;
  });
};

/**
 * Select routine progress for today
 */
export const selectTodayProgress = (
  instances: Record<string, RoutineInstance>,
  sessions: Record<string, FocusSession>
): RoutineProgress => {
  const todayRoutines = selectTodayRoutines(instances);
  const activeSession = selectActiveFocusSessions(sessions)[0];
  
  const totalRoutines = todayRoutines.length;
  const completedRoutines = todayRoutines.filter(r => r.status === 'completed').length;
  const inProgressRoutines = todayRoutines.filter(r => r.status === 'in_progress').length;
  const percentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;
  const momentumContribution = todayRoutines.reduce((sum, r) => sum + r.momentum, 0);

  return {
    totalRoutines,
    completedRoutines,
    inProgressRoutines,
    percentage,
    momentumContribution,
    currentFocusSession: activeSession
  };
};

/**
 * Select routine statistics from historical data
 */
export const selectRoutineStats = (history: Record<string, RoutineInstance[]>): RoutineStats => {
  const allInstances = Object.values(history).flat();
  return generateRoutineStats(allInstances);
};

/**
 * Select routine insights
 */
export const selectRoutineInsights = (
  instances: Record<string, RoutineInstance>,
  history: Record<string, RoutineInstance[]>
): { type: 'positive' | 'negative' | 'neutral'; message: string; priority: number }[] => {
  const allInstances = Object.values(history).flat();
  const insights = [];

  // Today's progress insight
  const todayProgress = selectTodayProgress(instances, {});
  if (todayProgress.percentage >= 80) {
    insights.push({
      type: 'positive' as const,
      message: 'Excellent progress today! You\'re crushing your routines.',
      priority: 1
    });
  } else if (todayProgress.percentage <= 30) {
    insights.push({
      type: 'negative' as const,
      message: 'Today\'s progress needs attention. Let\'s get back on track.',
      priority: 3
    });
  }

  // Streak insights
  const streaks = calculateAllStreaks(allInstances);
  Object.entries(streaks.current).forEach(([type, streak]) => {
    if (streak >= 7) {
      insights.push({
        type: 'positive' as const,
        message: `${type} routine streak: ${streak} days! Amazing consistency.`,
        priority: 2
      });
    } else if (isStreakAtRisk(allInstances, type as RoutineType)) {
      insights.push({
        type: 'negative' as const,
        message: `${type} routine streak is at risk - complete it today!`,
        priority: 3
      });
    }
  });

  return insights.sort((a, b) => a.priority - b.priority);
};

/**
 * Select upcoming routines
 */
export const selectUpcomingRoutines = (
  templates: Record<string, RoutineTemplate>,
  daysAhead: number = 7
): RoutineInstance[] => {
  const activeTemplates = selectActiveTemplates(templates);
  const upcoming: RoutineInstance[] = [];

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0] || '';

    activeTemplates.forEach(template => {
      if (template.frequency === 'daily' || 
          (template.frequency === 'weekly' && date.getDay() === 1) ||
          (template.frequency === 'monthly' && date.getDate() === 1)) {
        upcoming.push({
          id: `${template.id}-${dateString}`,
          templateId: template.id,
          date: dateString,
          type: template.type,
          status: 'pending',
          steps: template.steps.map(step => ({
            id: `${step.id}-${dateString}`,
            stepId: step.id,
            status: step.defaultCompleted ? 'completed' : 'pending',
            completedAt: step.defaultCompleted ? new Date().toISOString() : undefined,
            momentum: step.defaultCompleted ? 2 : 0
          })),
          momentum: 0,
          insights: []
        });
      }
    });
  }

  return upcoming;
};

/**
 * Select routine completion trends
 */
export const selectCompletionTrends = (
  history: Record<string, RoutineInstance[]>,
  days: number = 30
): { date: string; completionRate: number; count: number }[] => {
  const trends: { date: string; completionRate: number; count: number }[] = [];
  const today = new Date(getTodayString());

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0] || '';

    const dayInstances = history[dateString] || [];
    const completionRate = calculateCompletionRate(dayInstances);

    trends.push({
      date: dateString,
      completionRate,
      count: dayInstances.length
    });
  }

  return trends;
};

/**
 * Select morning/evening routine status for home dashboard
 */
export const selectMorningEveningStatus = (
  instances: Record<string, RoutineInstance>
): {
  morning: { completed: boolean; inProgress: boolean; pending: boolean };
  evening: { completed: boolean; inProgress: boolean; pending: boolean };
} => {
  const today = getTodayString();
  const todayInstances = Object.values(instances).filter(i => i.date === today);

  const morning = todayInstances.find(i => i.type === 'morning');
  const evening = todayInstances.find(i => i.type === 'evening');

  return {
    morning: {
      completed: morning?.status === 'completed',
      inProgress: morning?.status === 'in_progress',
      pending: !morning || morning?.status === 'pending'
    },
    evening: {
      completed: evening?.status === 'completed',
      inProgress: evening?.status === 'in_progress',
      pending: !evening || evening?.status === 'pending'
    }
  };
};

/**
 * Select routine summary for momentum integration
 */
export const selectRoutineMomentumData = (
  instances: Record<string, RoutineInstance>,
  sessions: Record<string, FocusSession>
): {
  completedCount: number;
  totalCount: number;
  momentumSum: number;
  activeRoutine: RoutineInstance | null;
} => {
  const today = getTodayString();
  const todayInstances = Object.values(instances).filter(i => i.date === today);
  const todaySessions = Object.values(sessions).filter(s => {
    const sessionDate = s.actualStart?.split('T')[0] || s.scheduledStart.split('T')[0];
    return sessionDate === today;
  });

  const completedCount = todayInstances.filter(i => i.status === 'completed').length;
  const totalCount = todayInstances.length;
  const momentumSum = todayInstances.reduce((sum, i) => sum + i.momentum, 0) +
                      todaySessions.reduce((sum, s) => sum + s.momentum, 0);
  const activeRoutine = todayInstances.find(i => i.status === 'in_progress') || null;

  return {
    completedCount,
    totalCount,
    momentumSum,
    activeRoutine
  };
};

/**
 * Hook for using routine selectors with memoization
 */
export const useRoutineSelectors = () => {
  // This would be implemented in the actual hooks file
  // For now, these are pure selector functions
  return {
    selectTodayRoutines,
    selectActiveRoutines,
    selectCompletedRoutines,
    selectRoutinesByType,
    selectActiveTemplates,
    selectTemplatesByType,
    selectActiveFocusSessions,
    selectTodayFocusSessions,
    selectTodayProgress,
    selectRoutineStats,
    selectRoutineInsights,
    selectUpcomingRoutines,
    selectCompletionTrends,
    selectMorningEveningStatus,
    selectRoutineMomentumData
  };
};
