import { useMemo } from "react";
import { useBudgetActions } from "./useBudgetActions";
import { useBudgetData } from "./useBudgetData";
import { safePercent } from "@/shared/lib/number";
import type { Expense } from "../types/types";

export interface BudgetSummary {
  spent: number;
  remaining: number;
  percentage: number;
}

/**
 * Legacy: getBudgetSummary (kept for backward compatibility)
 * @deprecated Use useBudgetData instead
 */
export const getBudgetSummary = (
  expenses: Expense[],
  weeklyBudget: number,
): BudgetSummary => {
  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return {
    spent,
    remaining: weeklyBudget - spent,
    percentage: safePercent(spent, weeklyBudget),
  };
};

/**
 * Legacy: useBudgetSummary (now uses new abstractions internally)
 * @deprecated Use useBudgetData instead
 */
export const useBudgetSummary = (): BudgetSummary => {
  const { totalExpenses, remaining, spentPercentage } = useBudgetData();
  return {
    spent: totalExpenses,
    remaining,
    percentage: spentPercentage,
  };
};

/**
 * Legacy: useBudget (now uses new abstractions internally)
 * @deprecated Use useBudgetActions and useBudgetData separately
 */
export const useBudget = () => {
  const data = useBudgetData();
  const actions = useBudgetActions();

  const summary = useMemo(
    () => ({
      spent: data.totalExpenses,
      remaining: data.remaining,
      percentage: data.spentPercentage,
    }),
    [data.totalExpenses, data.remaining, data.spentPercentage]
  );

  return {
    weeklyBudget: data.weeklyBudget,
    income: data.income,
    expenses: data.expenses,
    summary,
    actions,
  };
};
