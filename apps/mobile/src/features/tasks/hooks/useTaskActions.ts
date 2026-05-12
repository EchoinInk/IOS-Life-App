import { useTasksStore } from "../store/useTasksStore";
import type { CreateTaskInput, EntityId, Task } from "../types/types";

/**
 * Task Actions Hook
 * 
 * Provides all task-related actions.
 * Decouples UI from Zustand store implementation.
 * 
 * @returns Task action functions
 */
export const useTaskActions = () => {
  const addTask = useTasksStore((s) => s.addTask);
  const toggleTask = useTasksStore((s) => s.toggleTask);
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);

  return {
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
  };
};

/**
 * Type-safe action interface for mocking/testing
 */
export interface TaskActions {
  addTask: (input: CreateTaskInput) => void;
  toggleTask: (id: EntityId) => void;
  updateTask: (id: EntityId, updates: Partial<Task>) => void;
  deleteTask: (id: EntityId) => void;
}
