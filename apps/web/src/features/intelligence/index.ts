/**
 * Intelligence Layer Index
 * Centralized exports for the intelligence system
 */

// Core engine
export { IntelligenceEngine } from './intelligenceEngine';

// Core components
export { PatternDetector } from './patternDetection';
export { InsightGenerator } from './insightGenerator';
export { RecommendationEngine } from './recommendationEngine';

// Types
export type {
  SmartInsight,
  Recommendation,
  Pattern,
  IntelligenceContext,
  IntelligenceResult,
  TaskData,
  BudgetData,
  MealData,
  MomentumData,
  UserPreferences
} from './types/intelligence.types';
