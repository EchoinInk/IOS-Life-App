/**
 * Recurrence Engine - Handles recurring task and routine generation
 * Isolated domain logic for scheduling and recurrence patterns
 */

import type { RecurringTaskTemplate, RecurringTaskInstance } from '../types/routines.types';
import { getTodayString, getDayOfWeek, getDayOfMonth } from '../utils/dateUtils';

/**
 * Check if a recurring task should be generated for a specific date
 */
export const shouldGenerateTask = (
  template: RecurringTaskTemplate,
  targetDate: string
): boolean => {
  if (!template.isActive) return false;

  const targetDateObj = new Date(targetDate);
  const today = new Date(getTodayString());

  // Don't generate for past dates
  if (targetDateObj < today) return false;

  switch (template.frequency) {
    case 'daily':
      return true;
    
    case 'weekly':
      return template.dayOfWeek === getDayOfWeek(targetDateObj);
    
    case 'monthly':
      return template.dayOfMonth === getDayOfMonth(targetDateObj);
    
    default:
      return false;
  }
};

/**
 * Generate recurring task instances for a date
 */
export const generateRecurringTasks = (
  templates: RecurringTaskTemplate[],
  targetDate: string
): RecurringTaskInstance[] => {
  const tasks: RecurringTaskInstance[] = [];

  templates.forEach(template => {
    if (shouldGenerateTask(template, targetDate)) {
      const task: RecurringTaskInstance = {
        id: `${template.id}-${targetDate}`,
        templateId: template.id,
        title: template.title,
        description: template.description,
        category: template.category,
        priority: template.priority,
        dueDate: targetDate,
        estimatedDuration: template.estimatedDuration,
        status: 'pending',
        momentum: template.priority === 'high' ? 5 : template.priority === 'medium' ? 3 : 2,
        generatedAt: new Date().toISOString()
      };
      tasks.push(task);
    }
  });

  return tasks;
};

/**
 * Get next generation dates for a template
 */
export const getNextGenerationDates = (
  template: RecurringTaskTemplate,
  fromDate: string,
  count: number = 5
): string[] => {
  const dates: string[] = [];
  const startDate = new Date(fromDate);
  const currentDate = new Date(startDate);

  while (dates.length < count && currentDate <= new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000))) { // 90 days max
    const dateString = currentDate.toISOString().split('T')[0];
    if (dateString && shouldGenerateTask(template, dateString)) {
      dates.push(dateString);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Check if a task instance is overdue
 */
export const isTaskOverdue = (task: RecurringTaskInstance): boolean => {
  const today = getTodayString();
  return task.dueDate < today && task.status === 'pending';
};

/**
 * Get tasks due today
 */
export const getTasksDueToday = (tasks: RecurringTaskInstance[]): RecurringTaskInstance[] => {
  const today = getTodayString();
  return tasks.filter(task => task.dueDate === today);
};

/**
 * Get overdue tasks
 */
export const getOverdueTasks = (tasks: RecurringTaskInstance[]): RecurringTaskInstance[] => {
  return tasks.filter(task => isTaskOverdue(task));
};
