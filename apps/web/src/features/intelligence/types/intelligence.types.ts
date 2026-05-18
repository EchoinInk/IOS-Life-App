/**
 * Intelligence Layer Types
 * Defines types for smart insights, recommendations, and pattern detection
 */

export interface SmartInsight {
  id: string;
  type: 'overdue_tasks' | 'spending_trend' | 'consistency_drop' | 'focus_overload' | 'planning_gap' | 'achievement' | 'pattern';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'info';
  category: 'tasks' | 'budget' | 'meals' | 'routines' | 'general';
  timestamp: string;
  actionable: boolean;
  data?: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  type: 'timing' | 'budget' | 'focus' | 'planning' | 'routine';
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1
  priority: 'low' | 'medium' | 'high';
  category: 'tasks' | 'budget' | 'meals' | 'routines' | 'general';
  timestamp: string;
  expiresAt?: string;
  action?: {
    type: 'navigate' | 'modal' | 'external' | 'none';
    target?: string;
    data?: Record<string, unknown>;
  };
}

export interface Pattern {
  id: string;
  type: 'time_of_day' | 'day_of_week' | 'category_preference' | 'consistency' | 'trend';
  description: string;
  confidence: number; // 0-1
  data: {
    pattern: unknown;
    frequency: number;
    lastSeen: string;
  };
  category: 'tasks' | 'budget' | 'meals' | 'routines';
}

export interface IntelligenceContext {
  // User data
  tasks: TaskData[];
  budget: BudgetData[];
  meals: MealData[];
  momentum: MomentumData[];
  
  // Temporal context
  currentTime: Date;
  dayOfWeek: number;
  hourOfDay: number;
  isWeekend: boolean;
  
  // Preferences
  userPreferences: UserPreferences;
}

export interface TaskData {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
  createdAt: string;
  completedAt?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface BudgetData {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  description: string;
}

export interface MealData {
  id: string;
  name: string;
  date: string;
  category?: string;
  planned: boolean;
}

export interface MomentumData {
  date: string;
  score: number;
  activities: unknown[];
  streaks: Record<string, number>;
}

export interface UserPreferences {
  focusAreas: string[];
  preferredCategories: string[];
  planningStyle: 'minimal' | 'detailed' | 'balanced';
  workHours: {
    start: number;
    end: number;
  };
  budgetAlerts: boolean;
  taskReminders: boolean;
}

export interface IntelligenceResult {
  insights: SmartInsight[];
  recommendations: Recommendation[];
  patterns: Pattern[];
  summary: {
    totalInsights: number;
    highPriorityCount: number;
    actionableCount: number;
  };
}
