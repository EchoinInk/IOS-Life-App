/**
 * Routine-Momentum Integration Bridge
 * Converts routine data into momentum activities and scores
 * Maintains deterministic logic without AI APIs
 */

import type { DailyActivity, MomentumCategory } from '@/features/momentum/types/momentum.types';
import type { RoutineInstance, RoutineType, FocusSession } from '../types/routineTypes';
import { getTodayString } from '../utils/dateUtils';

/**
 * Convert a routine instance to a momentum activity
 */
export const routineToMomentumActivity = (
  instance: RoutineInstance
): DailyActivity => {
  const completedSteps = instance.steps.filter(s => s.status === 'completed').length;
  const totalSteps = instance.steps.length;
  const completionRate = totalSteps > 0 ? completedSteps / totalSteps : 0;
  
  // Base value depends on completion rate and routine type
  const baseValue = Math.round(completionRate * 10);
  
  // Bonus for full completion
  const completionBonus = completionRate === 1 ? 2 : 0;
  
  const value = Math.min(10, baseValue + completionBonus);
  
  return {
    id: `routine-${instance.id}`,
    category: 'routines' as MomentumCategory,
    type: instance.type,
    completed: instance.status === 'completed',
    value,
    timestamp: instance.completedAt || instance.startedAt || new Date().toISOString(),
    metadata: {
      routineId: instance.id,
      templateId: instance.templateId,
      routineType: instance.type,
      completionRate: Math.round(completionRate * 100),
      momentum: instance.momentum
    }
  };
};

/**
 * Convert a focus session to a momentum activity
 */
export const focusSessionToMomentumActivity = (
  session: FocusSession
): DailyActivity => {
  let value = 0;
  
  if (session.status === 'completed') {
    // Base value from quality
    switch (session.quality) {
      case 'high':
        value = 10;
        break;
      case 'medium':
        value = 7;
        break;
      case 'low':
        value = 4;
        break;
    }
  }
  
  return {
    id: `focus-${session.id}`,
    category: 'routines' as MomentumCategory,
    type: 'focus_session',
    completed: session.status === 'completed',
    value,
    timestamp: session.actualEnd || session.actualStart || session.scheduledStart,
    metadata: {
      sessionId: session.id,
      focusArea: session.focusArea,
      duration: session.duration,
      quality: session.quality,
      interruptions: session.interruptions
    }
  };
};

/**
 * Get routine momentum contribution for today
 */
export const getTodayRoutineMomentum = (
  instances: Record<string, RoutineInstance>,
  sessions: Record<string, FocusSession>
): {
  activities: DailyActivity[];
  totalMomentum: number;
  completedRoutines: number;
  totalRoutines: number;
} => {
  const today = getTodayString();
  const activities: DailyActivity[] = [];
  let totalMomentum = 0;
  let completedRoutines = 0;
  let totalRoutines = 0;
  
  // Process routine instances
  Object.values(instances).forEach(instance => {
    if (instance.date === today) {
      totalRoutines++;
      if (instance.status === 'completed') {
        completedRoutines++;
        totalMomentum += instance.momentum;
      }
      activities.push(routineToMomentumActivity(instance));
    }
  });
  
  // Process focus sessions
  Object.values(sessions).forEach(session => {
    const sessionDate = session.actualStart?.split('T')[0] || session.scheduledStart.split('T')[0];
    if (sessionDate === today) {
      activities.push(focusSessionToMomentumActivity(session));
      if (session.status === 'completed') {
        totalMomentum += session.momentum;
      }
    }
  });
  
  return {
    activities,
    totalMomentum,
    completedRoutines,
    totalRoutines
  };
};

/**
 * Get routine type label for momentum
 */
export const getRoutineTypeLabel = (type: RoutineType): string => {
  const labels: Record<RoutineType, string> = {
    morning: 'Morning Routine',
    evening: 'Evening Review',
    weekly: 'Weekly Reset',
    focus: 'Focus Session',
    planning: 'Planning Ritual'
  };
  return labels[type] || type;
};

/**
 * Calculate routine streak contribution
 */
export const calculateRoutineStreakContribution = (
  instances: Record<string, RoutineInstance>,
  routineType: RoutineType
): number => {
  const today = getTodayString();
  const typeInstances = Object.values(instances).filter(
    i => i.type === routineType && i.status === 'completed'
  );
  
  // Simple streak calculation - consecutive days
  if (typeInstances.length === 0) return 0;
  
  const sortedDates = [...new Set(typeInstances.map(i => i.date))].sort().reverse();
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const date of sortedDates) {
    const instanceDate = new Date(date);
    const diffDays = Math.floor((currentDate.getTime() - instanceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
      currentDate = instanceDate;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get routine momentum summary for UI
 */
export const getRoutineMomentumSummary = (
  instances: Record<string, RoutineInstance>,
  sessions: Record<string, FocusSession>
) => {
  const todayData = getTodayRoutineMomentum(instances, sessions);
  
  // Calculate streaks by type
  const routineTypes: RoutineType[] = ['morning', 'evening', 'weekly', 'focus', 'planning'];
  const streaks: Record<RoutineType, number> = {} as Record<RoutineType, number>;
  
  routineTypes.forEach(type => {
    streaks[type] = calculateRoutineStreakContribution(instances, type);
  });
  
  // Find strongest routine
  let strongestRoutine: RoutineType | null = null;
  let longestStreak = 0;
  
  Object.entries(streaks).forEach(([type, streak]) => {
    if (streak > longestStreak) {
      longestStreak = streak;
      strongestRoutine = type as RoutineType;
    }
  });
  
  return {
    ...todayData,
    streaks,
    strongestRoutine,
    longestStreak,
    completionRate: todayData.totalRoutines > 0 
      ? Math.round((todayData.completedRoutines / todayData.totalRoutines) * 100)
      : 0
  };
};
