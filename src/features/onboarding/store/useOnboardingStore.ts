/**
 * Onboarding state management store
 * Handles the multi-step onboarding flow and data persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  OnboardingState, 
  OnboardingData, 
  OnboardingStore
} from '../types/onboarding.types';

const initialOnboardingData: Partial<OnboardingData> = {
  userName: '',
  primaryFocusAreas: [],
  productivityGoals: [],
  preferredModules: ['tasks'], // Default to tasks
  dailyCadence: 'throughout_day',
  planningStyle: 'minimal',
  completedAt: null,
  version: '1.0.0'
};

const initialState: OnboardingState = {
  currentStep: 0,
  isCompleted: false,
  data: initialOnboardingData,
  isLoading: false,
  error: null,
  canProceed: false,
  canGoBack: false
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      state: initialState,

      // Actions
      setCurrentStep: (step: number) => 
        set((state) => ({
          state: {
            ...state.state,
            currentStep: step,
            canGoBack: step > 0,
            error: null
          }
        })),

      updateData: (newData: Partial<OnboardingData>) => 
        set((state) => {
          const updatedData = { ...state.state.data, ...newData };
          return {
            state: {
              ...state.state,
              data: updatedData,
              canProceed: get().canProceedFromStep(state.state.currentStep),
              error: null
            }
          };
        }),

      nextStep: () => {
        const { currentStep, isCompleted } = get().state;
        if (!isCompleted && currentStep < 5) { // 6 steps total (0-5)
          get().setCurrentStep(currentStep + 1);
        }
      },

      previousStep: () => {
        const { currentStep } = get().state;
        if (currentStep > 0) {
          get().setCurrentStep(currentStep - 1);
        }
      },

      completeOnboarding: () => 
        set((state) => ({
          state: {
            ...state.state,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            data: {
              ...state.state.data,
              completedAt: new Date().toISOString()
            }
          }
        })),

      resetOnboarding: () => 
        set(() => ({
          state: initialState
        })),

      // Computed
      isStepComplete: (stepId: string): boolean => {
        const { data } = get().state;
        
        switch (stepId) {
          case 'welcome':
            return !!data.userName?.trim();
          case 'focus':
            return (data.primaryFocusAreas?.length ?? 0) > 0;
          case 'goals':
            return (data.productivityGoals?.length ?? 0) > 0;
          case 'modules':
            return (data.preferredModules?.length ?? 0) > 0;
          case 'rhythm':
            return !!data.dailyCadence && !!data.planningStyle;
          case 'completion':
            return true; // Always complete when reached
          default:
            return false;
        }
      },

      getProgress: (): number => {
        const { currentStep } = get().state;
        return ((currentStep + 1) / 6) * 100; // 6 total steps
      },

      canProceedFromStep: (step: number): boolean => {
        const stepIds = ['welcome', 'focus', 'goals', 'modules', 'rhythm', 'completion'];
        return get().isStepComplete(stepIds[step] || '');
      }
    }),
    {
      name: 'lumo-onboarding-storage',
      partialize: (state) => ({
        state: {
          ...state.state,
          isLoading: false, // Don't persist loading state
          error: null // Don't persist errors
        }
      })
    }
  )
);

// Selectors for optimized re-renders
export const useOnboardingState = () => useOnboardingStore((state) => state.state);
export const useOnboardingData = () => useOnboardingStore((state) => state.state.data);
export const useOnboardingProgress = () => useOnboardingStore((state) => ({
  currentStep: state.state.currentStep,
  progress: state.getProgress(),
  canProceed: state.state.canProceed,
  canGoBack: state.state.canGoBack,
  isCompleted: state.state.isCompleted
}));

// Helper hooks for specific data
export const useUserName = () => useOnboardingStore((state) => state.state.data.userName);
export const useFocusAreas = () => useOnboardingStore((state) => state.state.data.primaryFocusAreas);
export const useProductivityGoals = () => useOnboardingStore((state) => state.state.data.productivityGoals);
export const usePreferredModules = () => useOnboardingStore((state) => state.state.data.preferredModules);
export const useDailyCadence = () => useOnboardingStore((state) => state.state.data.dailyCadence);
export const usePlanningStyle = () => useOnboardingStore((state) => state.state.data.planningStyle);

// Action hooks
export const useOnboardingActions = () => useOnboardingStore((state) => ({
  setCurrentStep: state.setCurrentStep,
  updateData: state.updateData,
  nextStep: state.nextStep,
  previousStep: state.previousStep,
  completeOnboarding: state.completeOnboarding,
  resetOnboarding: state.resetOnboarding
}));
