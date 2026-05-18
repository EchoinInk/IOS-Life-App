import { useShoppingActions } from "./useShoppingActions";
import { useShoppingData, useShoppingDataByCategory } from "./useShoppingData";
import type { ShoppingCategory } from "../types/types";

/**
 * Legacy: useShoppingList (now uses new abstractions internally)
 * @deprecated Use useShoppingActions and useShoppingDataByCategory separately
 */
export const useShoppingList = (category: ShoppingCategory) => {
  const data = useShoppingDataByCategory(category);
  const actions = useShoppingActions();

  return {
    items: data.items,
    toggleItem: actions.toggleShoppingItem,
  };
};

/**
 * Legacy: useShopping (now uses new abstractions internally)
 * @deprecated Use useShoppingActions and useShoppingData separately
 */
export const useShopping = () => {
  const data = useShoppingData();
  const actions = useShoppingActions();

  return {
    items: data.items,
    completedItems: data.completedItems,
    pendingItems: data.pendingItems,
    actions,
  };
};