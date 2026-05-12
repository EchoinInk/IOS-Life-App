import type { Task } from "@/features/tasks/types/types";
import type { Meal } from "@/features/meals/types/types";
import type { Expense } from "@/features/budget/types/types";
import type { ShoppingItem } from "@/features/shopping/types/types";
import type { DailyScore } from "@/features/momentum/types/types";
import type { Recommendation } from "../types/types";
import { getToday } from "@/shared/lib/date";

/**
 * Contextual Recommendations Generator
 * 
 * Generates actionable recommendations based on current context:
 * - Time of day
 * - Recent performance
 * - Feature-specific patterns
 * - Cross-feature relationships
 */

/**
 * Generate contextual recommendations
 */
export const generateContextualRecommendations = (
  tasks: Task[],
  meals: Meal[],
  expenses: Expense[],
  shoppingItems: ShoppingItem[],
  recentScores: DailyScore[],
  streak: number
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const today = getToday();
  const hour = new Date().getHours();

  // Time-based recommendations
  if (hour >= 6 && hour < 9) {
    // Morning
    const todayTasks = tasks.filter(t => t.date === today);
    if (todayTasks.length === 0) {
      recommendations.push({
        id: 'morning-plan-tasks',
        type: 'task',
        title: 'Plan your day',
        description: 'Start your morning by planning 3 key tasks for today',
        impact: 'high',
        effort: 'easy',
      });
    }
  } else if (hour >= 12 && hour < 14) {
    // Midday
    const weekdays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayWeekday = weekdays[new Date(today).getDay()];
    const todayMeals = meals.filter(m => m.day === todayWeekday);
    
    if (todayMeals.length === 0) {
      recommendations.push({
        id: 'midday-log-meal',
        type: 'meal',
        title: 'Log your lunch',
        description: 'Track your meal to maintain nutrition awareness',
        impact: 'medium',
        effort: 'easy',
      });
    }
  } else if (hour >= 17 && hour < 21) {
    // Evening
    const completedToday = tasks.filter(t => t.date === today && t.completed).length;
    const totalToday = tasks.filter(t => t.date === today).length;
    
    if (completedToday < totalToday && totalToday > 0) {
      recommendations.push({
        id: 'evening-complete-tasks',
        type: 'task',
        title: 'Complete remaining tasks',
        description: `${totalToday - completedToday} task${totalToday - completedToday > 1 ? 's' : ''} remaining today`,
        impact: 'high',
        effort: 'medium',
      });
    }
  }

  // Streak-based recommendations
  if (streak === 0) {
    recommendations.push({
      id: 'streak-start',
      type: 'streak',
      title: 'Start your streak today',
      description: 'Complete your daily goals to begin a new streak',
      impact: 'high',
      effort: 'easy',
    });
  } else if (streak >= 3 && streak < 7) {
    recommendations.push({
      id: 'streak-extend',
      type: 'streak',
      title: 'Keep your streak going',
      description: `${streak} day streak - complete today's goals to reach 7 days`,
      impact: 'high',
      effort: 'medium',
    });
  }

  // Budget recommendations
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const weeklyBudget = 1200; // Default, should come from store
  const spentPercent = weeklyBudget > 0 ? (totalSpent / weeklyBudget) * 100 : 0;
  
  if (spentPercent > 80) {
    recommendations.push({
      id: 'budget-review',
      type: 'budget',
      title: 'Review spending',
      description: `${Math.round(spentPercent)}% of budget used - review recent expenses`,
      impact: 'high',
      effort: 'easy',
    });
  }

  // Shopping recommendations
  const pendingShopping = shoppingItems.filter(i => !i.done).length;
  if (pendingShopping > 5) {
    recommendations.push({
      id: 'shopping-clear',
      type: 'shopping',
      title: 'Clear shopping list',
      description: `${pendingShopping} items pending - complete your shopping`,
      impact: 'medium',
      effort: 'medium',
    });
  }

  // Performance-based recommendations
  if (recentScores.length >= 3) {
    const recentAvg = recentScores.slice(-3).reduce((sum, s) => sum + s.score, 0) / 3;
    
    if (recentAvg < 60) {
      recommendations.push({
        id: 'performance-improve',
        type: 'overall',
        title: 'Focus on daily habits',
        description: 'Recent scores have been low - focus on completing daily goals',
        impact: 'high',
        effort: 'medium',
      });
    }
  }

  // Limit to top 5 recommendations
  return recommendations.slice(0, 5);
};

/**
 * Get recommendation priority
 */
export const getRecommendationPriority = (recommendation: Recommendation): number => {
  const priorityMap = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return priorityMap[recommendation.impact];
};
