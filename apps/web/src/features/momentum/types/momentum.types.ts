/**
 * Momentum and streak system types for Lumo
 * Premium, calm progress tracking without gamification
 */

export type StreakType = 
  | 'planning'
  | 'completion'
  | 'routine'
  | 'consistency'
  | 'focus'
  | 'wellness';

export type MomentumCategory = 
  | 'tasks'
  | 'routines'
  | 'meals'
  | 'budget'
  | 'planning';

export type MomentumLevel = 
  | 'building'
  | 'maintaining'
  | 'growing'
  | 'excelling';

export interface DailyMomentumScore {
  date: string; // YYYY-MM-DD
  totalScore: number; // 0-100
  categoryScores: Record<MomentumCategory, number>;
  activities: DailyActivity[];
  momentumLevel: MomentumLevel;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface DailyActivity {
  id: string;
  category: MomentumCategory;
  type: string;
  completed: boolean;
  value: number; // 0-10 contribution to score
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Streak {
  type: StreakType;
  currentLength: number;
  longestLength: number;
  startDate: string;
  lastActivityDate: string;
  isActive: boolean;
  momentumLevel: MomentumLevel;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface MomentumTrend {
  period: 'daily' | 'weekly' | 'monthly';
  scores: number[];
  trendDirection: 'up' | 'down' | 'stable';
  trendStrength: number; // 0-1
  averageScore: number;
  peakScore: number;
  momentumLevel: MomentumLevel;
}

export interface ConsistencyMetrics {
  overallConsistency: number; // 0-100
  categoryConsistency: Record<MomentumCategory, number>;
  weeklyPattern: Record<number, number>; // 0-6 (Sunday-Saturday)
  timeOfDayPattern: Record<number, number>; // 0-23 hours
  focusAreaConsistency: Record<string, number>;
  momentumLevel: MomentumLevel;
}

export interface MomentumInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'recommendation' | 'trend';
  title: string;
  content: string;
  relevance: number; // 0-1
  category?: MomentumCategory;
  focusArea?: string;
  timestamp: string;
  isPositive: boolean;
  momentumLevel: MomentumLevel;
}

export interface MomentumState {
  // Current state
  todayScore: DailyMomentumScore | null;
  currentStreaks: Record<StreakType, Streak>;
  weeklyTrend: MomentumTrend;
  consistency: ConsistencyMetrics;
  insights: MomentumInsight[];
  
  // Historical data
  dailyScores: Record<string, DailyMomentumScore>;
  streakHistory: Record<StreakType, Streak[]>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface MomentumStore {
  // State
  state: MomentumState;
  
  // Actions
  addActivity: (activity: Omit<DailyActivity, 'id'>) => void;
  updateDailyScore: (date: string, score: Partial<DailyMomentumScore>) => void;
  updateStreak: (type: StreakType, update: Partial<Streak>) => void;
  calculateTodayScore: () => void;
  generateInsights: () => void;
  refreshTrends: () => void;
  
  // Computed
  getTodayScore: () => number;
  getStreak: (type: StreakType) => Streak;
  getMomentumLevel: () => MomentumLevel;
  getWeeklyTrend: () => MomentumTrend;
  getConsistencyMetrics: () => ConsistencyMetrics;
  getActiveInsights: () => MomentumInsight[];
}

// Helper types for calculations
export interface MomentumCalculationContext {
  date: string;
  activities: DailyActivity[];
  previousScores: DailyMomentumScore[];
  userPreferences: {
    focusAreas: string[];
    preferredCategories: MomentumCategory[];
    planningStyle: string;
  };
}

export interface StreakCalculationResult {
  currentLength: number;
  longestLength: number;
  isActive: boolean;
  momentumLevel: MomentumLevel;
  trendDirection: 'up' | 'down' | 'stable';
}

// Constants for momentum calculations
export const MOMENTUM_THRESHOLDS = {
  BUILDING: { min: 0, max: 40 },
  MAINTAINING: { min: 40, max: 70 },
  GROWING: { min: 70, max: 85 },
  EXCELING: { min: 85, max: 100 }
} as const;

export const CATEGORY_WEIGHTS = {
  tasks: 0.3,
  routines: 0.25,
  meals: 0.2,
  budget: 0.15,
  planning: 0.1
} as const;

export const STREAK_TYPE_LABELS: Record<StreakType, string> = {
  planning: 'Planning Consistency',
  completion: 'Task Completion',
  routine: 'Daily Routines',
  consistency: 'Overall Consistency',
  focus: 'Focus Time',
  wellness: 'Wellness Activities'
} as const;

export const MOMENTUM_CATEGORY_LABELS: Record<MomentumCategory, string> = {
  tasks: 'Tasks & Projects',
  routines: 'Daily Routines',
  meals: 'Meal Planning',
  budget: 'Budget & Finance',
  planning: 'Planning & Organization'
} as const;

export const MOMENTUM_LEVEL_LABELS: Record<MomentumLevel, string> = {
  building: 'Building Momentum',
  maintaining: 'Maintaining Progress',
  growing: 'Growing Strong',
  excelling: 'Excelling Consistently'
} as const;

export const MOMENTUM_LEVEL_DESCRIPTIONS: Record<MomentumLevel, string> = {
  building: 'You\'re establishing new habits and building your foundation',
  maintaining: 'You\'re keeping consistent and maintaining steady progress',
  growing: 'You\'re seeing strong improvement and building momentum',
  excelling: 'You\'re performing at a high level with excellent consistency'
} as const;
