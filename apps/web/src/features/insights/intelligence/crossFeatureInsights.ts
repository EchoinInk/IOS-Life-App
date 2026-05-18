import type { Task } from "@/features/tasks/types/types";
import type { Meal } from "@/features/meals/types/types";
import type { Expense } from "@/features/budget/types/types";
import type { ShoppingItem } from "@/features/shopping/types/types";
import type { DailyScore } from "@/features/momentum/types/types";
import type { Insight } from "../types/types";
import { getToday } from "@/shared/lib/date";

/**
 * Cross-Feature Insights Generator
 * 
 * Generates insights by analyzing relationships between features:
 * - Task completion vs. budget spending
 * - Meal planning vs. shopping
 * - Overall patterns across features
 */

/**
 * Generate cross-feature insights
 */
export const generateCrossFeatureInsights = (
  _tasks: Task[],
  meals: Meal[],
  _expenses: Expense[],
  shoppingItems: ShoppingItem[],
  recentScores: DailyScore[]
): Insight[] => {
  const insights: Insight[] = [];
  const today = getToday();

  // Insight: Task completion vs. budget
  const recentBudgetScores = recentScores.slice(-7).map(s => s.breakdown.budget);
  const recentTaskScores = recentScores.slice(-7).map(s => s.breakdown.tasks);
  
  if (recentScores.length >= 3) {
    const avgBudgetScore = recentBudgetScores.reduce((a, b) => a + b, 0) / recentBudgetScores.length;
    const avgTaskScore = recentTaskScores.reduce((a, b) => a + b, 0) / recentTaskScores.length;
    
    if (avgTaskScore >= 80 && avgBudgetScore < 60) {
      insights.push({
        id: 'task-budget-correlation',
        type: 'budget',
        priority: 'medium',
        title: 'Task completion high, budget score low',
        description: 'You\'re great at completing tasks but spending could be optimized. Consider reviewing expenses.',
        actionable: true,
        actionLabel: 'Review Budget',
        createdAt: today,
        dismissed: false,
      });
    }
  }

  // Insight: Meal planning vs. shopping
  const weekdays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = 
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayWeekday = weekdays[new Date(today).getDay()];
  const todayMeals = meals.filter(m => m.day === todayWeekday);
  
  if (todayMeals.length >= 3 && shoppingItems.length === 0) {
    insights.push({
      id: 'meal-shopping-opportunity',
      type: 'shopping',
      priority: 'low',
      title: 'Meals planned, no shopping items',
      description: 'You have meals planned but no shopping list. Consider adding ingredients.',
      actionable: true,
      actionLabel: 'Add to Shopping',
      createdAt: today,
      dismissed: false,
    });
  }

  // Insight: Streak milestone
  const overallStreak = recentScores.filter(s => s.completed).length;
  if (overallStreak === 6) {
    insights.push({
      id: 'streak-milestone',
      type: 'streak',
      priority: 'high',
      title: 'Almost at 7-day streak!',
      description: 'Complete today\'s goals to reach a full week streak.',
      actionable: true,
      actionLabel: 'View Goals',
      createdAt: today,
      dismissed: false,
    });
  }

  // Insight: Consistency pattern
  if (recentScores.length >= 7) {
    const last7Scores = recentScores.slice(-7);
    const completedDays = last7Scores.filter(s => s.completed).length;
    
    if (completedDays >= 6) {
      insights.push({
        id: 'consistency-excellent',
        type: 'consistency',
        priority: 'low',
        title: 'Excellent consistency this week',
        description: `${completedDays}/7 days completed. You're building great habits!`,
        actionable: false,
        createdAt: today,
        dismissed: false,
      });
    } else if (completedDays <= 3) {
      insights.push({
        id: 'consistency-low',
        type: 'consistency',
        priority: 'medium',
        title: 'Consistency needs attention',
        description: `Only ${completedDays}/7 days completed this week. Focus on daily goals.`,
        actionable: true,
        actionLabel: 'View Progress',
        createdAt: today,
        dismissed: false,
      });
    }
  }

  // Insight: Cross-feature balance
  const recentTaskScores2 = recentScores.slice(-7).map(s => s.breakdown.tasks);
  const recentMealScores = recentScores.slice(-7).map(s => s.breakdown.meals);
  
  if (recentScores.length >= 3) {
    const avgTaskScore = recentTaskScores2.reduce((a, b) => a + b, 0) / recentTaskScores2.length;
    const avgMealScore = recentMealScores.reduce((a, b) => a + b, 0) / recentMealScores.length;
    
    if (avgTaskScore >= 80 && avgMealScore < 50) {
      insights.push({
        id: 'task-meal-balance',
        type: 'meal',
        priority: 'medium',
        title: 'Strong task habits, improve meal tracking',
        description: 'You\'re great with tasks but meal logging needs attention.',
        actionable: true,
        actionLabel: 'Log Meal',
        createdAt: today,
        dismissed: false,
      });
    }
  }

  return insights;
};

/**
 * Filter insights by priority
 */
export const filterInsightsByPriority = (
  insights: Insight[],
  priority: Insight['priority']
): Insight[] => {
  return insights.filter(i => i.priority === priority);
};

/**
 * Filter actionable insights
 */
export const filterActionableInsights = (insights: Insight[]): Insight[] => {
  return insights.filter(i => i.actionable && !i.dismissed);
};
