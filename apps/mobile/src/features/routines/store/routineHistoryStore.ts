/**
 * Routine History Store - Focused state slice for historical data
 * Separates historical data from active data for better performance
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RoutineHistoryState,
  RoutineHistoryStore,
  RoutineInstance,
  FocusSession,
  RecurringTaskInstance
} from '../types/routineTypes';

const initialState: RoutineHistoryState = {
  routineHistory: {},
  focusHistory: {},
  recurringTaskHistory: {},
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const useRoutineHistoryStore = create<RoutineHistoryStore>()(
  persist(
    (set) => ({
      state: initialState,

      // History management operations
      addToRoutineHistory: (date: string, instance: RoutineInstance) => {
        set((state) => {
          const history = { ...state.state.routineHistory };
          if (!history[date]) {
            history[date] = [];
          }
          history[date].push(instance);
          
          return {
            state: {
              ...state.state,
              routineHistory: history,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      addToFocusHistory: (date: string, session: FocusSession) => {
        set((state) => {
          const history = { ...state.state.focusHistory };
          if (!history[date]) {
            history[date] = [];
          }
          history[date].push(session);
          
          return {
            state: {
              ...state.state,
              focusHistory: history,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      addToRecurringTaskHistory: (date: string, task: RecurringTaskInstance) => {
        set((state) => {
          const history = { ...state.state.recurringTaskHistory };
          if (!history[date]) {
            history[date] = [];
          }
          history[date].push(task);
          
          return {
            state: {
              ...state.state,
              recurringTaskHistory: history,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Bulk operations for performance
      setRoutineHistory: (history: Record<string, RoutineInstance[]>) => {
        set((state) => ({
          state: {
            ...state.state,
            routineHistory: history,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setFocusHistory: (history: Record<string, FocusSession[]>) => {
        set((state) => ({
          state: {
            ...state.state,
            focusHistory: history,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setRecurringTaskHistory: (history: Record<string, RecurringTaskInstance[]>) => {
        set((state) => ({
          state: {
            ...state.state,
            recurringTaskHistory: history,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      // Utility operations
      setLoading: (loading: boolean) => {
        set((state) => ({
          state: {
            ...state.state,
            isLoading: loading
          }
        }));
      },

      setError: (error: string | null) => {
        set((state) => ({
          state: {
            ...state.state,
            error
          }
        }));
      }
    }),
    {
      name: 'routine-history-store',
      partialize: (state) => ({
        state: state.state
      })
    }
  )
);
