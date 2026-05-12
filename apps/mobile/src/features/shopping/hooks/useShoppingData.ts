import { useMemo } from "react";
import { useShoppingStore } from "../store/useShoppingStore";
import {
  selectItemsByCategory,
  selectCompletedItems,
  selectPendingItems,
  selectIncompleteItemCount,
  selectShoppingStats,
} from "../selectors/shoppingSelectors";
import type { ShoppingCategory } from "../types/types";

/**
 * Shopping Data Hook
 * 
 * Provides all shopping-related data selection.
 * Uses selectors for derived state.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Shopping data and derived state
 */
export const useShoppingData = () => {
  const items = useShoppingStore((s) => s.shoppingItems);

  // Derived state using selectors
  const completedItems = useMemo(() => selectCompletedItems(items), [items]);
  const pendingItems = useMemo(() => selectPendingItems(items), [items]);
  const incompleteCount = useMemo(() => selectIncompleteItemCount(items), [items]);
  const stats = useMemo(() => selectShoppingStats(items), [items]);

  return {
    // Raw data
    items,
    
    // Status-based data
    completedItems,
    pendingItems,
    
    // Derived metrics
    incompleteCount,
    stats,
    
    // Computed metrics
    totalItems: items.length,
    completedCount: completedItems.length,
    pendingCount: pendingItems.length,
  };
};

/**
 * Shopping Data Hook with Category Filter
 * 
 * Variant that filters items by category.
 * 
 * @param category - The category to filter items by
 * @returns Shopping data for the specified category
 */
export const useShoppingDataByCategory = (category: ShoppingCategory) => {
  const items = useShoppingStore((s) => s.shoppingItems);

  const filteredItems = useMemo(
    () => selectItemsByCategory(category)(items),
    [items, category]
  );

  return {
    items: filteredItems,
    count: filteredItems.length,
  };
};
