/**
 * Routine-Momentum Hook
 * Syncs routine data with momentum system
 * Provides automatic momentum contribution from routines
 */

import { useEffect } from 'react';
import { useRoutinesStore } from '../store/routinesStore';
import { useMomentumStore } from '@/features/momentum/store/useMomentumStore';
import { 
  getTodayRoutineMomentum,
  getRoutineMomentumSummary 
} from './routineMomentumBridge';

/**
 * Hook to sync routine data with momentum system
 * Automatically adds routine activities to momentum when routines change
 */
export const useRoutineMomentumSync = () => {
  const routineState = useRoutinesStore((state) => state.state);
  const addActivity = useMomentumStore((state) => state.addActivity);
  const calculateTodayScore = useMomentumStore((state) => state.calculateTodayScore);

  useEffect(() => {
    // Get today's routine momentum data
    const { activities } = getTodayRoutineMomentum(
      routineState.instances,
      routineState.focusSessions
    );

    // Add each routine activity to momentum
    activities.forEach(activity => {
      addActivity(activity);
    });

    // Recalculate today's momentum score with routine data
    calculateTodayScore();
  }, [routineState.instances, routineState.focusSessions, addActivity, calculateTodayScore]);
};

/**
 * Hook to get routine momentum summary for UI
 * Provides computed routine momentum data for display
 */
export const useRoutineMomentumSummary = () => {
  const routineState = useRoutinesStore((state) => state.state);

  const summary = getRoutineMomentumSummary(
    routineState.instances,
    routineState.focusSessions
  );

  return summary;
};
