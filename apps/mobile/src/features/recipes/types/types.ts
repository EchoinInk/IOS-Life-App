import type { EntityId } from "@/features/tasks/types/types";

export interface Recipe {
  id: EntityId;
  name: string;
  ingredients: string[];
  category?: string;
}

export interface CreateRecipeInput {
  name: string;
  ingredients: string[];
  category?: string;
}
