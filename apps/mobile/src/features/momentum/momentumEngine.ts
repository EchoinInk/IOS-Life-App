/**
 * Momentum Engine - Core logic for daily momentum scoring
 * Calculates daily scores based on activities and patterns
 */

import type {
  DailyMomentumScore,
  DailyActivity,
  MomentumCategory,
  MomentumLevel,
  MomentumCalculationContext,
  MomentumTrend,
  MomentumInsight
} from './types/momentum.types';
import { MOMENTUM_THRESHOLDS, CATEGORY_WEIGHTS } from './types/momentum.types';

export class MomentumEngine {
  /**
   * Calculate daily momentum score from activities
   */
  static calculateDailyScore(context: MomentumCalculationContext): DailyMomentumScore {
    const { date, activities, previousScores } = context;
    
    // Calculate category scores
    const categoryScores = this.calculateCategoryScores(activities);
    
    // Calculate total weighted score
    const totalScore = this.calculateTotalScore(categoryScores);
    
    // Determine momentum level
    const momentumLevel = this.determineMomentumLevel(totalScore);
    
    // Calculate trend direction
    const trendDirection = this.calculateTrendDirection(totalScore, previousScores);
    
    return {
      date,
      totalScore,
      categoryScores,
      activities,
      momentumLevel,
      trendDirection
    };
  }

  /**
   * Calculate scores for each category
   */
  private static calculateCategoryScores(activities: DailyActivity[]): Record<MomentumCategory, number> {
    const scores: Partial<Record<MomentumCategory, number>> = {};
    
    // Initialize all categories to 0
    const categories: MomentumCategory[] = ['tasks', 'routines', 'meals', 'budget', 'planning'];
    categories.forEach(category => {
      scores[category] = 0;
    });
    
    // Calculate scores based on activities
    activities.forEach(activity => {
      if (activity.completed) {
        scores[activity.category] = Math.min(100, (scores[activity.category] || 0) + activity.value);
      }
    });
    
    return scores as Record<MomentumCategory, number>;
  }

  /**
   * Calculate total weighted score
   */
  private static calculateTotalScore(categoryScores: Record<MomentumCategory, number>): number {
    let totalScore = 0;
    
    Object.entries(categoryScores).forEach(([category, score]) => {
      const weight = CATEGORY_WEIGHTS[category as MomentumCategory];
      totalScore += score * weight;
    });
    
    return Math.round(totalScore);
  }

  /**
   * Determine momentum level based on score
   */
  private static determineMomentumLevel(score: number): MomentumLevel {
    if (score >= MOMENTUM_THRESHOLDS.EXCELING.min) return 'excelling';
    if (score >= MOMENTUM_THRESHOLDS.GROWING.min) return 'growing';
    if (score >= MOMENTUM_THRESHOLDS.MAINTAINING.min) return 'maintaining';
    return 'building';
  }

  /**
   * Calculate trend direction compared to previous scores
   */
  private static calculateTrendDirection(
    currentScore: number,
    previousScores: DailyMomentumScore[]
  ): 'up' | 'down' | 'stable' {
    if (previousScores.length === 0) return 'stable';
    
    // Get the most recent previous score
    const mostRecent = previousScores[0];
    if (!mostRecent) return 'stable';
    const difference = currentScore - mostRecent.totalScore;
    
    // Consider stable if within 5 points
    if (Math.abs(difference) <= 5) return 'stable';
    return difference > 0 ? 'up' : 'down';
  }

  /**
   * Generate momentum insights based on patterns
   */
  static generateInsights(context: MomentumCalculationContext): MomentumInsight[] {
    const insights: MomentumInsight[] = [];
    const { activities, previousScores } = context;
    
    // Analyze completion patterns
    const completionInsight = this.analyzeCompletionPattern(activities, previousScores);
    if (completionInsight) insights.push(completionInsight);
    
    // Analyze category performance
    const categoryInsight = this.analyzeCategoryPerformance(activities);
    if (categoryInsight) insights.push(categoryInsight);
    
    // Analyze time patterns
    const timeInsight = this.analyzeTimePatterns(activities);
    if (timeInsight) insights.push(timeInsight);
    
    // Analyze consistency
    const consistencyInsight = this.analyzeConsistency(activities, previousScores);
    if (consistencyInsight) insights.push(consistencyInsight);
    
    return insights.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Analyze completion patterns
   */
  private static analyzeCompletionPattern(
    activities: DailyActivity[],
    _previousScores: DailyMomentumScore[]
  ): MomentumInsight | null {
    const completedActivities = activities.filter(a => a.completed);
    const completionRate = activities.length > 0 ? completedActivities.length / activities.length : 0;
    
    if (completionRate >= 0.8) {
      return {
        id: 'high-completion',
        type: 'achievement',
        title: 'Excellent Completion Rate',
        content: `You completed ${Math.round(completionRate * 100)}% of your planned activities today.`,
        relevance: 0.9,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'excelling'
      };
    }
    
    if (completionRate < 0.5 && activities.length > 0) {
      return {
        id: 'low-completion',
        type: 'recommendation',
        title: 'Focus on Completion',
        content: 'Consider planning fewer activities to improve your completion rate.',
        relevance: 0.7,
        timestamp: new Date().toISOString(),
        isPositive: false,
        momentumLevel: 'building'
      };
    }
    
    return null;
  }

  /**
   * Analyze category performance
   */
  private static analyzeCategoryPerformance(activities: DailyActivity[]): MomentumInsight | null {
    const categoryPerformance: Record<string, { completed: number; total: number }> = {};
    
    activities.forEach(activity => {
      if (!categoryPerformance[activity.category]) {
        categoryPerformance[activity.category] = { completed: 0, total: 0 };
      }
      categoryPerformance[activity.category]!.total++;
      if (activity.completed) {
        categoryPerformance[activity.category]!.completed++;
      }
    });
    
    // Find best performing category
    let bestCategory: string | null = null;
    let bestRate = 0;
    
    Object.entries(categoryPerformance).forEach(([category, performance]) => {
      const rate = performance.total > 0 ? performance.completed / performance.total : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestCategory = category;
      }
    });
    
    if (bestCategory && bestRate >= 0.8) {
      return {
        id: 'strong-category',
        type: 'pattern',
        title: 'Strong Performance',
        content: `You're excelling in ${bestCategory} with ${Math.round(bestRate * 100)}% completion.`,
        relevance: 0.8,
        category: bestCategory as MomentumCategory,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      };
    }
    
    return null;
  }

  /**
   * Analyze time patterns
   */
  private static analyzeTimePatterns(activities: DailyActivity[]): MomentumInsight | null {
    const hours = activities.map((a: DailyActivity) => new Date(a.timestamp).getHours());
    const morningCount = hours.filter((h: number) => h >= 6 && h < 12).length;
    const eveningCount = hours.filter((h: number) => h >= 18 && h < 22).length;
    
    if (morningCount > eveningCount && morningCount >= 3) {
      return {
        id: 'morning-pattern',
        type: 'pattern',
        title: 'Morning Momentum',
        content: 'You\'re most productive in the morning. Consider scheduling important activities then.',
        relevance: 0.6,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'maintaining'
      };
    }
    
    if (eveningCount > morningCount && eveningCount >= 3) {
      return {
        id: 'evening-pattern',
        type: 'pattern',
        title: 'Evening Focus',
        content: 'You thrive in the evening. Use this time for your most important tasks.',
        relevance: 0.6,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'maintaining'
      };
    }
    
    return null;
  }

  /**
   * Analyze consistency over time
   */
  private static analyzeConsistency(
    _activities: DailyActivity[],
    previousScores: DailyMomentumScore[]
  ): MomentumInsight | null {
    if (previousScores.length < 3) return null;
    
    const recentScores = previousScores.slice(0, 7).map(s => s.totalScore);
    const average = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / recentScores.length;
    
    if (variance < 100 && average >= 60) {
      return {
        id: 'high-consistency',
        type: 'achievement',
        title: 'Consistent Performance',
        content: 'You\'ve maintained excellent consistency over the past week.',
        relevance: 0.85,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'excelling'
      };
    }
    
    if (variance > 400) {
      return {
        id: 'inconsistent-pattern',
        type: 'recommendation',
        title: 'Build Consistency',
        content: 'Your performance varies quite a bit. Focus on building consistent daily habits.',
        relevance: 0.7,
        timestamp: new Date().toISOString(),
        isPositive: false,
        momentumLevel: 'building'
      };
    }
    
    return null;
  }

  /**
   * Calculate weekly trend
   */
  static calculateWeeklyTrend(scores: DailyMomentumScore[]): MomentumTrend {
    const recentScores = scores.slice(0, 7).map(s => s.totalScore);
    
    if (recentScores.length === 0) {
      return {
        period: 'weekly',
        scores: [],
        trendDirection: 'stable',
        trendStrength: 0,
        averageScore: 0,
        peakScore: 0,
        momentumLevel: 'building'
      };
    }
    
    const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const peakScore = Math.max(...recentScores);
    
    // Calculate trend direction and strength
    const trendDirection = this.calculateTrendDirection(
      recentScores[recentScores.length - 1] || 0,
      scores.slice(7)
    );
    
    // Simple trend strength calculation
    const trendStrength = this.calculateTrendStrength(recentScores);
    
    return {
      period: 'weekly',
      scores: recentScores,
      trendDirection,
      trendStrength,
      averageScore: Math.round(averageScore),
      peakScore,
      momentumLevel: this.determineMomentumLevel(averageScore)
    };
  }

  /**
   * Calculate trend strength (0-1)
   */
  private static calculateTrendStrength(scores: number[]): number {
    if (scores.length < 2) return 0;
    
    // Simple linear regression slope
    const n = scores.length;
    const sumX = (n * (n - 1)) / 2; // Sum of 0, 1, 2, ..., n-1
    const sumY = scores.reduce((sum, score) => sum + score, 0);
    const sumXY = scores.reduce((sum, score, index) => sum + (index * score), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Normalize to 0-1 range
    return Math.min(1, Math.abs(slope) / 10);
  }

  /**
   * Get momentum level color for UI
   */
  static getMomentumColor(level: MomentumLevel): string {
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
  }

  /**
   * Get momentum gradient for UI
   */
  static getMomentumGradient(level: MomentumLevel): string {
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
  }
}
