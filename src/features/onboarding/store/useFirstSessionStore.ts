/**
 * First Session Momentum Store
 * 
 * Tracks and manages the first-session experience to ensure new users
 * feel immediate momentum and emotional payoff
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FirstSessionState,
  FirstSessionStep,
  MomentumMilestone,
} from '../types/seededExperience.types';

interface FirstSessionStore {
  state: FirstSessionState;
  milestones: MomentumMilestone[];
  
  // Actions
  startFirstSession: () => void;
  completeStep: (stepId: string) => void;
  updateMomentumScore: (score: number) => void;
  completeMilestone: (milestoneId: string) => void;
  completeFirstSession: () => void;
  resetFirstSession: () => void;
  
  // Computed
  getCurrentStep: () => FirstSessionStep | null;
  getProgress: () => number;
  isStepCompleted: (stepId: string) => boolean;
  getActiveMilestones: () => MomentumMilestone[];
  getNextMilestone: () => MomentumMilestone | null;
}

const initialState: FirstSessionState = {
  isActive: false,
  startedAt: null,
  currentStep: 0,
  steps: [
    {
      id: 'explore-dashboard',
      title: 'Explore your dashboard',
      description: 'Take a moment to familiarize yourself with the interface',
      isCompleted: false,
      action: 'view_dashboard',
      required: false,
    },
    {
      id: 'complete-first-task',
      title: 'Complete your first task',
      description: 'Mark your first task as complete to feel the momentum',
      isCompleted: false,
      action: 'complete_task',
      required: true,
    },
    {
      id: 'start-routine',
      title: 'Start a routine',
      description: 'Begin your first routine to build consistency',
      isCompleted: false,
      action: 'start_routine',
      required: false,
    },
    {
      id: 'view-insights',
      title: 'View your insights',
      description: 'Check your personalized insights and recommendations',
      isCompleted: false,
      action: 'view_insights',
      required: false,
    },
  ],
  completedAt: null,
  momentumScore: 0,
};

const initialMilestones: MomentumMilestone[] = [
  {
    id: 'first-task-added',
    type: 'first_task',
    title: 'First Task Added',
    description: 'Add your first task to begin building momentum',
    isCompleted: false,
    reward: {
      type: 'message',
      content: '🎯 Task added! You\'ve started building momentum.',
      subtle: true,
    },
  },
  {
    id: 'first-completion',
    type: 'first_completion',
    title: 'First Completion',
    description: 'Complete your first task to feel the momentum',
    isCompleted: false,
    reward: {
      type: 'visual',
      content: '✨ First momentum win! Keep the momentum going.',
      subtle: false,
    },
  },
  {
    id: 'first-routine',
    type: 'first_routine',
    title: 'First Routine',
    description: 'Start your first routine to build consistency',
    isCompleted: false,
    reward: {
      type: 'message',
      content: '⏰ Routine started! Consistency creates momentum.',
      subtle: true,
    },
  },
  {
    id: 'first-focus',
    type: 'first_focus',
    title: 'First Focus Session',
    description: 'Complete your first focus session',
    isCompleted: false,
    reward: {
      type: 'message',
      content: '🎯 Focus session complete! Deep work builds momentum.',
      subtle: true,
    },
  },
  {
    id: 'first-planning',
    type: 'first_planning',
    title: 'First Planning',
    description: 'Complete your first planning ritual',
    isCompleted: false,
    reward: {
      type: 'unlock',
      content: '📋 Planning complete! You\'ve unlocked insights.',
      subtle: true,
    },
  },
];

export const useFirstSessionStore = create<FirstSessionStore>()(
  persist(
    (set, get) => ({
      state: initialState,
      milestones: initialMilestones,

      startFirstSession: () =>
        set((state) => ({
          state: {
            ...state.state,
            isActive: true,
            startedAt: new Date().toISOString(),
          },
        })),

      completeStep: (stepId: string) =>
        set((state) => {
          const updatedSteps = state.state.steps.map((step) =>
            step.id === stepId
              ? { ...step, isCompleted: true, completedAt: new Date().toISOString() }
              : step
          );

          // Move to next step
          const currentStepIndex = updatedSteps.findIndex((s) => s.id === stepId);
          const nextStepIndex = currentStepIndex + 1;
          const newCurrentStep =
            nextStepIndex < updatedSteps.length ? nextStepIndex : currentStepIndex;

          // Check if all required steps are completed
          const requiredSteps = updatedSteps.filter((s) => s.required);
          const allRequiredCompleted = requiredSteps.every((s) => s.isCompleted);

          return {
            state: {
              ...state.state,
              steps: updatedSteps,
              currentStep: newCurrentStep,
              completedAt: allRequiredCompleted ? new Date().toISOString() : null,
            },
          };
        }),

      updateMomentumScore: (score: number) =>
        set((state) => ({
          state: {
            ...state.state,
            momentumScore: Math.max(state.state.momentumScore, score),
          },
        })),

      completeMilestone: (milestoneId: string) =>
        set((state) => {
          const updatedMilestones = state.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? { ...milestone, isCompleted: true, completedAt: new Date().toISOString() }
              : milestone
          );

          // Update momentum score based on milestones completed
          const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
          const newScore = Math.min(100, completedCount * 20);

          return {
            milestones: updatedMilestones,
            state: {
              ...state.state,
              momentumScore: Math.max(state.state.momentumScore, newScore),
            },
          };
        }),

      completeFirstSession: () =>
        set((state) => ({
          state: {
            ...state.state,
            isActive: false,
            completedAt: state.state.completedAt || new Date().toISOString(),
          },
        })),

      resetFirstSession: () =>
        set(() => ({
          state: initialState,
          milestones: initialMilestones,
        })),

      getCurrentStep: () => {
        const { state } = get();
        return state.steps[state.currentStep] || null;
      },

      getProgress: () => {
        const { state } = get();
        const completedSteps = state.steps.filter((s) => s.isCompleted).length;
        return (completedSteps / state.steps.length) * 100;
      },

      isStepCompleted: (stepId: string) => {
        const { state } = get();
        return state.steps.some((s) => s.id === stepId && s.isCompleted);
      },

      getActiveMilestones: () => {
        const { milestones } = get();
        return milestones.filter((m) => !m.isCompleted);
      },

      getNextMilestone: () => {
        const { milestones } = get();
        return milestones.find((m) => !m.isCompleted) || null;
      },
    }),
    {
      name: 'lumo-first-session-storage',
      partialize: (state) => ({
        state: state.state,
        milestones: state.milestones,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useFirstSessionState = () =>
  useFirstSessionStore((state) => state.state);
export const useFirstSessionMilestones = () =>
  useFirstSessionStore((state) => state.milestones);
export const useFirstSessionProgress = () =>
  useFirstSessionStore((state) => ({
    progress: state.getProgress(),
    currentStep: state.getCurrentStep(),
    nextMilestone: state.getNextMilestone(),
  }));

// Action hooks
export const useFirstSessionActions = () =>
  useFirstSessionStore((state) => ({
    startFirstSession: state.startFirstSession,
    completeStep: state.completeStep,
    updateMomentumScore: state.updateMomentumScore,
    completeMilestone: state.completeMilestone,
    completeFirstSession: state.completeFirstSession,
    resetFirstSession: state.resetFirstSession,
  }));
