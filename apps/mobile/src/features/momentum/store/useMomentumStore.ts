import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createNamespacedStorage, STORE_VERSION } from "@/store/sharedPersist";
import type { MomentumState, DailyMomentumScore, Streak, DailyActivity } from "../types/momentum.types";
import { MomentumEngine } from "../momentumEngine";
import { calculateAllStreaks } from "../streakCalculator";
import { ConsistencyCalculator } from "../consistencyMetrics";
import { TrendInsightsGenerator } from "../trendInsights";
import { getToday } from "@/shared/lib/date";

interface MomentumStore extends MomentumState {
  // Actions
  addActivity: (activity: Omit<DailyActivity, 'id'>) => void;
  updateDailyScore: (date: string, score: Partial<DailyMomentumScore>) => void;
  calculateTodayScore: () => void;
  generateInsights: () => void;
  refreshTrends: () => void;
}

/**
 * Momentum Store - New implementation with updated types
 * 
 * Stores and manages momentum metrics:
 * - Daily scores and activities
 * - Streaks tracking
 * - Consistency metrics
 * - Trend insights
 */
export const useMomentumStore = create<MomentumStore>()(
  persist(
    (set, get) => ({
      // Initial state
      todayScore: null,
      currentStreaks: {} as Record<string, Streak>,
      weeklyTrend: {
        period: 'weekly',
        scores: [],
        trendDirection: 'stable',
        trendStrength: 0,
        averageScore: 0,
        peakScore: 0,
        momentumLevel: 'building'
      },
      consistency: {
        overallConsistency: 0,
        categoryConsistency: {
          tasks: 0,
          routines: 0,
          meals: 0,
          budget: 0,
          planning: 0
        },
        weeklyPattern: {
          0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
        },
        timeOfDayPattern: Array.from({ length: 24 }, (_, i) => i).reduce((acc, i) => {
          acc[i] = 0;
          return acc;
        }, {} as Record<number, number>),
        focusAreaConsistency: {},
        momentumLevel: 'building'
      },
      insights: [],
      dailyScores: {} as Record<string, DailyMomentumScore>,
      streakHistory: {} as Record<string, Streak[]>,
      isLoading: false,
      error: null,
      lastUpdated: null,

      // Actions
      addActivity: (activity) => {
        set((state) => {
          const today = getToday();
          const todayScore = state.dailyScores[today];
          
          if (todayScore) {
            const updatedActivity = {
              ...activity,
              id: `${Date.now()}-${Math.random()}`
            };
            
            const updatedScore = {
              ...todayScore,
              activities: [...todayScore.activities, updatedActivity]
            };
            
            const recalculatedScore = MomentumEngine.calculateDailyScore({
              date: today,
              activities: updatedScore.activities,
              previousScores: Object.values(state.dailyScores).filter(s => s.date !== today),
              userPreferences: {
                focusAreas: [],
                preferredCategories: ['tasks'],
                planningStyle: 'minimal'
              }
            });
            
            return {
              dailyScores: {
                ...state.dailyScores,
                [today]: recalculatedScore
              },
              todayScore: recalculatedScore
            };
          }
          
          return state;
        });
      },

      updateDailyScore: (date, scoreUpdate) => {
        set((state) => {
          const existingScore = state.dailyScores[date];
          if (existingScore) {
            return {
              dailyScores: {
                ...state.dailyScores,
                [date]: {
                  ...existingScore,
                  ...scoreUpdate
                }
              }
            };
          }
          return state;
        });
      },

      calculateTodayScore: () => {
        set({ isLoading: true });
        
        try {
          const today = getToday();
          const state = get();
          const existingScore = state.dailyScores[today];
          const allScores = Object.values(state.dailyScores);
          
          // If we have existing activities, recalculate
          if (existingScore) {
            const recalculatedScore = MomentumEngine.calculateDailyScore({
              date: today,
              activities: existingScore.activities,
              previousScores: allScores.filter(s => s.date !== today),
              userPreferences: {
                focusAreas: [],
                preferredCategories: ['tasks'],
                planningStyle: 'minimal'
              }
            });
            
            set({
              dailyScores: {
                ...state.dailyScores,
                [today]: recalculatedScore
              },
              todayScore: recalculatedScore,
              isLoading: false,
              lastUpdated: new Date().toISOString()
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to calculate score',
            isLoading: false
          });
        }
      },

      generateInsights: () => {
        const state = get();
        const allScores = Object.values(state.dailyScores);
        
        const insights = TrendInsightsGenerator.generateInsights(allScores);
        
        set({
          insights,
          lastUpdated: new Date().toISOString()
        });
      },

      refreshTrends: () => {
        const state = get();
        const allScores = Object.values(state.dailyScores);
        
        // Update weekly trend
        const weeklyTrend = MomentumEngine.calculateWeeklyTrend(allScores);
        
        // Update consistency metrics
        const consistency = ConsistencyCalculator.calculateConsistency(allScores);
        
        // Update streaks
        const currentStreaks = calculateAllStreaks(allScores);
        
        set({
          weeklyTrend,
          consistency,
          currentStreaks,
          lastUpdated: new Date().toISOString()
        });
      }
    }),
    {
      name: "momentum",
      version: STORE_VERSION,
      storage: createNamespacedStorage<MomentumState>([
        "todayScore",
        "currentStreaks", 
        "weeklyTrend",
        "consistency",
        "insights",
        "dailyScores",
        "streakHistory",
        "lastUpdated"
      ]),
      partialize: (state) => ({
        todayScore: state.todayScore,
        currentStreaks: state.currentStreaks,
        weeklyTrend: state.weeklyTrend,
        consistency: state.consistency,
        insights: state.insights,
        dailyScores: state.dailyScores,
        streakHistory: state.streakHistory,
        isLoading: state.isLoading,
        error: state.error,
        lastUpdated: state.lastUpdated
      }),
    },
  ),
);
