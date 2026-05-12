import type { Meal, Weekday } from "@/features/meals/types/types";

/**
 * CORE SELECTORS
 */

export const selectMealsByDay = (meals: Meal[], weekday: Weekday): Meal[] => {
  return meals.filter((meal) => meal.day === weekday);
};

export const selectMealsByDays = (meals: Meal[]): Record<Weekday, Meal[]> => {
  const grouped: Record<Weekday, Meal[]> = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  meals.forEach((meal) => {
    if (meal.day && grouped[meal.day]) {
      grouped[meal.day].push(meal);
    }
  });

  return grouped;
};

/**
 * DERIVED SELECTORS
 */

export const selectMealStats = (meals: Meal[], weekday: Weekday) => {
  const dayMeals = selectMealsByDay(meals, weekday);
  
  return {
    count: dayMeals.length,
    target: 3,
    completionRate: (dayMeals.length / 3) * 100,
    remaining: Math.max(0, 3 - dayMeals.length)
  };
};
