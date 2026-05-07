import TodayQuickActionsGrid from "@/features/today/components/TodayQuickActionsGrid";

export interface QuickActionsPanelProps {
  tasks: number;
  meals: number;
  remaining: number;
  onAddTask: () => void;
  onAddMeal: () => void;
  onAddExpense: () => void;
}

/**
 * Quick Actions Panel
 * 
 * Displays quick action cards for tasks, meals, and budget.
 * Wraps TodayQuickActionsGrid with animation.
 */
export const QuickActionsPanel = ({ 
  tasks, 
  meals, 
  remaining, 
  onAddTask, 
  onAddMeal, 
  onAddExpense 
}: QuickActionsPanelProps) => {
  return (
    <div className="animate-[fadeIn_0.85s_ease-out]">
      <TodayQuickActionsGrid
        tasks={tasks}
        meals={meals}
        remaining={remaining}
        onAddTask={onAddTask}
        onAddMeal={onAddMeal}
        onAddExpense={onAddExpense}
      />
    </div>
  );
};
