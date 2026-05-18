import { create } from 'zustand';
import { getTasks, setTasks } from '../persistence/storage';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  priority?: TaskPriority;
  isDraft?: boolean;
}

interface TaskStore {
  tasks: Task[];
  draftTask: Partial<Task> | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (id: string) => void;
  undoCompleteTask: (task: Task) => void;
  updateDraft: (draft: Partial<Task>) => void;
  clearDraft: () => void;
  saveDraft: () => void;
  loadTasksFromStorage: () => Promise<void>;
  persistTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  draftTask: null,
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
      completed: false,
      isDraft: false,
    };
    set((state) => ({ 
      tasks: [...state.tasks, newTask],
      draftTask: null,
    }));
    get().persistTasks();
  },
  completeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    get().persistTasks();
  },
  undoCompleteTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, { ...task, completed: false }],
    }));
    get().persistTasks();
  },
  updateDraft: (draft) => {
    set({ draftTask: { ...get().draftTask, ...draft } });
  },
  clearDraft: () => {
    set({ draftTask: null });
  },
  saveDraft: () => {
    const { draftTask } = get();
    if (draftTask && draftTask.title) {
      get().addTask(draftTask as Omit<Task, 'id' | 'createdAt' | 'completed'>);
    }
  },
  loadTasksFromStorage: async () => {
    const tasks = await getTasks();
    set({ tasks });
  },
  persistTasks: async () => {
    const { tasks } = get();
    await setTasks(tasks);
  },
}));
