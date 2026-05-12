import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getToday } from "@/shared/lib/date";
import {
  createNamespacedStorage,
  STORE_VERSION,
} from "@/store/sharedPersist";

import type {
  CreateTaskInput,
  EntityId,
  Task,
  TasksState,
} from "@/features/tasks/types/types";
import * as Tracker from "@/analytics/eventTracker";

/**
 * Legacy task shape for migration
 */
type LegacyTask = Task & {
  completedDates?: string[];
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],

      /**
       * TOGGLE TASK
       */
      toggleTask: (id: EntityId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          
          // Track task completion event
          if (task) {
            const wasCompleted = task.completed;
            try {
              if (!wasCompleted) {
                // Task is being completed
                Tracker.trackEvent({
                  category: 'task',
                  action: 'completed',
                  properties: {
                    task_id: id,
                    category: task.category || 'uncategorized',
                    priority: task.priority || 'medium',
                    completed_on_time: true, // Simplified - could calculate based on due date
                  },
                });
              }
            } catch (error) {
              console.error('[Analytics] Failed to track task completion:', error);
            }
          }

          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
          };
        }),

      /**
       * ADD TASK
       */
      addTask: (input: CreateTaskInput) =>
        set((state) => {
          const newTask: Task = {
            id: crypto.randomUUID(),
            completed: false,
            date: input.date ?? getToday(),
            ...input,
          };

          // Track task creation event
          try {
            Tracker.trackEvent({
              category: 'task',
              action: 'created',
              properties: {
                task_id: newTask.id,
                category: input.category || 'uncategorized',
                priority: input.priority || 'medium',
                due_date: input.date,
              },
            });
          } catch (error) {
            console.error('[Analytics] Failed to track task creation:', error);
          }

          return {
            tasks: [...state.tasks, newTask],
          };
        }),

      /**
       * UPDATE TASK
       */
      updateTask: (id: EntityId, updates: Partial<Task>) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      /**
       * DELETE TASK
       */
      deleteTask: (id: EntityId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          
          // Track task deletion event
          if (task) {
            try {
              Tracker.trackEvent({
                category: 'task',
                action: 'deleted',
                properties: {
                  task_id: id,
                  category: task.category || 'uncategorized',
                  completion_status: task.completed ? 'completed' : 'pending',
                },
              });
            } catch (error) {
              console.error('[Analytics] Failed to track task deletion:', error);
            }
          }

          return {
            tasks: state.tasks.filter((task) => task.id !== id),
          };
        }),
    }),

    {
      name: "tasks",
      version: STORE_VERSION,

      storage: createNamespacedStorage<
        Pick<TasksState, "tasks">
      >(["tasks"]),

      partialize: (state) => ({
        tasks: state.tasks,
      }),

      /**
       * MIGRATION (TYPE-SAFE)
       */
      migrate: (persisted) => {
        const s = (persisted as Partial<TasksState>) ?? { tasks: [] };
        const todayDate = getToday();

        return {
          tasks: (s.tasks ?? []).map((task) => {
            const legacyTask = task as LegacyTask;

            if (legacyTask.completedDates) {
              return {
                ...legacyTask,
                completed: legacyTask.completedDates.includes(todayDate),
                completedDates: undefined,
              };
            }

            return task;
          }),
        } as TasksState;
      },
    }
  )
);