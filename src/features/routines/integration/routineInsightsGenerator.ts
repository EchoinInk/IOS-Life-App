/**
 * Routine Insights Generator
 * Generates intelligent, calm insights about routine patterns
 * No AI APIs - deterministic pattern analysis
 */

import type { RoutineInstance, RoutineType } from '../types/routineTypes';
import { getTodayString } from '../utils/dateUtils';

export interface RoutineInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'recommendation' | 'trend';
  title: string;
  content: string;
  relevance: number;
  routineType?: RoutineType;
  timestamp: string;
  isPositive: boolean;
  action?: {
    type: 'start_routine' | 'adjust_template' | 'focus_area';
    target: string;
  };
}

export class RoutineInsightsGenerator {
  /**
   * Generate comprehensive routine insights
   */
  static generateInsights(
    instances: Record<string, RoutineInstance>,
    history: Record<string, RoutineInstance[]>
  ): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    const today = getTodayString();
    const todayInstances = Object.values(instances).filter(i => i.date === today);
    const allHistory = Object.values(history).flat();

    // Generate different types of insights
    insights.push(...this.generateCompletionInsights(todayInstances));
    insights.push(...this.generateStreakInsights(allHistory));
    insights.push(...this.generatePatternInsights(allHistory));
    insights.push(...this.generateTimingInsights(todayInstances));
    insights.push(...this.generateConsistencyInsights(allHistory));

    // Sort by relevance and return top insights
    return insights
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 6);
  }

  /**
   * Generate completion-based insights
   */
  private static generateCompletionInsights(todayInstances: RoutineInstance[]): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    const completed = todayInstances.filter(i => i.status === 'completed').length;
    const total = todayInstances.length;

    if (total === 0) {
      insights.push({
        id: 'no-routines-today',
        type: 'recommendation',
        title: 'Start Your Routines',
        content: 'Begin with your morning routine to build momentum for the day.',
        relevance: 0.8,
        timestamp: new Date().toISOString(),
        isPositive: false,
        action: { type: 'start_routine', target: 'morning' }
      });
    } else if (completed === total) {
      insights.push({
        id: 'all-routines-complete',
        type: 'achievement',
        title: 'Routines Complete',
        content: `Excellent! You completed all ${total} routines today.`,
        relevance: 0.95,
        timestamp: new Date().toISOString(),
        isPositive: true
      });
    } else {
      const remaining = total - completed;
      const percentage = Math.round((completed / total) * 100);
      
      if (percentage >= 75) {
        insights.push({
          id: 'routines-almost-done',
          type: 'pattern',
          title: 'Almost There',
          content: `${remaining} routine${remaining > 1 ? 's' : ''} left to complete today.`,
          relevance: 0.7,
          timestamp: new Date().toISOString(),
          isPositive: true
        });
      }
    }

    return insights;
  }

  /**
   * Generate streak-based insights
   */
  private static generateStreakInsights(history: RoutineInstance[]): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    const routineTypes: RoutineType[] = ['morning', 'evening', 'weekly', 'focus', 'planning'];

    routineTypes.forEach(type => {
      const streak = this.calculateStreak(history, type);
      
      if (streak >= 14) {
        insights.push({
          id: `${type}-streak-amazing`,
          type: 'achievement',
          title: 'Amazing Consistency',
          content: `${streak} day ${type} routine streak! Outstanding dedication.`,
          relevance: 0.9,
          routineType: type,
          timestamp: new Date().toISOString(),
          isPositive: true
        });
      } else if (streak >= 7) {
        insights.push({
          id: `${type}-streak-week`,
          type: 'achievement',
          title: 'Weekly Milestone',
          content: `${streak} day ${type} routine streak. Keep building momentum.`,
          relevance: 0.8,
          routineType: type,
          timestamp: new Date().toISOString(),
          isPositive: true
        });
      } else if (streak >= 3) {
        insights.push({
          id: `${type}-streak-building`,
          type: 'pattern',
          title: 'Building Momentum',
          content: `${streak} day ${type} routine streak. You're building consistency.`,
          relevance: 0.6,
          routineType: type,
          timestamp: new Date().toISOString(),
          isPositive: true
        });
      }
    });

    return insights;
  }

  /**
   * Generate pattern-based insights
   */
  private static generatePatternInsights(history: RoutineInstance[]): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    
    // Find strongest routine type
    const typeCompletion: Record<RoutineType, { completed: number; total: number }> = {
      morning: { completed: 0, total: 0 },
      evening: { completed: 0, total: 0 },
      weekly: { completed: 0, total: 0 },
      focus: { completed: 0, total: 0 },
      planning: { completed: 0, total: 0 }
    };

    history.forEach(instance => {
      typeCompletion[instance.type].total++;
      if (instance.status === 'completed') {
        typeCompletion[instance.type].completed++;
      }
    });

    let bestType: RoutineType | null = null;
    let bestRate = 0;

    Object.entries(typeCompletion).forEach(([type, data]) => {
      if (data.total > 0) {
        const rate = data.completed / data.total;
        if (rate > bestRate && rate >= 0.8) {
          bestRate = rate;
          bestType = type as RoutineType;
        }
      }
    });

    if (bestType && bestRate >= 0.9) {
      insights.push({
        id: 'strongest-routine',
        type: 'pattern',
        title: 'Strongest Routine',
        content: `Your ${bestType} routine has ${Math.round(bestRate * 100)}% completion rate. This is your anchor habit.`,
        relevance: 0.75,
        routineType: bestType,
        timestamp: new Date().toISOString(),
        isPositive: true
      });
    }

    return insights;
  }

  /**
   * Generate timing-based insights
   */
  private static generateTimingInsights(todayInstances: RoutineInstance[]): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    const hour = new Date().getHours();

    // Morning routine timing
    const morningRoutine = todayInstances.find(i => i.type === 'morning');
    if (!morningRoutine && hour >= 6 && hour < 12) {
      insights.push({
        id: 'morning-routine-timing',
        type: 'recommendation',
        title: 'Morning Momentum',
        content: 'Start your morning routine to set a positive tone for the day.',
        relevance: 0.7,
        routineType: 'morning',
        timestamp: new Date().toISOString(),
        isPositive: false,
        action: { type: 'start_routine', target: 'morning' }
      });
    }

    // Evening routine timing
    const eveningRoutine = todayInstances.find(i => i.type === 'evening');
    if (!eveningRoutine && hour >= 17) {
      insights.push({
        id: 'evening-routine-timing',
        type: 'recommendation',
        title: 'Evening Reflection',
        content: 'Complete your evening routine to reflect and prepare for tomorrow.',
        relevance: 0.65,
        routineType: 'evening',
        timestamp: new Date().toISOString(),
        isPositive: false,
        action: { type: 'start_routine', target: 'evening' }
      });
    }

    return insights;
  }

  /**
   * Generate consistency-based insights
   */
  private static generateConsistencyInsights(history: RoutineInstance[]): RoutineInsight[] {
    const insights: RoutineInsight[] = [];
    
    if (history.length < 7) {
      insights.push({
        id: 'building-consistency',
        type: 'recommendation',
        title: 'Building Consistency',
        content: 'Complete routines daily to build patterns and unlock deeper insights.',
        relevance: 0.5,
        timestamp: new Date().toISOString(),
        isPositive: true
      });
      return insights;
    }

    // Calculate weekly consistency
    const last7Days = history.slice(-7);
    const uniqueDays = new Set(last7Days.map(i => i.date)).size;
    const consistencyRate = uniqueDays / 7;

    if (consistencyRate >= 0.9) {
      insights.push({
        id: 'excellent-consistency',
        type: 'achievement',
        title: 'Excellent Consistency',
        content: `You've maintained routines on ${uniqueDays} of the last 7 days.`,
        relevance: 0.85,
        timestamp: new Date().toISOString(),
        isPositive: true
      });
    } else if (consistencyRate >= 0.7) {
      insights.push({
        id: 'good-consistency',
        type: 'pattern',
        title: 'Good Consistency',
        content: `Routines completed on ${uniqueDays} of the last 7 days. Room for improvement.`,
        relevance: 0.6,
        timestamp: new Date().toISOString(),
        isPositive: true
      });
    } else {
      insights.push({
        id: 'improve-consistency',
        type: 'recommendation',
        title: 'Build Consistency',
        content: 'Focus on completing at least one routine daily to build momentum.',
        relevance: 0.7,
        timestamp: new Date().toISOString(),
        isPositive: false
      });
    }

    return insights;
  }

  /**
   * Calculate streak for a specific routine type
   */
  private static calculateStreak(history: RoutineInstance[], type: RoutineType): number {
    const typeInstances = history
      .filter(i => i.type === type && i.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date));

    if (typeInstances.length === 0) return 0;

    const today = getTodayString();
    let streak = 0;
    let currentDate = new Date(today);

    for (const instance of typeInstances) {
      const instanceDate = new Date(instance.date);
      const diffDays = Math.floor((currentDate.getTime() - instanceDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate = instanceDate;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Generate weekly routine summary
   */
  static generateWeeklySummary(history: Record<string, RoutineInstance[]>): {
    summary: string;
    highlights: string[];
    completionRate: number;
  } {
    const allInstances = Object.values(history).flat();
    const completed = allInstances.filter(i => i.status === 'completed').length;
    const total = allInstances.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const highlights: string[] = [];

    if (completionRate >= 90) {
      highlights.push('Excellent routine completion rate');
    } else if (completionRate >= 70) {
      highlights.push('Strong routine consistency');
    }

    const streaks: Record<RoutineType, number> = {
      morning: this.calculateStreak(allInstances, 'morning'),
      evening: this.calculateStreak(allInstances, 'evening'),
      weekly: this.calculateStreak(allInstances, 'weekly'),
      focus: this.calculateStreak(allInstances, 'focus'),
      planning: this.calculateStreak(allInstances, 'planning')
    };

    const longestStreak = Math.max(...Object.values(streaks));
    if (longestStreak >= 7) {
      highlights.push(`${longestStreak} day streak achieved`);
    }

    let summary = '';
    if (completionRate >= 90) {
      summary = 'Outstanding routine discipline this week. You\'re building excellent habits.';
    } else if (completionRate >= 70) {
      summary = 'Good routine consistency. Small improvements will build strong momentum.';
    } else if (completionRate >= 50) {
      summary = 'Making progress with routines. Focus on consistency to build better habits.';
    } else {
      summary = 'Routines need attention. Start with just one daily routine to build momentum.';
    }

    return { summary, highlights, completionRate };
  }
}
