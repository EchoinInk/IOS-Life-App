/**
 * Pattern Detection System
 * Detects user patterns in tasks, budget, meals, and momentum data
 */

import type { 
  Pattern, 
  TaskData, 
  BudgetData, 
  MealData, 
  MomentumData,
  IntelligenceContext 
} from './types/intelligence.types';

export class PatternDetector {
  /**
   * Detect all patterns from user data
   */
  static detectPatterns(context: IntelligenceContext): Pattern[] {
    const patterns: Pattern[] = [];

    // Task patterns
    patterns.push(...this.detectTaskPatterns(context.tasks, context));
    
    // Budget patterns
    patterns.push(...this.detectBudgetPatterns(context.budget, context));
    
    // Meal patterns
    patterns.push(...this.detectMealPatterns(context.meals, context));
    
    // Momentum patterns
    patterns.push(...this.detectMomentumPatterns(context.momentum, context));

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Detect task-related patterns
   */
  private static detectTaskPatterns(tasks: TaskData[], _context: IntelligenceContext): Pattern[] {
    const patterns: Pattern[] = [];

    // Time of day completion pattern
    const timePattern = this.detectTaskTimePattern(tasks);
    if (timePattern) patterns.push(timePattern);

    // Day of week pattern
    const dayPattern = this.detectTaskDayPattern(tasks);
    if (dayPattern) patterns.push(dayPattern);

    // Category preference pattern
    const categoryPattern = this.detectTaskCategoryPattern(tasks);
    if (categoryPattern) patterns.push(categoryPattern);

    // Overdue tasks pattern
    const overduePattern = this.detectOverdueTasksPattern(tasks);
    if (overduePattern) patterns.push(overduePattern);

    return patterns;
  }

  /**
   * Detect budget-related patterns
   */
  private static detectBudgetPatterns(budget: BudgetData[], _context: IntelligenceContext): Pattern[] {
    const patterns: Pattern[] = [];

    // Spending trend pattern
    const spendingPattern = this.detectSpendingTrendPattern(budget);
    if (spendingPattern) patterns.push(spendingPattern);

    // Category spending pattern
    const categoryPattern = this.detectBudgetCategoryPattern(budget);
    if (categoryPattern) patterns.push(categoryPattern);

    return patterns;
  }

  /**
   * Detect meal-related patterns
   */
  private static detectMealPatterns(meals: MealData[], _context: IntelligenceContext): Pattern[] {
    const patterns: Pattern[] = [];

    // Meal planning consistency
    const planningPattern = this.detectMealPlanningPattern(meals);
    if (planningPattern) patterns.push(planningPattern);

    // Category preference pattern
    const categoryPattern = this.detectMealCategoryPattern(meals);
    if (categoryPattern) patterns.push(categoryPattern);

    return patterns;
  }

  /**
   * Detect momentum-related patterns
   */
  private static detectMomentumPatterns(momentum: MomentumData[], _context: IntelligenceContext): Pattern[] {
    const patterns: Pattern[] = [];

    // Consistency pattern
    const consistencyPattern = this.detectConsistencyPattern(momentum);
    if (consistencyPattern) patterns.push(consistencyPattern);

    // Trend pattern
    const trendPattern = this.detectMomentumTrendPattern(momentum);
    if (trendPattern) patterns.push(trendPattern);

    return patterns;
  }

  /**
   * Detect task completion time patterns
   */
  private static detectTaskTimePattern(tasks: TaskData[]): Pattern | null {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    if (completedTasks.length < 5) return null;

    const hourCounts: Record<number, number> = {};
    completedTasks.forEach(task => {
      const hour = new Date(task.completedAt!).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const totalTasks = completedTasks.length;
    const threshold = totalTasks * 0.3; // 30% threshold for pattern detection

    for (const [hour, count] of Object.entries(hourCounts)) {
      if (count >= threshold) {
        return {
          id: 'task-time-pattern',
          type: 'time_of_day',
          description: `You tend to complete tasks around ${parseInt(hour)}:00`,
          confidence: count / totalTasks,
          data: {
            pattern: { hour: parseInt(hour), count },
            frequency: count,
            lastSeen: new Date().toISOString()
          },
          category: 'tasks'
        };
      }
    }

    return null;
  }

  /**
   * Detect task day of week patterns
   */
  private static detectTaskDayPattern(tasks: TaskData[]): Pattern | null {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    if (completedTasks.length < 7) return null;

    const dayCounts: Record<number, number> = {};
    completedTasks.forEach(task => {
      const day = new Date(task.completedAt!).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const totalTasks = completedTasks.length;
    const threshold = totalTasks * 0.25; // 25% threshold

    for (const [day, count] of Object.entries(dayCounts)) {
      if (count >= threshold) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
          id: 'task-day-pattern',
          type: 'day_of_week',
          description: `You're most productive on ${dayNames[parseInt(day)]}s`,
          confidence: count / totalTasks,
          data: {
            pattern: { day: parseInt(day), count },
            frequency: count,
            lastSeen: new Date().toISOString()
          },
          category: 'tasks'
        };
      }
    }

    return null;
  }

  /**
   * Detect task category preferences
   */
  private static detectTaskCategoryPattern(tasks: TaskData[]): Pattern | null {
    const tasksWithCategories = tasks.filter(task => task.category);
    if (tasksWithCategories.length < 5) return null;

    const categoryCounts: Record<string, number> = {};
    tasksWithCategories.forEach(task => {
      categoryCounts[task.category!] = (categoryCounts[task.category!] || 0) + 1;
    });

    const totalTasks = tasksWithCategories.length;
    const threshold = totalTasks * 0.4; // 40% threshold

    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count >= threshold) {
        return {
          id: 'task-category-pattern',
          type: 'category_preference',
          description: `You frequently work on ${category} tasks`,
          confidence: count / totalTasks,
          data: {
            pattern: { category, count },
            frequency: count,
            lastSeen: new Date().toISOString()
          },
          category: 'tasks'
        };
      }
    }

    return null;
  }

  /**
   * Detect overdue tasks pattern
   */
  private static detectOverdueTasksPattern(tasks: TaskData[]): Pattern | null {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );

    if (overdueTasks.length === 0) return null;
    if (overdueTasks.length < 2) return null;

    const totalTasks = tasks.length;
    const overdueRatio = overdueTasks.length / totalTasks;

    return {
      id: 'overdue-tasks-pattern',
      type: 'consistency',
      description: `${overdueTasks.length} tasks are overdue`,
      confidence: Math.min(overdueRatio * 2, 1),
      data: {
        pattern: { overdueCount: overdueTasks.length, totalTasks },
        frequency: overdueTasks.length,
        lastSeen: new Date().toISOString()
      },
      category: 'tasks'
    };
  }

  /**
   * Detect spending trend patterns
   */
  private static detectSpendingTrendPattern(budget: BudgetData[]): Pattern | null {
    const expenses = budget.filter(item => item.type === 'expense');
    if (expenses.length < 10) return null;

    // Sort by date
    expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate weekly spending
    const weeklySpending: Record<string, number> = {};
    expenses.forEach(expense => {
      const week = this.getWeekKey(new Date(expense.date));
      weeklySpending[week] = (weeklySpending[week] || 0) + expense.amount;
    });

    const weeks = Object.keys(weeklySpending);
    if (weeks.length < 3) return null;

    // Check for increasing trend
    const recentWeeks = weeks.slice(-3);
    const amounts = recentWeeks.map(week => weeklySpending[week]);
    const isIncreasing = amounts[2] !== undefined && amounts[1] !== undefined && amounts[0] !== undefined &&
      amounts[2] > amounts[1] && amounts[1] > amounts[0];

    if (isIncreasing) {
      return {
        id: 'spending-increasing-pattern',
        type: 'trend',
        description: 'Your spending has been increasing over recent weeks',
        confidence: 0.7,
        data: {
          pattern: { trend: 'increasing', amounts },
          frequency: 3,
          lastSeen: new Date().toISOString()
        },
        category: 'budget'
      };
    }

    return null;
  }

  /**
   * Detect budget category patterns
   */
  private static detectBudgetCategoryPattern(budget: BudgetData[]): Pattern | null {
    const expenses = budget.filter(item => item.type === 'expense');
    if (expenses.length < 5) return null;

    const categoryCounts: Record<string, number> = {};
    const categoryAmounts: Record<string, number> = {};
    
    expenses.forEach(expense => {
      categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + 1;
      categoryAmounts[expense.category] = (categoryAmounts[expense.category] || 0) + expense.amount;
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const threshold = totalExpenses * 0.3; // 30% of total spending

    for (const [category, amount] of Object.entries(categoryAmounts)) {
      if (amount >= threshold) {
        return {
          id: 'budget-category-pattern',
          type: 'category_preference',
          description: `You spend most on ${category}`,
          confidence: amount / totalExpenses,
          data: {
            pattern: { category, amount, count: categoryCounts[category] },
            frequency: categoryCounts[category] || 0,
            lastSeen: new Date().toISOString()
          },
          category: 'budget'
        };
      }
    }

    return null;
  }

  /**
   * Detect meal planning patterns
   */
  private static detectMealPlanningPattern(meals: MealData[]): Pattern | null {
    if (meals.length < 7) return null;

    const plannedMeals = meals.filter(meal => meal.planned);
    const planningRatio = plannedMeals.length / meals.length;

    if (planningRatio < 0.3) {
      return {
        id: 'low-meal-planning-pattern',
        type: 'consistency',
        description: 'You rarely plan meals in advance',
        confidence: 1 - planningRatio,
        data: {
          pattern: { planningRatio, plannedCount: plannedMeals.length },
          frequency: meals.length,
          lastSeen: new Date().toISOString()
        },
        category: 'meals'
      };
    }

    return null;
  }

  /**
   * Detect meal category preferences
   */
  private static detectMealCategoryPattern(meals: MealData[]): Pattern | null {
    const mealsWithCategories = meals.filter(meal => meal.category);
    if (mealsWithCategories.length < 5) return null;

    const categoryCounts: Record<string, number> = {};
    mealsWithCategories.forEach(meal => {
      categoryCounts[meal.category!] = (categoryCounts[meal.category!] || 0) + 1;
    });

    const totalMeals = mealsWithCategories.length;
    const threshold = totalMeals * 0.4; // 40% threshold

    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count >= threshold) {
        return {
          id: 'meal-category-pattern',
          type: 'category_preference',
          description: `You frequently have ${category} meals`,
          confidence: count / totalMeals,
          data: {
            pattern: { category, count },
            frequency: count,
            lastSeen: new Date().toISOString()
          },
          category: 'meals'
        };
      }
    }

    return null;
  }

  /**
   * Detect consistency patterns in momentum
   */
  private static detectConsistencyPattern(momentum: MomentumData[]): Pattern | null {
    if (momentum.length < 7) return null;

    const recentScores = momentum.slice(-7).map(m => m.score);
    const average = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / recentScores.length;
    const consistency = 1 - (variance / 10000); // Normalize to 0-1

    if (consistency < 0.5) {
      return {
        id: 'low-consistency-pattern',
        type: 'consistency',
        description: 'Your momentum has been inconsistent lately',
        confidence: 1 - consistency,
        data: {
          pattern: { consistency, average, variance },
          frequency: recentScores.length,
          lastSeen: new Date().toISOString()
        },
        category: 'tasks' as const
      };
    }

    return null;
  }

  /**
   * Detect momentum trend patterns
   */
  private static detectMomentumTrendPattern(momentum: MomentumData[]): Pattern | null {
    if (momentum.length < 5) return null;

    const recentScores = momentum.slice(-5).map(m => m.score);
    const isIncreasing = recentScores[4] !== undefined && recentScores[3] !== undefined && recentScores[2] !== undefined &&
      recentScores[4] > recentScores[3] && recentScores[3] > recentScores[2];
    const isDecreasing = recentScores[4] !== undefined && recentScores[3] !== undefined && recentScores[2] !== undefined &&
      recentScores[4] < recentScores[3] && recentScores[3] < recentScores[2];

    if (isIncreasing) {
      return {
        id: 'momentum-increasing-pattern',
        type: 'trend',
        description: 'Your momentum has been improving',
        confidence: 0.8,
        data: {
          pattern: { trend: 'increasing', scores: recentScores },
          frequency: recentScores.length,
          lastSeen: new Date().toISOString()
        },
        category: 'tasks' as const
      };
    }

    if (isDecreasing) {
      return {
        id: 'momentum-decreasing-pattern',
        type: 'trend',
        description: 'Your momentum has been declining',
        confidence: 0.8,
        data: {
          pattern: { trend: 'decreasing', scores: recentScores },
          frequency: recentScores.length,
          lastSeen: new Date().toISOString()
        },
        category: 'tasks' as const
      };
    }

    return null;
  }

  /**
   * Helper function to get week key
   */
  private static getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  }
}
