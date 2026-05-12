import type { Task } from "@/features/tasks/types/types";

/**
 * CORE
 */

export const selectTasksByDate = (tasks: Task[], date: string) => {
  return tasks.filter((t) => t.date === date);
};

export const selectCompletedTasks = (tasks: Task[]) => {
  return tasks.filter((t) => t.completed);
};

export const selectIncompleteTasks = (tasks: Task[]) => {
  return tasks.filter((t) => !t.completed);
};

/**
 * COMPOSED (DATE-BASED)
 */

export const selectTodayTasks = (tasks: Task[], today: string) => {
  return selectTasksByDate(tasks, today);
};

export const selectCompletedTodayTasks = (tasks: Task[], today: string) => {
  return selectTasksByDate(tasks, today).filter((t) => t.completed);
};

export const selectIncompleteTodayTasks = (tasks: Task[], today: string) => {
  return selectTasksByDate(tasks, today).filter((t) => !t.completed);
};

export const selectUpcomingTasks = (tasks: Task[], today: string) => {
  return tasks.filter((t) => t.date > today);
};

/**
 * RELATIVE TO A REFERENCE DATE
 */

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export const selectUpcomingFromDate = (tasks: Task[], date: string): Task[] => {
  return tasks
    .filter((t) => !t.completed && t.date > date)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      const pa = PRIORITY_ORDER[a.priority as string] ?? 3;
      const pb = PRIORITY_ORDER[b.priority as string] ?? 3;
      return pa - pb;
    });
};

export const selectCompletedBeforeDate = (tasks: Task[], date: string): Task[] => {
  return tasks
    .filter((t) => t.completed && t.date < date)
    .sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * DERIVED
 */

export const selectNextTask = (tasks: Task[], today: string) => {
  return selectIncompleteTodayTasks(tasks, today)[0] ?? null;
};