import { create } from 'zustand';
import { getTasks, setTasks } from '../persistence/storage';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  addTask: (title: string) => void;
  completeTask: (id: string) => void;
  loadTasksFromStorage: () => Promise<void>;
  persistTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  addTask: (title) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    get().persistTasks();
  },
  completeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    get().persistTasks();
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
