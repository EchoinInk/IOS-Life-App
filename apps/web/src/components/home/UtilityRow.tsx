/**
 * Utility Row — compact, inline action chips.
 * Tight, scannable, dashboard-style controls.
 */
import { memo } from "react";
import { Plus, Utensils, DollarSign, type LucideIcon } from "lucide-react";

export interface UtilityRowProps {
  tasks: number;
  meals: number;
  remaining: number;
  onAddTask: () => void;
  onAddMeal: () => void;
  onAddExpense: () => void;
}

interface ChipProps {
  icon: LucideIcon;
  label: string;
  meta: string;
  onClick: () => void;
}

const Chip = ({ icon: Icon, label, meta, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className="
      group flex-1 min-w-0
      flex items-center gap-2.5
      h-11 px-3
      rounded-lg
      bg-surface border border-border/60
      hover:bg-surface-hover hover:border-border/80
      active:scale-[0.98] active:bg-surface-active
      transition-[transform,opacity] duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
      text-left shadow-sm
    "
  >
    <span className="w-6.5 h-6.5 rounded-md bg-surface-elevated group-hover:bg-primary/10 group-hover:text-primary text-text-secondary flex items-center justify-center shrink-0 transition-[background-color,color] duration-200 shadow-sm">
      <Icon size={14} strokeWidth={2.25} />
    </span>
    <span className="flex flex-col min-w-0 leading-tight">
      <span className="text-[12px] font-bold text-text-primary truncate">
        {label}
      </span>
      <span className="text-[10.5px] font-medium text-text-secondary truncate tabular-nums">
        {meta}
      </span>
    </span>
  </button>
);

export const UtilityRow = memo(
  ({
    tasks,
    meals,
    remaining,
    onAddTask,
    onAddMeal,
    onAddExpense,
  }: UtilityRowProps) => (
    <div className="flex items-stretch gap-2">
      <Chip
        icon={Plus}
        label="Task"
        meta={tasks > 0 ? `${tasks} open` : "Add"}
        onClick={onAddTask}
      />
      <Chip
        icon={Utensils}
        label="Meal"
        meta={meals > 0 ? `${meals} logged` : "Log"}
        onClick={onAddMeal}
      />
      <Chip
        icon={DollarSign}
        label="Expense"
        meta={`$${remaining} left`}
        onClick={onAddExpense}
      />
    </div>
  ),
);

UtilityRow.displayName = "UtilityRow";
export default UtilityRow;
