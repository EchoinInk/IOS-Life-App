/**
 * Completion Engine - Handles completion calculations and statistics
 * Isolated domain logic for completion tracking
 */

import type { RoutineInstance, RoutineType, RoutineStats } from '../types/routineTypes';
import { getTodayString, isThisMonth, getWeekStart, getWeekEnd } from '../utils/dateUtils';

/**
 * Calculate completion rate for a set of routine instances
 */
export const calculateCompletionRate = (instances: RoutineInstance[]): number => {
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
 * Calculate average momentum contribution
 */
export const calculateAverageMomentum = (instances: RoutineInstance[]): number => {
  if (instances.length === 0) return 0;
  
  const totalMomentum = instances.reduce((sum, instance) => sum + instance.momentum, 0);
  return Math.round(totalMomentum / instances.length);
};

/**
 * Generate comprehensive routine statistics
 */
export const generateRoutineStats = (instances: RoutineInstance[]): RoutineStats => {
  const overallCompletionRate = calculateCompletionRate(instances);
  const typeCompletionRates = calculateTypeCompletionRates(instances);
  const weeklyCompletionRate = calculateWeeklyCompletionRate(instances);
  const monthlyCompletionRate = calculateMonthlyCompletionRate(instances);
  const averageMomentumContribution = calculateAverageMomentum(instances);

  // Calculate streaks (these would come from streakEngine in a real implementation)
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

/**
 * Calculate completion trends over time
 */
export const calculateCompletionTrends = (
  instances: RoutineInstance[],
  days: number = 30
): { date: string; rate: number; count: number }[] => {
  const trends: { date: string; rate: number; count: number }[] = [];
  const today = new Date(getTodayString());

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0] || '';

    const dayInstances = instances.filter(instance => instance.date === dateString);
    const completionRate = calculateCompletionRate(dayInstances);

    trends.push({
      date: dateString,
      rate: completionRate,
      count: dayInstances.length
    });
  }

  return trends;
};

/**
 * Get completion insights and recommendations
 */
export const getCompletionInsights = (
  instances: RoutineInstance[]
): { insight: string; type: 'positive' | 'negative' | 'neutral'; priority: number }[] => {
  const insights: { insight: string; type: 'positive' | 'negative' | 'neutral'; priority: number }[] = [];
  const stats = generateRoutineStats(instances);

  // Overall completion insights
  if (stats.overallCompletionRate >= 80) {
    insights.push({
      insight: 'Excellent completion rate! You\'re maintaining great consistency.',
      type: 'positive',
      priority: 1
    });
  } else if (stats.overallCompletionRate >= 60) {
    insights.push({
      insight: 'Good completion rate with room for improvement.',
      type: 'neutral',
      priority: 2
    });
  } else {
    insights.push({
      insight: 'Completion rate could be improved. Consider simplifying routines.',
      type: 'negative',
      priority: 3
    });
  }

  // Type-specific insights
  Object.entries(stats.typeCompletionRates).forEach(([type, rate]) => {
    if (rate >= 90) {
      insights.push({
        insight: `${type} routines are highly consistent - keep it up!`,
        type: 'positive',
        priority: 2
      });
    } else if (rate <= 30) {
      insights.push({
        insight: `${type} routines need attention - consider adjusting timing or content.`,
        type: 'negative',
        priority: 3
      });
    }
  });

  // Weekly performance
  if (stats.weeklyCompletionRate >= 75) {
    insights.push({
      insight: 'Strong weekly performance maintaining momentum.',
      type: 'positive',
      priority: 2
    });
  } else if (stats.weeklyCompletionRate <= 40) {
    insights.push({
      insight: 'Weekly performance needs focus - review weekly routine structure.',
      type: 'negative',
      priority: 3
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
};

/**
 * Calculate routine efficiency (momentum per time spent)
 */
export const calculateRoutineEfficiency = (
  instances: RoutineInstance[],
  templates: Record<string, { estimatedDuration: number }>
): { efficiency: number; insights: string[] } => {
  if (instances.length === 0) {
    return { efficiency: 0, insights: ['No routine data available for efficiency calculation'] };
  }

  let totalMomentum = 0;
  let totalEstimatedTime = 0;
  const insights: string[] = [];

  instances.forEach(instance => {
    const template = templates[instance.templateId];
    if (template) {
      totalMomentum += instance.momentum;
      totalEstimatedTime += template.estimatedDuration;
    }
  });

  const efficiency = totalEstimatedTime > 0 ? totalMomentum / totalEstimatedTime : 0;

  // Generate insights
  if (efficiency >= 0.3) {
    insights.push('High efficiency - great momentum per time invested!');
  } else if (efficiency >= 0.2) {
    insights.push('Good efficiency with balanced momentum and time.');
  } else {
    insights.push('Consider optimizing routine structure for better momentum.');
  }

  return { efficiency, insights };
};

/**
 * Predict future completion probability
 */
export const predictCompletionProbability = (
  instances: RoutineInstance[],
  routineType: RoutineType
): { probability: number; confidence: number; factors: string[] } => {
  const typeInstances = instances.filter(instance => instance.type === routineType);
  const factors: string[] = [];

  if (typeInstances.length < 5) {
    return {
      probability: 0.5,
      confidence: 0.2,
      factors: ['Limited historical data for prediction']
    };
  }

  // Recent performance (last 10 instances)
  const recentInstances = typeInstances.slice(-10);
  const recentCompletionRate = calculateCompletionRate(recentInstances);
  
  // Time of day performance
  const morningInstances = typeInstances.filter(instance => {
    const hour = new Date(instance.startedAt || instance.date).getHours();
    return hour >= 6 && hour < 12;
  });
  const morningRate = calculateCompletionRate(morningInstances);

  // Day of week performance
  const weekdayInstances = typeInstances.filter(instance => {
    const day = new Date(instance.date).getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  });
  const weekdayRate = calculateCompletionRate(weekdayInstances);

  // Calculate weighted probability
  let probability = recentCompletionRate * 0.5; // 50% weight on recent performance
  const confidence = Math.min(recentInstances.length / 10, 1);

  // Adjust based on time patterns
  if (morningInstances.length > 0) {
    probability += morningRate * 0.3;
    if (morningRate > 80) factors.push('Strong morning performance');
  }

  // Adjust based on day patterns
  if (weekdayInstances.length > 0) {
    probability += weekdayRate * 0.2;
    if (weekdayRate > 80) factors.push('Consistent weekday performance');
  }

  // Add insights
  if (recentCompletionRate > 85) {
    factors.push('Excellent recent consistency');
  } else if (recentCompletionRate < 50) {
    factors.push('Recent performance needs improvement');
  }

  return {
    probability: Math.min(probability, 1),
    confidence,
    factors
  };
};
