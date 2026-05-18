import { useMealActions } from "./useMealActions";
import { useMealData } from "./useMealData";
import type { Weekday, Meal } from "../types/types";

/**
 * Legacy: useMealsByDay (now uses new abstractions internally)
 * @deprecated Use useMealData instead
 */
export const useMealsByDay = (): Record<Weekday, Meal[]> => {
  const { mealsByDay } = useMealData();
  return mealsByDay;
};

/**
 * Legacy: useMeals (now uses new abstractions internally)
 * @deprecated Use useMealActions and useMealData separately
 */
export const useMeals = () => {
  const data = useMealData();
  const actions = useMealActions();

  return {
    meals: data.meals,
    mealsByDay: data.mealsByDay,
    actions,
  };
};
