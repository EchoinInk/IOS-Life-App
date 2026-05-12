import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@/shared/lib/id";
import { createNamespacedStorage, STORE_VERSION } from "@/store/sharedPersist";
import type { CreateExpenseInput, Expense } from "@/features/budget/types/types";

interface BudgetState {
  weeklyBudget: number;
  income: number;
  expenses: Expense[];
  addExpense: (input: CreateExpenseInput) => void;
  setIncome: (amount: number) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      weeklyBudget: 1200,
      income: 1200,
      expenses: [],
      addExpense: (input) =>
        set((state) => ({
          expenses: [{ id: createId(), ...input }, ...state.expenses],
        })),
      setIncome: (amount) => set({ income: amount }),
    }),
    {
      name: "budget",
      version: STORE_VERSION,
      storage: createNamespacedStorage<Pick<BudgetState, "weeklyBudget" | "income" | "expenses">>([
        "weeklyBudget",
        "income",
        "expenses",
      ]),
      partialize: (state) => ({
        weeklyBudget: state.weeklyBudget,
        income: state.income,
        expenses: state.expenses,
      }),
    },
  ),
);
