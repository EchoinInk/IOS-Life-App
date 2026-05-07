/**
 * Streak Engine - Handles streak calculations and tracking
 * Isolated domain logic for streak management
 */

import type { RoutineInstance, RoutineType } from '../types/routineTypes';
import { getTodayString } from '../utils/dateUtils';

/**
 * Calculate current streak for a specific routine type
 */
export const calculateCurrentStreak = (
  instances: RoutineInstance[],
  routineType: RoutineType
): number => {
  const typeInstances = instances
    .filter(instance => instance.type === routineType)
    .filter(instance => instance.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (typeInstances.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date(getTodayString());
  
  for (const instance of typeInstances) {
    const instanceDate = new Date(instance.date);
    
    // Check if this instance is from consecutive days
    const daysDiff = Math.floor((currentDate.getTime() - instanceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = instanceDate;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak for a specific routine type
 */
export const calculateLongestStreak = (
  instances: RoutineInstance[],
  routineType: RoutineType
): number => {
  const typeInstances = instances
    .filter(instance => instance.type === routineType)
    .filter(instance => instance.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  typeInstances.forEach(instance => {
    const instanceDate = new Date(instance.date);
    
    if (lastDate) {
      const daysDiff = Math.floor((instanceDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
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
  });

  return longestStreak;
};

/**
 * Calculate all streaks for routine types
 */
export const calculateAllStreaks = (
  instances: RoutineInstance[]
): { current: Record<RoutineType, number>; longest: Record<RoutineType, number> } => {
  const routineTypes: RoutineType[] = ['morning', 'evening', 'weekly', 'focus', 'planning'];
  
  const currentStreaks: Record<RoutineType, number> = {
    morning: 0,
    evening: 0,
    weekly: 0,
    focus: 0,
    planning: 0
  };
  
  const longestStreaks: Record<RoutineType, number> = {
    morning: 0,
    evening: 0,
    weekly: 0,
    focus: 0,
    planning: 0
  };

  routineTypes.forEach(type => {
    currentStreaks[type] = calculateCurrentStreak(instances, type);
    longestStreaks[type] = calculateLongestStreak(instances, type);
  });

  return { current: currentStreaks, longest: longestStreaks };
};

/**
 * Check if streak is at risk (missed yesterday)
 */
export const isStreakAtRisk = (
  instances: RoutineInstance[],
  routineType: RoutineType
): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0] || '';

  // Check if yesterday's routine was completed
  const yesterdayInstance = instances.find(instance => 
    instance.type === routineType && 
    instance.date === yesterdayString
  );

  // If yesterday was missed and we have a current streak, it's at risk
  const currentStreak = calculateCurrentStreak(instances, routineType);
  return currentStreak > 0 && (!yesterdayInstance || yesterdayInstance.status !== 'completed');
};

/**
 * Get streak milestones and achievements
 */
export const getStreakMilestones = (streak: number): string[] => {
  const milestones: string[] = [];
  
  if (streak >= 1) milestones.push('First Day Complete!');
  if (streak >= 3) milestones.push('3-Day Streak!');
  if (streak >= 7) milestones.push('One Week Strong!');
  if (streak >= 14) milestones.push('Two Weeks Consistent!');
  if (streak >= 30) milestones.push('Monthly Mastery!');
  if (streak >= 60) milestones.push('Two Months Dedicated!');
  if (streak >= 90) milestones.push('Quarterly Champion!');
  if (streak >= 180) milestones.push('Six Months Unstoppable!');
  if (streak >= 365) milestones.push('Year of Excellence!');
  
  return milestones;
};

/**
 * Calculate streak recovery suggestions
 */
export const getStreakRecoverySuggestions = (
  instances: RoutineInstance[],
  routineType: RoutineType
): string[] => {
  const suggestions: string[] = [];
  const currentStreak = calculateCurrentStreak(instances, routineType);
  
  if (currentStreak === 0) {
    suggestions.push('Start fresh today - every journey begins with a single step');
    suggestions.push('Focus on consistency over perfection');
  } else if (currentStreak < 3) {
    suggestions.push('You\'re building momentum - keep going!');
    suggestions.push('Try setting a reminder to maintain consistency');
  } else if (currentStreak < 7) {
    suggestions.push('Great start! Aim for a full week');
    suggestions.push('Consider adjusting the routine time if needed');
  } else {
    suggestions.push('Excellent consistency! You\'ve got this');
    suggestions.push('Share your progress to stay motivated');
  }
  
  return suggestions;
};

/**
 * Predict streak continuation probability
 */
export const predictStreakContinuation = (
  instances: RoutineInstance[],
  routineType: RoutineType
): { probability: number; confidence: number } => {
  const typeInstances = instances
    .filter(instance => instance.type === routineType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (typeInstances.length < 7) {
    return { probability: 0.5, confidence: 0.2 };
  }

  // Calculate completion rate for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentInstances = typeInstances.filter(instance => 
    instance.date && new Date(instance.date) >= thirtyDaysAgo
  );
  
  const completedCount = recentInstances.filter(instance => 
    instance.status === 'completed'
  ).length;
  
  const completionRate = completedCount / recentInstances.length;
  
  // Calculate consistency (variance in completion)
  let consistency = 1;
  if (recentInstances.length > 1) {
    const completedDays = recentInstances
      .filter(instance => instance.status === 'completed' && instance.date)
      .map(instance => new Date(instance.date).getTime());
    
    if (completedDays.length > 1) {
      const gaps: number[] = [];
      for (let i = 1; i < completedDays.length; i++) {
        const current = completedDays[i]!;
        const prev = completedDays[i - 1]!;
        gaps.push(current - prev);
      }
      
      const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
      const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
      consistency = 1 / (1 + variance / (1000 * 60 * 60 * 24)); // Normalize by day
    }
  }
  
  const probability = completionRate * consistency;
  const confidence = Math.min(recentInstances.length / 30, 1);
  
  return { probability, confidence };
};
