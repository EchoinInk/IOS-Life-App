import { useMemo } from "react";
import { useBudgetStore } from "@/features/budget/store/useBudgetStore";
import { useMealsStore } from "@/features/meals/store/useMealsStore";
import { useTasksStore } from "@/features/tasks/store/useTasksStore";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { selectNextTask } from "@/features/tasks/selectors/taskSelectors";
import { getToday } from "@/shared/lib/date";
import type { CreateExpenseInput } from "@/features/budget/types/types";
import type { CreateMealInput } from "@/features/meals/types/types";

export interface HomeDashboardData {
  // Derived state
  nextTask: ReturnType<typeof selectNextTask>;
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
 * - Store subscriptions
 * - Derived state calculations
 * - Action preparation
 * 
 * @returns HomeDashboardData - All data and actions needed by the view
 */
export const useHomeDashboard = (): HomeDashboardData => {
  const todayStr = getToday();

  // Store actions
  const addExpense = useBudgetStore((s) => s.addExpense);
  const addMeal = useMealsStore((s) => s.addMeal);
  const toggleTask = useTasksStore((s) => s.toggleTask);

  // Store data for derived calculations
  const tasks = useTasksStore((s) => s.tasks);

  // Derived state
  const nextTask = useMemo(() => selectNextTask(tasks, todayStr), [tasks, todayStr]);
  const todayData = useTodayData();

  return {
    nextTask,
    todayData,
    todayStr,
    toggleTask,
    addExpense,
    addMeal,
  };
};
