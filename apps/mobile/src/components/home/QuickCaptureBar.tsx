/**
 * Quick Capture Bar
 *
 * Sticky bottom action tray for one-handed quick entry.
 * Optimized for thumb ergonomics with high-frequency actions
 * positioned in the natural thumb zone.
 *
 * Design: Arc Search / Linear Mobile inspired
 * - Bottom-anchored for thumb reach
 * - Large, well-spaced touch targets
 * - Immediate visual feedback
 */
import { memo, useCallback } from "react";
import clsx from "clsx";
import { Plus, Utensils, DollarSign } from "lucide-react";

export interface QuickCaptureBarProps {
  onAddTask: () => void;
  onAddMeal: () => void;
  onAddExpense: () => void;
}

interface CaptureButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color?: "primary" | "success" | "warning";
  priority?: boolean;
}

/**
 * CaptureButton Motion System
 * - 150ms transitions for smooth state changes
 * - 5% scale compression on press for tactile feedback
 * - Icon hover scale for visual delight
 * - Consistent focus rings for accessibility
 */
const CaptureButton = ({
  icon: Icon,
  label,
  onClick,
  color = "primary",
  priority = false,
}: CaptureButtonProps) => {
  const colorClass = {
    primary: priority
      ? "bg-primary text-text-on-primary hover:brightness-110 hover:shadow-md"
      : "bg-surface-elevated text-text-primary hover:bg-surface hover:shadow-sm",
    success: "bg-surface-elevated text-success hover:bg-success/10 hover:shadow-sm",
    warning: "bg-surface-elevated text-warning hover:bg-warning/10 hover:shadow-sm",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex flex-col items-center justify-center",
        "min-w-[72px] min-h-[72px] sm:min-w-[80px] sm:min-h-[80px]",
        "rounded-2xl shadow-sm",
        colorClass[color],
        "transition-[background-color,transform] duration-150 ease-motion-out",
        "active:scale-[0.95] active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        "motion-reduce:transition-none motion-reduce:active:scale-100"
      )}
      aria-label={label}
    >
      <Icon
        size={priority ? 28 : 22}
        className={clsx(
          "transition-transform duration-150 ease-motion-out",
          "group-hover:scale-110",
          priority ? "mb-1" : "mb-0.5",
          "motion-reduce:transition-none"
        )}
      />
      <span className="text-[10px] sm:text-xs font-medium leading-none">
        {label}
      </span>
    </button>
  );
};

export const QuickCaptureBar = memo(({
  onAddTask,
  onAddMeal,
  onAddExpense,
}: QuickCaptureBarProps) => {
  const handleTask = useCallback(() => onAddTask(), [onAddTask]);
  const handleMeal = useCallback(() => onAddMeal(), [onAddMeal]);
  const handleExpense = useCallback(() => onAddExpense(), [onAddExpense]);

  return (
    <div className="sticky bottom-0 z-40 -mx-4 px-4 pt-3 pb-4 bg-gradient-to-t from-background via-background to-transparent">
      {/* Action Tray */}
      <div className="flex items-center justify-center gap-3">
        <CaptureButton
          icon={Utensils}
          label="Meal"
          onClick={handleMeal}
          color="success"
        />

        {/* Primary action - centered, larger */}
        <CaptureButton
          icon={Plus}
          label="Task"
          onClick={handleTask}
          color="primary"
          priority
        />

        <CaptureButton
          icon={DollarSign}
          label="Expense"
          onClick={handleExpense}
          color="warning"
        />
      </div>

      {/* Drag Handle (visual indicator) */}
      <div className="flex justify-center mt-3">
        <div className="w-10 h-1 rounded-full bg-text-muted/20" />
      </div>
    </div>
  );
});

QuickCaptureBar.displayName = "QuickCaptureBar";
export default QuickCaptureBar;
