import { useMemo } from "react";
import { useMealsStore } from "../store/useMealsStore";
import { selectMealsByDay, selectMealsByDays, selectMealStats } from "../selectors/mealSelectors";
import type { Weekday } from "../types/types";

/**
 * Meal Data Hook
 * 
 * Provides all meal-related data selection.
 * Uses selectors for derived state.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Meal data and derived state
 */
export const useMealData = () => {
  const meals = useMealsStore((s) => s.meals);
  const todayWeekday: Weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][new Date().getDay()] as Weekday;

  // Derived state using selectors
  const mealsByDay = useMemo(() => selectMealsByDays(meals), [meals]);
  const todayMeals = useMemo(() => selectMealsByDay(meals, todayWeekday), [meals, todayWeekday]);
  const todayStats = useMemo(() => selectMealStats(meals, todayWeekday), [meals, todayWeekday]);

  return {
    // Raw data
    meals,
    
    // Grouped data
    mealsByDay,
    
    // Today's data
    todayMeals,
    todayWeekday,
    todayStats,
    
    // Computed metrics
    totalMeals: meals.length,
    todayMealCount: todayMeals.length,
  };
};

/**
 * Meal Data Hook with Weekday Parameter
 * 
 * Variant that accepts a weekday parameter for flexible day-based queries.
 * 
 * @param weekday - The weekday to query meals for
 * @returns Meal data for the specified weekday
 */
export const useMealDataByDay = (weekday: Weekday) => {
  const meals = useMealsStore((s) => s.meals);

  const dayMeals = useMemo(() => selectMealsByDay(meals, weekday), [meals, weekday]);
  const dayStats = useMemo(() => selectMealStats(meals, weekday), [meals, weekday]);

  return {
    meals: dayMeals,
    stats: dayStats,
    count: dayMeals.length,
  };
};
