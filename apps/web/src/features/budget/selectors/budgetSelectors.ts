import type { Expense } from "@/features/budget/types/types";

/**
 * CORE SELECTORS
 */

export const selectTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};


/**
 * DERIVED SELECTORS
 */

export const selectBudgetSummary = (expenses: Expense[], weeklyBudget: number, income: number) => {
  const totalExpenses = selectTotalExpenses(expenses);
  const remaining = weeklyBudget - totalExpenses;
  const spentPercentage = weeklyBudget > 0 ? (totalExpenses / weeklyBudget) * 100 : 0;
  
  return {
    totalExpenses,
    remaining,
    spentPercentage,
    weeklyBudget,
    income
  };
};
