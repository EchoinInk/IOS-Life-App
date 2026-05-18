import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@/shared/lib/id";
import { createNamespacedStorage, STORE_VERSION } from "@/store/sharedPersist";
import type { CreateRecipeInput, Recipe } from "@/features/recipes/types/types";

interface RecipesState {
  recipes: Recipe[];
  addRecipe: (input: CreateRecipeInput) => void;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set) => ({
      recipes: [],
      addRecipe: (input) =>
        set((state) => ({ recipes: [{ id: createId(), ...input }, ...state.recipes] })),
    }),
    {
      name: "recipes",
      version: STORE_VERSION,
      storage: createNamespacedStorage<Pick<RecipesState, "recipes">>(["recipes"]),
      partialize: (state) => ({ recipes: state.recipes }),
    },
  ),
);
