/**
 * Routines System Types - Simplified and flattened for better TypeScript inference
 * Focused on data structures without business logic
 */

export type RoutineType = 
  | 'morning'
  | 'evening'
  | 'weekly'
  | 'focus'
  | 'planning';

export type RoutineFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly';

export type RoutineStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type FocusSessionStatus = 
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled';

// Core entities - simplified and flat
export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  type: RoutineType;
  frequency: RoutineFrequency;
  steps: RoutineStep[];
  estimatedDuration: number;
  isDefault: boolean;
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  isOptional: boolean;
  estimatedDuration: number;
  category: 'planning' | 'reflection' | 'preparation' | 'review' | 'focus';
  defaultCompleted: boolean;
}

export interface RoutineInstance {
  id: string;
  templateId: string;
  date: string;
  type: RoutineType;
  status: RoutineStatus;
  steps: RoutineInstanceStep[];
  startedAt?: string;
  completedAt?: string;
  momentum: number;
  insights: string[];
}

export interface RoutineInstanceStep {
  id: string;
  stepId: string;
  status: RoutineStatus;
  completedAt?: string;
  notes?: string;
  momentum: number;
}

export interface FocusSession {
  id: string;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: FocusSessionStatus;
  duration: number;
  focusArea: string;
  momentum: number;
  interruptions: number;
  quality: 'low' | 'medium' | 'high';
}

export interface RecurringTaskTemplate {
  id: string;
  title: string;
  description?: string;
  frequency: RoutineFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number;
  isActive: boolean;
  createdAt: string;
  lastGenerated?: string;
}

export interface RecurringTaskInstance {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  estimatedDuration: number;
  status: RoutineStatus;
  momentum: number;
  generatedAt: string;
  completedAt?: string;
}

export interface PlanningRitual {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  frequency: RoutineFrequency;
  steps: PlanningStep[];
  isActive: boolean;
  lastCompleted?: string;
  momentum: number;
}

export interface PlanningStep {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  category: 'review' | 'planning' | 'prioritization' | 'reflection';
}

// Store states - flattened and focused
export interface RoutinesState {
  // Templates
  templates: Record<string, RoutineTemplate>;
  recurringTaskTemplates: Record<string, RecurringTaskTemplate>;
  planningRituals: Record<string, PlanningRitual>;
  
  // Active instances
  instances: Record<string, RoutineInstance>;
  focusSessions: Record<string, FocusSession>;
  recurringTasks: Record<string, RecurringTaskInstance>;
  
  // Metadata
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface RoutineHistoryState {
  // Historical data by date
  routineHistory: Record<string, RoutineInstance[]>;
  focusHistory: Record<string, FocusSession[]>;
  recurringTaskHistory: Record<string, RecurringTaskInstance[]>;
  
  // Metadata
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface RoutinePreferencesState {
  // User preferences
  defaultTemplates: string[];
  preferredRoutineTypes: RoutineType[];
  focusSessionSettings: {
    defaultDuration: number;
    defaultQuality: 'low' | 'medium' | 'high';
    interruptionTracking: boolean;
  };
  notificationSettings: {
    morningReminders: boolean;
    eveningReminders: boolean;
    weeklyResetReminders: boolean;
  };
  
  // Metadata
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Store interfaces - focused responsibilities
export interface RoutinesStore {
  state: RoutinesState;
  
  // Template CRUD
  addTemplate: (template: RoutineTemplate) => void;
  updateTemplate: (id: string, template: RoutineTemplate) => void;
  removeTemplate: (id: string) => void;
  
  // Instance CRUD
  addInstance: (instance: RoutineInstance) => void;
  updateInstance: (id: string, instance: RoutineInstance) => void;
  removeInstance: (id: string) => void;
  
  // Focus session CRUD
  addFocusSession: (session: FocusSession) => void;
  updateFocusSession: (id: string, session: FocusSession) => void;
  removeFocusSession: (id: string) => void;
  
  // Recurring task CRUD
  addRecurringTaskTemplate: (template: RecurringTaskTemplate) => void;
  updateRecurringTaskTemplate: (id: string, template: RecurringTaskTemplate) => void;
  removeRecurringTaskTemplate: (id: string) => void;
  
  addRecurringTaskInstance: (task: RecurringTaskInstance) => void;
  updateRecurringTaskInstance: (id: string, task: RecurringTaskInstance) => void;
  removeRecurringTaskInstance: (id: string) => void;
  
  // Planning ritual CRUD
  addPlanningRitual: (ritual: PlanningRitual) => void;
  updatePlanningRitual: (id: string, ritual: PlanningRitual) => void;
  removePlanningRitual: (id: string) => void;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface RoutineHistoryStore {
  state: RoutineHistoryState;
  
  // History management
  addToRoutineHistory: (date: string, instance: RoutineInstance) => void;
  addToFocusHistory: (date: string, session: FocusSession) => void;
  addToRecurringTaskHistory: (date: string, task: RecurringTaskInstance) => void;
  
  // Bulk operations
  setRoutineHistory: (history: Record<string, RoutineInstance[]>) => void;
  setFocusHistory: (history: Record<string, FocusSession[]>) => void;
  setRecurringTaskHistory: (history: Record<string, RecurringTaskInstance[]>) => void;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface RoutinePreferencesStore {
  state: RoutinePreferencesState;
  
  // Preference management
  setDefaultTemplates: (templateIds: string[]) => void;
  setPreferredRoutineTypes: (types: RoutineType[]) => void;
  setFocusSessionSettings: (settings: RoutinePreferencesState['focusSessionSettings']) => void;
  setNotificationSettings: (settings: RoutinePreferencesState['notificationSettings']) => void;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Computed types - for domain engines
export interface RoutineProgress {
  totalRoutines: number;
  completedRoutines: number;
  inProgressRoutines: number;
  percentage: number;
  momentumContribution: number;
  currentFocusSession?: FocusSession;
}

export interface RoutineStats {
  overallCompletionRate: number;
  typeCompletionRates: Record<RoutineType, number>;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  currentStreaks: Record<RoutineType, number>;
  longestStreaks: Record<RoutineType, number>;
  averageMomentumContribution: number;
}

export interface RoutineInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement' | 'trend';
  title: string;
  content: string;
  relevance: number;
  routineType?: RoutineType;
  timestamp: string;
  isPositive: boolean;
  action?: {
    type: 'start_routine' | 'adjust_template' | 'focus_area';
    target: string;
  };
}

export interface RoutineWeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalRoutines: number;
  completedRoutines: number;
  completionRate: number;
  averageMomentumContribution: number;
  highlights: string[];
  improvements: string[];
  nextWeekFocus: string[];
}

// Constants
export const ROUTINE_TYPE_LABELS: Record<RoutineType, string> = {
  morning: 'Morning Routine',
  evening: 'Evening Review',
  weekly: 'Weekly Reset',
  focus: 'Focus Session',
  planning: 'Planning Ritual'
} as const;

export const ROUTINE_TYPE_DESCRIPTIONS: Record<RoutineType, string> = {
  morning: 'Start your day with intention and clarity',
  evening: 'Reflect and prepare for tomorrow',
  weekly: 'Reset and plan for the week ahead',
  focus: 'Dedicated deep work sessions',
  planning: 'Strategic planning and prioritization'
} as const;

export const DEFAULT_ROUTINE_TEMPLATES: Omit<RoutineTemplate, 'id' | 'createdAt'>[] = [
  {
    name: 'Morning Momentum',
    description: 'Quick start to build daily momentum',
    type: 'morning',
    frequency: 'daily',
    estimatedDuration: 15,
    isDefault: true,
    isCustom: false,
    isActive: true,
    steps: [
      {
        id: '1',
        title: 'Review Today\'s Focus',
        description: 'Check your top priorities for today',
        order: 1,
        isOptional: false,
        estimatedDuration: 5,
        category: 'planning',
        defaultCompleted: false
      },
      {
        id: '2',
        title: 'Set 3 Main Goals',
        description: 'Identify the 3 most important tasks',
        order: 2,
        isOptional: false,
        estimatedDuration: 5,
        category: 'planning',
        defaultCompleted: false
      },
      {
        id: '3',
        title: 'Quick Energy Check',
        description: 'Note your current energy level',
        order: 3,
        isOptional: true,
        estimatedDuration: 2,
        category: 'reflection',
        defaultCompleted: false
      },
      {
        id: '4',
        title: 'Schedule First Focus Block',
        description: 'Block time for your most important task',
        order: 4,
        isOptional: false,
        estimatedDuration: 3,
        category: 'focus',
        defaultCompleted: false
      }
    ]
  },
  {
    name: 'Evening Wind Down',
    description: 'Reflect and prepare for tomorrow',
    type: 'evening',
    frequency: 'daily',
    estimatedDuration: 10,
    isDefault: true,
    isCustom: false,
    isActive: true,
    steps: [
      {
        id: '1',
        title: 'Review Today\'s Progress',
        description: 'Check what you accomplished',
        order: 1,
        isOptional: false,
        estimatedDuration: 3,
        category: 'review',
        defaultCompleted: false
      },
      {
        id: '2',
        title: 'Note Key Learnings',
        description: 'What went well or could improve',
        order: 2,
        isOptional: true,
        estimatedDuration: 3,
        category: 'reflection',
        defaultCompleted: false
      },
      {
        id: '3',
        title: 'Prepare Tomorrow',
        description: 'Set your top priorities for tomorrow',
        order: 3,
        isOptional: false,
        estimatedDuration: 4,
        category: 'planning',
        defaultCompleted: false
      }
    ]
  },
  {
    name: 'Weekly Reset',
    description: 'Review progress and plan the week ahead',
    type: 'weekly',
    frequency: 'weekly',
    estimatedDuration: 30,
    isDefault: true,
    isCustom: false,
    isActive: true,
    steps: [
      {
        id: '1',
        title: 'Review Last Week',
        description: 'Assess accomplishments and challenges',
        order: 1,
        isOptional: false,
        estimatedDuration: 8,
        category: 'review',
        defaultCompleted: false
      },
      {
        id: '2',
        title: 'Set Weekly Goals',
        description: 'Define 3-5 key objectives',
        order: 2,
        isOptional: false,
        estimatedDuration: 10,
        category: 'planning',
        defaultCompleted: false
      },
      {
        id: '3',
        title: 'Schedule Focus Blocks',
        description: 'Block time for important work',
        order: 3,
        isOptional: false,
        estimatedDuration: 7,
        category: 'focus',
        defaultCompleted: false
      },
      {
        id: '4',
        title: 'Review Commitments',
        description: 'Check and adjust existing commitments',
        order: 4,
        isOptional: true,
        estimatedDuration: 5,
        category: 'review',
        defaultCompleted: false
      }
    ]
  }
] as const;
