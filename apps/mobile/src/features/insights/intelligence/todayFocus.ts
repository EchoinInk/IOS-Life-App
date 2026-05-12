import type { Task } from "@/features/tasks/types/types";
import type { DailyScore } from "@/features/momentum/types/types";
import { getToday } from "@/shared/lib/date";

/**
 * Today Focus Intelligence
 * 
 * Prioritizes what the user should focus on today based on:
 * - Task urgency and importance
 * - Yesterday's performance
 * - Streak status
 * - Budget status
 */

export interface FocusPriority {
  type: 'tasks' | 'meals' | 'budget' | 'shopping' | 'celebration';
  priority: number; // 0-100
  reason: string;
  action?: string;
}

/**
 * Calculate today's focus priority
 */
export const calculateTodayFocus = (
  tasks: Task[],
  yesterdayScore: DailyScore | null,
  streak: number,
  budgetRemaining: number,
  weeklyBudget: number
): FocusPriority => {
  const today = getToday();
  const todayTasks = tasks.filter(t => t.date === today);
  const overdueTasks = tasks.filter(t => t.date < today && !t.completed);
  const urgentTasks = todayTasks.filter(t => t.time && !t.completed);

  // Task priority calculation
  let taskPriority = 0;
  let taskReason = '';
  let taskAction = '';

  if (overdueTasks.length > 0) {
    taskPriority = 95;
    taskReason = `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need attention`;
    taskAction = 'Review and complete overdue tasks';
  } else if (urgentTasks.length > 0) {
    taskPriority = 85;
    taskReason = `${urgentTasks.length} scheduled task${urgentTasks.length > 1 ? 's' : ''} for today`;
    taskAction = 'Complete today\'s scheduled tasks';
  } else if (todayTasks.length > 0) {
    taskPriority = 70;
    taskReason = `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} to complete today`;
    taskAction = 'Make progress on today\'s tasks';
  } else if (yesterdayScore && yesterdayScore.score < 60) {
    taskPriority = 60;
    taskReason = 'Yesterday was challenging - build momentum today';
    taskAction = 'Start with small wins';
  }

  // Budget priority
  let budgetPriority = 0;
  const budgetPercent = weeklyBudget > 0 ? (budgetRemaining / weeklyBudget) * 100 : 100;
  if (budgetPercent < 20) {
    budgetPriority = 90;
  } else if (budgetPercent < 40) {
    budgetPriority = 70;
  } else if (budgetPercent < 60) {
    budgetPriority = 50;
  }

  // Determine highest priority
  const priorities = [
    { type: 'tasks' as const, priority: taskPriority, reason: taskReason, action: taskAction },
    { type: 'budget' as const, priority: budgetPriority, reason: `Budget at ${Math.round(budgetPercent)}%`, action: 'Review spending' },
    { type: 'shopping' as const, priority: 40, reason: 'Keep shopping list current', action: 'Update shopping items' },
    { type: 'meals' as const, priority: 45, reason: 'Plan meals for the week', action: 'Log meals' },
  ];

  // Check for celebration (all tasks done, good budget, strong streak)
  if (
    todayTasks.length > 0 &&
    todayTasks.every(t => t.completed) &&
    budgetPercent > 60 &&
    streak >= 3
  ) {
    return {
      type: 'celebration',
      priority: 100,
      reason: `Amazing day! ${streak} day streak and all tasks complete`,
      action: 'Celebrate your progress',
    };
  }

  // Sort by priority and return highest
  priorities.sort((a, b) => b.priority - a.priority);
  const topPriority = priorities[0];
  
  return topPriority || {
    type: 'tasks',
    priority: 50,
    reason: 'Start your day with intention',
    action: 'Plan your day',
  };
};

/**
 * Get focus color for UI
 */
export const getFocusColor = (type: FocusPriority['type']): string => {
  const colors = {
    tasks: 'text-primary',
    meals: 'text-accent',
    budget: 'text-warning',
    shopping: 'text-info',
    celebration: 'text-success',
  };
  return colors[type];
};
