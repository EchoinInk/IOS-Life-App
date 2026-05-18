import type { ShoppingItem, ShoppingCategory } from "@/features/shopping/types/types";

/**
 * CORE SELECTORS
 */

export const selectItemsByCategory =
  (category: ShoppingCategory) =>
  (items: ShoppingItem[]) =>
    items.filter((item) => item.category === category);

export const selectCompletedItems = (items: ShoppingItem[]) =>
  items.filter((item) => item.done);

export const selectPendingItems = (items: ShoppingItem[]) =>
  items.filter((item) => !item.done);

export const selectIncompleteItemCount = (items: ShoppingItem[]) =>
  items.filter((i) => !i.done).length;

/**
 * DERIVED SELECTORS
 */

export const selectShoppingStats = (items: ShoppingItem[]) => {
  const completed = selectCompletedItems(items);
  const pending = selectPendingItems(items);
  
  return {
    total: items.length,
    completed: completed.length,
    pending: pending.length,
    completionRate: items.length > 0 ? (completed.length / items.length) * 100 : 0
  };
};
