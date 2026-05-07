/**
 * Consistency Metrics - Calculate and track user consistency patterns
 * Provides insights into user behavior patterns and trends
 */

import type { 
  DailyMomentumScore, 
  ConsistencyMetrics, 
  MomentumCategory,
  MomentumLevel 
} from './types/momentum.types';

export class ConsistencyCalculator {
  /**
   * Calculate comprehensive consistency metrics
   */
  static calculateConsistency(scores: DailyMomentumScore[]): ConsistencyMetrics {
    if (scores.length === 0) {
      return this.getEmptyMetrics();
    }

    const overallConsistency = this.calculateOverallConsistency(scores);
    const categoryConsistency = this.calculateCategoryConsistency(scores);
    const weeklyPattern = this.calculateWeeklyPattern(scores);
    const timeOfDayPattern = this.calculateTimeOfDayPattern(scores);
    const focusAreaConsistency = this.calculateFocusAreaConsistency(scores);
    const momentumLevel = this.determineMomentumLevel(overallConsistency);

    return {
      overallConsistency,
      categoryConsistency,
      weeklyPattern,
      timeOfDayPattern,
      focusAreaConsistency,
      momentumLevel
    };
  }

  /**
   * Calculate overall consistency score (0-100)
   */
  private static calculateOverallConsistency(scores: DailyMomentumScore[]): number {
    if (scores.length === 0) return 0;

    // Calculate consistency based on score variance and completion rate
    const scoreValues = scores.map(s => s.totalScore);
    const average = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    const variance = scoreValues.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scoreValues.length;
    
    // Lower variance = higher consistency
    const consistencyScore = Math.max(0, 100 - (variance / 10));
    
    // Factor in completion rate (scores >= 60)
    const completionRate = scores.filter(s => s.totalScore >= 60).length / scores.length;
    
    return Math.round((consistencyScore * 0.6) + (completionRate * 100 * 0.4));
  }

  /**
   * Calculate consistency for each category
   */
  private static calculateCategoryConsistency(scores: DailyMomentumScore[]): Record<MomentumCategory, number> {
    const categories: MomentumCategory[] = ['tasks', 'routines', 'meals', 'budget', 'planning'];
    const consistency: Partial<Record<MomentumCategory, number>> = {};

    categories.forEach(category => {
      const categoryScores = scores.map(s => s.categoryScores[category] ?? 0);
      
      if (categoryScores.length === 0) {
        consistency[category] = 0;
        return;
      }

      const average = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
      const variance = categoryScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / categoryScores.length;
      
      // Lower variance = higher consistency
      consistency[category] = Math.max(0, Math.round(100 - (variance / 10)));
    });

    return consistency as Record<MomentumCategory, number>;
  }

  /**
   * Calculate weekly pattern (0-6 = Sunday-Saturday)
   */
  private static calculateWeeklyPattern(scores: DailyMomentumScore[]): Record<number, number> {
    const pattern: Record<number, number> = {};
    
    // Initialize all days to 0
    for (let i = 0; i < 7; i++) {
      pattern[i] = 0;
    }

    scores.forEach(score => {
      const date = new Date(score.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (score.totalScore >= 60) { // Only count successful days
        pattern[dayOfWeek] = (pattern[dayOfWeek] || 0) + 1;
      }
    });

    // Convert to percentages
    const totalWeeks = scores.length / 7;
    Object.keys(pattern).forEach(day => {
      const dayIndex = parseInt(day);
      pattern[dayIndex] = totalWeeks > 0 ? Math.round(((pattern[dayIndex] ?? 0) / totalWeeks) * 100) : 0;
    });

    return pattern;
  }

  /**
   * Calculate time of day pattern (0-23 hours)
   */
  private static calculateTimeOfDayPattern(scores: DailyMomentumScore[]): Record<number, number> {
    const pattern: Record<number, number> = {};
    
    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
      pattern[i] = 0;
    }

    scores.forEach(score => {
      score.activities.forEach(activity => {
        if (activity.completed) {
          const hour = new Date(activity.timestamp).getHours();
          pattern[hour] = (pattern[hour] || 0) + 1;
        }
      });
    });

    // Convert to percentages
    const totalActivities = Object.values(pattern).reduce((sum, count) => sum + count, 0);
    if (totalActivities > 0) {
      Object.keys(pattern).forEach(hour => {
        const hourIndex = parseInt(hour);
        pattern[hourIndex] = Math.round(((pattern[hourIndex] ?? 0) / totalActivities) * 100);
      });
    }

    return pattern;
  }

  /**
   * Calculate focus area consistency
   */
  private static calculateFocusAreaConsistency(scores: DailyMomentumScore[]): Record<string, number> {
    const focusAreaScores: Record<string, number[]> = {};

    scores.forEach(score => {
      score.activities.forEach(activity => {
        const focusArea = (activity.metadata?.focusArea as string | undefined) || 'general';
        
        if (!focusAreaScores[focusArea]) {
          focusAreaScores[focusArea] = [];
        }
        
        if (activity.completed) {
          focusAreaScores[focusArea].push(activity.value);
        }
      });
    });

    const consistency: Record<string, number> = {};
    
    Object.entries(focusAreaScores).forEach(([focusArea, values]) => {
      if (values.length === 0) {
        consistency[focusArea] = 0;
        return;
      }

      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / values.length;
      
      consistency[focusArea] = Math.max(0, Math.round(100 - (variance / 10)));
    });

    return consistency;
  }

  /**
   * Determine momentum level based on consistency score
   */
  private static determineMomentumLevel(consistencyScore: number): MomentumLevel {
    if (consistencyScore >= 85) return 'excelling';
    if (consistencyScore >= 70) return 'growing';
    if (consistencyScore >= 50) return 'maintaining';
    return 'building';
  }

  /**
   * Get empty consistency metrics
   */
  private static getEmptyMetrics(): ConsistencyMetrics {
    return {
      overallConsistency: 0,
      categoryConsistency: {
        tasks: 0,
        routines: 0,
        meals: 0,
        budget: 0,
        planning: 0
      },
      weeklyPattern: {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
      },
      timeOfDayPattern: Array.from({ length: 24 }, (_, i) => i).reduce((acc, i) => {
        acc[i] = 0;
        return acc;
      }, {} as Record<number, number>),
      focusAreaConsistency: {},
      momentumLevel: 'building'
    };
  }

  /**
   * Get best performing day of week
   */
  static getBestDayOfWeek(weeklyPattern: Record<number, number>): number | null {
    let bestDay = null;
    let bestScore = 0;

    Object.entries(weeklyPattern).forEach(([day, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestDay = parseInt(day);
      }
    });

    return bestDay;
  }

  /**
   * Get best performing time of day
   */
  static getBestTimeOfDay(timePattern: Record<number, number>): number | null {
    let bestHour = null;
    let bestScore = 0;

    Object.entries(timePattern).forEach(([hour, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestHour = parseInt(hour);
      }
    });

    return bestHour;
  }

  /**
   * Get consistency trend (improving, declining, stable)
   */
  static getConsistencyTrend(scores: DailyMomentumScore[]): 'improving' | 'declining' | 'stable' {
    if (scores.length < 7) return 'stable';

    const recent = scores.slice(0, 7);
    const older = scores.slice(7, 14);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, s) => sum + s.totalScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.totalScore, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (Math.abs(difference) <= 5) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }

  /**
   * Get consistency recommendations
   */
  static getConsistencyRecommendations(metrics: ConsistencyMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.overallConsistency < 50) {
      recommendations.push('Focus on building daily habits to improve consistency');
    }

    // Check category-specific issues
    Object.entries(metrics.categoryConsistency).forEach(([category, consistency]) => {
      if (consistency < 40) {
        recommendations.push(`Consider setting smaller goals for ${category} to build consistency`);
      }
    });

    // Check weekly patterns
    const bestDay = Object.entries(metrics.weeklyPattern).reduce((best, [day, score]) => 
      score > best.score ? { day: parseInt(day), score } : best,
      { day: 0, score: 0 }
    );
    const worstDay = Object.entries(metrics.weeklyPattern).reduce((worst, [day, score]) => 
      score < worst.score ? { day: parseInt(day), score } : worst,
      { day: 0, score: 100 }
    );

    if (worstDay.score < 30) {
      recommendations.push(`Your ${this.getDayName(worstDay.day)} could use more attention`);
    }

    if ((metrics.weeklyPattern[bestDay.day] ?? 0) > 80) {
      recommendations.push(`You're strongest on ${this.getDayName(bestDay.day)} - leverage this for important tasks`);
    }

    return recommendations;
  }

  /**
   * Helper to get day name
   */
  private static getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  }
}
