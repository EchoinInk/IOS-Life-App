import type { DailyScore } from "./types/types";
import type { WeeklyConsistency } from "./types/types";
import { getToday, parseDateKey } from "@/shared/lib/date";

/**
 * Weekly Consistency Calculator
 * 
 * Calculates consistency metrics for a given week.
 * Tracks how many days were completed and average score.
 */

/**
 * Get week start and end dates for a given date
 * Week starts on Monday
 */
export const getWeekRange = (date: string = getToday()): { start: string; end: string } => {
  const dateObj = parseDateKey(date);
  const day = dateObj.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust for Monday start
  const start = new Date(dateObj);
  start.setDate(dateObj.getDate() + diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  const startDate = start.toISOString().split('T')[0];
  const endDate = end.toISOString().split('T')[0];
  
  return {
    start: startDate || date,
    end: endDate || date,
  };
};

/**
 * Calculate weekly consistency metrics
 */
export const calculateWeeklyConsistency = (
  dailyScores: DailyScore[],
  date: string = getToday()
): WeeklyConsistency => {
  const { start, end } = getWeekRange(date);
  
  // Filter scores for the current week
  const weekScores = dailyScores.filter(score => {
    const scoreDate = parseDateKey(score.date);
    const startDate = parseDateKey(start);
    const endDate = parseDateKey(end);
    return scoreDate >= startDate && scoreDate <= endDate;
  });
  
  const daysCompleted = weekScores.filter(s => s.completed).length;
  const totalDays = 7; // Always 7 days in a week
  const averageScore = weekScores.length > 0
    ? weekScores.reduce((sum, s) => sum + s.score, 0) / weekScores.length
    : 0;
  
  // Determine trend by comparing with previous week
  const previousWeekEnd = getWeekRange(getDaysBetween(start, -1)).end;
  const previousWeekScores = dailyScores.filter(s => {
    const scoreDate = parseDateKey(s.date);
    const previousWeekStart = parseDateKey(getDaysBetween(start, -7));
    const previousWeekEndDate = parseDateKey(previousWeekEnd);
    return scoreDate >= previousWeekStart && scoreDate <= previousWeekEndDate;
  });
  
  const previousDaysCompleted = previousWeekScores.filter(s => s.completed).length;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (daysCompleted > previousDaysCompleted) {
    trend = 'up';
  } else if (daysCompleted < previousDaysCompleted) {
    trend = 'down';
  }
  
  return {
    weekStart: start,
    weekEnd: end,
    daysCompleted,
    totalDays,
    averageScore: Math.round(averageScore),
    trend,
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
 * Get consistency message
 */
export const getConsistencyMessage = (consistency: WeeklyConsistency): string => {
  const percentage = (consistency.daysCompleted / consistency.totalDays) * 100;
  
  if (percentage >= 100) {
    return "Perfect week! You completed every day. 🎉";
  }
  
  if (percentage >= 80) {
    return `Great consistency! ${consistency.daysCompleted}/${consistency.totalDays} days completed.`;
  }
  
  if (percentage >= 50) {
    return `Good progress. ${consistency.daysCompleted}/${consistency.totalDays} days completed.`;
  }
  
  if (percentage > 0) {
    return `Getting started. ${consistency.daysCompleted}/${consistency.totalDays} days completed.`;
  }
  
  return "Start your consistency journey today!";
};
