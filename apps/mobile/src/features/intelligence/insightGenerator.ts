/**
 * Insight Generator
 * Generates contextual insights from user data and patterns
 */

import type { 
  SmartInsight, 
  IntelligenceContext,
  Pattern 
} from './types/intelligence.types';
import { PatternDetector } from './patternDetection';

export class InsightGenerator {
  /**
   * Generate all insights from context
   */
  static generateInsights(context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // Get patterns first
    const patterns = PatternDetector.detectPatterns(context);

    // Generate insights from patterns
    insights.push(...this.generatePatternInsights(patterns, context));

    // Generate direct insights from data
    insights.push(...this.generateTaskInsights(context));
    insights.push(...this.generateBudgetInsights(context));
    insights.push(...this.generateMealInsights(context));
    insights.push(...this.generateMomentumInsights(context));

    // Sort by severity and timestamp
    return insights.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1, info: 0 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Generate insights from detected patterns
   */
  private static generatePatternInsights(patterns: Pattern[], _context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];

    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'time_of_day':
          if (pattern.confidence > 0.6) {
            insights.push({
              id: `pattern-${pattern.id}`,
              type: 'pattern',
              title: 'Peak Productivity Time',
              description: `You tend to complete tasks most effectively around ${this.extractTimeFromPattern(pattern.data.pattern)}. Consider scheduling important tasks during this time.`,
              severity: 'info',
              category: 'tasks',
              timestamp: new Date().toISOString(),
              actionable: true,
              data: pattern.data
            });
          }
          break;

        case 'day_of_week':
          if (pattern.confidence > 0.5) {
            insights.push({
              id: `pattern-${pattern.id}`,
              type: 'pattern',
              title: 'Weekly Productivity Pattern',
              description: `You're most productive on ${this.extractDayFromPattern(pattern.data.pattern)}. Plan your week to leverage this strength.`,
              severity: 'info',
              category: 'tasks',
              timestamp: new Date().toISOString(),
              actionable: true,
              data: pattern.data
            });
          }
          break;

        case 'consistency':
          if (pattern.id.includes('low-consistency')) {
            insights.push({
              id: `pattern-${pattern.id}`,
              type: 'consistency_drop',
              title: 'Inconsistent Momentum',
              description: 'Your momentum has been inconsistent lately. Focus on small, daily actions to build stability.',
              severity: 'medium',
              category: 'general',
              timestamp: new Date().toISOString(),
              actionable: true,
              data: pattern.data
            });
          }
          break;

        case 'trend':
          if (pattern.id.includes('increasing')) {
            insights.push({
              id: `pattern-${pattern.id}`,
              type: 'achievement',
              title: 'Positive Trend Detected',
              description: 'Your momentum has been improving! Keep up the great work.',
              severity: 'info',
              category: 'general',
              timestamp: new Date().toISOString(),
              actionable: false,
              data: pattern.data
            });
          } else if (pattern.id.includes('decreasing')) {
            insights.push({
              id: `pattern-${pattern.id}`,
              type: 'consistency_drop',
              title: 'Declining Momentum',
              description: 'Your momentum has been declining. Consider reviewing your recent activities and priorities.',
              severity: 'medium',
              category: 'general',
              timestamp: new Date().toISOString(),
              actionable: true,
              data: pattern.data
            });
          }
          break;
      }
    });

    return insights;
  }

  /**
   * Generate task-related insights
   */
  private static generateTaskInsights(context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const { tasks } = context;

    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < context.currentTime
    );

    if (overdueTasks.length > 0) {
      insights.push({
        id: 'overdue-tasks',
        type: 'overdue_tasks',
        title: 'Overdue Tasks Detected',
        description: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} ${overdueTasks.length > 1 ? 'are' : 'is'} overdue. Consider prioritizing ${overdueTasks.length > 1 ? 'them' : 'it'}.`,
        severity: overdueTasks.length > 3 ? 'high' : overdueTasks.length > 1 ? 'medium' : 'low',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        actionable: true,
        data: { overdueTasks: overdueTasks.length, taskIds: overdueTasks.map(t => t.id) }
      });
    }

    // Focus overload
    const activeTasks = tasks.filter(task => !task.completed);
    const highPriorityTasks = activeTasks.filter(task => task.priority === 'high');
    
    if (highPriorityTasks.length > 3) {
      insights.push({
        id: 'focus-overload',
        type: 'focus_overload',
        title: 'High Priority Overload',
        description: `You have ${highPriorityTasks.length} high-priority tasks. Consider breaking them down or reassessing priorities.`,
        severity: 'medium',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        actionable: true,
        data: { highPriorityCount: highPriorityTasks.length, totalActive: activeTasks.length }
      });
    }

    // Planning gaps
    const tasksWithoutDueDates = activeTasks.filter(task => !task.dueDate);
    const planningRatio = tasksWithoutDueDates.length / Math.max(activeTasks.length, 1);
    
    if (planningRatio > 0.7 && activeTasks.length > 5) {
      insights.push({
        id: 'planning-gap',
        type: 'planning_gap',
        title: 'Planning Gap Detected',
        description: `${Math.round(planningRatio * 100)}% of your active tasks lack due dates. Setting timelines can improve focus.`,
        severity: 'low',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        actionable: true,
        data: { tasksWithoutDueDates: tasksWithoutDueDates.length, totalActive: activeTasks.length }
      });
    }

    return insights;
  }

  /**
   * Generate budget-related insights
   */
  private static generateBudgetInsights(context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const { budget } = context;

    // Spending trends
    const expenses = budget.filter(item => item.type === 'expense');
    if (expenses.length >= 5) {
      const recentExpenses = expenses.slice(-10);
      const totalRecent = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const averageExpense = totalRecent / recentExpenses.length;

      // Check for unusual spending
      const lastExpense = recentExpenses[recentExpenses.length - 1];
      if (lastExpense && lastExpense.amount > averageExpense * 2) {
        insights.push({
          id: 'unusual-spending',
          type: 'spending_trend',
          title: 'Unusual Spending Detected',
          description: `Your recent expense of $${lastExpense.amount.toFixed(2)} is higher than your average of $${averageExpense.toFixed(2)}.`,
          severity: 'medium',
          category: 'budget',
          timestamp: new Date().toISOString(),
          actionable: true,
          data: { amount: lastExpense.amount, average: averageExpense }
        });
      }
    }

    // Budget alerts
    if (context.userPreferences.budgetAlerts) {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      });

      const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Alert if spending is high (arbitrary threshold for demo)
      if (monthlyTotal > 1000) {
        insights.push({
          id: 'high-monthly-spending',
          type: 'spending_trend',
          title: 'Monthly Spending Alert',
          description: `You've spent $${monthlyTotal.toFixed(2)} this month. Consider reviewing your budget.`,
          severity: 'medium',
          category: 'budget',
          timestamp: new Date().toISOString(),
          actionable: true,
          data: { monthlyTotal, expenseCount: monthlyExpenses.length }
        });
      }
    }

    return insights;
  }

  /**
   * Generate meal-related insights
   */
  private static generateMealInsights(context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const { meals } = context;

    // Meal planning consistency
    const plannedMeals = meals.filter(meal => meal.planned);
    const planningRatio = plannedMeals.length / Math.max(meals.length, 1);

    if (meals.length >= 7 && planningRatio < 0.3) {
      insights.push({
        id: 'low-meal-planning',
        type: 'planning_gap',
        title: 'Low Meal Planning',
        description: `Only ${Math.round(planningRatio * 100)}% of your meals are planned. Planning can reduce stress and improve nutrition.`,
        severity: 'low',
        category: 'meals',
        timestamp: new Date().toISOString(),
        actionable: true,
        data: { plannedMeals: plannedMeals.length, totalMeals: meals.length }
      });
    }

    return insights;
  }

  /**
   * Generate momentum-related insights
   */
  private static generateMomentumInsights(context: IntelligenceContext): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const { momentum } = context;

    if (momentum.length < 3) return insights;

    // Recent momentum trend
    const recentMomentum = momentum.slice(-7);
    const averageScore = recentMomentum.reduce((sum, m) => sum + m.score, 0) / recentMomentum.length;

    // Achievement insights
    if (averageScore >= 80) {
      insights.push({
        id: 'high-momentum',
        type: 'achievement',
        title: 'Excellent Momentum',
        description: `Your average momentum score is ${Math.round(averageScore)}. You're performing at an elite level!`,
        severity: 'info',
        category: 'general',
        timestamp: new Date().toISOString(),
        actionable: false,
        data: { averageScore, recentScores: recentMomentum.map(m => m.score) }
      });
    } else if (averageScore >= 60) {
      insights.push({
        id: 'good-momentum',
        type: 'achievement',
        title: 'Solid Momentum',
        description: `Your average momentum score is ${Math.round(averageScore)}. Keep building on this foundation.`,
        severity: 'info',
        category: 'general',
        timestamp: new Date().toISOString(),
        actionable: false,
        data: { averageScore, recentScores: recentMomentum.map(m => m.score) }
      });
    }

    // Streak insights
    const latestMomentum = recentMomentum[recentMomentum.length - 1];
    if (latestMomentum && latestMomentum.streaks) {
      const longestStreak = Math.max(...Object.values(latestMomentum.streaks));
      if (longestStreak >= 7) {
        insights.push({
          id: 'impressive-streak',
          type: 'achievement',
          title: 'Impressive Streak',
          description: `You have a ${longestStreak}-day streak! Consistency is building strong habits.`,
          severity: 'info',
          category: 'general',
          timestamp: new Date().toISOString(),
          actionable: false,
          data: { streakLength: longestStreak, streaks: latestMomentum.streaks }
        });
      }
    }

    return insights;
  }

  /**
   * Helper to extract time from pattern data
   */
  private static extractTimeFromPattern(pattern: unknown): string {
    if (typeof pattern === 'object' && pattern !== null && 'hour' in pattern) {
      const hour = (pattern as { hour: number }).hour;
      if (hour >= 6 && hour < 12) return `${hour}:00 AM`;
      if (hour >= 12 && hour < 18) return `${hour - 12}:00 PM`;
      if (hour >= 18 && hour < 24) return `${hour - 12}:00 PM`;
      return `${hour}:00 AM`;
    }
    return 'peak hours';
  }

  /**
   * Helper to extract day from pattern data
   */
  private static extractDayFromPattern(pattern: unknown): string {
    if (typeof pattern === 'object' && pattern !== null && 'day' in pattern) {
      const day = (pattern as { day: number }).day;
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[day] || 'certain days';
    }
    return 'certain days';
  }
}
