import { useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import AddMeal from "@/features/meals/components/AddMealModal";
import { IntelligentEmptyState } from "@/components/ui/IntelligentEmptyState";
import { Body } from "@/components/ui/Text";

import { weekdays } from "@/features/meals/constants/weekdays";
import { useMeals } from "@/features/meals/hooks/useMeals";

const MealPlannerPage = () => {
  const { actions, mealsByDay } = useMeals();
  const { addMeal } = actions;

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <Header title="Meal Planner" />

        {weekdays.map((day) => {
          const dayMeals = mealsByDay[day] ?? [];

          return (
            <Card key={day}>
              <CardHeader title={day} />
              <CardBody>
                {dayMeals.length === 0 ? (
                  <IntelligentEmptyState
                    context="meals"
                    isFirstTime={true}
                    className="py-4"
                    action={
                      <Button onClick={() => setOpen(true)} variant="primary" size="sm">
                        Plan First Meal
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {dayMeals.map((meal) => (
                      <Body key={meal.id}>
                        {meal.name}
                      </Body>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}

        <Button fullWidth onClick={() => setOpen(true)} aria-label="Add meal">
          <Plus size={16} /> Add Meal
        </Button>
      </div>

      {/* MODAL OUTSIDE */}
      <AddMeal
        open={open}
        onClose={() => setOpen(false)}
        onSave={addMeal}
      />
    </>
  );
};

export default MealPlannerPage;