/**
 * Routine Scoring - Handles momentum calculations and scoring
 * Isolated domain logic for routine performance metrics
 */

import type { 
  RoutineInstance, 
  RoutineCompletionStats, 
  RoutineType, 
  RoutineStatus 
} from '../types/routines.types';
import { getTodayString, isThisMonth, getWeekStart, getWeekEnd } from '../utils/dateUtils';

/**
 * Calculate momentum contribution for a routine step
 */
export const calculateStepMomentum = (
  stepStatus: RoutineStatus,
  isOptional: boolean
): number => {
  if (stepStatus !== 'completed') return 0;
  if (isOptional) return 1; // Optional steps give less momentum
  return 2; // Required steps give standard momentum
};

/**
 * Calculate total momentum for a routine instance
 */
export const calculateRoutineMomentum = (instance: RoutineInstance): number => {
  return instance.steps.reduce((total, step) => total + step.momentum, 0);
};

/**
 * Calculate completion rate for a set of routines
 */
export const calculateCompletionRate = (
  instances: RoutineInstance[]
): number => {
  if (instances.length === 0) return 0;
  const completed = instances.filter(instance => instance.status === 'completed').length;
  return Math.round((completed / instances.length) * 100);
};

/**
 * Calculate type-specific completion rates
 */
export const calculateTypeCompletionRates = (
  instances: RoutineInstance[]
): Record<RoutineType, number> => {
  const rates: Record<RoutineType, number> = {
    morning: 0,
    evening: 0,
    weekly: 0,
    focus: 0,
    planning: 0
  };

  Object.keys(rates).forEach(type => {
    const routineType = type as RoutineType;
    const typeInstances = instances.filter(instance => instance.type === routineType);
    rates[routineType] = calculateCompletionRate(typeInstances);
  });

  return rates;
};

/**
 * Calculate weekly completion rate
 */
export const calculateWeeklyCompletionRate = (instances: RoutineInstance[]): number => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);

  const weekInstances = instances.filter(instance => {
    const instanceDate = new Date(instance.date);
    return instanceDate >= weekStart && instanceDate <= weekEnd;
  });

  return calculateCompletionRate(weekInstances);
};

/**
 * Calculate monthly completion rate
 */
export const calculateMonthlyCompletionRate = (instances: RoutineInstance[]): number => {
  const monthInstances = instances.filter(instance => {
    const instanceDate = new Date(instance.date);
    return isThisMonth(instanceDate);
  });

  return calculateCompletionRate(monthInstances);
};

/**
 * Calculate current streaks for each routine type
 */
export const calculateCurrentStreaks = (
  instances: RoutineInstance[]
): Record<RoutineType, number> => {
  const streaks: Record<RoutineType, number> = {
    morning: 0,
    evening: 0,
    weekly: 0,
    focus: 0,
    planning: 0
  };

  // Sort instances by date (newest first)
  const sortedInstances = [...instances].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  Object.keys(streaks).forEach(type => {
    const routineType = type as RoutineType;
    const typeInstances = sortedInstances.filter(instance => instance.type === routineType);
    
    let streak = 0;
    let currentDate = new Date(getTodayString());
    
    for (const instance of typeInstances) {
      const instanceDate = new Date(instance.date);
      
      // Check if this instance is from consecutive days
      const daysDiff = Math.floor((currentDate.getTime() - instanceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak && instance.status === 'completed') {
        streak++;
        currentDate = instanceDate;
      } else {
        break;
      }
    }
    
    streaks[routineType] = streak;
  });

  return streaks;
};

/**
 * Calculate longest streaks for each routine type
 */
export const calculateLongestStreaks = (
  instances: RoutineInstance[]
): Record<RoutineType, number> => {
  const streaks: Record<RoutineType, number> = {
    morning: 0,
    evening: 0,
    weekly: 0,
    focus: 0,
    planning: 0
  };

  Object.keys(streaks).forEach(type => {
    const routineType = type as RoutineType;
    const typeInstances = instances.filter(instance => instance.type === routineType);
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    typeInstances.forEach(instance => {
      if (instance.status === 'completed') {
        const instanceDate = new Date(instance.date);
        
        if (lastDate) {
          const daysDiff = Math.floor((lastDate.getTime() - instanceDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) { // Consecutive day
            currentStreak++;
          } else {
            currentStreak = 1; // Reset streak
          }
        } else {
          currentStreak = 1;
        }
        
        lastDate = instanceDate;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
        lastDate = null;
      }
    });
    
    streaks[routineType] = longestStreak;
  });

  return streaks;
};

/**
 * Calculate average momentum contribution
 */
export const calculateAverageMomentum = (instances: RoutineInstance[]): number => {
  if (instances.length === 0) return 0;
  
  const totalMomentum = instances.reduce((sum, instance) => sum + instance.momentum, 0);
  return Math.round(totalMomentum / instances.length);
};

/**
 * Generate comprehensive completion statistics
 */
export const generateCompletionStats = (
  instances: RoutineInstance[]
): RoutineCompletionStats => {
  const overallCompletionRate = calculateCompletionRate(instances);
  const typeCompletionRates = calculateTypeCompletionRates(instances);
  const weeklyCompletionRate = calculateWeeklyCompletionRate(instances);
  const monthlyCompletionRate = calculateMonthlyCompletionRate(instances);
  const currentStreaks = calculateCurrentStreaks(instances);
  const longestStreaks = calculateLongestStreaks(instances);
  const averageMomentumContribution = calculateAverageMomentum(instances);

  return {
    overallCompletionRate,
    typeCompletionRates,
    weeklyCompletionRate,
    monthlyCompletionRate,
    currentStreaks,
    longestStreaks,
    averageMomentumContribution
  };
};
