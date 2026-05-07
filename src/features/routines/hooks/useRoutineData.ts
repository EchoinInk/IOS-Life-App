/**
 * Routine Data Hook - Abstraction layer for routine data access
 * Follows Lumo's hook patterns for clean separation of concerns
 */

import { useMemo } from 'react';
import { useRoutinesStore } from '../store/routinesStore';
import { getTodayString } from '../utils/dateUtils';
import type {
  RoutineInstance,
  RoutineTemplate,
  FocusSession,
  RoutineProgress
} from '../types/routineTypes';
import type { RoutineCompletionStats } from '../types/routines.types';

export interface RoutineData {
  // Today's data
  todayRoutines: RoutineInstance[];
  todayProgress: RoutineProgress;
  todayRecurringTasks: unknown[];
  overdueTasks: unknown[];

  // Templates
  activeTemplates: RoutineTemplate[];

  // Focus sessions
  activeFocusSession: FocusSession | undefined;
  todayFocusSessions: FocusSession[];

  // Historical data
  allHistory: RoutineInstance[];
  completionStats: RoutineCompletionStats;

  // Computed values
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Hook for accessing routine data with computed properties
 * Provides memoized calculations to prevent unnecessary re-renders
 */
export const useRoutineData = (): RoutineData => {
  const state = useRoutinesStore((store) => store.state);

  // Memoized today's routines
  const todayRoutines = useMemo(() => {
    const today = getTodayString();
    return Object.values(state.instances)
      .filter((routine): routine is RoutineInstance => routine.date === today);
  }, [state.instances]);

  // Memoized today's progress
  const todayProgress = useMemo((): RoutineProgress => {
    const totalRoutines = todayRoutines.length;
    const completedRoutines = todayRoutines.filter(r => r.status === 'completed').length;
    const inProgressRoutines = todayRoutines.filter(r => r.status === 'in_progress').length;
    const percentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;
    const momentumContribution = todayRoutines.reduce((sum, r) => sum + r.momentum, 0);

    const activeFocusSession = Object.values(state.focusSessions)
      .find(session => session.status === 'active');

    return {
      totalRoutines,
      completedRoutines,
      inProgressRoutines,
      percentage,
      momentumContribution,
      currentFocusSession: activeFocusSession
    };
  }, [todayRoutines, state.focusSessions]);

  // Memoized active templates
  const activeTemplates = useMemo(() => {
    return Object.values(state.templates)
      .filter(template => template.isActive);
  }, [state.templates]);

  // Memoized focus sessions
  const activeFocusSession = useMemo(() => {
    return Object.values(state.focusSessions)
      .find(session => session.status === 'active');
  }, [state.focusSessions]);

  const todayFocusSessions = useMemo(() => {
    const today = getTodayString();
    return Object.values(state.focusSessions)
      .filter(session => {
        const sessionDate = session.actualStart?.split('T')[0] || session.scheduledStart.split('T')[0];
        return sessionDate === today;
      });
  }, [state.focusSessions]);

  // No history in current store - return empty
  const allHistory = useMemo(() => [] as RoutineInstance[], []);

  // Default completion stats
  const completionStats = useMemo((): RoutineCompletionStats => ({
    overallCompletionRate: 0,
    typeCompletionRates: { morning: 0, evening: 0, weekly: 0, focus: 0, planning: 0 },
    weeklyCompletionRate: 0,
    monthlyCompletionRate: 0,
    currentStreaks: { morning: 0, evening: 0, weekly: 0, focus: 0, planning: 0 },
    longestStreaks: { morning: 0, evening: 0, weekly: 0, focus: 0, planning: 0 },
    averageMomentumContribution: 0
  }), []);

  return {
    todayRoutines,
    todayProgress,
    todayRecurringTasks: [],
    overdueTasks: [],
    activeTemplates,
    activeFocusSession,
    todayFocusSessions,
    allHistory,
    completionStats,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated
  };
};
