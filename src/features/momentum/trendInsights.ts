/**
 * Trend Insights - Generate insights and summaries from momentum data
 * Provides intelligent analysis of user patterns and trends
 */

import type { 
  DailyMomentumScore, 
  MomentumInsight,
  MomentumLevel,
  MomentumCategory 
} from './types/momentum.types';

export class TrendInsightsGenerator {
  /**
   * Generate comprehensive trend insights
   */
  static generateInsights(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];

    if (scores.length < 3) {
      return this.getInsufficientDataInsights();
    }

    // Generate different types of insights
    insights.push(...this.generatePatternInsights(scores));
    insights.push(...this.generateAchievementInsights(scores));
    insights.push(...this.generateTrendInsights(scores));
    insights.push(...this.generateRecommendationInsights(scores));

    // Sort by relevance and return top insights
    return insights
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8); // Limit to top 8 insights
  }

  /**
   * Generate pattern-based insights
   */
  private static generatePatternInsights(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];

    // Weekly pattern analysis
    const weeklyPattern = this.analyzeWeeklyPattern(scores);
    if (weeklyPattern.insight) {
      insights.push(weeklyPattern.insight);
    }

    // Category performance patterns
    const categoryPatterns = this.analyzeCategoryPatterns(scores);
    insights.push(...categoryPatterns);

    // Time-based patterns
    const timePatterns = this.analyzeTimePatterns(scores);
    if (timePatterns.insight) {
      insights.push(timePatterns.insight);
    }

    return insights;
  }

  /**
   * Generate achievement-based insights
   */
  private static generateAchievementInsights(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];

    // Recent high performance
    const recentHighPerf = this.checkRecentHighPerformance(scores);
    if (recentHighPerf) insights.push(recentHighPerf);

    // Consistency achievements
    const consistencyAchievement = this.checkConsistencyAchievement(scores);
    if (consistencyAchievement) insights.push(consistencyAchievement);

    // Improvement streak
    const improvementStreak = this.checkImprovementStreak(scores);
    if (improvementStreak) insights.push(improvementStreak);

    return insights;
  }

  /**
   * Generate trend-based insights
   */
  private static generateTrendInsights(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];

    // Momentum trend
    const momentumTrend = this.analyzeMomentumTrend(scores);
    if (momentumTrend) insights.push(momentumTrend);

    // Score trajectory
    const scoreTrajectory = this.analyzeScoreTrajectory(scores);
    if (scoreTrajectory) insights.push(scoreTrajectory);

    return insights;
  }

  /**
   * Generate recommendation-based insights
   */
  private static generateRecommendationInsights(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];

    // Area for improvement
    const improvementArea = this.identifyImprovementArea(scores);
    if (improvementArea) insights.push(improvementArea);

    // Optimization suggestions
    const optimization = this.suggestOptimization(scores);
    if (optimization) insights.push(optimization);

    return insights;
  }

  /**
   * Analyze weekly patterns
   */
  private static analyzeWeeklyPattern(scores: DailyMomentumScore[]): { insight?: MomentumInsight } {
    const dayPerformance: Record<number, { total: number; count: number }> = {};

    scores.forEach(score => {
      const day = new Date(score.date).getDay();
      if (!dayPerformance[day]) {
        dayPerformance[day] = { total: 0, count: 0 };
      }
      dayPerformance[day].total += score.totalScore;
      dayPerformance[day].count++;
    });

    // Find best and worst days
    let bestDay = -1;
    let worstDay = -1;
    let bestAvg = 0;
    let worstAvg = 100;

    Object.entries(dayPerformance).forEach(([day, performance]) => {
      const avg = performance.total / performance.count;
      const dayNum = parseInt(day);
      
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = dayNum;
      }
      if (avg < worstAvg) {
        worstAvg = avg;
        worstDay = dayNum;
      }
    });

    if (bestDay >= 0 && worstDay >= 0 && bestAvg - worstAvg > 20) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return {
        insight: {
          id: 'weekly-pattern',
          type: 'pattern',
          title: 'Weekly Performance Pattern',
          content: `You perform best on ${dayNames[bestDay]} (${Math.round(bestAvg)} avg) and could improve on ${dayNames[worstDay]} (${Math.round(worstAvg)} avg).`,
          relevance: 0.7,
          timestamp: new Date().toISOString(),
          isPositive: true,
          momentumLevel: 'maintaining'
        }
      };
    }

    return {};
  }

  /**
   * Analyze category performance patterns
   */
  private static analyzeCategoryPatterns(scores: DailyMomentumScore[]): MomentumInsight[] {
    const insights: MomentumInsight[] = [];
    const categoryAverages: Record<MomentumCategory, number> = {
      tasks: 0,
      routines: 0,
      meals: 0,
      budget: 0,
      planning: 0
    };

    // Calculate category averages
    Object.keys(categoryAverages).forEach(category => {
      const cat = category as MomentumCategory;
      const values = scores.map(s => s.categoryScores[cat] || 0);
      categoryAverages[cat] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    // Find strongest and weakest categories
    const sortedCategories = Object.entries(categoryAverages)
      .sort(([, a], [, b]) => b - a);

    const bestCategory = Object.entries(categoryAverages)
      .reduce((best, [day, score]) => score > best[1] ? [day, score] : best, ['', 0] as [string, number]);

    const [strongestCat, strongestAvg] = bestCategory;
    const [weakestCat, weakestAvg] = sortedCategories[sortedCategories.length - 1] || ['', 0];

    if (strongestAvg - weakestAvg > 25) {
      insights.push({
        id: 'category-strength',
        type: 'pattern',
        title: 'Category Performance',
        content: `You excel in ${strongestCat} (${Math.round(strongestAvg)}) but could focus on ${weakestCat} (${Math.round(weakestAvg)}).`,
        relevance: 0.8,
        category: strongestCat as MomentumCategory,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      });
    }

    return insights;
  }

  /**
   * Analyze time-based patterns
   */
  private static analyzeTimePatterns(scores: DailyMomentumScore[]): { insight?: MomentumInsight } {
    const hourPerformance: Record<number, number> = {};

    scores.forEach(score => {
      score.activities.forEach(activity => {
        if (activity.completed) {
          const hour = new Date(activity.timestamp).getHours();
          hourPerformance[hour] = (hourPerformance[hour] || 0) + activity.value;
        }
      });
    });

    // Find peak hours
    const sortedHours = Object.entries(hourPerformance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (sortedHours.length >= 2) {
      const peakHours = sortedHours.map(([hour]) => parseInt(hour)).sort();
      
      if (peakHours[0] !== undefined && peakHours[0] >= 6 && peakHours[0] <= 10) {
        return {
          insight: {
            id: 'morning-peak',
            type: 'pattern',
            title: 'Morning Peak Performance',
            content: `You're most productive in the morning hours (${peakHours.join(', ')}). Schedule important tasks then.`,
            relevance: 0.6,
            timestamp: new Date().toISOString(),
            isPositive: true,
            momentumLevel: 'maintaining'
          }
        };
      }
    }

    return {};
  }

  /**
   * Check for recent high performance
   */
  private static checkRecentHighPerformance(scores: DailyMomentumScore[]): MomentumInsight | null {
    const recentScores = scores.slice(0, 3);
    const recentAvg = recentScores.reduce((sum, s) => sum + s.totalScore, 0) / recentScores.length;

    if (recentAvg >= 85) {
      return {
        id: 'recent-high-perf',
        type: 'achievement',
        title: 'Excellent Recent Performance',
        content: `Your recent average score is ${Math.round(recentAvg)} - you're performing at an excellent level!`,
        relevance: 0.9,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'excelling'
      };
    }

    return null;
  }

  /**
   * Check for consistency achievements
   */
  private static checkConsistencyAchievement(scores: DailyMomentumScore[]): MomentumInsight | null {
    const recentScores = scores.slice(0, 7);
    const qualifiedDays = recentScores.filter(s => s.totalScore >= 60).length;

    if (qualifiedDays === 7) {
      return {
        id: 'perfect-week',
        type: 'achievement',
        title: 'Perfect Week',
        content: 'You\'ve maintained momentum every day this week. Outstanding consistency!',
        relevance: 0.95,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'excelling'
      };
    }

    if (qualifiedDays >= 6) {
      return {
        id: 'strong-consistency',
        type: 'achievement',
        title: 'Strong Consistency',
        content: `${qualifiedDays} out of 7 days with good momentum. Keep it up!`,
        relevance: 0.8,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      };
    }

    return null;
  }

  /**
   * Check for improvement streak
   */
  private static checkImprovementStreak(scores: DailyMomentumScore[]): MomentumInsight | null {
    if (scores.length < 3) return null;

    let streakLength = 0;
    for (let i = 0; i < Math.min(scores.length - 1, 6); i++) {
      const currentScore = scores[i];
      const nextScore = scores[i + 1];
      
      if (currentScore && nextScore && 
          currentScore.totalScore !== undefined && 
          nextScore.totalScore !== undefined && 
          currentScore.totalScore > nextScore.totalScore) {
        streakLength++;
      } else {
        break;
      }
    }

    if (streakLength >= 3) {
      return {
        id: 'improvement-streak',
        type: 'achievement',
        title: 'Improvement Streak',
        content: `${streakLength} days of continuous improvement. Your momentum is building!`,
        relevance: 0.85,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      };
    }

    return null;
  }

  /**
   * Analyze momentum trend
   */
  private static analyzeMomentumTrend(scores: DailyMomentumScore[]): MomentumInsight | null {
    if (scores.length < 7) return null;

    const recent = scores.slice(0, 7);
    const older = scores.slice(7, 14);

    if (older.length === 0) return null;

    const recentAvg = recent.reduce((sum, s) => sum + s.totalScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.totalScore, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 10) {
      return {
        id: 'positive-trend',
        type: 'trend',
        title: 'Positive Trend',
        content: `Your momentum has improved by ${Math.round(difference)} points recently. Keep building!`,
        relevance: 0.8,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      };
    }

    if (difference < -10) {
      return {
        id: 'declining-trend',
        type: 'trend',
        title: 'Attention Needed',
        content: `Your momentum has declined by ${Math.round(Math.abs(difference))} points. Let's refocus.`,
        relevance: 0.9,
        timestamp: new Date().toISOString(),
        isPositive: false,
        momentumLevel: 'building'
      };
    }

    return null;
  }

  /**
   * Analyze score trajectory
   */
  private static analyzeScoreTrajectory(scores: DailyMomentumScore[]): MomentumInsight | null {
    if (scores.length < 5) return null;

    const recentScores = scores.slice(0, 5).map(s => s.totalScore);
    const trend = this.calculateSimpleTrend(recentScores);

    if (trend > 5) {
      return {
        id: 'upward-trajectory',
        type: 'trend',
        title: 'Upward Trajectory',
        content: 'Your scores are trending upward. You\'re building excellent momentum!',
        relevance: 0.75,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'growing'
      };
    }

    if (trend < -5) {
      return {
        id: 'downward-trajectory',
        type: 'trend',
        title: 'Course Correction',
        content: 'Your recent trajectory is downward. Let\'s get back on track.',
        relevance: 0.8,
        timestamp: new Date().toISOString(),
        isPositive: false,
        momentumLevel: 'building'
      };
    }

    return null;
  }

  /**
   * Identify areas for improvement
   */
  private static identifyImprovementArea(scores: DailyMomentumScore[]): MomentumInsight | null {
    const categoryAverages: Record<MomentumCategory, number> = {
      tasks: 0,
      routines: 0,
      meals: 0,
      budget: 0,
      planning: 0
    };

    Object.keys(categoryAverages).forEach(category => {
      const cat = category as MomentumCategory;
      const values = scores.map(s => s.categoryScores[cat] || 0);
      categoryAverages[cat] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    const weakestCategory = Object.entries(categoryAverages)
      .sort(([, a], [, b]) => a - b)[0];

    if (weakestCategory && weakestCategory[1] < 40) {
      return {
        id: 'improvement-area',
        type: 'recommendation',
        title: 'Focus Area',
        content: `Consider focusing on ${weakestCategory[0]} - it could benefit from extra attention.`,
        relevance: 0.7,
        category: weakestCategory[0] as MomentumCategory,
        timestamp: new Date().toISOString(),
        isPositive: false,
        momentumLevel: 'building'
      };
    }

    return null;
  }

  /**
   * Suggest optimizations
   */
  private static suggestOptimization(scores: DailyMomentumScore[]): MomentumInsight | null {
    const recentScores = scores.slice(0, 5);
    const avgScore = recentScores.reduce((sum, s) => sum + s.totalScore, 0) / recentScores.length;

    if (avgScore >= 60 && avgScore < 80) {
      return {
        id: 'optimization',
        type: 'recommendation',
        title: 'Optimization Opportunity',
        content: 'You\'re doing well! Small adjustments could push you into excellent performance.',
        relevance: 0.6,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'maintaining'
      };
    }

    return null;
  }

  /**
   * Calculate simple trend
   */
  private static calculateSimpleTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[values.length - 1];
    const last = values[0];
    
    if (first === undefined || last === undefined) return 0;
    return last - first;
  }

  /**
   * Get insights for insufficient data
   */
  private static getInsufficientDataInsights(): MomentumInsight[] {
    return [
      {
        id: 'getting-started',
        type: 'recommendation',
        title: 'Building Your Foundation',
        content: 'Keep using Lumo daily to build momentum and unlock personalized insights.',
        relevance: 0.5,
        timestamp: new Date().toISOString(),
        isPositive: true,
        momentumLevel: 'building'
      }
    ];
  }

  /**
   * Generate weekly summary
   */
  static generateWeeklySummary(scores: DailyMomentumScore[]): {
    summary: string;
    highlights: string[];
    momentumLevel: MomentumLevel;
  } {
    if (scores.length === 0) {
      return {
        summary: 'No activity this week. Start building your momentum!',
        highlights: ['Begin your journey with small daily actions'],
        momentumLevel: 'building'
      };
    }

    const weekScores = scores.slice(0, 7);
    const avgScore = weekScores.reduce((sum, s) => sum + s.totalScore, 0) / weekScores.length;
    const highScoreDays = weekScores.filter(s => s.totalScore >= 80).length;
    const momentumLevel = this.getMomentumLevel(avgScore);

    const highlights: string[] = [];
    
    if (highScoreDays >= 5) {
      highlights.push(`${highScoreDays} days of excellent performance`);
    }
    
    if (avgScore >= 70) {
      highlights.push(`Strong weekly average of ${Math.round(avgScore)}`);
    }
    
    if (weekScores.length >= 7) {
      highlights.push('Completed a full week of tracking');
    }

    const summary = this.generateSummaryText(avgScore, highScoreDays, weekScores.length);

    return { summary, highlights, momentumLevel };
  }

  /**
   * Generate summary text
   */
  private static generateSummaryText(avgScore: number, _highScoreDays: number, _totalDays: number): string {
    if (avgScore >= 85) {
      return 'Exceptional week! You\'re performing at an elite level with outstanding consistency.';
    }
    
    if (avgScore >= 70) {
      return 'Great week! You\'re building strong momentum and showing excellent progress.';
    }
    
    if (avgScore >= 50) {
      return 'Good progress! You\'re building consistency and improving week over week.';
    }
    
    if (avgScore >= 30) {
      return 'You\'re making progress. Focus on consistency to build stronger momentum.';
    }
    
    return 'Every day is a new opportunity to build momentum. Start small and stay consistent.';
  }

  /**
   * Get momentum level from score
   */
  private static getMomentumLevel(score: number): MomentumLevel {
    if (score >= 85) return 'excelling';
    if (score >= 70) return 'growing';
    if (score >= 50) return 'maintaining';
    return 'building';
  }
}
