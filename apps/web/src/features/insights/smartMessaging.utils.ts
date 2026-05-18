import { getStreakMessage } from "./streaks.utils";
import type { Streak } from "./streaks.types";

export interface SmartMessagingData {
  tasksCompleted: number;
  tasksTotal: number;
  remaining: number;
  streakTasks: Streak;
  streakMeals: Streak;
  budgetRemaining: number;
  budgetTotal: number;
  mealsLogged: number;
  mealsTarget: number;
}

export const getSmartMotivation = (data: SmartMessagingData): string | null => {
  const { tasksCompleted, tasksTotal, remaining, streakTasks, streakMeals, budgetRemaining, budgetTotal, mealsLogged, mealsTarget } = data;

  // Priority 1: Perfect completion
  if (remaining === 0) {
    if (streakTasks.current >= 3) {
      return "Perfect day. Keep the streak going.";
    }
    return "Perfect day! You're unstoppable.";
  }

  // Priority 2: High streak motivation
  if (streakTasks.current >= 7) {
    return `${streakTasks.current} day streak! You're building an amazing habit.`;
  }

  if (streakTasks.current >= 3) {
    return `${streakTasks.current} day streak - Don't break it now!`;
  }

  // Priority 3: Large task count - start small
  if (remaining > 5) {
    return "Start small — one task is enough to build momentum.";
  }

  // Priority 4: Budget awareness
  if (budgetRemaining < budgetTotal * 0.3 && budgetRemaining > 0) {
    return "Focus on your tasks today and watch your spending.";
  }

  // Priority 5: Meal streak
  if (streakMeals.current >= 3) {
    return `Great meal logging! ${mealsTarget - mealsLogged} meal${mealsTarget - mealsLogged !== 1 ? 's' : ''} to go.`;
  }

  // Priority 6: Progress encouragement
  if (tasksCompleted > 0 && remaining <= 3) {
    return "Almost there! You're doing great.";
  }

  // Priority 7: First task motivation
  if (tasksCompleted === 0 && tasksTotal > 0) {
    return "You've got this! Take the first step towards a productive day.";
  }
  // Priority 8: No tasks scenario
  if (tasksTotal === 0) {
    if (streakMeals.current >= 3) {
      return "You're crushing your meal goals!";
    }
    return "Take a breather, you've earned it!";
  }
  // Default fallback
  return null;
};

export const getSmartSubtext = (data: SmartMessagingData): string => {
  const { tasksCompleted, tasksTotal, remaining, streakTasks } = data;

  if (tasksTotal === 0) {
    return "No tasks scheduled";
  }

  if (remaining === 0) {
    return `All ${tasksTotal} completed`;
  }

  if (streakTasks.current > 0) {
    return `${tasksCompleted} of ${tasksTotal} completed • ${getStreakMessage(streakTasks)}`;
  }

  return `${tasksCompleted} of ${tasksTotal} completed`;
};
