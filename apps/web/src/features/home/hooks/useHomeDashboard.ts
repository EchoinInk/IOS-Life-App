import { useTaskActions } from "@/features/tasks/hooks/useTaskActions";
import { useTaskData } from "@/features/tasks/hooks/useTaskData";
import { useBudgetActions } from "@/features/budget/hooks/useBudgetActions";
import { useMealActions } from "@/features/meals/hooks/useMealActions";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { getToday } from "@/shared/lib/date";
import type { CreateExpenseInput } from "@/features/budget/types/types";
import type { CreateMealInput } from "@/features/meals/types/types";

export interface HomeDashboardData {
  // Derived state
  nextTask: ReturnType<typeof useTaskData>["nextTask"];
  todayData: ReturnType<typeof useTodayData>;
  todayStr: string;
  
  // Actions
  toggleTask: (id: string) => void;
  addExpense: (input: CreateExpenseInput) => void;
  addMeal: (input: CreateMealInput) => void;
}

/**
 * Home Dashboard Container Hook
 * 
 * Orchestrates all data fetching, state selection, and action preparation
 * for the home dashboard. This hook centralizes:
 * - Store subscriptions via abstraction hooks
 * - Derived state calculations
 * - Action preparation via abstraction hooks
 * 
 * @returns HomeDashboardData - All data and actions needed by the view
 */
export const useHomeDashboard = (): HomeDashboardData => {
  const todayStr = getToday();

  // Use abstraction hooks for actions
  const taskActions = useTaskActions();
  const budgetActions = useBudgetActions();
  const mealActions = useMealActions();

  // Use abstraction hooks for data
  const taskData = useTaskData();
  const todayData = useTodayData();

  return {
    nextTask: taskData.nextTask,
    todayData,
    todayStr,
    toggleTask: taskActions.toggleTask,
    addExpense: budgetActions.addExpense,
    addMeal: mealActions.addMeal,
  };
};
