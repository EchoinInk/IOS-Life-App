import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import { taskCategories } from "@/features/tasks/constants/categories";
import type { TaskCategory, TaskRecurrence, TaskPriority } from "@/features/tasks/types/types";

export interface EditTaskModalViewModel {
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
  onDelete: () => void;
}

export const EditTaskModalView = ({ model }: { model: EditTaskModalViewModel }) => {
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
    onDelete,
  } = model;

  return (
    <BottomSheetDialog open={open} title="Edit Task" onClose={onClose}>
      
      {/* CONTENT */}
      <form onSubmit={onSave} className="flex flex-col h-full">

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-32">

          {/* TASK NAME */}
          <input
            placeholder="Task name"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm outline-none"
          />

          {/* DATE + RECURRING (same row) */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm"
            />
            <select
              value={recurrence}
              onChange={(e) => onRecurrenceChange(e.target.value as TaskRecurrence)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm"
            >
              <option value="">Recurring</option>
              <option value="none">None</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* CATEGORY + PRIORITY (same row) */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value as TaskCategory)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm"
            >
              <option value="">Category</option>
              {taskCategories.map((c: TaskCategory) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm"
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* NOTES */}
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm min-h-[80px]"
          />

        </div>

        {/* STICKY FOOTER: DELETE + UPDATE */}
        <div className="sticky bottom-0 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 bg-background">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onDelete}
              className="
                py-3
                rounded-xl
                text-destructive
                font-medium
                bg-destructive/10
              "
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={!canSave || loading}
              className="
                py-3
                rounded-xl
                text-on-primary
                font-medium
                bg-primary
                disabled:opacity-50
              "
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

      </form>
    </BottomSheetDialog>
  );
};
