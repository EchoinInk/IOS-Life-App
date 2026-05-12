/**
 * Parse ingredients from comma-separated string
 * Removes empty strings and trims whitespace
 */
export const parseIngredients = (ingredients: string): string[] => {
  return ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Format ingredients for display
 */
export const formatIngredients = (ingredients: string[]): string => {
  return ingredients.join(", ");
};
