import { useBudgetStore } from "../store/useBudgetStore";
import type { CreateExpenseInput } from "../types/types";

/**
 * Budget Actions Hook
 * 
 * Provides all budget-related actions.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Budget action functions
 */
export const useBudgetActions = () => {
  const addExpense = useBudgetStore((s) => s.addExpense);
  const setIncome = useBudgetStore((s) => s.setIncome);

  return {
    addExpense,
    setIncome,
  };
};

/**
 * Type-safe action interface for mocking/testing
 */
export interface BudgetActions {
  addExpense: (input: CreateExpenseInput) => void;
  setIncome: (amount: number) => void;
}
