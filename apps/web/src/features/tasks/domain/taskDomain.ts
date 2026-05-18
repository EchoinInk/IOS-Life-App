import type { Task } from "@/features/tasks/types/types";
import { safeDate } from "@/utils/safeDate";
import { categoryMetadata } from "@/features/tasks/constants/categories";

/**
 * ---------------------------------------
 * SIMPLE TASK UTILITIES
 * ---------------------------------------
 */

export const isTaskCompleted = (task: Task): boolean => {
  return task.completed;
};

/**
 * ---------------------------------------
 * PRESENTATION DERIVATION (TASK-SCOPED)
 * ---------------------------------------
 */

export type TaskCategoryMetadata = {
  bg: string;
  text: string;
  icon: string;
};

export const getCategoryMetadata = (category?: string): TaskCategoryMetadata => {
  const fallbackKey = "Other";
  const key = (category || fallbackKey) as keyof typeof categoryMetadata;
  return categoryMetadata[key] ?? categoryMetadata[fallbackKey];
};

export const formatTaskDisplayDate = (date: string): string => {
  const parsed = safeDate(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export const formatTaskDateTime = (date: string, time?: string): string => {
  return [formatTaskDisplayDate(date), time].filter(Boolean).join(" • ");
};