import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@/shared/lib/id";
import { createNamespacedStorage, STORE_VERSION } from "@/store/sharedPersist";
import type { CreateMealInput, Meal } from "@/features/meals/types/types";

interface MealsState {
  meals: Meal[];
  addMeal: (input: CreateMealInput) => void;
}

export const useMealsStore = create<MealsState>()(
  persist(
    (set) => ({
      meals: [],
      addMeal: (input) =>
        set((state) => ({
          meals: [{ id: createId(), ...input }, ...state.meals],
        })),
    }),
    {
      name: "meals",
      version: STORE_VERSION,
      storage: createNamespacedStorage<Pick<MealsState, "meals">>(["meals"]),
      partialize: (state) => ({ meals: state.meals }),
    },
  ),
);
