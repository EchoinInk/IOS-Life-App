import { useMemo } from "react";
import { useBudgetStore } from "../store/useBudgetStore";
import { selectBudgetSummary } from "../selectors/budgetSelectors";
import { safePercent } from "@/shared/lib/number";

/**
 * Budget Data Hook
 * 
 * Provides all budget-related data selection.
 * Uses selectors for derived state.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Budget data and derived state
 */
export const useBudgetData = () => {
  const expenses = useBudgetStore((s) => s.expenses);
  const weeklyBudget = useBudgetStore((s) => s.weeklyBudget);
  const income = useBudgetStore((s) => s.income);

  // Derived state using selectors
  const budgetSummary = useMemo(
    () => selectBudgetSummary(expenses, weeklyBudget, income),
    [expenses, weeklyBudget, income]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const spentPercentage = useMemo(
    () => safePercent(totalExpenses, weeklyBudget),
    [totalExpenses, weeklyBudget]
  );

  return {
    // Raw data
    expenses,
    weeklyBudget,
    income,
    
    // Derived state
    budgetSummary,
    totalExpenses,
    remaining: weeklyBudget - totalExpenses,
    spentPercentage,
    
    // Computed metrics
    expenseCount: expenses.length,
  };
};

/**
 * Budget Summary Hook (Legacy compatibility)
 * 
 * Maintains backward compatibility with existing useBudgetSummary hook.
 * @deprecated Use useBudgetData instead
 */
export const useBudgetSummary = () => {
  const { totalExpenses, remaining, spentPercentage } = useBudgetData();
  
  return {
    spent: totalExpenses,
    remaining,
    percentage: spentPercentage,
  };
};
