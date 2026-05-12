import { useState } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import { FormActions } from "@/components/ui/FormActions";
import { Field, ModalForm, TextareaField, SelectField } from "@/components/ui/FormField";
import { parseIngredients } from "../utils/recipeUtils";

interface AddRecipeProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: { name: string; ingredients: string[]; category?: string }) => void;
}

const categories = ["Breakfast", "Lunch", "Dinner"];

const AddRecipe = ({ open, onClose, onSave }: AddRecipeProps) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("");
  const canSave = name.trim().length > 0;

  const reset = () => {
    setName("");
    setIngredients("");
    setCategory("");
  };

  return (
    <BottomSheetDialog open={open} title="Add Recipe" onClose={onClose}>
      <ModalForm onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        onSave({ name: name.trim(), ingredients: parseIngredients(ingredients), category: category || undefined });
        reset();
        onClose();
      }}>
        <Field id="add-recipe-name" label="Recipe name" autoFocus placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextareaField id="add-recipe-ingredients" label="Ingredients" placeholder="Ingredients (comma separated)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={3} />
        <SelectField id="add-recipe-category" label="Recipe category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">No category</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <FormActions onCancel={() => { reset(); onClose(); }} disabled={!canSave} />
      </ModalForm>
    </BottomSheetDialog>
  );
};

export default AddRecipe;
