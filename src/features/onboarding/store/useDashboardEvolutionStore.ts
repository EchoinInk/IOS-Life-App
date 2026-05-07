/**
 * Dashboard Evolution Store
 * 
 * Tracks dashboard milestones and manages UI evolution based on user progress
 * Ensures the dashboard visibly evolves after first actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DashboardEvolutionState,
  DashboardMilestone,
  DashboardVisualChange,
} from '../types/seededExperience.types';

interface DashboardEvolutionStore {
  state: DashboardEvolutionState;
  
  // Actions
  achieveMilestone: (milestoneType: DashboardMilestone['type']) => void;
  triggerCelebration: (type: 'first_complete' | 'streak_start' | 'routine_complete') => void;
  dismissCelebration: () => void;
  resetEvolution: () => void;
  
  // Computed
  getCurrentVisualChange: () => DashboardVisualChange;
  getStage: () => DashboardEvolutionState['currentStage'];
  hasAchievedMilestone: (type: DashboardMilestone['type']) => boolean;
}

const initialState: DashboardEvolutionState = {
  currentStage: 'empty',
  milestones: [
    {
      id: 'first-task-added',
      type: 'first_task_added',
      title: 'First Task Added',
      achievedAt: undefined,
      visualChange: {
        showProgressCard: true,
        showMomentumRing: false,
        showInsightsCard: false,
        showRoutinesCard: false,
        compactMode: true,
      },
    },
    {
      id: 'first-task-completed',
      type: 'first_task_completed',
      title: 'First Task Completed',
      achievedAt: undefined,
      visualChange: {
        showProgressCard: true,
        showMomentumRing: true,
        showInsightsCard: true,
        showRoutinesCard: false,
        compactMode: false,
      },
    },
    {
      id: 'first-routine-started',
      type: 'first_routine_started',
      title: 'First Routine Started',
      achievedAt: undefined,
      visualChange: {
        showProgressCard: true,
        showMomentumRing: true,
        showInsightsCard: true,
        showRoutinesCard: true,
        compactMode: false,
      },
    },
    {
      id: 'first-focus-completed',
      type: 'first_focus_completed',
      title: 'First Focus Session Completed',
      achievedAt: undefined,
      visualChange: {
        showProgressCard: true,
        showMomentumRing: true,
        showInsightsCard: true,
        showRoutinesCard: true,
        compactMode: false,
      },
    },
  ],
  showCelebration: false,
  celebrationType: undefined,
};

export const useDashboardEvolutionStore = create<DashboardEvolutionStore>()(
  persist(
    (set, get) => ({
      state: initialState,

      achieveMilestone: (milestoneType) =>
        set((state) => {
          const milestoneIndex = state.state.milestones.findIndex(
            (m) => m.type === milestoneType
          );

          if (milestoneIndex === -1) {
            return state; // Milestone not found
          }

          const milestone = state.state.milestones[milestoneIndex];
          if (!milestone || milestone.achievedAt) {
            return state; // Milestone not found or already achieved
          }

          const updatedMilestones = [...state.state.milestones];
          updatedMilestones[milestoneIndex] = {
            ...milestone,
            achievedAt: new Date().toISOString(),
          } as DashboardMilestone;

          // Determine new stage based on achieved milestones
          const achievedCount = updatedMilestones.filter((m) => m.achievedAt).length;
          let newStage: DashboardEvolutionState['currentStage'] = 'empty';

          if (achievedCount >= 1) newStage = 'seeded';
          if (achievedCount >= 2) newStage = 'first_completion';
          if (achievedCount >= 3) newStage = 'first_routine';
          if (achievedCount >= 4) newStage = 'active';

          return {
            state: {
              ...state.state,
              milestones: updatedMilestones,
              currentStage: newStage,
            },
          };
        }),

      triggerCelebration: (type) =>
        set((state) => ({
          state: {
            ...state.state,
            showCelebration: true,
            celebrationType: type,
          },
        })),

      dismissCelebration: () =>
        set((state) => ({
          state: {
            ...state.state,
            showCelebration: false,
            celebrationType: undefined,
          },
        })),

      resetEvolution: () =>
        set(() => ({
          state: initialState,
        })),

      getCurrentVisualChange: () => {
        const { state } = get();
        // Get the visual change from the most recently achieved milestone
        const achievedMilestones = state.milestones
          .filter((m) => m.achievedAt !== undefined)
          .sort((a, b) => {
            const timeA = a.achievedAt ? new Date(a.achievedAt).getTime() : 0;
            const timeB = b.achievedAt ? new Date(b.achievedAt).getTime() : 0;
            return timeB - timeA;
          });

        if (achievedMilestones.length > 0) {
          return achievedMilestones[0]!.visualChange;
        }

        // Default to empty state visual change
        return {
          showProgressCard: false,
          showMomentumRing: false,
          showInsightsCard: false,
          showRoutinesCard: false,
          compactMode: true,
        };
      },

      getStage: () => {
        const { state } = get();
        return state.currentStage;
      },

      hasAchievedMilestone: (type) => {
        const { state } = get();
        return state.milestones.some(
          (m) => m.type === type && m.achievedAt !== undefined
        );
      },
    }),
    {
      name: 'lumo-dashboard-evolution-storage',
      partialize: (state) => ({
        state: state.state,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useDashboardEvolutionState = () =>
  useDashboardEvolutionStore((state) => state.state);
export const useDashboardVisualChange = () =>
  useDashboardEvolutionStore((state) => state.getCurrentVisualChange());
export const useDashboardStage = () =>
  useDashboardEvolutionStore((state) => state.getStage());

// Action hooks
export const useDashboardEvolutionActions = () =>
  useDashboardEvolutionStore((state) => ({
    achieveMilestone: state.achieveMilestone,
    triggerCelebration: state.triggerCelebration,
    dismissCelebration: state.dismissCelebration,
    resetEvolution: state.resetEvolution,
  }));
