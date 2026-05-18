import { useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import AddRecipe from "@/features/recipes/components/AddRecipeModal";
import { useApplyRecipe } from "@/features/recipes/hooks/useApplyRecipe";
import { useRecipes } from "@/features/recipes/hooks/useRecipes";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeroTitle, Meta, Highlight } from "@/components/ui/Text";

const RecipesPage = () => {
  const { recipes, actions } = useRecipes();
  const { addRecipe } = actions;

  const { applyRecipe } = useApplyRecipe();

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <Header title="Recipes" />

        {recipes.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                title="No recipes yet"
                description="Start by adding your first recipe to begin building your collection"
                action={
                  <Button onClick={() => setOpen(true)} aria-label="Add recipe">
                    Add Recipe
                  </Button>
                }
                className="py-6"
              />
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardBody>
                  <button
                    type="button"
                    onClick={() => applyRecipe(recipe)}
                    className="w-full text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-80 transition"
                    aria-label={`Use recipe: ${recipe.name}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <HeroTitle>
                          {recipe.name}
                        </HeroTitle>

                        <Meta className="mt-1">
                          {recipe.ingredients.length} ingredient
                          {recipe.ingredients.length === 1 ? "" : "s"}
                          {recipe.category ? ` · ${recipe.category}` : ""}
                        </Meta>
                      </div>

                      <Highlight className="opacity-70">
                        Use
                      </Highlight>
                    </div>
                  </button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Only show when recipes exist */}
        {recipes.length > 0 && (
          <Button fullWidth onClick={() => setOpen(true)} aria-label="Add new recipe">
            <Plus size={16} /> Add Recipe
          </Button>
        )}
      </div>

      {/* MODAL OUTSIDE */}
      <AddRecipe
        open={open}
        onClose={() => setOpen(false)}
        onSave={addRecipe}
      />
    </>
  );
};

export default RecipesPage;
