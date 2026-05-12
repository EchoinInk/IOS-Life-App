/**
 * Onboarding feature index
 * Exports all onboarding components, hooks, and utilities
 */

// Main screen
export { default as OnboardingScreen } from './OnboardingScreen';

// Store and state management
export { useOnboardingStore } from './store/useOnboardingStore';
export { 
  useOnboardingState,
  useOnboardingData,
  useOnboardingProgress,
  useUserName,
  useFocusAreas,
  useProductivityGoals,
  usePreferredModules,
  useDailyCadence,
  usePlanningStyle,
  useOnboardingActions
} from './store/useOnboardingStore';

// Hooks
export { useOnboardingCheck } from './hooks/useOnboardingCheck';

// Components
export { OnboardingFlow } from './components/OnboardingFlow';
export { WelcomeStep } from './components/steps/WelcomeStep';
export { FocusStep } from './components/steps/FocusStep';
export { GoalsStep } from './components/steps/GoalsStep';
export { ModulesStep } from './components/steps/ModulesStep';
export { RhythmStep } from './components/steps/RhythmStep';
export { CompletionStep } from './components/steps/CompletionStep';

// Types
export type {
  OnboardingData,
  OnboardingState,
  OnboardingStep,
  OnboardingStepProps,
  OnboardingStore,
  PersonalizedDefaults,
  FocusArea,
  ProductivityGoal,
  PreferredModule,
  DailyCadence,
  PlanningStyle
} from './types/onboarding.types';

// Constants
export {
  ONBOARDING_STEPS,
  FOCUS_AREA_LABELS,
  GOAL_LABELS,
  MODULE_LABELS,
  CADENCE_LABELS,
  PLANNING_STYLE_LABELS
} from './types/onboarding.types';

// Utilities
export {
  PersonalizationEngine,
  generatePersonalizedDefaults,
  getPersonalizedDashboardLayout,
  getPersonalizedWelcomeMessage
} from './utils/personalization.utils';
