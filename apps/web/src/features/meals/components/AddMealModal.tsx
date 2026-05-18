import { useState } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import type { Weekday } from "@/features/meals/types/types";

interface AddMealProps {
  open: boolean;
  onClose: () => void;
  onSave: (meal: { name: string; day: Weekday; type: string }) => void;
}

const days: Weekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const AddMeal = ({ open, onClose, onSave }: AddMealProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [day, setDay] = useState<Weekday>("Monday");
  const [loading, setLoading] = useState(false);
  const canSave = name.trim().length > 0 && type.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    setLoading(true);
    try {
      await onSave({ name: name.trim(), day, type });
      setName("");
      setType("");
      setDay("Monday");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetDialog open={open} title="Add Meal" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-32">

          {/* MEAL NAME */}
          <div>
            <label htmlFor="meal-name" className="sr-only">
              Meal name
            </label>
            <input
              id="meal-name"
              placeholder="Meal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* MEAL TYPE */}
          <div>
            <label htmlFor="meal-type" className="sr-only">
              Meal type
            </label>
            <select
              id="meal-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Meal type</option>
              {mealTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* DAY */}
          <div>
            <label htmlFor="meal-day" className="sr-only">
              Day
            </label>
            <select
              id="meal-day"
              value={day}
              onChange={(e) => setDay(e.target.value as Weekday)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {days.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

        </div>

        {/* STICKY CTA */}
        <div className="sticky bottom-0 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 bg-background">
          <button
            type="submit"
            disabled={!canSave || loading}
            className="
              w-full
              py-3
              rounded-xl
              text-on-primary
              font-medium
              bg-primary
              disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            "
            aria-label={loading ? "Adding meal" : "Add meal"}
          >
            {loading ? "Adding..." : "Add Meal"}
          </button>
        </div>

      </form>
    </BottomSheetDialog>
  );
};

export default AddMeal;
