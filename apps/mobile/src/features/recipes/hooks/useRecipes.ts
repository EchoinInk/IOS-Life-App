import { useRecipesStore } from "../store/useRecipesStore";

export const useRecipes = () => {
  const recipes = useRecipesStore((state) => state.recipes);
  const addRecipe = useRecipesStore((state) => state.addRecipe);

  return {
    recipes,
    actions: {
      addRecipe,
    },
  };
};
