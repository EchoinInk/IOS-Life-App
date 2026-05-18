/**
 * Progress Selectors - Optimized selectors for momentum data
 * Provides efficient access to computed momentum values
 */

import type { 
  DailyMomentumScore, 
  Streak, 
  MomentumTrend, 
  ConsistencyMetrics,
  MomentumLevel,
  MomentumCategory,
  MomentumInsight
} from './types/momentum.types';

/**
 * Select today's momentum score
 */
export const selectTodayScore = (state: { todayScore: DailyMomentumScore | null }): number => {
  return state.todayScore?.totalScore || 0;
};

/**
 * Select today's momentum level
 */
export const selectTodayLevel = (state: { todayScore: DailyMomentumScore | null }): MomentumLevel => {
  return state.todayScore?.momentumLevel || 'building';
};

/**
 * Select today's trend direction
 */
export const selectTodayTrend = (state: { todayScore: DailyMomentumScore | null }): 'up' | 'down' | 'stable' => {
  return state.todayScore?.trendDirection || 'stable';
};

/**
 * Select category scores for today
 */
export const selectCategoryScores = (state: { todayScore: DailyMomentumScore | null }): Record<MomentumCategory, number> => {
  return state.todayScore?.categoryScores || {
    tasks: 0,
    routines: 0,
    meals: 0,
    budget: 0,
    planning: 0
  };
};

/**
 * Select streak by type
 */
export const selectStreak = (state: { currentStreaks: Record<string, Streak> }, type: string): Streak => {
  return state.currentStreaks[type] || {
    type: type as 'planning' | 'completion' | 'routine' | 'consistency' | 'focus' | 'wellness',
    currentLength: 0,
    longestLength: 0,
    startDate: '',
    lastActivityDate: '',
    isActive: false,
    momentumLevel: 'building',
    trendDirection: 'stable'
  };
};

/**
 * Select longest current streak across all types
 */
export const selectLongestStreak = (state: { currentStreaks: Record<string, Streak> }): Streak => {
  const streaks = Object.values(state.currentStreaks);
  return streaks.reduce((longest, current) => 
    current.currentLength > longest.currentLength ? current : longest,
    streaks[0] || {
      type: 'planning',
      currentLength: 0,
      longestLength: 0,
      startDate: '',
      lastActivityDate: '',
      isActive: false,
      momentumLevel: 'building',
      trendDirection: 'stable'
    }
  );
};

/**
 * Select active streaks count
 */
export const selectActiveStreaksCount = (state: { currentStreaks: Record<string, Streak> }): number => {
  return Object.values(state.currentStreaks).filter(streak => streak.isActive).length;
};

/**
 * Select weekly trend data
 */
export const selectWeeklyTrend = (state: { weeklyTrend: MomentumTrend }): MomentumTrend => {
  return state.weeklyTrend;
};

/**
 * Select weekly trend direction
 */
export const selectWeeklyTrendDirection = (state: { weeklyTrend: MomentumTrend }): 'up' | 'down' | 'stable' => {
  return state.weeklyTrend?.trendDirection || 'stable';
};

/**
 * Select weekly average score
 */
export const selectWeeklyAverage = (state: { weeklyTrend: MomentumTrend }): number => {
  return state.weeklyTrend?.averageScore || 0;
};

/**
 * Select consistency metrics
 */
export const selectConsistencyMetrics = (state: { consistency: ConsistencyMetrics }): ConsistencyMetrics => {
  return state.consistency;
};

/**
 * Select overall consistency score
 */
export const selectOverallConsistency = (state: { consistency: ConsistencyMetrics }): number => {
  return state.consistency?.overallConsistency || 0;
};

/**
 * Select category consistency
 */
export const selectCategoryConsistency = (state: { consistency: ConsistencyMetrics }): Record<MomentumCategory, number> => {
  return state.consistency?.categoryConsistency || {
    tasks: 0,
    routines: 0,
    meals: 0,
    budget: 0,
    planning: 0
  };
};

/**
 * Select momentum insights filtered by relevance
 */
export const selectRelevantInsights = (state: { insights: MomentumInsight[] }, minRelevance: number = 0.5) => {
  return state.insights?.filter(insight => insight.relevance >= minRelevance) || [];
};

/**
 * Select positive insights only
 */
export const selectPositiveInsights = (state: { insights: MomentumInsight[] }) => {
  return state.insights?.filter(insight => insight.isPositive) || [];
};

/**
 * Select insights by type
 */
export const selectInsightsByType = (state: { insights: MomentumInsight[] }, type: string) => {
  return state.insights?.filter(insight => insight.type === type) || [];
};

/**
 * Select momentum progress percentage (0-100)
 */
export const selectMomentumProgress = (score: number): number => {
  return Math.min(100, Math.max(0, score));
};

/**
 * Select momentum color class based on level
 */
export const selectMomentumColor = (level: MomentumLevel): string => {
  switch (level) {
    case 'building':
      return 'text-warning';
    case 'maintaining':
      return 'text-info';
    case 'growing':
      return 'text-success';
    case 'excelling':
      return 'text-accent';
    default:
      return 'text-text-muted';
  }
};

/**
 * Select momentum gradient class based on level
 */
export const selectMomentumGradient = (level: MomentumLevel): string => {
  switch (level) {
    case 'building':
      return 'from-warning to-warning';
    case 'maintaining':
      return 'from-info to-info';
    case 'growing':
      return 'from-success to-success';
    case 'excelling':
      return 'from-accent to-accent';
    default:
      return 'from-text-muted to-text-muted';
  }
};

/**
 * Select streak status message
 */
export const selectStreakStatus = (streak: Streak): string => {
  if (streak.currentLength === 0) {
    return 'No active streak';
  }
  
  if (streak.currentLength === 1) {
    return '1 day streak';
  }
  
  return `${streak.currentLength} day streak`;
};

/**
 * Select streak motivation level
 */
export const selectStreakMotivationLevel = (streak: Streak): 'low' | 'medium' | 'high' | 'legendary' => {
  if (streak.currentLength === 0) return 'low';
  if (streak.currentLength < 7) return 'medium';
  if (streak.currentLength < 30) return 'high';
  return 'legendary';
};

/**
 * Select best performing category
 */
export const selectBestCategory = (categoryScores: Record<MomentumCategory, number>): MomentumCategory | null => {
  const entries = Object.entries(categoryScores);
  if (entries.length === 0) return null;
  
  const [bestCategory] = entries.reduce((best, current) => 
    current[1] > best[1] ? current : best
  );
  
  return bestCategory as MomentumCategory;
};

/**
 * Select momentum summary for quick display
 */
export const selectMomentumSummary = (state: { 
  todayScore: DailyMomentumScore | null;
  currentStreaks: Record<string, Streak>;
  weeklyTrend: MomentumTrend;
}) => {
  const todayScore = selectTodayScore(state);
  const todayLevel = selectTodayLevel(state);
  const longestStreak = selectLongestStreak(state);
  const weeklyTrend = selectWeeklyTrendDirection(state);
  const weeklyAverage = selectWeeklyAverage(state);
  
  return {
    score: todayScore,
    level: todayLevel,
    longestStreak: longestStreak.currentLength,
    weeklyTrend,
    weeklyAverage,
    color: selectMomentumColor(todayLevel),
    gradient: selectMomentumGradient(todayLevel)
  };
};
