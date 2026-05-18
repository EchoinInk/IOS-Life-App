import { getToday } from "@/shared/lib/date";

import type { Recipe } from "@/features/recipes/types/types";
import type { CreateMealInput, Weekday } from "@/features/meals/types/types";
import type { CreateTaskInput } from "@/features/tasks/types/types";
import type { CreateShoppingItemInput } from "@/features/shopping/types/types";

const WEEKDAYS: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const weekdayForToday = (): Weekday => {
  const today = getToday();
  return WEEKDAYS[new Date(today).getDay()] ?? "Monday";
};

const mapIngredientToCategory = (
  ingredient: string
): CreateShoppingItemInput["category"] => {
  const name = ingredient.toLowerCase();

  if (
    name.includes("milk") ||
    name.includes("cheese") ||
    name.includes("chicken") ||
    name.includes("beef") ||
    name.includes("apple") ||
    name.includes("banana") ||
    name.includes("rice") ||
    name.includes("pasta")
  ) {
    return "Groceries";
  }

  return "Household";
};

type RecipeWorkflow = {
  meal: CreateMealInput;
  shoppingItems: CreateShoppingItemInput[];
  task: CreateTaskInput;
};

export const buildRecipeWorkflow = (
  recipe: Pick<Recipe, "name" | "ingredients">
): RecipeWorkflow => {
  const today = getToday();

  return {
    meal: {
      name: recipe.name,
      day: weekdayForToday(),
    },

    shoppingItems: recipe.ingredients.map((ingredient) => ({
      name: ingredient,
      category: mapIngredientToCategory(ingredient),
    })),

    task: {
      label: `Cook ${recipe.name}`,
      date: today,
    },
  };
};
