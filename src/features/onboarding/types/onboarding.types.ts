/**
 * Onboarding system types for Lumo
 * First-run experience and personalization data model
 */

export type FocusArea = 
  | 'work'
  | 'health'
  | 'budgeting'
  | 'routines'
  | 'relationships'
  | 'learning'
  | 'creativity';

export type ProductivityGoal = 
  | 'reduce_stress'
  | 'build_consistency'
  | 'save_money'
  | 'improve_health'
  | 'be_more_productive'
  | 'stay_organized';

export type PreferredModule = 
  | 'tasks'
  | 'budget'
  | 'meals'
  | 'shopping'
  | 'recipes'
  | 'bills';

export type DailyCadence = 
  | 'morning_person'
  | 'evening_person'
  | 'throughout_day'
  | 'weekly_planner';

export type PlanningStyle = 
  | 'minimal'
  | 'detailed'
  | 'visual'
  | 'time_based';

export interface OnboardingData {
  // User basics
  userName: string;
  
  // Focus and goals
  primaryFocusAreas: FocusArea[];
  productivityGoals: ProductivityGoal[];
  
  // Module preferences
  preferredModules: PreferredModule[];
  
  // Daily patterns
  dailyCadence: DailyCadence;
  planningStyle: PlanningStyle;
  
  // Metadata
  completedAt: string | null;
  version: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isComplete: boolean;
  canSkip: boolean;
}

export interface OnboardingStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export interface OnboardingState {
  // Current flow state
  currentStep: number;
  isCompleted: boolean;
  data: Partial<OnboardingData>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Flow control
  canProceed: boolean;
  canGoBack: boolean;
}

export interface PersonalizedDefaults {
  // Smart starter content based on onboarding
  suggestedTasks: Array<{
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  suggestedRoutines: Array<{
    name: string;
    time: string;
    focusArea: FocusArea;
  }>;
  
  quickActions: Array<{
    id: string;
    label: string;
    icon: string;
    module: PreferredModule;
  }>;
  
  insights: Array<{
    type: 'tip' | 'recommendation' | 'motivation';
    title: string;
    content: string;
    relevantTo: FocusArea[];
  }>;
}

export interface OnboardingStore {
  // State
  state: OnboardingState;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Computed
  isStepComplete: (stepId: string) => boolean;
  getProgress: () => number;
  canProceedFromStep: (step: number) => boolean;
}

export const ONBOARDING_STEPS: Omit<OnboardingStep, 'component'>[] = [
  {
    id: 'welcome',
    title: 'Welcome to Lumo',
    description: 'Let\'s set up your personal productivity companion',
    isComplete: false,
    canSkip: false
  },
  {
    id: 'focus',
    title: 'What\'s your focus?',
    description: 'Choose the areas you want to improve',
    isComplete: false,
    canSkip: false
  },
  {
    id: 'goals',
    title: 'What are your goals?',
    description: 'Tell us what you want to achieve',
    isComplete: false,
    canSkip: false
  },
  {
    id: 'modules',
    title: 'Choose your tools',
    description: 'Select the modules you\'ll use most',
    isComplete: false,
    canSkip: true
  },
  {
    id: 'rhythm',
    title: 'Your daily rhythm',
    description: 'How do you like to plan your day?',
    isComplete: false,
    canSkip: true
  },
  {
    id: 'completion',
    title: 'You\'re all set!',
    description: 'Here\'s what we\'ve set up for you',
    isComplete: false,
    canSkip: false
  }
];

export const FOCUS_AREA_LABELS: Record<FocusArea, string> = {
  work: 'Work & Career',
  health: 'Health & Fitness',
  budgeting: 'Budget & Finance',
  routines: 'Daily Routines',
  relationships: 'Relationships',
  learning: 'Learning & Growth',
  creativity: 'Creative Projects'
};

export const GOAL_LABELS: Record<ProductivityGoal, string> = {
  reduce_stress: 'Reduce stress',
  build_consistency: 'Build consistent habits',
  save_money: 'Save money',
  improve_health: 'Improve health',
  be_more_productive: 'Be more productive',
  stay_organized: 'Stay organized'
};

export const MODULE_LABELS: Record<PreferredModule, string> = {
  tasks: 'Tasks & Projects',
  budget: 'Budget & Expenses',
  meals: 'Meal Planning',
  shopping: 'Shopping Lists',
  recipes: 'Recipe Collection',
  bills: 'Bill Tracking'
};

export const CADENCE_LABELS: Record<DailyCadence, string> = {
  morning_person: 'Morning planner',
  evening_person: 'Evening planner',
  throughout_day: 'Throughout the day',
  weekly_planner: 'Weekly planner'
};

export const PLANNING_STYLE_LABELS: Record<PlanningStyle, string> = {
  minimal: 'Keep it simple',
  detailed: 'Detailed planning',
  visual: 'Visual organization',
  time_based: 'Time-based scheduling'
};
