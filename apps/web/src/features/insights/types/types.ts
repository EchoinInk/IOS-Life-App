/**
 * Insights Feature Types
 * 
 * Core types for intelligent recommendations and cross-feature insights.
 */

export type InsightType = 'task' | 'meal' | 'budget' | 'shopping' | 'streak' | 'consistency' | 'overall';

export type InsightPriority = 'high' | 'medium' | 'low';

export interface Insight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  actionable: boolean;
  actionLabel?: string;
  createdAt: string;
  dismissed: boolean;
}

export interface SmartSummary {
  focusArea: 'tasks' | 'meals' | 'budget' | 'shopping' | 'overall';
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
}

export interface InsightState {
  insights: Insight[];
  summaries: SmartSummary[];
  recommendations: Recommendation[];
  lastGenerated: string | null;
}
