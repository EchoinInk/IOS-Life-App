/**
 * Momentum System Index
 * Exports all momentum components, hooks, and utilities
 */

// Main store and hooks
export { useMomentumStore } from './store/useMomentumStore';
export { useMomentumToday } from './hooks/useMomentumToday';

// Core engine and calculators
export { MomentumEngine } from './momentumEngine';
export { calculateAllStreaks, calculateStreak, isStreakInDanger, getStreakMotivation } from './streakCalculator';
export { ConsistencyCalculator } from './consistencyMetrics';
export { TrendInsightsGenerator } from './trendInsights';

// Progress selectors
export {
  selectTodayScore,
  selectTodayLevel,
  selectTodayTrend,
  selectCategoryScores,
  selectStreak,
  selectLongestStreak,
  selectActiveStreaksCount,
  selectWeeklyTrend,
  selectWeeklyTrendDirection,
  selectWeeklyAverage,
  selectConsistencyMetrics,
  selectOverallConsistency,
  selectCategoryConsistency,
  selectRelevantInsights,
  selectPositiveInsights,
  selectInsightsByType,
  selectMomentumProgress,
  selectMomentumColor,
  selectMomentumGradient,
  selectStreakStatus,
  selectStreakMotivationLevel,
  selectBestCategory,
  selectMomentumSummary
} from './progressSelectors';

// UI components
export { MomentumRing } from './components/MomentumRing';
export { MomentumBar } from './components/MomentumBar';
export { StreakDisplay } from './components/StreakDisplay';

// Types
export type {
  DailyMomentumScore,
  DailyActivity,
  Streak,
  MomentumTrend,
  ConsistencyMetrics,
  MomentumInsight,
  MomentumState,
  MomentumStore,
  MomentumCalculationContext,
  StreakCalculationResult,
  MomentumLevel,
  MomentumCategory,
  StreakType
} from './types/momentum.types';

// Constants
export {
  MOMENTUM_THRESHOLDS,
  CATEGORY_WEIGHTS,
  STREAK_TYPE_LABELS,
  MOMENTUM_CATEGORY_LABELS,
  MOMENTUM_LEVEL_LABELS,
  MOMENTUM_LEVEL_DESCRIPTIONS
} from './types/momentum.types';
