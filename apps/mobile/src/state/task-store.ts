import { create } from 'zustand';
import { getTasks, setTasks } from '../persistence/storage';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'today' | 'backlog' | 'snoozed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  isDraft?: boolean;
  snoozedUntil?: number;
}

interface TaskStore {
  tasks: Task[];
  draftTask: Partial<Task> | null;
  completedTask: Task | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (id: string) => void;
  undoCompleteTask: (task: Task) => void;
  snoozeTask: (id: string, hours?: number) => void;
  deferTask: (id: string) => void;
  reduceScope: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateDraft: (draft: Partial<Task>) => void;
  clearDraft: () => void;
  saveDraft: () => void;
  loadTasksFromStorage: () => Promise<void>;
  persistTasks: () => Promise<void>;
  recoverInterruptedState: () => void;
  seedDemoData: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  draftTask: null,
  completedTask: null,
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
      completed: false,
      isDraft: false,
      status: 'today',
    };
    set((state) => ({ 
      tasks: [...state.tasks, newTask],
      draftTask: null,
    }));
    get().persistTasks();
  },
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (task) {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        completedTask: task,
      }));
      get().persistTasks();
    }
  },
  undoCompleteTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, { ...task, completed: false }],
      completedTask: null,
    }));
    get().persistTasks();
  },
  snoozeTask: (id, hours = 24) => {
    const snoozedUntil = Date.now() + (hours * 60 * 60 * 1000);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, snoozedUntil, status: 'snoozed' }
          : task
      ),
    }));
    get().persistTasks();
  },
  deferTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, status: 'backlog', dueDate: undefined }
          : task
      ),
    }));
    get().persistTasks();
  },
  reduceScope: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, priority: task.priority === 'high' ? 'medium' : 'low' }
          : task
      ),
    }));
    get().persistTasks();
  },
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
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
  recoverInterruptedState: () => {
    const { draftTask, completedTask } = get();
    
    // Auto-save draft if it has content
    if (draftTask && draftTask.title && draftTask.title.trim()) {
      console.log('Recovering interrupted draft:', draftTask.title);
      // Optionally auto-save or prompt user
    }
    
    // Check for snoozed tasks that should be back
    const now = Date.now();
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.snoozedUntil && task.snoozedUntil < now) {
          return { ...task, snoozedUntil: undefined, status: 'today' };
        }
        return task;
      }),
    }));
  },
  seedDemoData: () => {
    const { tasks } = get();
    if (tasks.length === 0) {
      const now = Date.now();
      const yesterday = now - (24 * 60 * 60 * 1000);
      const tomorrow = now + (24 * 60 * 60 * 1000);
      
      const demoTasks: Task[] = [
        {
          id: '1',
          title: 'Reply to Sarah\'s email',
          completed: false,
          createdAt: yesterday,
          dueDate: yesterday,
          priority: 'high',
          status: 'today',
        },
        {
          id: '2',
          title: 'Take a 10-minute walk',
          completed: false,
          createdAt: now,
          priority: 'low',
          status: 'today',
        },
        {
          id: '3',
          title: 'Review project proposal',
          completed: false,
          createdAt: now,
          dueDate: tomorrow,
          priority: 'medium',
          status: 'today',
        },
        {
          id: '4',
          title: 'Water the plants',
          completed: false,
          createdAt: now,
          priority: 'low',
          status: 'today',
        },
        {
          id: '5',
          title: 'Schedule dentist appointment',
          completed: false,
          createdAt: now,
          dueDate: tomorrow,
          priority: 'medium',
          status: 'today',
        },
        {
          id: '6',
          title: 'Sort through mail',
          completed: false,
          createdAt: now,
          priority: 'low',
          status: 'today',
        },
        {
          id: '7',
          title: 'Call mom',
          completed: false,
          createdAt: now,
          priority: 'medium',
          status: 'today',
        },
      ];
      
      set({ tasks: demoTasks });
      get().persistTasks();
    }
  },
}));
