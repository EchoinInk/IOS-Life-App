import { useMemo } from "react";
import { useTaskData } from "@/features/tasks/hooks/useTaskData";
import { useMealData } from "@/features/meals/hooks/useMealData";
import { useBudgetData } from "@/features/budget/hooks/useBudgetData";
import { useShoppingData } from "@/features/shopping/hooks/useShoppingData";

export type TodayData = {
  focus: {
    percentage: number;
    label: string;
    subtext: string;
  };
  summary: {
    tasks: { completed: number; total: number };
    meals: { logged: number; target: number };
    budget: { remaining: number };
    shopping: { remaining: number };
  };
};

/**
 * Memoized calculation for today's focus
 * Prevents recalculation when dependencies haven't changed
 */
const calculateFocus = (
  todayTasksLength: number,
  completedTodayTasksLength: number,
  remainingBudget: number,
  weeklyBudget: number,
  todayMealsLength: number
): TodayData["focus"] => {
  if (todayTasksLength > 0) {
    const percentage = Math.round((completedTodayTasksLength / todayTasksLength) * 100);
    const remaining = todayTasksLength - completedTodayTasksLength;
    return {
      percentage,
      label: `${remaining} task${remaining !== 1 ? "s" : ""} remaining`,
      subtext: `${completedTodayTasksLength} of ${todayTasksLength} completed`,
    };
  } else if (remainingBudget > 0 && weeklyBudget > 0) {
    const percentage = Math.round((remainingBudget / weeklyBudget) * 100);
    return {
      percentage,
      label: `$${Math.round(remainingBudget)} remaining`,
      subtext: `of $${weeklyBudget} weekly budget`,
    };
  } else {
    const target = 3;
    const percentage = Math.round((todayMealsLength / target) * 100);
    const remaining = target - todayMealsLength;
    return {
      percentage,
      label: `${remaining} meal${remaining !== 1 ? "s" : ""} to log`,
      subtext: `${todayMealsLength} of ${target} logged`,
    };
  }
};

export const useTodayData = (): TodayData => {
  // Use abstraction hooks for data
  const taskData = useTaskData();
  const mealData = useMealData();
  const budgetData = useBudgetData();
  const shoppingData = useShoppingData();

  const { todayTasks, completedTodayTasks } = taskData;
  const { weeklyBudget, remaining: remainingBudget } = budgetData.budgetSummary;
  const { incompleteCount } = shoppingData;
  const { todayMeals } = mealData;

  // Memoize focus calculation to prevent recalculation
  const focus = useMemo(
    () => calculateFocus(
      todayTasks.length,
      completedTodayTasks.length,
      remainingBudget,
      weeklyBudget,
      todayMeals.length
    ),
    [todayTasks.length, completedTodayTasks.length, remainingBudget, weeklyBudget, todayMeals.length]
  );

  // Memoize summary to prevent recalculation
  const summary = useMemo(
    () => ({
      tasks: { completed: completedTodayTasks.length, total: todayTasks.length },
      meals: { logged: todayMeals.length, target: 3 },
      budget: { remaining: Math.round(remainingBudget) },
      shopping: { remaining: incompleteCount },
    }),
    [completedTodayTasks.length, todayTasks.length, todayMeals.length, remainingBudget, incompleteCount]
  );

  return {
    focus,
    summary,
  };
};
