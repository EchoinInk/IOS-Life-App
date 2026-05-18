/**
 * Routine Preferences Store - Focused state slice for user preferences
 * Separates preferences from data for better organization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RoutinePreferencesState,
  RoutinePreferencesStore,
  RoutineType
} from '../types/routineTypes';

const initialState: RoutinePreferencesState = {
  defaultTemplates: [],
  preferredRoutineTypes: [],
  focusSessionSettings: {
    defaultDuration: 25,
    defaultQuality: 'medium',
    interruptionTracking: true
  },
  notificationSettings: {
    morningReminders: true,
    eveningReminders: true,
    weeklyResetReminders: true
  },
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const useRoutinePreferencesStore = create<RoutinePreferencesStore>()(
  persist(
    (set) => ({
      state: initialState,

      // Preference management operations
      setDefaultTemplates: (templateIds: string[]) => {
        set((state) => ({
          state: {
            ...state.state,
            defaultTemplates: templateIds,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setPreferredRoutineTypes: (types: RoutineType[]) => {
        set((state) => ({
          state: {
            ...state.state,
            preferredRoutineTypes: types,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setFocusSessionSettings: (settings: RoutinePreferencesState['focusSessionSettings']) => {
        set((state) => ({
          state: {
            ...state.state,
            focusSessionSettings: {
              ...state.state.focusSessionSettings,
              ...settings
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setNotificationSettings: (settings: RoutinePreferencesState['notificationSettings']) => {
        set((state) => ({
          state: {
            ...state.state,
            notificationSettings: {
              ...state.state.notificationSettings,
              ...settings
            },
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
      name: 'routine-preferences-store',
      partialize: (state) => ({
        state: state.state
      })
    }
  )
);
