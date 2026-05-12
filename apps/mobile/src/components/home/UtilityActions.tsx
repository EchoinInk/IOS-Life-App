/**
 * Utility Actions
 *
 * Dense, dashboard-style action controls for common operations.
 * Designed for fast scanning and quick access.
 *
 * Design: Raycast-inspired utility bar
 * - Icon-forward design
 * - Compact grid layout
 * - Immediate action affordances
 */
import { memo, useCallback } from "react";
import { Plus, Utensils, DollarSign, ListTodo, ArrowUpRight } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export interface UtilityActionsProps {
  tasks: number;
  meals: number;
  remaining: number;
  onAddTask: () => void;
  onAddMeal: () => void;
  onAddExpense: () => void;
}

interface ActionItemProps {
  icon: React.ElementType;
  label: string;
  value?: string | number;
  onClick: () => void;
  color?: "primary" | "success" | "warning" | "default";
}

const ActionItem = ({
  icon: Icon,
  label,
  value,
  onClick,
  color = "default",
}: ActionItemProps) => {
  const colorClass = {
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    default: "bg-surface-elevated text-text-secondary hover:bg-surface-subtle",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex items-center gap-3
        min-h-[44px] p-3
        rounded-lg bg-surface-elevated hover:bg-surface
        transition-[background-color,transform] duration-200
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
        w-full text-left
      "
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClass[color]}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <Text size="sm" weight="medium" tone="primary">
            {label}
          </Text>
          <ArrowUpRight
            size={14}
            className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        {value !== undefined && (
          <Text size="xs" tone="muted" className="mt-0.5">
            {value}
          </Text>
        )}
      </div>
    </button>
  );
};

export const UtilityActions = memo(({
  tasks,
  meals,
  remaining,
  onAddTask,
  onAddMeal,
  onAddExpense,
}: UtilityActionsProps) => {
  const handleAddTask = useCallback(() => onAddTask(), [onAddTask]);
  const handleAddMeal = useCallback(() => onAddMeal(), [onAddMeal]);
  const handleAddExpense = useCallback(() => onAddExpense(), [onAddExpense]);

  return (
    <Surface variant="default" padding="md" radius="lg" className="w-full">
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1 mb-3">
          <Text size="xs" weight="semibold" tone="muted" className="uppercase tracking-wider">
            Quick Actions
          </Text>
        </div>

        {/* Action Grid - 2 columns on mobile, 3 on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <ActionItem
            icon={Plus}
            label="Add Task"
            value={tasks > 0 ? `${tasks} pending` : "No tasks"}
            onClick={handleAddTask}
            color="primary"
          />
          <ActionItem
            icon={Utensils}
            label="Log Meal"
            value={meals > 0 ? `${meals} logged` : "No meals"}
            onClick={handleAddMeal}
            color="success"
          />
          <ActionItem
            icon={DollarSign}
            label="Expense"
            value={`$${remaining} left`}
            onClick={handleAddExpense}
            color="warning"
          />
        </div>

        {/* Secondary Actions Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
          <button
            type="button"
            className="
              flex-1
              min-h-[44px] py-2.5 px-3
              rounded-lg bg-surface-subtle hover:bg-surface-elevated
              text-text-secondary hover:text-text-primary
              text-xs font-medium
              transition-[background-color,transform] duration-200
              active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
            "
          >
            <div className="flex items-center justify-center gap-1.5">
              <ListTodo size={16} />
              View All Tasks
            </div>
          </button>
        </div>
      </div>
    </Surface>
  );
});

UtilityActions.displayName = "UtilityActions";
export default UtilityActions;
