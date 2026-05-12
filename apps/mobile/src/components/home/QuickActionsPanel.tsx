import { memo, useCallback } from "react";
import TodayQuickActionsGrid from "@/features/today/components/TodayQuickActionsGrid";
import { TAILWIND_ANIMATIONS } from "@/theme/animations";
import { useDashboardAnalytics } from "@/analytics/analyticsHooks";

export interface QuickActionsPanelProps {
  tasks: number;
  meals: number;
  remaining: number;
  routinesCompleted: number;
  routinesTotal: number;
  onAddTask: () => void;
  onAddMeal: () => void;
  onAddExpense: () => void;
  onStartRoutine: () => void;
}

/**
 * Quick Actions Panel
 * 
 * Displays quick action cards for tasks, meals, and budget.
 * Wraps TodayQuickActionsGrid with animation.
 * 
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses centralized animation utilities
 * - Memoized callbacks to prevent child re-renders
 */
export const QuickActionsPanel = memo(({ 
  tasks, 
  meals, 
  remaining, 
  routinesCompleted,
  routinesTotal,
  onAddTask, 
  onAddMeal, 
  onAddExpense,
  onStartRoutine
}: QuickActionsPanelProps) => {
  const { quickActionUsed: dashboardQuickActionUsed } = useDashboardAnalytics();

  // Memoize callbacks to prevent TodayQuickActionsGrid from re-rendering
  const handleAddTask = useCallback(() => {
    dashboardQuickActionUsed('add_task', 'home');
    onAddTask();
  }, [onAddTask, dashboardQuickActionUsed]);

  const handleAddMeal = useCallback(() => {
    dashboardQuickActionUsed('view_shopping', 'home');
    onAddMeal();
  }, [onAddMeal, dashboardQuickActionUsed]);

  const handleAddExpense = useCallback(() => {
    dashboardQuickActionUsed('view_shopping', 'home');
    onAddExpense();
  }, [onAddExpense, dashboardQuickActionUsed]);

  const handleStartRoutine = useCallback(() => {
    dashboardQuickActionUsed('start_routine', 'home');
    onStartRoutine();
  }, [onStartRoutine, dashboardQuickActionUsed]);

  return (
    <div className={TAILWIND_ANIMATIONS.fadeIn}>
      <TodayQuickActionsGrid
        tasks={tasks}
        meals={meals}
        remaining={remaining}
        routinesCompleted={routinesCompleted}
        routinesTotal={routinesTotal}
        onAddTask={handleAddTask}
        onAddMeal={handleAddMeal}
        onAddExpense={handleAddExpense}
        onStartRoutine={handleStartRoutine}
      />
    </div>
  );
});

QuickActionsPanel.displayName = 'QuickActionsPanel';
