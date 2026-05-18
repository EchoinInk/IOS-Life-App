import type { EntityId } from "@/features/tasks/types/types";

export interface Expense {
  id: EntityId;
  name: string;
  amount: number;
}

export interface CreateExpenseInput {
  name: string;
  amount: number;
}
