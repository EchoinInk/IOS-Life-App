import type { EntityId } from "@/features/tasks/types/types";

export type ShoppingCategory = "Groceries" | "Household";

export interface ShoppingItem {
  id: EntityId;
  name: string;
  done: boolean;
  category: ShoppingCategory;
}

export interface CreateShoppingItemInput {
  name: string;
  category: ShoppingCategory;
}