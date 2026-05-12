/**
 * Intelligence Engine
 * Main orchestrator for the intelligence layer
 * Combines pattern detection, insight generation, and recommendations
 */

import type { 
  IntelligenceContext,
  IntelligenceResult,
  SmartInsight,
  Recommendation,
  Pattern,
  TaskData,
  BudgetData,
  MealData,
  MomentumData,
  UserPreferences
} from './types/intelligence.types';
import { PatternDetector } from './patternDetection';
import { InsightGenerator } from './insightGenerator';
import { RecommendationEngine } from './recommendationEngine';

export class IntelligenceEngine {
  /**
   * Main entry point - generate comprehensive intelligence
   */
  static generateIntelligence(context: IntelligenceContext): IntelligenceResult {
    // Generate all components
    const patterns = PatternDetector.detectPatterns(context);
    const insights = InsightGenerator.generateInsights(context);
    const recommendations = RecommendationEngine.generateRecommendations(context);

    // Calculate summary
    const summary = {
      totalInsights: insights.length,
      highPriorityCount: insights.filter(i => i.severity === 'high').length,
      actionableCount: insights.filter(i => i.actionable).length
    };

    return {
      insights,
      recommendations,
      patterns,
      summary
    };
  }

  /**
   * Create intelligence context from raw data
   */
  static createContext(
    tasks: TaskData[],
    budget: BudgetData[],
    meals: MealData[],
    momentum: MomentumData[],
    userPreferences: UserPreferences
  ): IntelligenceContext {
    const currentTime = new Date();
    
    return {
      tasks,
      budget,
      meals,
      momentum,
      currentTime,
      dayOfWeek: currentTime.getDay(),
      hourOfDay: currentTime.getHours(),
      isWeekend: currentTime.getDay() === 0 || currentTime.getDay() === 6,
      userPreferences
    };
  }

  /**
   * Get insights only (for dashboard cards)
   */
  static getInsights(context: IntelligenceContext, limit: number = 5): SmartInsight[] {
    const insights = InsightGenerator.generateInsights(context);
    return insights.slice(0, limit);
  }

  /**
   * Get recommendations only (for proactive suggestions)
   */
  static getRecommendations(context: IntelligenceContext, limit: number = 3): Recommendation[] {
    const recommendations = RecommendationEngine.generateRecommendations(context);
    return recommendations.slice(0, limit);
  }

  /**
   * Get patterns only (for analysis)
   */
  static getPatterns(context: IntelligenceContext): Pattern[] {
    return PatternDetector.detectPatterns(context);
  }

  /**
   * Get high-priority items that need attention
   */
  static getHighPriorityItems(context: IntelligenceContext): {
    insights: SmartInsight[];
    recommendations: Recommendation[];
  } {
    const result = this.generateIntelligence(context);
    
    return {
      insights: result.insights.filter(i => i.severity === 'high'),
      recommendations: result.recommendations.filter(r => r.priority === 'high')
    };
  }

  /**
   * Get actionable items
   */
  static getActionableItems(context: IntelligenceContext): {
    insights: SmartInsight[];
    recommendations: Recommendation[];
  } {
    const result = this.generateIntelligence(context);
    
    return {
      insights: result.insights.filter(i => i.actionable),
      recommendations: result.recommendations.filter(r => r.action)
    };
  }

  /**
   * Get category-specific intelligence
   */
  static getCategoryIntelligence(context: IntelligenceContext, category: 'tasks' | 'budget' | 'meals' | 'routines'): {
    insights: SmartInsight[];
    recommendations: Recommendation[];
    patterns: Pattern[];
  } {
    const result = this.generateIntelligence(context);
    
    return {
      insights: result.insights.filter(i => i.category === category),
      recommendations: result.recommendations.filter(r => r.category === category),
      patterns: result.patterns.filter(p => p.category === category)
    };
  }

  /**
   * Check if user needs attention (has high-priority items)
   */
  static needsAttention(context: IntelligenceContext): boolean {
    const highPriority = this.getHighPriorityItems(context);
    return highPriority.insights.length > 0 || highPriority.recommendations.length > 0;
  }

  /**
   * Get intelligence summary for dashboard
   */
  static getDashboardSummary(context: IntelligenceContext): {
    hasInsights: boolean;
    hasRecommendations: boolean;
    needsAttention: boolean;
    insightCount: number;
    recommendationCount: number;
    topInsight?: SmartInsight;
    topRecommendation?: Recommendation;
  } {
    const result = this.generateIntelligence(context);
    const needsAttention = this.needsAttention(context);
    
    return {
      hasInsights: result.insights.length > 0,
      hasRecommendations: result.recommendations.length > 0,
      needsAttention,
      insightCount: result.insights.length,
      recommendationCount: result.recommendations.length,
      topInsight: result.insights[0],
      topRecommendation: result.recommendations[0]
    };
  }

  /**
   * Get time-based intelligence (current context sensitive)
   */
  static getTimeBasedIntelligence(context: IntelligenceContext): {
    currentRecommendations: Recommendation[];
    timingInsights: SmartInsight[];
  } {
    const allRecommendations = RecommendationEngine.generateRecommendations(context);
    const allInsights = InsightGenerator.generateInsights(context);
    
    // Filter for current time-sensitive items
    const currentRecommendations = allRecommendations.filter(rec => {
      if (!rec.expiresAt) return true; // No expiration = always relevant
      return new Date(rec.expiresAt) > context.currentTime;
    });

    // Filter for timing-related insights
    const timingInsights = allInsights.filter(insight => 
      insight.type === 'pattern' || 
      insight.type === 'consistency_drop' ||
      insight.type === 'planning_gap'
    );

    return {
      currentRecommendations,
      timingInsights
    };
  }

  /**
   * Explain a recommendation (for transparency)
   */
  static explainRecommendation(recommendation: Recommendation): string {
    let explanation = `"${recommendation.title}"\n\n`;
    explanation += `Why: ${recommendation.reasoning}\n\n`;
    explanation += `Confidence: ${Math.round(recommendation.confidence * 100)}%\n`;
    explanation += `Priority: ${recommendation.priority}\n`;
    explanation += `Category: ${recommendation.category}\n`;
    
    if (recommendation.expiresAt) {
      const expiresAt = new Date(recommendation.expiresAt);
      explanation += `Expires: ${expiresAt.toLocaleDateString()} ${expiresAt.toLocaleTimeString()}\n`;
    }
    
    return explanation;
  }

  /**
   * Explain an insight (for transparency)
   */
  static explainInsight(insight: SmartInsight): string {
    let explanation = `"${insight.title}"\n\n`;
    explanation += `What: ${insight.description}\n\n`;
    explanation += `Type: ${insight.type}\n`;
    explanation += `Severity: ${insight.severity}\n`;
    explanation += `Category: ${insight.category}\n`;
    explanation += `Actionable: ${insight.actionable ? 'Yes' : 'No'}\n`;
    
    return explanation;
  }

  /**
   * Validate intelligence data quality
   */
  static validateContext(context: IntelligenceContext): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check data completeness
    if (!context.tasks) issues.push('Tasks data is missing');
    if (!context.budget) issues.push('Budget data is missing');
    if (!context.meals) issues.push('Meals data is missing');
    if (!context.momentum) issues.push('Momentum data is missing');
    if (!context.userPreferences) issues.push('User preferences are missing');

    // Check data quality
    if (context.tasks && context.tasks.length === 0) {
      issues.push('No tasks data available');
    }
    
    if (context.momentum && context.momentum.length < 3) {
      issues.push('Insufficient momentum data for pattern detection');
    }

    // Check temporal data
    if (!context.currentTime) {
      issues.push('Current time is not set');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
