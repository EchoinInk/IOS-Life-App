import { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useTasksStore } from "../store/useTasksStore";
import {
  selectTasksByDate,
  selectCompletedTasks,
  selectIncompleteTasks,
  selectTodayTasks,
  selectCompletedTodayTasks,
  selectIncompleteTodayTasks,
  selectUpcomingFromDate,
  selectCompletedBeforeDate,
  selectNextTask,
} from "../selectors/taskSelectors";
import { getToday } from "@/shared/lib/date";

/**
 * Task Data Hook
 * 
 * Provides all task-related data selection.
 * Uses shallow selectors for optimal performance.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Task data and derived state
 */
export const useTaskData = () => {
  // Use shallow selector to prevent unnecessary re-renders
  const tasks = useTasksStore((s) => s.tasks, shallow);
  const today = getToday();

  // Core data
  const allTasks = useMemo(() => tasks, [tasks]);

  // Derived state using selectors - memoized to prevent recalculations
  const todayTasks = useMemo(() => selectTodayTasks(tasks, today), [tasks, today]);
  const completedTodayTasks = useMemo(() => selectCompletedTodayTasks(tasks, today), [tasks, today]);
  const incompleteTodayTasks = useMemo(() => selectIncompleteTodayTasks(tasks, today), [tasks, today]);
  const nextTask = useMemo(() => selectNextTask(tasks, today), [tasks, today]);
  const upcomingTasks = useMemo(() => selectUpcomingFromDate(tasks, today), [tasks, today]);
  const completedBeforeToday = useMemo(() => selectCompletedBeforeDate(tasks, today), [tasks, today]);
  const completedTasks = useMemo(() => selectCompletedTasks(tasks), [tasks]);
  const incompleteTasks = useMemo(() => selectIncompleteTasks(tasks), [tasks]);

  // Computed metrics - memoized to prevent recalculations
  const metrics = useMemo(() => ({
    totalTasks: tasks.length,
    completedCount: completedTasks.length,
    incompleteCount: incompleteTasks.length,
  }), [tasks.length, completedTasks.length, incompleteTasks.length]);

  return {
    // Raw data
    tasks: allTasks,
    
    // Today's data
    todayTasks,
    completedTodayTasks,
    incompleteTodayTasks,
    nextTask,
    
    // Date-based data
    upcomingTasks,
    completedBeforeToday,
    
    // Status-based data
    completedTasks,
    incompleteTasks,
    
    // Computed metrics
    ...metrics,
  };
};

/**
 * Task Data Hook with Date Parameter
 * 
 * Variant that accepts a date parameter for flexible date-based queries.
 * 
 * @param date - The date to query tasks for
 * @returns Task data for the specified date
 */
export const useTaskDataByDate = (date: string) => {
  const tasks = useTasksStore((s) => s.tasks, shallow);

  const tasksByDate = useMemo(() => selectTasksByDate(tasks, date), [tasks, date]);
  const completedTasksByDate = useMemo(
    () => selectTasksByDate(tasks, date).filter((t) => t.completed),
    [tasks, date]
  );
  const incompleteTasksByDate = useMemo(
    () => selectTasksByDate(tasks, date).filter((t) => !t.completed),
    [tasks, date]
  );

  return {
    tasks: tasksByDate,
    completedTasks: completedTasksByDate,
    incompleteTasks: incompleteTasksByDate,
    total: tasksByDate.length,
    completed: completedTasksByDate.length,
    incomplete: incompleteTasksByDate.length,
  };
};
