/**
 * ARCHITECTURE RULES:
 * - No filtering / sorting in UI
 * - No business logic in components  
 * - Use selectors or hooks
 */
import { Surface } from "@/components/ui/Surface";
import { HeroTitle, Label } from "@/components/ui/Text";

import { useTasksStore } from "@/features/tasks/store/useTasksStore";
import { selectTodayTasks } from "@/features/tasks/selectors/taskSelectors";
import { selectTopActiveCategories } from "@/features/tasks/selectors/taskInsightsSelectors";
import { getToday } from "@/shared/lib/date";


/**
 * Today insights card.
 * Pure presentation — data derived via selector.
 */
export const TaskInsights = () => {
  const tasks = useTasksStore((state) => state.tasks);
  const today = getToday();

  const todayTasks = selectTodayTasks(tasks, today);

  const hasInsights = todayTasks.length > 0;

  if (!hasInsights) {
    return (
      <Surface className="space-y-2">
        <HeroTitle>Today Overview</HeroTitle>
        <Label className="text-muted">
          Start adding tasks to see insights here
        </Label>
      </Surface>
    );
  }

  const activeCategories = selectTopActiveCategories(todayTasks);

  return (
    <Surface className="space-y-2">
      <HeroTitle>Today Overview</HeroTitle>

      <div className="space-y-1">
        {activeCategories.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between"
          >
            <Label className="font-medium">{item.category}</Label>

            <Label className="text-foreground font-medium">
              {item.count - item.completed} left
            </Label>
          </div>
        ))}
      </div>
    </Surface>
  );
};