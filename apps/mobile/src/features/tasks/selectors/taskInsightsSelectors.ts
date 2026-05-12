import type { Task } from "@/features/tasks/types/types";

export interface CategoryStat {
  category: string;
  count: number;
  completed: number;
}

/**
 * CORE SELECTORS
 */

export const selectTaskCategoryStats = (tasks: Task[]): Record<string, CategoryStat> => {
  return tasks.reduce((acc, task) => {
    const category = task.category || "Other";

    if (!acc[category]) {
      acc[category] = { category, count: 0, completed: 0 };
    }

    acc[category].count++;

    if (task.completed) {
      acc[category].completed++;
    }

    return acc;
  }, {} as Record<string, CategoryStat>);
};

/**
 * DERIVED SELECTORS
 */

export const selectActiveCategories = (tasks: Task[], limit: number = 3): CategoryStat[] => {
  const categoryStats = selectTaskCategoryStats(tasks);
  
  return Object.values(categoryStats)
    .filter((stat) => stat.count > stat.completed)
    .slice(0, limit);
};

export const selectTopActiveCategories = (tasks: Task[]): CategoryStat[] => {
  return selectActiveCategories(tasks, 3);
};
