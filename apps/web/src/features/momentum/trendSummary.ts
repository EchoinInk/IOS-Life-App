import type { DailyScore } from "./types/types";
import type { TrendSummary } from "./types/types";
import { getToday, parseDateKey } from "@/shared/lib/date";

/**
 * Trend Summary Calculator
 * 
 * Analyzes performance trends over time periods.
 * Identifies improvements, declines, and key insights.
 */

/**
 * Calculate trend summary for a period
 */
export const calculateTrendSummary = (
  dailyScores: DailyScore[],
  period: 'week' | 'month' = 'week'
): TrendSummary => {
  const today = getToday();
  const days = period === 'week' ? 7 : 30;
  
  const startDate = getDaysBetween(today, -days);
  const recentScores = dailyScores.filter(s => {
    const scoreDate = parseDateKey(s.date);
    const start = parseDateKey(startDate);
    return scoreDate >= start;
  });
  
  if (recentScores.length === 0) {
    return {
      period,
      direction: 'stable',
      changePercent: 0,
      highlights: ['No data available yet'],
      concerns: [],
    };
  }
  
  const recentAverage = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length;
  
  // Compare with previous period
  const previousStart = getDaysBetween(startDate, -days);
  const previousScores = dailyScores.filter(s => {
    const scoreDate = parseDateKey(s.date);
    const start = parseDateKey(previousStart);
    const end = parseDateKey(startDate);
    return scoreDate >= start && scoreDate < end;
  });
  
  let direction: 'improving' | 'declining' | 'stable' = 'stable';
  let changePercent = 0;
  
  if (previousScores.length > 0) {
    const previousAverage = previousScores.reduce((sum, s) => sum + s.score, 0) / previousScores.length;
    changePercent = ((recentAverage - previousAverage) / previousAverage) * 100;
    
    if (changePercent > 5) {
      direction = 'improving';
    } else if (changePercent < -5) {
      direction = 'declining';
    }
  }
  
  // Generate highlights and concerns
  const highlights: string[] = [];
  const concerns: string[] = [];
  
  const completedDays = recentScores.filter(s => s.completed).length;
  const completionRate = (completedDays / recentScores.length) * 100;
  
  if (completionRate >= 80) {
    highlights.push(`High completion rate: ${Math.round(completionRate)}%`);
  } else if (completionRate < 50 && recentScores.length >= 3) {
    concerns.push(`Low completion rate: ${Math.round(completionRate)}%`);
  }
  
  if (direction === 'improving') {
    highlights.push(`Performance improving by ${Math.round(Math.abs(changePercent))}%`);
  } else if (direction === 'declining') {
    concerns.push(`Performance declining by ${Math.round(Math.abs(changePercent))}%`);
  }
  
  // Check category-specific trends
  const recentTaskAvg = recentScores.reduce((sum, s) => sum + s.breakdown.tasks, 0) / recentScores.length;
  const recentMealAvg = recentScores.reduce((sum, s) => sum + s.breakdown.meals, 0) / recentScores.length;
  
  if (recentTaskAvg >= 80) {
    highlights.push('Strong task consistency');
  } else if (recentTaskAvg < 50 && recentScores.length >= 3) {
    concerns.push('Task consistency needs improvement');
  }
  
  if (recentMealAvg >= 80) {
    highlights.push('Good meal logging habits');
  } else if (recentMealAvg < 50 && recentScores.length >= 3) {
    concerns.push('Meal logging needs attention');
  }
  
  // Ensure at least one highlight if no concerns
  if (highlights.length === 0 && concerns.length === 0) {
    highlights.push('Building momentum - keep going!');
  }
  
  return {
    period,
    direction,
    changePercent: Math.round(changePercent),
    highlights,
    concerns,
  };
};

/**
 * Helper function to get days between dates
 */
const getDaysBetween = (date: string, offset: number): string => {
  const dateObj = parseDateKey(date);
  dateObj.setDate(dateObj.getDate() + offset);
  const result = dateObj.toISOString().split('T')[0];
  return result || date;
};

/**
 * Get trend emoji
 */
export const getTrendEmoji = (direction: TrendSummary['direction']): string => {
  const emojis = {
    improving: '📈',
    declining: '📉',
    stable: '➡️',
  };
  return emojis[direction];
};
