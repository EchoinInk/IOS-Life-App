import { memo, useCallback } from "react";
import type { HomeDashboardData } from "@/features/home/hooks/useHomeDashboard";
import type { HomeModalsReturn } from "@/features/home/hooks/useHomeModals";
import { TodayCommandCenter } from "./TodayCommandCenter";
import { UpNextPriority } from "./UpNextPriority";
import { UtilityActions } from "./UtilityActions";
import { InsightsPanel } from "./InsightsPanel";

export interface HomeDashboardViewProps {
  data: HomeDashboardData;
  modals: HomeModalsReturn;
}

/**
 * Home Dashboard View — Productivity OS Command Center
 *
 * Redesigned for high-signal density and immediate action:
 * 1. Today Command Center - Compact daily overview
 * 2. Up Next Priority - Primary focal point with urgency
 * 3. Utility Actions - Dense, fast-access controls
 * 4. Insights - Secondary context
 *
 * Layout:
 * - Mobile: Single column, stacked hierarchy
 * - Tablet/Desktop: 2-column grid for Command Center + Actions
 *
 * Design principles:
 * - Testable (pure component, props-driven)
 * - Memoized for performance
 * - Accessibility-first (semantic HTML, ARIA labels)
 */
export const HomeDashboardView = memo(({ data, modals }: HomeDashboardViewProps) => {
  const { nextTask, todayData, toggleTask } = data;
  const { openTaskModal, openMealModal, openExpenseModal } = modals;

  // Memoize callbacks to prevent child re-renders
  const handleToggleNextTask = useCallback(() => {
    if (nextTask) {
      toggleTask(nextTask.id);
    }
  }, [nextTask, toggleTask]);

  return (
    <div className="space-y-3">
      {/* ROW 1: Command Center + Utility Actions (side-by-side on larger screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <TodayCommandCenter
          percentage={todayData.focus.percentage}
          total={todayData.summary.tasks.total}
          completed={todayData.summary.tasks.completed}
          remaining={todayData.summary.tasks.total - todayData.summary.tasks.completed}
          onAddTask={openTaskModal}
        />
        <UtilityActions
          tasks={todayData.summary.tasks.total}
          meals={todayData.summary.meals.logged}
          remaining={todayData.summary.budget.remaining}
          onAddTask={openTaskModal}
          onAddMeal={openMealModal}
          onAddExpense={openExpenseModal}
        />
      </div>

      {/* ROW 2: Up Next Priority - Primary focal point */}
      <section aria-label="Next task">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Up Next
          </span>
          {nextTask && (
            <span className="text-xs text-text-muted">
              Tap to complete
            </span>
          )}
        </div>
        <UpNextPriority
          task={nextTask}
          onPress={handleToggleNextTask}
        />
      </section>

      {/* ROW 3: Insights - Contextual awareness */}
      <section aria-label="Insights">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Insights
          </span>
        </div>
        <InsightsPanel />
      </section>
    </div>
  );
});

HomeDashboardView.displayName = 'HomeDashboardView';
