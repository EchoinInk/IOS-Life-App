import type { Task } from "@/features/tasks/types/types";

/**
 * Get priority color class for task priority
 */
export const getTaskPriorityColor = (priority?: string): string => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "muted";
    default:
      return "transparent";
  }
};

/**
 * Format time for display (e.g., "9AM", "2PM")
 */
export const formatTaskTime = (time?: string): string | null => {
  if (!time) return null;
  
  const hour = Number(time.split(":")[0]);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  
  return `${displayHour}${period}`;
};

/**
 * Get task completion status text
 */
export const getTaskCompletionText = (task: Task): string => {
  return task.completed ? "completed" : "pending";
};

/**
 * Check if task is overdue
 */
export const isTaskOverdue = (task: Task, today: string): boolean => {
  return !task.completed && task.date < today;
};
