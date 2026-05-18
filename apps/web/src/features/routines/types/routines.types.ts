/**
 * Routines and Recurring Flow System Types for Lumo
 * Lightweight, premium routine tracking without gamification
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

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  type: RoutineType;
  frequency: RoutineFrequency;
  steps: RoutineStep[];
  estimatedDuration: number; // minutes
  isDefault: boolean;
  isCustom: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  isOptional: boolean;
  estimatedDuration: number; // minutes
  category: 'planning' | 'reflection' | 'preparation' | 'review' | 'focus';
  defaultCompleted: boolean;
}

export interface RoutineInstance {
  id: string;
  templateId: string;
  date: string; // YYYY-MM-DD
  type: RoutineType;
  status: RoutineStatus;
  steps: RoutineInstanceStep[];
  startedAt?: string;
  completedAt?: string;
  momentum: number; // 0-10 contribution to daily score
  insights: string[];
}

export interface RoutineInstanceStep {
  id: string;
  stepId: string;
  status: RoutineStatus;
  completedAt?: string;
  notes?: string;
  momentum: number; // 0-10 contribution
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
  duration: number; // minutes
  focusArea: string;
  momentum: number; // 0-10 contribution
  interruptions: number;
  quality: 'low' | 'medium' | 'high';
}

export interface RecurringTaskTemplate {
  id: string;
  title: string;
  description?: string;
  frequency: RoutineFrequency;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // minutes
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
  dueDate: string; // YYYY-MM-DD
  estimatedDuration: number;
  status: RoutineStatus;
  momentum: number; // 0-10 contribution
  generatedAt: string;
}

export interface PlanningRitual {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  frequency: RoutineFrequency;
  steps: PlanningStep[];
  isActive: boolean;
  lastCompleted?: string;
  momentum: number; // 0-10 contribution
}

export interface PlanningStep {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  category: 'review' | 'planning' | 'prioritization' | 'reflection';
}

export interface RoutineState {
  // Templates
  routineTemplates: Record<string, RoutineTemplate>;
  recurringTaskTemplates: Record<string, RecurringTaskTemplate>;
  planningRituals: Record<string, PlanningRitual>;
  
  // Active instances
  todayRoutines: Record<string, RoutineInstance>;
  upcomingRoutines: Record<string, RoutineInstance>;
  focusSessions: Record<string, FocusSession>;
  recurringTasks: Record<string, RecurringTaskInstance>;
  
  // History and analytics
  routineHistory: Record<string, RoutineInstance[]>; // date -> instances
  focusHistory: Record<string, FocusSession[]>; // date -> sessions
  completionStats: RoutineCompletionStats;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface RoutineCompletionStats {
  overallCompletionRate: number; // 0-100
  typeCompletionRates: Record<RoutineType, number>;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  currentStreaks: Record<RoutineType, number>;
  longestStreaks: Record<RoutineType, number>;
  averageMomentumContribution: number;
}

export interface RoutineStore {
  // State
  state: RoutineState;
  
  // Template actions
  createRoutineTemplate: (template: Omit<RoutineTemplate, 'id' | 'createdAt'>) => void;
  updateRoutineTemplate: (id: string, updates: Partial<RoutineTemplate>) => void;
  deleteRoutineTemplate: (id: string) => void;
  activateRoutineTemplate: (id: string) => void;
  deactivateRoutineTemplate: (id: string) => void;
  
  // Instance actions
  startRoutine: (templateId: string, date: string) => void;
  completeRoutineStep: (instanceId: string, stepId: string, notes?: string) => void;
  skipRoutineStep: (instanceId: string, stepId: string) => void;
  completeRoutine: (instanceId: string) => void;
  skipRoutine: (instanceId: string) => void;
  
  // Focus session actions
  startFocusSession: (session: Omit<FocusSession, 'id' | 'status'>) => void;
  endFocusSession: (sessionId: string, quality: 'low' | 'medium' | 'high') => void;
  cancelFocusSession: (sessionId: string) => void;
  
  // Recurring task actions
  createRecurringTaskTemplate: (template: Omit<RecurringTaskTemplate, 'id' | 'createdAt' | 'lastGenerated'>) => void;
  generateRecurringTasks: (date: string) => void;
  completeRecurringTask: (taskId: string) => void;
  
  // Planning ritual actions
  createPlanningRitual: (ritual: Omit<PlanningRitual, 'id'>) => void;
  completePlanningRitual: (ritualId: string, date: string) => void;
  
  // Analytics and insights
  getTodayRoutines: () => RoutineInstance[];
  getUpcomingRoutines: () => RoutineInstance[];
  getRoutineStats: () => RoutineCompletionStats;
  getRoutineInsights: () => RoutineInsight[];
  generateWeeklySummary: () => RoutineWeeklySummary;
  
  // Computed getters
  getActiveRoutineTemplates: () => RoutineTemplate[];
  getTodayProgress: () => RoutineProgress;
  getMomentumContribution: () => number;
}

export interface RoutineInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement' | 'trend';
  title: string;
  content: string;
  relevance: number; // 0-1
  routineType?: RoutineType;
  timestamp: string;
  isPositive: boolean;
  action?: {
    type: 'start_routine' | 'adjust_template' | 'focus_area';
    target: string;
  };
}

export interface RoutineProgress {
  totalRoutines: number;
  completedRoutines: number;
  inProgressRoutines: number;
  percentage: number;
  momentumContribution: number;
  nextRoutine?: RoutineInstance;
  currentFocusSession?: FocusSession;
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

export const DEFAULT_ROUTINE_TEMPLATES: Partial<RoutineTemplate>[] = [
  {
    name: 'Morning Momentum',
    description: 'Quick start to build daily momentum',
    type: 'morning',
    frequency: 'daily',
    estimatedDuration: 15,
    isDefault: true,
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
