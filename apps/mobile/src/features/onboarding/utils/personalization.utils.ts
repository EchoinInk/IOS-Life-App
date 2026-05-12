/**
 * Personalization utilities - Generate smart defaults based on onboarding data
 * Creates personalized content, recommendations, and starter data
 */

import type { 
  OnboardingData, 
  PersonalizedDefaults, 
  PreferredModule
} from '../types/onboarding.types';

export class PersonalizationEngine {
  private data: Partial<OnboardingData>;

  constructor(data: Partial<OnboardingData>) {
    this.data = data;
  }

  /**
   * Generate all personalized defaults
   */
  generateDefaults(): PersonalizedDefaults {
    return {
      suggestedTasks: this.generateSuggestedTasks(),
      suggestedRoutines: this.generateSuggestedRoutines(),
      quickActions: this.generateQuickActions(),
      insights: this.generateInsights()
    };
  }

  /**
   * Generate personalized task suggestions based on focus areas and goals
   */
  private generateSuggestedTasks() {
    const tasks: PersonalizedDefaults['suggestedTasks'] = [];
    const focusAreas = this.data.primaryFocusAreas || [];
    const goals = this.data.productivityGoals || [];

    // Work focus tasks
    if (focusAreas.includes('work')) {
      tasks.push(
        {
          title: 'Review today\'s priorities',
          category: 'work',
          priority: 'high'
        },
        {
          title: 'Block focus time for deep work',
          category: 'work',
          priority: 'medium'
        }
      );
    }

    // Health focus tasks
    if (focusAreas.includes('health')) {
      tasks.push(
        {
          title: 'Schedule workout for today',
          category: 'health',
          priority: 'high'
        },
        {
          title: 'Prepare healthy meals',
          category: 'health',
          priority: 'medium'
        }
      );
    }

    // Budgeting focus tasks
    if (focusAreas.includes('budgeting')) {
      tasks.push(
        {
          title: 'Review daily spending',
          category: 'budget',
          priority: 'high'
        },
        {
          title: 'Update budget tracker',
          category: 'budget',
          priority: 'medium'
        }
      );
    }

    // Routine focus tasks
    if (focusAreas.includes('routines')) {
      tasks.push(
        {
          title: 'Complete morning routine',
          category: 'routines',
          priority: 'high'
        },
        {
          title: 'Plan tomorrow\'s schedule',
          category: 'routines',
          priority: 'medium'
        }
      );
    }

    // Goal-based tasks
    if (goals.includes('reduce_stress')) {
      tasks.push({
        title: 'Take a 5-minute mindfulness break',
        category: 'wellness',
        priority: 'medium'
      });
    }

    if (goals.includes('build_consistency')) {
      tasks.push({
        title: 'Check off completed habits',
        category: 'habits',
        priority: 'high'
      });
    }

    return tasks.slice(0, 6); // Limit to 6 tasks
  }

  /**
   * Generate suggested routines based on daily cadence and focus areas
   */
  private generateSuggestedRoutines() {
    const routines: PersonalizedDefaults['suggestedRoutines'] = [];
    const cadence = this.data.dailyCadence || 'throughout_day';
    const focusAreas = this.data.primaryFocusAreas || [];

    // Morning routines
    if (cadence === 'morning_person') {
      routines.push(
        {
          name: 'Morning Planning',
          time: '07:00',
          focusArea: 'routines'
        },
        {
          name: 'Exercise & Movement',
          time: '07:30',
          focusArea: 'health'
        }
      );
    }

    // Evening routines
    if (cadence === 'evening_person') {
      routines.push(
        {
          name: 'Evening Review',
          time: '20:00',
          focusArea: 'routines'
        },
        {
          name: 'Tomorrow Preparation',
          time: '21:00',
          focusArea: 'work'
        }
      );
    }

    // Throughout the day
    if (cadence === 'throughout_day') {
      routines.push(
        {
          name: 'Morning Check-in',
          time: '09:00',
          focusArea: 'routines'
        },
        {
          name: 'Midday Review',
          time: '12:30',
          focusArea: 'routines'
        },
        {
          name: 'Evening Wind-down',
          time: '18:00',
          focusArea: 'routines'
        }
      );
    }

    // Weekly planning
    if (cadence === 'weekly_planner') {
      routines.push(
        {
          name: 'Weekly Review',
          time: 'Sunday 19:00',
          focusArea: 'routines'
        },
        {
          name: 'Week Setup',
          time: 'Monday 08:00',
          focusArea: 'work'
        }
      );
    }

    // Focus area specific routines
    if (focusAreas.includes('health')) {
      routines.push({
        name: 'Health Check-in',
        time: '12:00',
        focusArea: 'health'
      });
    }

    return routines.slice(0, 4); // Limit to 4 routines
  }

  /**
   * Generate quick actions based on preferred modules
   */
  private generateQuickActions() {
    const actions: PersonalizedDefaults['quickActions'] = [];
    const modules = this.data.preferredModules || ['tasks'];

    const moduleActions: Record<PreferredModule, PersonalizedDefaults['quickActions'][0]> = {
      tasks: {
        id: 'quick-task',
        label: 'Add Task',
        icon: '✅',
        module: 'tasks'
      },
      budget: {
        id: 'quick-expense',
        label: 'Add Expense',
        icon: '💳',
        module: 'budget'
      },
      meals: {
        id: 'quick-meal',
        label: 'Plan Meal',
        icon: '🍽️',
        module: 'meals'
      },
      shopping: {
        id: 'quick-shopping',
        label: 'Add Item',
        icon: '🛒',
        module: 'shopping'
      },
      recipes: {
        id: 'quick-recipe',
        label: 'Save Recipe',
        icon: '📖',
        module: 'recipes'
      },
      bills: {
        id: 'quick-bill',
        label: 'Add Bill',
        icon: '📄',
        module: 'bills'
      }
    };

    modules.forEach(module => {
      const action = moduleActions[module];
      if (action) {
        actions.push(action);
      }
    });

    return actions.slice(0, 4); // Limit to 4 quick actions
  }

  /**
   * Generate personalized insights based on focus areas and goals
   */
  private generateInsights() {
    const insights: PersonalizedDefaults['insights'] = [];
    const focusAreas = this.data.primaryFocusAreas || [];
    const goals = this.data.productivityGoals || [];

    // Work focus insights
    if (focusAreas.includes('work')) {
      insights.push(
        {
          type: 'tip',
          title: 'Focus Time Optimization',
          content: 'Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.',
          relevantTo: ['work']
        },
        {
          type: 'recommendation',
          title: 'Daily Prioritization',
          content: 'Start each day by identifying your top 3 most important tasks.',
          relevantTo: ['work']
        }
      );
    }

    // Health focus insights
    if (focusAreas.includes('health')) {
      insights.push(
        {
          type: 'tip',
          title: 'Hydration Reminder',
          content: 'Drink water regularly throughout the day to maintain energy and focus.',
          relevantTo: ['health']
        },
        {
          type: 'motivation',
          title: 'Progress Over Perfection',
          content: 'Small, consistent health choices lead to significant long-term results.',
          relevantTo: ['health']
        }
      );
    }

    // Budgeting focus insights
    if (focusAreas.includes('budgeting')) {
      insights.push(
        {
          type: 'tip',
          title: 'Daily Budget Check',
          content: 'Review your spending each evening to stay on track with your financial goals.',
          relevantTo: ['budgeting']
        },
        {
          type: 'recommendation',
          title: '50/30/20 Rule',
          content: 'Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.',
          relevantTo: ['budgeting']
        }
      );
    }

    // Goal-based insights
    if (goals.includes('reduce_stress')) {
      insights.push(
        {
          type: 'tip',
          title: 'Mindful Moments',
          content: 'Take 3 deep breaths when feeling overwhelmed to reset your mental state.',
          relevantTo: ['work', 'health', 'routines']
        }
      );
    }

    if (goals.includes('build_consistency')) {
      insights.push(
        {
          type: 'motivation',
          title: 'Habit Stacking',
          content: 'Link new habits to existing ones to make them easier to maintain.',
          relevantTo: ['routines', 'health']
        }
      );
    }

    if (goals.includes('save_money')) {
      insights.push(
        {
          type: 'tip',
          title: 'Track Small Expenses',
          content: 'Small daily purchases add up. Track them to identify saving opportunities.',
          relevantTo: ['budgeting']
        }
      );
    }

    return insights.slice(0, 6); // Limit to 6 insights
  }

  /**
   * Get personalized dashboard layout based on planning style
   */
  getDashboardLayout() {
    const planningStyle = this.data.planningStyle || 'minimal';
    const modules = this.data.preferredModules || ['tasks'];

    const layouts = {
      minimal: {
        showCharts: false,
        showDetailedStats: false,
        compactView: true,
        priorityModules: modules.slice(0, 2)
      },
      detailed: {
        showCharts: true,
        showDetailedStats: true,
        compactView: false,
        priorityModules: modules
      },
      visual: {
        showCharts: true,
        showDetailedStats: false,
        compactView: false,
        priorityModules: modules
      },
      time_based: {
        showCharts: false,
        showDetailedStats: true,
        compactView: true,
        priorityModules: modules
      }
    };

    return layouts[planningStyle];
  }

  /**
   * Get personalized welcome message
   */
  getWelcomeMessage() {
    const userName = this.data.userName || 'there';
    const focusAreas = this.data.primaryFocusAreas || [];
    const timeOfDay = this.getTimeOfDay();

    const greetings: Record<string, string> = {
      morning: `Good morning, ${userName}!`,
      afternoon: `Good afternoon, ${userName}!`,
      evening: `Good evening, ${userName}!`
    };

    const baseGreeting = greetings[timeOfDay];

    if (focusAreas.length > 0) {
      const primaryFocus = focusAreas[0];
      const focusMessages: Record<string, string> = {
        work: 'Ready to make today productive?',
        health: 'Let\'s focus on your wellness goals today.',
        budgeting: 'Time to stay on top of your finances.',
        routines: 'Let\'s build some great habits today.',
        relationships: 'How can we strengthen your connections today?',
        learning: 'Ready to learn something new?',
        creativity: 'Let\'s unleash your creative potential!'
      };

      const message = focusMessages[primaryFocus as string];
      if (message) {
        return `${baseGreeting} ${message}`;
      }
    }

    return `${baseGreeting} How can Lumo help you today?`;
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
}

/**
 * Generate personalized defaults for a user
 */
export function generatePersonalizedDefaults(data: Partial<OnboardingData>): PersonalizedDefaults {
  const engine = new PersonalizationEngine(data);
  return engine.generateDefaults();
}

/**
 * Get personalized dashboard layout
 */
export function getPersonalizedDashboardLayout(data: Partial<OnboardingData>) {
  const engine = new PersonalizationEngine(data);
  return engine.getDashboardLayout();
}

/**
 * Get personalized welcome message
 */
export function getPersonalizedWelcomeMessage(data: Partial<OnboardingData>) {
  const engine = new PersonalizationEngine(data);
  return engine.getWelcomeMessage();
}
