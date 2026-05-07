/**
 * Seeded Experience Types
 * 
 * Premium first-run experience system that generates contextual starter content
 * ensuring new users experience immediate momentum and emotional payoff
 */

import type { OnboardingData, FocusArea } from './onboarding.types';

/**
 * Seeded content package - all content generated for first-run experience
 */
export interface SeededContentPackage {
  version: string;
  generatedAt: string;
  onboardingData: Partial<OnboardingData>;
  
  // Seeded entities
  tasks: SeededTask[];
  routines: SeededRoutine[];
  focusSessions: SeededFocusSession[];
  insights: SeededInsight[];
  
  // First session momentum
  firstWinTask: SeededTask | null;
  momentumMilestones: MomentumMilestone[];
  
  // Dashboard evolution
  dashboardState: DashboardEvolutionState;
}

/**
 * Seeded task with metadata
 */
export interface SeededTask {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  time?: string;
  notes?: string;
  estimatedDuration?: number; // minutes
  
  // Seeding metadata
  isSeeded: true;
  seedType: 'first_win' | 'example' | 'suggested' | 'routine';
  sourceFocusArea: FocusArea;
  isDeletable: boolean;
  completionReward?: string;
}

/**
 * Seeded routine template
 */
export interface SeededRoutine {
  id: string;
  name: string;
  description: string;
  type: 'morning' | 'evening' | 'weekly' | 'focus';
  frequency: 'daily' | 'weekly';
  estimatedDuration: number;
  steps: SeededRoutineStep[];
  
  // Seeding metadata
  isSeeded: true;
  sourceFocusArea: FocusArea;
  isDeletable: boolean;
  isCustomizable: boolean;
}

export interface SeededRoutineStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  estimatedDuration: number;
  isOptional: boolean;
  category: 'planning' | 'reflection' | 'preparation' | 'review' | 'focus';
}

/**
 * Seeded focus session
 */
export interface SeededFocusSession {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  focusArea: FocusArea;
  
  // Seeding metadata
  isSeeded: true;
  isReschedulable: boolean;
  suggestedTime: string;
}

/**
 * Seeded insight
 */
export interface SeededInsight {
  id: string;
  type: 'tip' | 'recommendation' | 'motivation' | 'pattern';
  title: string;
  content: string;
  relevantTo: FocusArea[];
  
  // Seeding metadata
  isSeeded: true;
  priority: number; // 0-1 relevance score
  showImmediately: boolean;
}

/**
 * Momentum milestone - tracks first-session achievements
 */
export interface MomentumMilestone {
  id: string;
  type: 'first_task' | 'first_completion' | 'first_routine' | 'first_focus' | 'first_planning';
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  reward?: MomentumReward;
}

export interface MomentumReward {
  type: 'visual' | 'message' | 'unlock';
  content: string;
  subtle: boolean;
}

/**
 * Dashboard evolution state
 */
export interface DashboardEvolutionState {
  currentStage: 'empty' | 'seeded' | 'first_completion' | 'first_routine' | 'active';
  milestones: DashboardMilestone[];
  showCelebration: boolean;
  celebrationType?: 'first_complete' | 'streak_start' | 'routine_complete';
}

export interface DashboardMilestone {
  id: string;
  type: 'first_task_added' | 'first_task_completed' | 'first_routine_started' | 'first_focus_completed';
  title: string;
  achievedAt?: string;
  visualChange: DashboardVisualChange;
}

export interface DashboardVisualChange {
  showProgressCard: boolean;
  showMomentumRing: boolean;
  showInsightsCard: boolean;
  showRoutinesCard: boolean;
  compactMode: boolean;
}

/**
 * First session state
 */
export interface FirstSessionState {
  isActive: boolean;
  startedAt: string | null;
  currentStep: number;
  steps: FirstSessionStep[];
  completedAt: string | null;
  momentumScore: number;
}

export interface FirstSessionStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  action: 'view_dashboard' | 'complete_task' | 'start_routine' | 'view_insights';
  required: boolean;
}

/**
 * Seeding configuration
 */
export interface SeedingConfig {
  taskCount: number;
  routineCount: number;
  focusSessionCount: number;
  insightCount: number;
  includeFirstWinTask: boolean;
  includeStarterRoutines: boolean;
  includeSampleInsights: boolean;
}

/**
 * Generator result
 */
export interface SeedingResult {
  success: boolean;
  contentPackage: SeededContentPackage | null;
  firstSessionState: FirstSessionState | null;
  error?: string;
}
