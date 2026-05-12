
/**
 * ---------------------------------------
 * CORE TYPES
 * ---------------------------------------
 */

export type EntityId = string;

export type TaskCategory =
  | "Home & Household"
  | "Health & Wellness"
  | "Career Development"
  | "Errands & Life Admin"
  | "Family & Relationships"
  | "Finances";

export type TaskRecurrence = "none" | "weekly" | "monthly";

export type TaskPriority = "low" | "medium" | "high";

/**
 * ---------------------------------------
 * TASK ENTITY
 * ---------------------------------------
 */

export interface Task {
  id: EntityId;
  label: string;
  date: string;
  time?: string;
  completed: boolean;
  category?: string;
  notes?: string;
  recurrence?: string;
  priority?: TaskPriority;
}

/**
 * ---------------------------------------
 * INPUT TYPES
 * ---------------------------------------
 */

export interface CreateTaskInput {
  label: string;
  date?: string;
  time?: string;
  category?: string;
  notes?: string;
  recurrence?: string;
  priority?: TaskPriority;
}

/**
 * ---------------------------------------
 * STORE STATE
 * ---------------------------------------
 */

export interface TasksState {
  tasks: Task[];

  addTask: (input: CreateTaskInput) => void;

  toggleTask: (id: EntityId) => void;

updateTask: (id: EntityId, updates: Partial<Task>) => void;

  deleteTask: (id: EntityId) => void;
}