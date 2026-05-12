/**
 * Routines Store - Focused state slice for active routine data
 * Simplified CRUD operations without business logic
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RoutinesState,
  RoutinesStore,
  RoutineTemplate,
  RoutineInstance,
  FocusSession,
  RecurringTaskTemplate,
  RecurringTaskInstance,
  PlanningRitual
} from '../types/routineTypes';

const initialState: RoutinesState = {
  templates: {},
  recurringTaskTemplates: {},
  planningRituals: {},
  instances: {},
  focusSessions: {},
  recurringTasks: {},
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const useRoutinesStore = create<RoutinesStore>()(
  persist(
    (set) => ({
      state: initialState,

      // Template CRUD operations
      addTemplate: (template: RoutineTemplate) => {
        set((state) => ({
          state: {
            ...state.state,
            templates: {
              ...state.state.templates,
              [template.id]: template
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updateTemplate: (id: string, template: RoutineTemplate) => {
        set((state) => ({
          state: {
            ...state.state,
            templates: {
              ...state.state.templates,
              [id]: template
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removeTemplate: (id: string) => {
        set((state) => {
          const newTemplates = { ...state.state.templates };
          delete newTemplates[id];
          
          return {
            state: {
              ...state.state,
              templates: newTemplates,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Instance CRUD operations
      addInstance: (instance: RoutineInstance) => {
        set((state) => ({
          state: {
            ...state.state,
            instances: {
              ...state.state.instances,
              [instance.id]: instance
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updateInstance: (id: string, instance: RoutineInstance) => {
        set((state) => ({
          state: {
            ...state.state,
            instances: {
              ...state.state.instances,
              [id]: instance
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removeInstance: (id: string) => {
        set((state) => {
          const newInstances = { ...state.state.instances };
          delete newInstances[id];
          
          return {
            state: {
              ...state.state,
              instances: newInstances,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Focus session CRUD operations
      addFocusSession: (session: FocusSession) => {
        set((state) => ({
          state: {
            ...state.state,
            focusSessions: {
              ...state.state.focusSessions,
              [session.id]: session
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updateFocusSession: (id: string, session: FocusSession) => {
        set((state) => ({
          state: {
            ...state.state,
            focusSessions: {
              ...state.state.focusSessions,
              [id]: session
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removeFocusSession: (id: string) => {
        set((state) => {
          const newSessions = { ...state.state.focusSessions };
          delete newSessions[id];
          
          return {
            state: {
              ...state.state,
              focusSessions: newSessions,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Recurring task template CRUD operations
      addRecurringTaskTemplate: (template: RecurringTaskTemplate) => {
        set((state) => ({
          state: {
            ...state.state,
            recurringTaskTemplates: {
              ...state.state.recurringTaskTemplates,
              [template.id]: template
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updateRecurringTaskTemplate: (id: string, template: RecurringTaskTemplate) => {
        set((state) => ({
          state: {
            ...state.state,
            recurringTaskTemplates: {
              ...state.state.recurringTaskTemplates,
              [id]: template
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removeRecurringTaskTemplate: (id: string) => {
        set((state) => {
          const newTemplates = { ...state.state.recurringTaskTemplates };
          delete newTemplates[id];
          
          return {
            state: {
              ...state.state,
              recurringTaskTemplates: newTemplates,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Recurring task instance CRUD operations
      addRecurringTaskInstance: (task: RecurringTaskInstance) => {
        set((state) => ({
          state: {
            ...state.state,
            recurringTasks: {
              ...state.state.recurringTasks,
              [task.id]: task
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updateRecurringTaskInstance: (id: string, task: RecurringTaskInstance) => {
        set((state) => ({
          state: {
            ...state.state,
            recurringTasks: {
              ...state.state.recurringTasks,
              [id]: task
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removeRecurringTaskInstance: (id: string) => {
        set((state) => {
          const newTasks = { ...state.state.recurringTasks };
          delete newTasks[id];
          
          return {
            state: {
              ...state.state,
              recurringTasks: newTasks,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      // Planning ritual CRUD operations
      addPlanningRitual: (ritual: PlanningRitual) => {
        set((state) => ({
          state: {
            ...state.state,
            planningRituals: {
              ...state.state.planningRituals,
              [ritual.id]: ritual
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      updatePlanningRitual: (id: string, ritual: PlanningRitual) => {
        set((state) => ({
          state: {
            ...state.state,
            planningRituals: {
              ...state.state.planningRituals,
              [id]: ritual
            },
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      removePlanningRitual: (id: string) => {
        set((state) => {
          const newRituals = { ...state.state.planningRituals };
          delete newRituals[id];
          
          return {
            state: {
              ...state.state,
              planningRituals: newRituals,
              lastUpdated: new Date().toISOString()
            }
          };
        });
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
      name: 'routines-store',
      partialize: (state) => ({
        state: state.state
      })
    }
  )
);
