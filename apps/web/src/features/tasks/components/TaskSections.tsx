import { useState, useMemo, useCallback } from "react";
import type { Task } from "../types/types";
import { TaskRowNew } from "./TaskRowNew";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  selectIncompleteTasks,
  selectCompletedTasks,
} from "../selectors/taskSelectors";

interface Props {
  todayTasks: Task[];
  upcomingTasks: Task[];
  completedTasks: Task[];
  onToggle: (id: string) => void;
}

/**
 * Task Sections Component
 * 
 * Renders task lists organized by status.
 * 
 * Performance optimizations:
 * - Memoized derived state to prevent recalculation
 * - Memoized callbacks to prevent child re-renders
 * - Virtualization candidate for large lists (>50 items)
 */
export const TaskSections = ({ todayTasks, upcomingTasks, completedTasks, onToggle }: Props) => {
  const [completedExpanded, setCompletedExpanded] = useState(false);

  // Memoize derived state to prevent recalculation on every render
  const derivedState = useMemo(() => {
    const todayIncomplete = selectIncompleteTasks(todayTasks);
    const todayCompleted = selectCompletedTasks(todayTasks);
    const allCompletedCount = todayCompleted.length + completedTasks.length;
    
    return {
      todayIncomplete,
      todayCompleted,
      allCompletedCount,
      hasTodayTasks: todayIncomplete.length > 0,
      hasUpcomingTasks: upcomingTasks.length > 0,
      hasCompletedTasks: allCompletedCount > 0,
      isEmpty: todayIncomplete.length === 0 && upcomingTasks.length === 0,
    };
  }, [todayTasks, upcomingTasks, completedTasks]);

  // Memoize callback to prevent TaskRowNew from re-rendering when parent re-renders
  const handleToggle = useCallback((id: string) => {
    onToggle(id);
  }, [onToggle]);

  // Memoize toggle callback for completed section
  const toggleCompleted = useCallback(() => {
    setCompletedExpanded(prev => !prev);
  }, []);

  const {
    todayIncomplete,
    todayCompleted,
    allCompletedCount,
    hasTodayTasks,
    hasUpcomingTasks,
    hasCompletedTasks,
    isEmpty,
  } = derivedState;

  return (
    <div className="space-y-4">
      
      {/* Today Section */}
      {hasTodayTasks && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground px-3">Today</h3>
          <div className="space-y-1">
            {todayIncomplete.map((task) => (
              <TaskRowNew key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {hasUpcomingTasks && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted px-3">Upcoming</h3>
          <div className="space-y-1">
            {upcomingTasks.map((task) => (
              <TaskRowNew key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {hasCompletedTasks && (
        <div className="space-y-2">
          <button
            onClick={toggleCompleted}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            {completedExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Completed ({allCompletedCount})
          </button>
          
          {completedExpanded && (
            <div className="space-y-1">
              {todayCompleted.map((task) => (
                <TaskRowNew key={task.id} task={task} onToggle={handleToggle} />
              ))}
              {completedTasks.map((task) => (
                <TaskRowNew key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="px-3 py-8 text-center">
          <p className="text-sm text-muted">No tasks for this day</p>
          <p className="text-xs text-muted mt-1">Add a task to get started</p>
        </div>
      )}
    </div>
  );
};
