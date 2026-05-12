import type { Task } from "@/features/tasks/types/types";
import type { Meal } from "@/features/meals/types/types";
import type { Expense } from "@/features/budget/types/types";
import type { DailyScore } from "@/features/momentum/types/types";
import type { SmartSummary } from "../types/types";
import { getToday } from "@/shared/lib/date";

/**
 * Smart Summary Generator
 * 
 * Generates intelligent summaries of user's current state across all features.
 * Provides highlights, concerns, and actionable recommendations.
 */

/**
 * Generate smart summary for tasks
 */
export const generateTaskSummary = (
  tasks: Task[],
  recentScores: DailyScore[]
): SmartSummary => {
  const today = getToday();
  const todayTasks = tasks.filter(t => t.date === today);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => t.date < today && !t.completed).length;

  const highlights: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  if (completedToday === todayTasks.length && todayTasks.length > 0) {
    highlights.push(`Completed all ${todayTasks.length} today's tasks`);
  } else if (completedToday > 0) {
    highlights.push(`Completed ${completedToday} of ${todayTasks.length} today's tasks`);
  }

  if (overdueTasks > 0) {
    concerns.push(`${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''} need attention`);
    recommendations.push('Review and complete overdue tasks');
  }

  if (todayTasks.length === 0) {
    recommendations.push('Plan your day by adding tasks');
  }

  const recentTaskScores = recentScores.slice(-7).map(s => s.breakdown.tasks);
  const avgTaskScore = recentTaskScores.length > 0
    ? recentTaskScores.reduce((a, b) => a + b, 0) / recentTaskScores.length
    : 0;

  if (avgTaskScore >= 80) {
    highlights.push('Strong task consistency this week');
  } else if (avgTaskScore < 50 && recentTaskScores.length >= 3) {
    concerns.push('Task consistency has been low this week');
    recommendations.push('Focus on building daily task habits');
  }

  const summary = todayTasks.length > 0
    ? `${completedToday}/${todayTasks.length} tasks completed today`
    : 'No tasks scheduled for today';

  return {
    focusArea: 'tasks',
    summary,
    highlights,
    concerns,
    recommendations,
  };
};

/**
 * Generate smart summary for budget
 */
export const generateBudgetSummary = (
  expenses: Expense[],
  weeklyBudget: number,
  income: number
): SmartSummary => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const spentPercent = weeklyBudget > 0 ? (totalSpent / weeklyBudget) * 100 : 0;

  const highlights: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  if (spentPercent <= 50) {
    highlights.push(`On track - only ${Math.round(spentPercent)}% of budget used`);
  } else if (spentPercent <= 80) {
    highlights.push(`Budget at ${Math.round(spentPercent)}% - monitoring spending`);
  }

  if (spentPercent > 80) {
    concerns.push(`${Math.round(spentPercent)}% of budget used - review spending`);
    recommendations.push('Review recent expenses and adjust if needed');
  }

  if (spentPercent > 100) {
    concerns.push(`Over budget by ${Math.round(spentPercent - 100)}%`);
    recommendations.push('Identify areas to reduce spending');
  }

  if (income > weeklyBudget) {
    highlights.push(`Income exceeds weekly budget by $${Math.round(income - weeklyBudget)}`);
  }

  const summary = `$${Math.round(totalSpent)} spent of $${weeklyBudget} weekly budget`;

  return {
    focusArea: 'budget',
    summary,
    highlights,
    concerns,
    recommendations,
  };
};

/**
 * Generate smart summary for meals
 */
export const generateMealSummary = (
  meals: Meal[],
  recentScores: DailyScore[]
): SmartSummary => {
  const today = getToday();
  const weekdays: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = 
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayWeekday = weekdays[new Date(today).getDay()];
  const todayMeals = meals.filter(m => m.day === todayWeekday);

  const highlights: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  if (todayMeals.length >= 3) {
    highlights.push(`Logged ${todayMeals.length} meals today`);
  } else if (todayMeals.length > 0) {
    highlights.push(`Logged ${todayMeals.length} meal${todayMeals.length > 1 ? 's' : ''} today`);
  }

  if (todayMeals.length === 0) {
    concerns.push('No meals logged today');
    recommendations.push('Log your meals to track nutrition');
  }

  const recentMealScores = recentScores.slice(-7).map(s => s.breakdown.meals);
  const avgMealScore = recentMealScores.length > 0
    ? recentMealScores.reduce((a, b) => a + b, 0) / recentMealScores.length
    : 0;

  if (avgMealScore >= 80) {
    highlights.push('Excellent meal logging consistency');
  } else if (avgMealScore < 50 && recentMealScores.length >= 3) {
    concerns.push('Meal logging has been inconsistent');
    recommendations.push('Build daily meal logging habit');
  }

  const summary = todayMeals.length > 0
    ? `${todayMeals.length} meal${todayMeals.length > 1 ? 's' : ''} logged today`
    : 'No meals logged today';

  return {
    focusArea: 'meals',
    summary,
    highlights,
    concerns,
    recommendations,
  };
};

/**
 * Generate overall smart summary
 */
export const generateOverallSummary = (
  tasks: Task[],
  meals: Meal[],
  expenses: Expense[],
  weeklyBudget: number,
  income: number,
  recentScores: DailyScore[]
): SmartSummary => {
  const taskSummary = generateTaskSummary(tasks, recentScores);
  const budgetSummary = generateBudgetSummary(expenses, weeklyBudget, income);
  const mealSummary = generateMealSummary(meals, recentScores);

  const highlights = [...taskSummary.highlights, ...budgetSummary.highlights, ...mealSummary.highlights];
  const concerns = [...taskSummary.concerns, ...budgetSummary.concerns, ...mealSummary.concerns];
  const recommendations = [...taskSummary.recommendations, ...budgetSummary.recommendations, ...mealSummary.recommendations];

  // Limit to top 3 each
  const topHighlights = highlights.slice(0, 3);
  const topConcerns = concerns.slice(0, 3);
  const topRecommendations = recommendations.slice(0, 3);

  const avgScore = recentScores.length > 0
    ? recentScores.slice(-7).reduce((sum, s) => sum + s.score, 0) / Math.min(recentScores.length, 7)
    : 0;

  const summary = avgScore >= 80
    ? 'Excellent progress across all areas'
    : avgScore >= 60
    ? 'Good progress with room for improvement'
    : avgScore >= 40
    ? 'Building momentum - keep going'
    : 'Focus on building daily habits';

  return {
    focusArea: 'overall',
    summary,
    highlights: topHighlights,
    concerns: topConcerns,
    recommendations: topRecommendations,
  };
};
