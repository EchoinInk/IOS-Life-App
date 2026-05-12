/**
 * useMomentumToday - Hook for accessing today's momentum data
 * Provides easy access to momentum state for UI components
 */

import { useMemo } from 'react';
import { 
  selectTodayScore,
  selectTodayLevel,
  selectLongestStreak,
  selectWeeklyTrendDirection,
  selectRelevantInsights
} from '../progressSelectors';
import { useMomentumStore } from '../store/useMomentumStore';

export const useMomentumToday = () => {
  const state = useMomentumStore();

  // Memoized computed values
  const todayScore = useMemo(() => selectTodayScore(state), [state]);
  const momentumLevel = useMemo(() => selectTodayLevel(state), [state]);
  const weeklyTrend = useMemo(() => selectWeeklyTrendDirection(state), [state]);
  const longestStreak = useMemo(() => selectLongestStreak(state), [state]);
  const insights = useMemo(() => selectRelevantInsights(state, 0.6), [state]);

  return {
    todayScore,
    momentumLevel,
    weeklyTrend,
    longestStreak,
    insights,
    isLoading: state.isLoading,
    error: state.error
  };
};
