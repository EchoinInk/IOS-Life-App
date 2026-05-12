import { useMealsStore } from "../store/useMealsStore";
import type { CreateMealInput } from "../types/types";

/**
 * Meal Actions Hook
 * 
 * Provides all meal-related actions.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Meal action functions
 */
export const useMealActions = () => {
  const addMeal = useMealsStore((s) => s.addMeal);

  return {
    addMeal,
  };
};

/**
 * Type-safe action interface for mocking/testing
 */
export interface MealActions {
  addMeal: (input: CreateMealInput) => void;
}
