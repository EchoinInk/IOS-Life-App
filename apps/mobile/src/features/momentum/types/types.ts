/**
 * Momentum Feature Types
 * 
 * Core types for retention and engagement tracking systems.
 */

export type StreakType = 'tasks' | 'meals' | 'budget' | 'shopping' | 'overall';

export interface DailyScore {
  date: string;
  score: number; // 0-100
  breakdown: {
    tasks: number;
    meals: number;
    budget: number;
    shopping: number;
  };
  completed: boolean;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
  type: StreakType;
}

export interface WeeklyConsistency {
  weekStart: string;
  weekEnd: string;
  daysCompleted: number;
  totalDays: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TrendSummary {
  period: 'week' | 'month';
  direction: 'improving' | 'declining' | 'stable';
  changePercent: number;
  highlights: string[];
  concerns: string[];
}

export interface MomentumState {
  dailyScores: DailyScore[];
  streaks: Record<StreakType, StreakData>;
  weeklyConsistency: WeeklyConsistency[];
  lastCalculated: string | null;
}
