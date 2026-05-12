/**
 * Recommendation Engine
 * Generates proactive recommendations based on patterns and context
 */

import type { 
  Recommendation, 
  IntelligenceContext,
  SmartInsight,
  Pattern 
} from './types/intelligence.types';
import { PatternDetector } from './patternDetection';
import { InsightGenerator } from './insightGenerator';

export class RecommendationEngine {
  /**
   * Generate all recommendations
   */
  static generateRecommendations(context: IntelligenceContext): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Get insights and patterns
    const insights = InsightGenerator.generateInsights(context);
    const patterns = PatternDetector.detectPatterns(context);

    // Generate recommendations from different sources
    recommendations.push(...this.generateTimingRecommendations(context, patterns));
    recommendations.push(...this.generateBudgetRecommendations(context, insights));
    recommendations.push(...this.generateFocusRecommendations(context, insights));
    recommendations.push(...this.generatePlanningRecommendations(context, insights));
    recommendations.push(...this.generateRoutineRecommendations(context, patterns));

    // Sort by priority and confidence
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.confidence - a.confidence;
    });
  }

  /**
   * Generate timing-based recommendations
   */
  private static generateTimingRecommendations(context: IntelligenceContext, patterns: Pattern[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { hourOfDay, isWeekend } = context;

    // Evening low-task recommendation
    if (hourOfDay >= 18 && hourOfDay <= 21) {
      const activeTasks = context.tasks.filter(task => !task.completed);
      if (activeTasks.length <= 2) {
        recommendations.push({
          id: 'evening-low-tasks',
          type: 'timing',
          title: 'Perfect Evening for Relaxation',
          description: 'Tonight is a good low-task evening. You\'ve handled your priorities for the day.',
          reasoning: `You have only ${activeTasks.length} active tasks remaining and it's ${hourOfDay}:00.`,
          confidence: 0.8,
          priority: 'low',
          category: 'general',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() // Expires in 3 hours
        });
      }
    }

    // Morning productivity recommendation
    if (hourOfDay >= 6 && hourOfDay <= 9) {
      const timePattern = patterns.find(p => p.type === 'time_of_day' && p.confidence > 0.6);
      if (timePattern) {
        const patternData = timePattern.data.pattern as { hour: number };
        if (patternData.hour >= 6 && patternData.hour <= 12) {
          recommendations.push({
            id: 'morning-productivity',
            type: 'timing',
            title: 'Peak Productivity Time',
            description: 'You tend to complete tasks earlier in the day. Start with your most important task now.',
            reasoning: `Your pattern shows you're most productive around ${patternData.hour}:00.`,
            confidence: timePattern.confidence,
            priority: 'medium',
            category: 'tasks',
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
          });
        }
      }
    }

    // Weekend planning recommendation
    if (isWeekend && hourOfDay >= 9 && hourOfDay <= 11) {
      const weekendTasks = context.tasks.filter(task => !task.completed && task.category === 'errands');
      if (weekendTasks.length > 0) {
        recommendations.push({
          id: 'weekend-errands',
          type: 'timing',
          title: 'Good Time for Weekend Tasks',
          description: `You have ${weekendTasks.length} errand${weekendTasks.length > 1 ? 's' : ''} that could be tackled this weekend.`,
          reasoning: 'Weekend mornings are ideal for errands and planning tasks.',
          confidence: 0.7,
          priority: 'medium',
          category: 'tasks',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          action: {
            type: 'navigate',
            target: '/tasks'
          }
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate budget-related recommendations
   */
  private static generateBudgetRecommendations(context: IntelligenceContext, insights: SmartInsight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { budget } = context;

    // Weekly budget check
    const thisWeek = this.getCurrentWeek();
    const weeklyExpenses = budget.filter(item => {
      const itemDate = new Date(item.date);
      return item.type === 'expense' && this.isDateInWeek(itemDate, thisWeek);
    });

    const weeklyTotal = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Budget threshold warning (using $500 as example threshold)
    const weeklyBudgetThreshold = 500;
    if (weeklyTotal > weeklyBudgetThreshold * 0.8) {
      recommendations.push({
        id: 'weekly-budget-warning',
        type: 'budget',
        title: 'Approaching Weekly Budget',
        description: `You're close to your weekly budget. You've spent $${weeklyTotal.toFixed(2)} of $${weeklyBudgetThreshold}.`,
        reasoning: `Your weekly spending of $${weeklyTotal.toFixed(2)} is ${Math.round((weeklyTotal / weeklyBudgetThreshold) * 100)}% of your budget.`,
        confidence: 0.9,
        priority: 'high',
        category: 'budget',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Expires in a week
        action: {
          type: 'navigate',
          target: '/budget'
        }
      });
    }

    // Spending pattern recommendation
    const spendingInsight = insights.find(i => i.type === 'spending_trend');
    if (spendingInsight && spendingInsight.severity === 'medium') {
      recommendations.push({
        id: 'review-spending',
        type: 'budget',
        title: 'Review Recent Spending',
        description: 'Your spending patterns suggest a review would be beneficial.',
        reasoning: spendingInsight.description,
        confidence: 0.7,
        priority: 'medium',
        category: 'budget',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        action: {
          type: 'navigate',
          target: '/budget'
        }
      });
    }

    return recommendations;
  }

  /**
   * Generate focus-related recommendations
   */
  private static generateFocusRecommendations(context: IntelligenceContext, insights: SmartInsight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { tasks } = context;

    // High priority tasks recommendation
    const highPriorityTasks = tasks.filter(task => !task.completed && task.priority === 'high');
    if (highPriorityTasks.length > 0) {
      recommendations.push({
        id: 'focus-high-priority',
        type: 'focus',
        title: 'Focus on High Priority Tasks',
        description: `You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} that need attention.`,
        reasoning: `High-priority tasks should be tackled first to maintain momentum.`,
        confidence: 0.8,
        priority: 'high',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        action: {
          type: 'navigate',
          target: '/tasks'
        }
      });
    }

    // Focus overload recommendation
    const focusInsight = insights.find(i => i.type === 'focus_overload');
    if (focusInsight) {
      recommendations.push({
        id: 'reduce-focus-load',
        type: 'focus',
        title: 'Reduce Focus Load',
        description: 'Consider breaking down large tasks or reassessing priorities.',
        reasoning: focusInsight.description,
        confidence: 0.7,
        priority: 'medium',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
      });
    }

    // Task completion pattern recommendation
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    if (completedTasks.length >= 5) {
      const completionHours = completedTasks.map(task => new Date(task.completedAt!).getHours());
      const morningCompletions = completionHours.filter(hour => hour >= 6 && hour <= 12).length;
      const completionRatio = morningCompletions / completedTasks.length;

      if (completionRatio > 0.6) {
        recommendations.push({
          id: 'morning-task-pattern',
          type: 'focus',
          title: 'You Complete Tasks Earlier in the Day',
          description: 'You tend to complete tasks earlier in the day. Schedule important work in the morning.',
          reasoning: `${Math.round(completionRatio * 100)}% of your completed tasks were finished before noon.`,
          confidence: completionRatio,
          priority: 'low',
          category: 'tasks',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate planning-related recommendations
   */
  private static generatePlanningRecommendations(context: IntelligenceContext, insights: SmartInsight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Planning gap recommendation
    const planningInsight = insights.find(i => i.type === 'planning_gap');
    if (planningInsight) {
      recommendations.push({
        id: 'improve-planning',
        type: 'planning',
        title: 'Improve Task Planning',
        description: 'Adding due dates and timelines to tasks can improve focus and completion rates.',
        reasoning: planningInsight.description,
        confidence: 0.6,
        priority: 'low',
        category: 'tasks',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        action: {
          type: 'navigate',
          target: '/tasks'
        }
      });
    }

    // Meal planning recommendation
    const { meals } = context;
    const plannedMeals = meals.filter(meal => meal.planned);
    const planningRatio = plannedMeals.length / Math.max(meals.length, 1);

    if (meals.length >= 7 && planningRatio < 0.5) {
      recommendations.push({
        id: 'meal-planning',
        type: 'planning',
        title: 'Plan More Meals',
        description: 'Meal planning can reduce daily stress and improve nutrition.',
        reasoning: `Only ${Math.round(planningRatio * 100)}% of your meals are planned.`,
        confidence: 0.7,
        priority: 'low',
        category: 'meals',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        action: {
          type: 'navigate',
          target: '/meals'
        }
      });
    }

    return recommendations;
  }

  /**
   * Generate routine-related recommendations
   */
  private static generateRoutineRecommendations(context: IntelligenceContext, patterns: Pattern[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { userPreferences } = context;

    // Consistency routine recommendation
    const consistencyPattern = patterns.find(p => p.type === 'consistency' && p.confidence < 0.5);
    if (consistencyPattern) {
      recommendations.push({
        id: 'build-consistency-routine',
        type: 'routine',
        title: 'Build Consistency Routine',
        description: 'Establish a simple daily routine to improve momentum consistency.',
        reasoning: 'Your momentum patterns show room for improvement in consistency.',
        confidence: 0.6,
        priority: 'medium',
        category: 'routines',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Work hours routine recommendation
    const currentHour = context.hourOfDay;
    const { workHours } = userPreferences;
    
    if (currentHour >= workHours.start && currentHour <= workHours.end) {
      const activeWorkTasks = context.tasks.filter(task => 
        !task.completed && 
        task.category && 
        ['work', 'career', 'business'].includes(task.category.toLowerCase())
      );

      if (activeWorkTasks.length > 0) {
        recommendations.push({
          id: 'work-hours-focus',
          type: 'routine',
          title: 'Work Hours Focus Time',
          description: `You have ${activeWorkTasks.length} work-related tasks to handle during work hours.`,
          reasoning: `It's currently your designated work time (${workHours.start}:00 - ${workHours.end}:00).`,
          confidence: 0.8,
          priority: 'medium',
          category: 'routines',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (workHours.end - currentHour) * 60 * 60 * 1000).toISOString()
        });
      }
    }

    return recommendations;
  }

  /**
   * Helper function to get current week
   */
  private static getCurrentWeek(): { start: Date; end: Date } {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { start: startOfWeek, end: endOfWeek };
  }

  /**
   * Helper function to check if date is in week
   */
  private static isDateInWeek(date: Date, week: { start: Date; end: Date }): boolean {
    return date >= week.start && date <= week.end;
  }
}
