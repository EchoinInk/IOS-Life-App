import type { Task } from "@/features/tasks/types/types";
import type { Meal } from "@/features/meals/types/types";
import type { Expense } from "@/features/budget/types/types";
import type { ShoppingItem } from "@/features/shopping/types/types";
import type { DailyScore } from "./types/types";
import { getToday } from "@/shared/lib/date";

/**
 * Daily Score Calculator
 * 
 * Calculates a 0-100 daily completion score based on:
 * - Task completion rate
 * - Meal logging rate
 * - Budget adherence
 * - Shopping completion
 * 
 * Weights can be adjusted based on user preferences.
 */

const SCORE_WEIGHTS = {
  tasks: 0.4,      // 40% weight
  meals: 0.25,     // 25% weight
  budget: 0.2,     // 20% weight
  shopping: 0.15,  // 15% weight
} as const;

const TARGETS = {
  tasks: 3,        // Target: 3 tasks per day
  meals: 3,        // Target: 3 meals per day
  budget: 1,       // Target: stay within budget (1 = good)
  shopping: 0,     // Target: 0 pending items
} as const;

/**
 * Calculate task score (0-100)
 * Based on completion rate relative to target
 */
export const calculateTaskScore = (tasks: Task[], date: string): number => {
  const todayTasks = tasks.filter(t => t.date === date);
  const completedTasks = todayTasks.filter(t => t.completed);
  
  if (todayTasks.length === 0) return 0;
  
  const completionRate = completedTasks.length / todayTasks.length;
  const targetProgress = Math.min(todayTasks.length / TARGETS.tasks, 1);
  
  // Score combines completion rate and target progress
  return Math.round((completionRate * 0.7 + targetProgress * 0.3) * 100);
};

/**
 * Calculate meal score (0-100)
 * Based on meals logged relative to target
 * Note: Meals use 'day' (Weekday) instead of date
 */
export const calculateMealScore = (meals: Meal[], date: string): number => {
  const dateObj = new Date(date);
  const weekdays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[dateObj.getDay()];
  const todayMeals = meals.filter(m => m.day === weekday);
  const targetProgress = Math.min(todayMeals.length / TARGETS.meals, 1);
  
  return Math.round(targetProgress * 100);
};

/**
 * Calculate budget score (0-100)
 * Based on whether staying within weekly budget
 * Note: Expenses don't have date property, so we calculate based on total weekly spending
 */
export const calculateBudgetScore = (
  expenses: Expense[],
  weeklyBudget: number
): number => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  if (weeklyBudget === 0) return 100;
  
  const budgetUsage = totalSpent / weeklyBudget;
  
  // Score decreases as budget usage exceeds 100%
  if (budgetUsage <= 1) {
    return 100;
  }
  
  return Math.max(0, Math.round(100 - (budgetUsage - 1) * 50));
};

/**
 * Calculate shopping score (0-100)
 * Based on pending items completion
 */
export const calculateShoppingScore = (shoppingItems: ShoppingItem[]): number => {
  const totalItems = shoppingItems.length;
  const completedItems = shoppingItems.filter(i => i.done).length;
  
  if (totalItems === 0) return 100;
  
  const completionRate = completedItems / totalItems;
  return Math.round(completionRate * 100);
};

/**
 * Calculate overall daily score (0-100)
 * Combines all category scores with weights
 */
export const calculateDailyScore = (
  tasks: Task[],
  meals: Meal[],
  expenses: Expense[],
  shoppingItems: ShoppingItem[],
  weeklyBudget: number,
  date: string = getToday()
): DailyScore => {
  const taskScore = calculateTaskScore(tasks, date);
  const mealScore = calculateMealScore(meals, date);
  const budgetScore = calculateBudgetScore(expenses, weeklyBudget);
  const shoppingScore = calculateShoppingScore(shoppingItems);
  
  const weightedScore = 
    taskScore * SCORE_WEIGHTS.tasks +
    mealScore * SCORE_WEIGHTS.meals +
    budgetScore * SCORE_WEIGHTS.budget +
    shoppingScore * SCORE_WEIGHTS.shopping;
  
  const finalScore = Math.round(weightedScore);
  const completed = finalScore >= 80; // 80+ is considered "completed"
  
  return {
    date,
    score: finalScore,
    breakdown: {
      tasks: taskScore,
      meals: mealScore,
      budget: budgetScore,
      shopping: shoppingScore,
    },
    completed,
  };
};

/**
 * Get score category for display
 */
export const getScoreCategory = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
};

/**
 * Get score color for UI
 * Uses semantic tokens instead of Tailwind palette colors
 */
export const getScoreColor = (score: number): string => {
  const category = getScoreCategory(score);
  const colors = {
    excellent: 'text-success',
    good: 'text-primary',
    fair: 'text-warning',
    poor: 'text-error',
  };
  return colors[category];
};
