import { useShoppingStore } from "../store/useShoppingStore";
import type { CreateShoppingItemInput } from "../types/types";
import type { EntityId } from "@/features/tasks/types/types";

/**
 * Shopping Actions Hook
 * 
 * Provides all shopping-related actions.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Shopping action functions
 */
export const useShoppingActions = () => {
  const addShoppingItem = useShoppingStore((s) => s.addShoppingItem);
  const toggleShoppingItem = useShoppingStore((s) => s.toggleShoppingItem);

  return {
    addShoppingItem,
    toggleShoppingItem,
  };
};

/**
 * Type-safe action interface for mocking/testing
 */
export interface ShoppingActions {
  addShoppingItem: (input: CreateShoppingItemInput) => void;
  toggleShoppingItem: (id: EntityId) => void;
}
