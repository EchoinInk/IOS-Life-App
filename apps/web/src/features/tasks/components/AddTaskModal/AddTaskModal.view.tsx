import { memo } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import { taskCategories } from "@/features/tasks/constants/categories";
import type {
  TaskCategory,
  TaskRecurrence,
  TaskPriority,
} from "@/features/tasks/types/types";

export interface AddTaskModalViewModel {
  open: boolean;
  label: string;
  notes: string;
  date: string;
  category: TaskCategory | "";
  recurrence: TaskRecurrence | "";
  priority: TaskPriority | "";
  canSave: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void;
  onLabelChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCategoryChange: (value: TaskCategory) => void;
  onRecurrenceChange: (value: TaskRecurrence) => void;
  onPriorityChange: (value: TaskPriority) => void;
}

export const AddTaskModalView = memo(
  ({ model }: { model: AddTaskModalViewModel }) => {
    const {
      open,
      label,
      notes,
      date,
      category,
      recurrence,
      priority,
      canSave,
      loading,
      onClose,
      onSave,
      onLabelChange,
      onNotesChange,
      onDateChange,
      onCategoryChange,
      onRecurrenceChange,
      onPriorityChange,
    } = model;

    return (
      <BottomSheetDialog open={open} title="Add Task" onClose={onClose}>
        {/* FORM - Optimized for mobile ergonomics */}
        <form onSubmit={onSave} className="flex flex-col h-full">

          {/* SCROLLABLE INPUT AREA */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">

            {/* TASK NAME - Primary input with better touch target */}
            <div className="space-y-2">
              <label htmlFor="task-label" className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Task Name
              </label>
              <input
                id="task-label"
                autoFocus
                value={label}
                placeholder="What needs to be done?"
                onChange={(e) => onLabelChange(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                className="
                  w-full
                  min-h-[48px]
                  rounded-lg
                  bg-surface-elevated
                  border border-border
                  px-4 py-3
                  text-base
                  placeholder:text-text-placeholder
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30
                  transition-all duration-150
                "
              />
            </div>

            {/* DATE + RECURRING - Touch-friendly selects */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="
                    w-full
                    min-h-[44px]
                    rounded-lg
                    bg-surface-elevated
                    border border-border
                    px-3 py-2.5
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Repeat
                </label>
                <select
                  value={recurrence}
                  onChange={(e) =>
                    onRecurrenceChange(e.target.value as TaskRecurrence)
                  }
                  className="
                    w-full
                    min-h-[44px]
                    rounded-lg
                    bg-surface-elevated
                    border border-border
                    px-3 py-2.5
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
                >
                  <option value="">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* CATEGORY + PRIORITY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    onCategoryChange(e.target.value as TaskCategory)
                  }
                  className="
                    w-full
                    min-h-[44px]
                    rounded-lg
                    bg-surface-elevated
                    border border-border
                    px-3 py-2.5
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
                >
                  <option value="">Select...</option>
                  {taskCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    onPriorityChange(e.target.value as TaskPriority)
                  }
                  className="
                    w-full
                    min-h-[44px]
                    rounded-lg
                    bg-surface-elevated
                    border border-border
                    px-3 py-2.5
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
                >
                  <option value="">Normal</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* NOTES - Larger touch target */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                placeholder="Add any additional details..."
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                className="
                  w-full
                  rounded-lg
                  bg-surface-elevated
                  border border-border
                  px-4 py-3
                  text-sm
                  placeholder:text-text-placeholder
                  resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                  transition-all duration-150
                "
              />
            </div>

          </div>

          {/* STICKY CTA BUTTON - Always accessible in thumb zone */}
          <div className="
            sticky bottom-0
            px-4 py-4
            bg-background
            border-t border-border-subtle
            safe-area-bottom
          ">
            <button
              type="submit"
              disabled={!canSave || loading}
              className="
                w-full
                min-h-[48px]
                rounded-lg
                bg-primary
                text-text-on-primary
                font-semibold
                text-base
                shadow-sm
                transition-all duration-150
                hover:brightness-105
                active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2
              "
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>

        </form>
      </BottomSheetDialog>
    );
  }
);

AddTaskModalView.displayName = "AddTaskModalView";