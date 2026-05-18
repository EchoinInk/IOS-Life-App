import { memo, useCallback, useEffect } from "react";
import type { HomeDashboardData } from "@/features/home/hooks/useHomeDashboard";
import type { HomeModalsReturn } from "@/features/home/hooks/useHomeModals";
import { TodayFocusCard } from "./TodayFocusCard";
import { UtilityRow } from "./UtilityRow";
import { InsightsPanel } from "./InsightsPanel";
import { useDashboardAnalytics } from "@/analytics/analyticsHooks";

export interface HomeDashboardViewProps {
  data: HomeDashboardData;
  modals: HomeModalsReturn;
}

/**
 * Home Dashboard — premium productivity OS layout.
 *
 * Hierarchy:
 *  1. Today Focus Card (dominant) — progress + next task + CTA
 *  2. Utility Row — compact Add Task / Log Meal / Expense chips
 *  3. Insights — secondary, ambient context
 */
export const HomeDashboardView = memo(({ data, modals }: HomeDashboardViewProps) => {
  const { nextTask, todayData, toggleTask } = data;
  const { openTaskModal, openMealModal, openExpenseModal } = modals;
  const { viewed: dashboardViewed } = useDashboardAnalytics();

  const handleCompleteNext = useCallback(() => {
    if (nextTask) toggleTask(nextTask.id);
  }, [nextTask, toggleTask]);

  // Track dashboard view
  useEffect(() => {
    dashboardViewed(
      'home',
      todayData.summary.tasks.total - todayData.summary.tasks.completed,
      todayData.summary.tasks.completed,
      0 // momentum score - would need to be calculated
    );
  }, [dashboardViewed, todayData]);

  return (
    <div className="space-y-3.5">
      {/* PRIMARY — Today focus */}
      <TodayFocusCard
        percentage={todayData.focus.percentage}
        total={todayData.summary.tasks.total}
        completed={todayData.summary.tasks.completed}
        remaining={todayData.summary.tasks.total - todayData.summary.tasks.completed}
        nextTask={nextTask}
        onAddTask={openTaskModal}
        onCompleteNext={handleCompleteNext}
      />

      {/* SECONDARY — Quick capture utilities */}
      <UtilityRow
        tasks={todayData.summary.tasks.total - todayData.summary.tasks.completed}
        meals={todayData.summary.meals.logged}
        remaining={todayData.summary.budget.remaining}
        onAddTask={openTaskModal}
        onAddMeal={openMealModal}
        onAddExpense={openExpenseModal}
      />

      {/* TERTIARY — Insights */}
      <section aria-label="Insights" className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary">
            Insights
          </h2>
        </div>
        <InsightsPanel />
      </section>
    </div>
  );
});

HomeDashboardView.displayName = "HomeDashboardView";
