/**
 * Seeded Content Generator
 * 
 * Deterministic generator that creates contextual starter content
 * based on onboarding selections. Ensures immediate momentum for new users.
 */

import type {
  OnboardingData,
  FocusArea,
  DailyCadence,
} from '../types/onboarding.types';
import type {
  SeededContentPackage,
  SeededTask,
  SeededRoutine,
  SeededFocusSession,
  SeededInsight,
  MomentumMilestone,
  DashboardEvolutionState,
  FirstSessionState,
  SeedingConfig,
  SeedingResult,
} from '../types/seededExperience.types';

/**
 * Deterministic seeded content generator
 * Creates contextual starter content without randomness
 */
export class SeededContentGenerator {
  private data: Partial<OnboardingData>;
  private config: SeedingConfig;
  private seedDate: string;

  constructor(data: Partial<OnboardingData>, config?: Partial<SeedingConfig>) {
    this.data = data;
    const dateStr = new Date().toISOString();
    this.seedDate = dateStr.split('T')[0] ?? dateStr.slice(0, 10); // YYYY-MM-DD
    this.config = {
      taskCount: 5,
      routineCount: 2,
      focusSessionCount: 1,
      insightCount: 4,
      includeFirstWinTask: true,
      includeStarterRoutines: true,
      includeSampleInsights: true,
      ...config,
    };
  }

  /**
   * Generate complete seeded content package
   */
  generate(): SeedingResult {
    try {
      const contentPackage: SeededContentPackage = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        onboardingData: this.data,
        tasks: this.generateTasks(),
        routines: this.generateRoutines(),
        focusSessions: this.generateFocusSessions(),
        insights: this.generateInsights(),
        firstWinTask: this.config.includeFirstWinTask
          ? this.generateFirstWinTask()
          : null,
        momentumMilestones: this.generateMomentumMilestones(),
        dashboardState: this.generateDashboardState(),
      };

      const firstSessionState = this.generateFirstSessionState();

      return {
        success: true,
        contentPackage,
        firstSessionState,
      };
    } catch (error) {
      return {
        success: false,
        contentPackage: null,
        firstSessionState: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate seeded tasks based on focus areas and goals
   */
  private generateTasks(): SeededTask[] {
    const tasks: SeededTask[] = [];
    const focusAreas = this.data.primaryFocusAreas || [];
    const goals = this.data.productivityGoals || [];

    // Generate tasks based on focus areas
    focusAreas.forEach((area, index) => {
      const areaTasks = this.getTasksForFocusArea(area, index);
      tasks.push(...areaTasks);
    });

    // Generate tasks based on goals
    goals.forEach((goal, index) => {
      const goalTasks = this.getTasksForGoal(goal, focusAreas.length + index);
      tasks.push(...goalTasks);
    });

    // Ensure we have at least some tasks
    if (tasks.length === 0) {
      tasks.push(...this.getDefaultTasks());
    }

    return tasks.slice(0, this.config.taskCount);
  }

  /**
   * Get tasks specific to a focus area
   */
  private getTasksForFocusArea(area: FocusArea, seedIndex: number): SeededTask[] {
    const taskMap: Record<FocusArea, SeededTask[]> = {
      work: [
        {
          id: this.generateId(`task-work-${seedIndex}-1`),
          title: 'Review today\'s priorities',
          category: 'Work & Career',
          priority: 'high',
          date: this.seedDate,
          time: '09:00',
          notes: 'Identify your top 3 most important tasks for today',
          estimatedDuration: 10,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'work',
          isDeletable: true,
          completionReward: 'Great start! You\'ve set your direction for the day.',
        },
        {
          id: this.generateId(`task-work-${seedIndex}-2`),
          title: 'Schedule focus time for deep work',
          category: 'Work & Career',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Block 60-90 minutes for your most important task',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'work',
          isDeletable: true,
        },
      ],
      health: [
        {
          id: this.generateId(`task-health-${seedIndex}-1`),
          title: 'Schedule movement or exercise',
          category: 'Health & Wellness',
          priority: 'high',
          date: this.seedDate,
          time: this.getOptimalTime('health'),
          notes: 'Even 20 minutes of movement boosts energy and focus',
          estimatedDuration: 30,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'health',
          isDeletable: true,
          completionReward: 'Excellent! Movement fuels your momentum.',
        },
        {
          id: this.generateId(`task-health-${seedIndex}-2`),
          title: 'Prepare a healthy meal',
          category: 'Health & Wellness',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Plan and prep at least one nutritious meal today',
          estimatedDuration: 20,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'health',
          isDeletable: true,
        },
      ],
      budgeting: [
        {
          id: this.generateId(`task-budget-${seedIndex}-1`),
          title: 'Review today\'s spending',
          category: 'Finances',
          priority: 'high',
          date: this.seedDate,
          time: '20:00',
          notes: 'Quick check of expenses to stay on track',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'budgeting',
          isDeletable: true,
          completionReward: 'Financial awareness builds confidence.',
        },
        {
          id: this.generateId(`task-budget-${seedIndex}-2`),
          title: 'Update budget tracker',
          category: 'Finances',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Log any expenses and review against your budget',
          estimatedDuration: 10,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'budgeting',
          isDeletable: true,
        },
      ],
      routines: [
        {
          id: this.generateId(`task-routine-${seedIndex}-1`),
          title: 'Complete morning routine',
          category: 'Home & Household',
          priority: 'high',
          date: this.seedDate,
          time: this.getOptimalTime('routines'),
          notes: 'Follow your morning ritual to start with intention',
          estimatedDuration: 15,
          isSeeded: true,
          seedType: 'routine',
          sourceFocusArea: 'routines',
          isDeletable: true,
          completionReward: 'Morning momentum activated!',
        },
        {
          id: this.generateId(`task-routine-${seedIndex}-2`),
          title: 'Plan tomorrow\'s schedule',
          category: 'Home & Household',
          priority: 'medium',
          date: this.seedDate,
          time: '21:00',
          notes: 'Set your top priorities for tomorrow',
          estimatedDuration: 10,
          isSeeded: true,
          seedType: 'routine',
          sourceFocusArea: 'routines',
          isDeletable: true,
        },
      ],
      relationships: [
        {
          id: this.generateId(`task-rel-${seedIndex}-1`),
          title: 'Reach out to someone important',
          category: 'Family & Relationships',
          priority: 'high',
          date: this.seedDate,
          notes: 'Send a message or schedule a call',
          estimatedDuration: 10,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'relationships',
          isDeletable: true,
          completionReward: 'Connection strengthens your foundation.',
        },
        {
          id: this.generateId(`task-rel-${seedIndex}-2`),
          title: 'Schedule quality time',
          category: 'Family & Relationships',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Block time for meaningful interaction',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'relationships',
          isDeletable: true,
        },
      ],
      learning: [
        {
          id: this.generateId(`task-learn-${seedIndex}-1`),
          title: 'Dedicate 30 minutes to learning',
          category: 'Career Development',
          priority: 'high',
          date: this.seedDate,
          time: this.getOptimalTime('learning'),
          notes: 'Read, watch, or practice something new',
          estimatedDuration: 30,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'learning',
          isDeletable: true,
          completionReward: 'Growth fuels momentum.',
        },
        {
          id: this.generateId(`task-learn-${seedIndex}-2`),
          title: 'Review and reflect on learning',
          category: 'Career Development',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Note key insights from your learning session',
          estimatedDuration: 10,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'learning',
          isDeletable: true,
        },
      ],
      creativity: [
        {
          id: this.generateId(`task-create-${seedIndex}-1`),
          title: 'Start a creative project',
          category: 'Career Development',
          priority: 'high',
          date: this.seedDate,
          time: this.getOptimalTime('creativity'),
          notes: 'Begin something you\'ve been meaning to create',
          estimatedDuration: 45,
          isSeeded: true,
          seedType: 'example',
          sourceFocusArea: 'creativity',
          isDeletable: true,
          completionReward: 'Creative momentum unleashed!',
        },
        {
          id: this.generateId(`task-create-${seedIndex}-2`),
          title: 'Capture creative ideas',
          category: 'Career Development',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Write down any ideas that come to mind',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'creativity',
          isDeletable: true,
        },
      ],
    };

    return taskMap[area] || [];
  }

  /**
   * Get tasks based on productivity goals
   */
  private getTasksForGoal(goal: string, seedIndex: number): SeededTask[] {
    const goalTasks: Record<string, SeededTask[]> = {
      reduce_stress: [
        {
          id: this.generateId(`task-stress-${seedIndex}`),
          title: 'Take a 5-minute mindfulness break',
          category: 'Health & Wellness',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Pause, breathe, and reset',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'health',
          isDeletable: true,
        },
      ],
      build_consistency: [
        {
          id: this.generateId(`task-consistency-${seedIndex}`),
          title: 'Review completed habits',
          category: 'Home & Household',
          priority: 'high',
          date: this.seedDate,
          notes: 'Check off what you\'ve accomplished today',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'routines',
          isDeletable: true,
        },
      ],
      save_money: [
        {
          id: this.generateId(`task-savings-${seedIndex}`),
          title: 'Identify one saving opportunity',
          category: 'Finances',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Find one small expense to reduce or eliminate',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'budgeting',
          isDeletable: true,
        },
      ],
      improve_health: [
        {
          id: this.generateId(`task-healthgoal-${seedIndex}`),
          title: 'Drink water throughout the day',
          category: 'Health & Wellness',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Set a goal for daily water intake',
          estimatedDuration: 1,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'health',
          isDeletable: true,
        },
      ],
      be_more_productive: [
        {
          id: this.generateId(`task-productivity-${seedIndex}`),
          title: 'Identify your top 3 priorities',
          category: 'Career Development',
          priority: 'high',
          date: this.seedDate,
          notes: 'Focus on what matters most today',
          estimatedDuration: 5,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'work',
          isDeletable: true,
        },
      ],
      stay_organized: [
        {
          id: this.generateId(`task-organized-${seedIndex}`),
          title: 'Quick inbox zero',
          category: 'Errands & Life Admin',
          priority: 'medium',
          date: this.seedDate,
          notes: 'Clear and organize your digital or physical inbox',
          estimatedDuration: 15,
          isSeeded: true,
          seedType: 'suggested',
          sourceFocusArea: 'routines',
          isDeletable: true,
        },
      ],
    };

    return goalTasks[goal] || [];
  }

  /**
   * Get default tasks when no focus areas selected
   */
  private getDefaultTasks(): SeededTask[] {
    return [
      {
        id: this.generateId('task-default-1'),
        title: 'Set your top 3 priorities for today',
        category: 'Career Development',
        priority: 'high',
        date: this.seedDate,
        time: '09:00',
        notes: 'What are the 3 most important things to accomplish today?',
        estimatedDuration: 10,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'work',
        isDeletable: true,
        completionReward: 'Perfect! You\'ve set your direction for the day.',
      },
      {
        id: this.generateId('task-default-2'),
        title: 'Take a mindful break',
        category: 'Health & Wellness',
        priority: 'medium',
        date: this.seedDate,
        notes: 'Pause for 5 minutes to breathe and reset',
        estimatedDuration: 5,
        isSeeded: true,
        seedType: 'suggested',
        sourceFocusArea: 'health',
        isDeletable: true,
      },
      {
        id: this.generateId('task-default-3'),
        title: 'Plan tomorrow\'s schedule',
        category: 'Home & Household',
        priority: 'medium',
        date: this.seedDate,
        time: '21:00',
        notes: 'End your day with clarity for tomorrow',
        estimatedDuration: 10,
        isSeeded: true,
        seedType: 'routine',
        sourceFocusArea: 'routines',
        isDeletable: true,
      },
    ];
  }

  /**
   * Generate the first win task - simple, quick, rewarding
   */
  private generateFirstWinTask(): SeededTask {
    const focusAreas = this.data.primaryFocusAreas || [];
    const primaryArea = (focusAreas[0] || 'work') as FocusArea;

    const firstWinTasks: Record<FocusArea, SeededTask> = {
      work: {
        id: this.generateId('first-win'),
        title: 'Set today\'s top priority',
        category: 'Career Development',
        priority: 'high',
        date: this.seedDate,
        notes: 'Choose one meaningful goal for today',
        estimatedDuration: 2,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'work',
        isDeletable: false,
        completionReward: '🎯 First momentum win achieved! Great start.',
      },
      health: {
        id: this.generateId('first-win'),
        title: 'Drink a glass of water',
        category: 'Health & Wellness',
        priority: 'high',
        date: this.seedDate,
        notes: 'Start your day hydrated',
        estimatedDuration: 1,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'health',
        isDeletable: false,
        completionReward: '💧 Hydrated and ready! First momentum win.',
      },
      budgeting: {
        id: this.generateId('first-win'),
        title: 'Note today\'s budget',
        category: 'Finances',
        priority: 'high',
        date: this.seedDate,
        notes: 'Set a spending intention for today',
        estimatedDuration: 2,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'budgeting',
        isDeletable: false,
        completionReward: '💰 Financial awareness activated! First win.',
      },
      routines: {
        id: this.generateId('first-win'),
        title: 'Plan your morning routine',
        category: 'Home & Household',
        priority: 'high',
        date: this.seedDate,
        notes: 'Choose 3 simple steps for tomorrow morning',
        estimatedDuration: 3,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'routines',
        isDeletable: false,
        completionReward: '⏰ Routine momentum started! First win.',
      },
      relationships: {
        id: this.generateId('first-win'),
        title: 'Send a thoughtful message',
        category: 'Family & Relationships',
        priority: 'high',
        date: this.seedDate,
        notes: 'Reach out to someone you care about',
        estimatedDuration: 3,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'relationships',
        isDeletable: false,
        completionReward: '💙 Connection established! First momentum win.',
      },
      learning: {
        id: this.generateId('first-win'),
        title: 'Choose one thing to learn today',
        category: 'Career Development',
        priority: 'high',
        date: this.seedDate,
        notes: 'Pick a topic, article, or video',
        estimatedDuration: 2,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'learning',
        isDeletable: false,
        completionReward: '📚 Growth mindset activated! First win.',
      },
      creativity: {
        id: this.generateId('first-win'),
        title: 'Capture one creative idea',
        category: 'Career Development',
        priority: 'high',
        date: this.seedDate,
        notes: 'Write down any idea that comes to mind',
        estimatedDuration: 2,
        isSeeded: true,
        seedType: 'first_win',
        sourceFocusArea: 'creativity',
        isDeletable: false,
        completionReward: '✨ Creative spark captured! First win.',
      },
    };

    return firstWinTasks[primaryArea];
  }

  /**
   * Generate seeded routines based on daily cadence
   */
  private generateRoutines(): SeededRoutine[] {
    if (!this.config.includeStarterRoutines) return [];

    const routines: SeededRoutine[] = [];
    const cadence = this.data.dailyCadence || 'throughout_day';
    const focusAreas = this.data.primaryFocusAreas || [];

    // Morning routine
    if (cadence === 'morning_person' || cadence === 'throughout_day') {
      routines.push(this.generateMorningRoutine(focusAreas));
    }

    // Evening routine
    if (cadence === 'evening_person' || cadence === 'throughout_day') {
      routines.push(this.generateEveningRoutine(focusAreas));
    }

    // Weekly routine
    if (cadence === 'weekly_planner') {
      routines.push(this.generateWeeklyRoutine(focusAreas));
    }

    return routines.slice(0, this.config.routineCount);
  }

  private generateMorningRoutine(focusAreas: FocusArea[]): SeededRoutine {
    return {
      id: this.generateId('routine-morning'),
      name: 'Morning Momentum',
      description: 'Start your day with intention and clarity',
      type: 'morning',
      frequency: 'daily',
      estimatedDuration: 15,
      steps: [
        {
          id: this.generateId('routine-morning-step-1'),
          title: 'Review today\'s focus',
          description: 'Check your top priorities for today',
          order: 1,
          estimatedDuration: 5,
          isOptional: false,
          category: 'planning',
        },
        {
          id: this.generateId('routine-morning-step-2'),
          title: 'Set 3 main goals',
          description: 'Identify the 3 most important tasks',
          order: 2,
          estimatedDuration: 5,
          isOptional: false,
          category: 'planning',
        },
        {
          id: this.generateId('routine-morning-step-3'),
          title: 'Quick energy check',
          description: 'Note your current energy level',
          order: 3,
          estimatedDuration: 2,
          isOptional: true,
          category: 'reflection',
        },
        {
          id: this.generateId('routine-morning-step-4'),
          title: 'Schedule first focus block',
          description: 'Block time for your most important task',
          order: 4,
          estimatedDuration: 3,
          isOptional: false,
          category: 'focus',
        },
      ],
      isSeeded: true,
      sourceFocusArea: focusAreas[0] || 'routines',
      isDeletable: true,
      isCustomizable: true,
    };
  }

  private generateEveningRoutine(focusAreas: FocusArea[]): SeededRoutine {
    return {
      id: this.generateId('routine-evening'),
      name: 'Evening Wind Down',
      description: 'Reflect and prepare for tomorrow',
      type: 'evening',
      frequency: 'daily',
      estimatedDuration: 10,
      steps: [
        {
          id: this.generateId('routine-evening-step-1'),
          title: 'Review today\'s progress',
          description: 'Check what you accomplished',
          order: 1,
          estimatedDuration: 3,
          isOptional: false,
          category: 'review',
        },
        {
          id: this.generateId('routine-evening-step-2'),
          title: 'Note key learnings',
          description: 'What went well or could improve',
          order: 2,
          estimatedDuration: 3,
          isOptional: true,
          category: 'reflection',
        },
        {
          id: this.generateId('routine-evening-step-3'),
          title: 'Prepare tomorrow',
          description: 'Set your top priorities for tomorrow',
          order: 3,
          estimatedDuration: 4,
          isOptional: false,
          category: 'planning',
        },
      ],
      isSeeded: true,
      sourceFocusArea: focusAreas[0] || 'routines',
      isDeletable: true,
      isCustomizable: true,
    };
  }

  private generateWeeklyRoutine(focusAreas: FocusArea[]): SeededRoutine {
    return {
      id: this.generateId('routine-weekly'),
      name: 'Weekly Reset',
      description: 'Review progress and plan the week ahead',
      type: 'weekly',
      frequency: 'weekly',
      estimatedDuration: 30,
      steps: [
        {
          id: this.generateId('routine-weekly-step-1'),
          title: 'Review last week',
          description: 'Assess accomplishments and challenges',
          order: 1,
          estimatedDuration: 8,
          isOptional: false,
          category: 'review',
        },
        {
          id: this.generateId('routine-weekly-step-2'),
          title: 'Set weekly goals',
          description: 'Define 3-5 key objectives',
          order: 2,
          estimatedDuration: 10,
          isOptional: false,
          category: 'planning',
        },
        {
          id: this.generateId('routine-weekly-step-3'),
          title: 'Schedule focus blocks',
          description: 'Block time for important work',
          order: 3,
          estimatedDuration: 7,
          isOptional: false,
          category: 'focus',
        },
        {
          id: this.generateId('routine-weekly-step-4'),
          title: 'Review commitments',
          description: 'Check and adjust existing commitments',
          order: 4,
          estimatedDuration: 5,
          isOptional: true,
          category: 'review',
        },
      ],
      isSeeded: true,
      sourceFocusArea: focusAreas[0] || 'routines',
      isDeletable: true,
      isCustomizable: true,
    };
  }

  /**
   * Generate seeded focus sessions
   */
  private generateFocusSessions(): SeededFocusSession[] {
    if (this.config.focusSessionCount === 0) return [];

    const sessions: SeededFocusSession[] = [];
    const focusAreas = this.data.primaryFocusAreas || ['work'];
    const primaryArea = focusAreas[0] ?? 'work';
    const cadence = this.data.dailyCadence || 'throughout_day';

    // Generate one focus session for the primary focus area
    const session = this.generateFocusSession(primaryArea as FocusArea, cadence);
    sessions.push(session);

    return sessions;
  }

  private generateFocusSession(
    focusArea: FocusArea,
    cadence: DailyCadence,
  ): SeededFocusSession {
    const optimalTime = this.getOptimalFocusTime(cadence);
    const duration = this.getOptimalFocusDuration(focusArea);

    const sessionData: Record<FocusArea, { title: string; description: string }> =
      {
        work: {
          title: 'Deep Work Session',
          description: 'Focused time for your most important task',
        },
        health: {
          title: 'Wellness Focus',
          description: 'Dedicated time for health activities',
        },
        budgeting: {
          title: 'Financial Planning',
          description: 'Time to review and plan finances',
        },
        routines: {
          title: 'Routine Building',
          description: 'Focus on establishing habits',
        },
        relationships: {
          title: 'Connection Time',
          description: 'Dedicated time for relationships',
        },
        learning: {
          title: 'Learning Session',
          description: 'Focused time for learning and growth',
        },
        creativity: {
          title: 'Creative Flow',
          description: 'Uninterrupted creative time',
        },
      };

    const data = sessionData[focusArea] ?? sessionData.work;

    const startTime = new Date();
    const [hours, minutes] = optimalTime.split(':').map(Number);
    startTime.setHours(hours ?? 10, minutes ?? 0, 0, 0);

    const endTime = new Date(startTime.getTime() + (duration ?? 45) * 60 * 1000);

    return {
      id: this.generateId('focus-session'),
      title: data.title,
      description: data.description,
      scheduledStart: startTime.toISOString(),
      scheduledEnd: endTime.toISOString(),
      duration,
      focusArea,
      isSeeded: true,
      isReschedulable: true,
      suggestedTime: optimalTime,
    };
  }

  /**
   * Generate seeded insights
   */
  private generateInsights(): SeededInsight[] {
    if (!this.config.includeSampleInsights) return [];

    const insights: SeededInsight[] = [];
    const focusAreas = this.data.primaryFocusAreas || [];
    const goals = this.data.productivityGoals || [];

    // Generate insights based on focus areas
    focusAreas.forEach((area, index) => {
      const areaInsights = this.getInsightsForFocusArea(area, index);
      insights.push(...areaInsights);
    });

    // Generate insights based on goals
    goals.forEach((goal, index) => {
      const goalInsights = this.getInsightsForGoal(goal, focusAreas.length + index);
      insights.push(...goalInsights);
    });

    // Ensure we have at least some insights
    if (insights.length === 0) {
      insights.push(...this.getDefaultInsights());
    }

    // Mark first insight to show immediately
    if (insights.length > 0) {
      insights[0]!.showImmediately = true;
    }

    return insights.slice(0, this.config.insightCount);
  }

  private getInsightsForFocusArea(area: FocusArea, seedIndex: number): SeededInsight[] {
    const insightMap: Record<FocusArea, SeededInsight[]> = {
      work: [
        {
          id: this.generateId(`insight-work-${seedIndex}-1`),
          type: 'tip',
          title: 'Focus Time Optimization',
          content:
            'Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.',
          relevantTo: ['work'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-work-${seedIndex}-2`),
          type: 'recommendation',
          title: 'Daily Prioritization',
          content: 'Start each day by identifying your top 3 most important tasks.',
          relevantTo: ['work'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      health: [
        {
          id: this.generateId(`insight-health-${seedIndex}-1`),
          type: 'tip',
          title: 'Hydration Reminder',
          content:
            'Drink water regularly throughout the day to maintain energy and focus.',
          relevantTo: ['health'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-health-${seedIndex}-2`),
          type: 'motivation',
          title: 'Progress Over Perfection',
          content:
            'Small, consistent health choices lead to significant long-term results.',
          relevantTo: ['health'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      budgeting: [
        {
          id: this.generateId(`insight-budget-${seedIndex}-1`),
          type: 'tip',
          title: 'Daily Budget Check',
          content:
            'Review your spending each evening to stay on track with your financial goals.',
          relevantTo: ['budgeting'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-budget-${seedIndex}-2`),
          type: 'recommendation',
          title: '50/30/20 Rule',
          content:
            'Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.',
          relevantTo: ['budgeting'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      routines: [
        {
          id: this.generateId(`insight-routine-${seedIndex}-1`),
          type: 'tip',
          title: 'Habit Stacking',
          content:
            'Link new habits to existing ones to make them easier to maintain.',
          relevantTo: ['routines'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-routine-${seedIndex}-2`),
          type: 'motivation',
          title: 'Consistency Creates Momentum',
          content:
            'Small daily actions compound into significant progress over time.',
          relevantTo: ['routines'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      relationships: [
        {
          id: this.generateId(`insight-rel-${seedIndex}-1`),
          type: 'tip',
          title: 'Quality Over Quantity',
          content:
            'Focus on meaningful interactions rather than trying to connect with everyone.',
          relevantTo: ['relationships'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-rel-${seedIndex}-2`),
          type: 'recommendation',
          title: 'Scheduled Connection',
          content:
            'Block specific time for important relationships to ensure they get attention.',
          relevantTo: ['relationships'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      learning: [
        {
          id: this.generateId(`insight-learn-${seedIndex}-1`),
          type: 'tip',
          title: 'Active Recall',
          content:
            'Test yourself on what you\'ve learned rather than just re-reading material.',
          relevantTo: ['learning'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-learn-${seedIndex}-2`),
          type: 'motivation',
          title: 'Growth Mindset',
          content:
            'View challenges as opportunities to learn and improve, not as failures.',
          relevantTo: ['learning'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
      creativity: [
        {
          id: this.generateId(`insight-create-${seedIndex}-1`),
          type: 'tip',
          title: 'Capture Ideas Immediately',
          content:
            'Keep a simple system to capture ideas as they come, before they fade.',
          relevantTo: ['creativity'],
          isSeeded: true,
          priority: 0.9,
          showImmediately: false,
        },
        {
          id: this.generateId(`insight-create-${seedIndex}-2`),
          type: 'motivation',
          title: 'Embrace Imperfection',
          content:
            'Start creating before you feel ready. Progress comes from doing, not perfecting.',
          relevantTo: ['creativity'],
          isSeeded: true,
          priority: 0.85,
          showImmediately: false,
        },
      ],
    };

    return insightMap[area] || [];
  }

  private getInsightsForGoal(goal: string, seedIndex: number): SeededInsight[] {
    const goalInsights: Record<string, SeededInsight[]> = {
      reduce_stress: [
        {
          id: this.generateId(`insight-stress-${seedIndex}`),
          type: 'tip',
          title: 'Mindful Moments',
          content:
            'Take 3 deep breaths when feeling overwhelmed to reset your mental state.',
          relevantTo: ['work', 'health', 'routines'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
      build_consistency: [
        {
          id: this.generateId(`insight-consistency-${seedIndex}`),
          type: 'motivation',
          title: 'The Compound Effect',
          content:
            'Small daily improvements lead to staggering results over time.',
          relevantTo: ['routines', 'health'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
      save_money: [
        {
          id: this.generateId(`insight-savings-${seedIndex}`),
          type: 'tip',
          title: 'Track Small Expenses',
          content:
            'Small daily purchases add up. Track them to identify saving opportunities.',
          relevantTo: ['budgeting'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
      improve_health: [
        {
          id: this.generateId(`insight-healthgoal-${seedIndex}`),
          type: 'recommendation',
          title: 'Start Small',
          content:
            'Begin with health habits so small they feel easy. Build from there.',
          relevantTo: ['health'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
      be_more_productive: [
        {
          id: this.generateId(`insight-productivity-${seedIndex}`),
          type: 'tip',
          title: 'Eat the Frog',
          content:
            'Tackle your most challenging task first when your energy is highest.',
          relevantTo: ['work'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
      stay_organized: [
        {
          id: this.generateId(`insight-organized-${seedIndex}`),
          type: 'recommendation',
          title: 'One Touch Rule',
          content:
            'Handle each item once. Do it, delegate it, defer it, or delete it.',
          relevantTo: ['routines'],
          isSeeded: true,
          priority: 0.88,
          showImmediately: false,
        },
      ],
    };

    return goalInsights[goal] || [];
  }

  private getDefaultInsights(): SeededInsight[] {
    return [
      {
        id: this.generateId('insight-default-1'),
        type: 'motivation',
        title: 'Start Small',
        content:
          'The key to momentum is starting with actions so small they feel easy.',
        relevantTo: ['routines'],
        isSeeded: true,
        priority: 0.9,
        showImmediately: true,
      },
      {
        id: this.generateId('insight-default-2'),
        type: 'tip',
        title: 'Focus on One Thing',
        content:
          'Choose one priority and give it your full attention. Multitasking reduces effectiveness.',
        relevantTo: ['work'],
        isSeeded: true,
        priority: 0.85,
        showImmediately: false,
      },
    ];
  }

  /**
   * Generate momentum milestones
   */
  private generateMomentumMilestones(): MomentumMilestone[] {
    return [
      {
        id: this.generateId('milestone-first-task'),
        type: 'first_task',
        title: 'First Task Added',
        description: 'Add your first task to begin building momentum',
        isCompleted: false,
        reward: {
          type: 'message',
          content: '🎯 Task added! You\'ve started building momentum.',
          subtle: true,
        },
      },
      {
        id: this.generateId('milestone-first-complete'),
        type: 'first_completion',
        title: 'First Completion',
        description: 'Complete your first task to feel the momentum',
        isCompleted: false,
        reward: {
          type: 'visual',
          content: '✨ First momentum win! Keep the momentum going.',
          subtle: false,
        },
      },
      {
        id: this.generateId('milestone-first-routine'),
        type: 'first_routine',
        title: 'First Routine',
        description: 'Start your first routine to build consistency',
        isCompleted: false,
        reward: {
          type: 'message',
          content: '⏰ Routine started! Consistency creates momentum.',
          subtle: true,
        },
      },
      {
        id: this.generateId('milestone-first-focus'),
        type: 'first_focus',
        title: 'First Focus Session',
        description: 'Complete your first focus session',
        isCompleted: false,
        reward: {
          type: 'message',
          content: '🎯 Focus session complete! Deep work builds momentum.',
          subtle: true,
        },
      },
      {
        id: this.generateId('milestone-first-planning'),
        type: 'first_planning',
        title: 'First Planning',
        description: 'Complete your first planning ritual',
        isCompleted: false,
        reward: {
          type: 'unlock',
          content: '📋 Planning complete! You\'ve unlocked insights.',
          subtle: true,
        },
      },
    ];
  }

  /**
   * Generate dashboard evolution state
   */
  private generateDashboardState(): DashboardEvolutionState {
    const planningStyle = this.data.planningStyle || 'minimal';

    return {
      currentStage: 'seeded',
      milestones: [
        {
          id: this.generateId('dash-milestone-1'),
          type: 'first_task_added',
          title: 'First Task Added',
          achievedAt: undefined,
          visualChange: {
            showProgressCard: true,
            showMomentumRing: false,
            showInsightsCard: false,
            showRoutinesCard: false,
            compactMode: planningStyle === 'minimal',
          },
        },
        {
          id: this.generateId('dash-milestone-2'),
          type: 'first_task_completed',
          title: 'First Task Completed',
          achievedAt: undefined,
          visualChange: {
            showProgressCard: true,
            showMomentumRing: true,
            showInsightsCard: true,
            showRoutinesCard: false,
            compactMode: planningStyle === 'minimal',
          },
        },
        {
          id: this.generateId('dash-milestone-3'),
          type: 'first_routine_started',
          title: 'First Routine Started',
          achievedAt: undefined,
          visualChange: {
            showProgressCard: true,
            showMomentumRing: true,
            showInsightsCard: true,
            showRoutinesCard: true,
            compactMode: false,
          },
        },
        {
          id: this.generateId('dash-milestone-4'),
          type: 'first_focus_completed',
          title: 'First Focus Session Completed',
          achievedAt: undefined,
          visualChange: {
            showProgressCard: true,
            showMomentumRing: true,
            showInsightsCard: true,
            showRoutinesCard: true,
            compactMode: false,
          },
        },
      ],
      showCelebration: false,
    };
  }

  /**
   * Generate first session state
   */
  private generateFirstSessionState(): FirstSessionState {
    return {
      isActive: true,
      startedAt: new Date().toISOString(),
      currentStep: 0,
      steps: [
        {
          id: this.generateId('first-session-step-1'),
          title: 'Explore your dashboard',
          description: 'Take a moment to familiarize yourself with the interface',
          isCompleted: false,
          action: 'view_dashboard',
          required: false,
        },
        {
          id: this.generateId('first-session-step-2'),
          title: 'Complete your first task',
          description: 'Mark your first task as complete to feel the momentum',
          isCompleted: false,
          action: 'complete_task',
          required: true,
        },
        {
          id: this.generateId('first-session-step-3'),
          title: 'Start a routine',
          description: 'Begin your first routine to build consistency',
          isCompleted: false,
          action: 'start_routine',
          required: false,
        },
        {
          id: this.generateId('first-session-step-4'),
          title: 'View your insights',
          description: 'Check your personalized insights and recommendations',
          isCompleted: false,
          action: 'view_insights',
          required: false,
        },
      ],
      completedAt: null,
      momentumScore: 0,
    };
  }

  /**
   * Helper: Get optimal time based on focus area
   */
  private getOptimalTime(focusArea: string): string {
    const cadence = this.data.dailyCadence || 'throughout_day';

    if (cadence === 'morning_person') {
      return '07:00';
    } else if (cadence === 'evening_person') {
      return '18:00';
    }

    // Default times based on focus area
    const times: Record<string, string> = {
      health: '07:00',
      learning: '09:00',
      creativity: '10:00',
      work: '09:00',
      budgeting: '20:00',
      routines: '08:00',
      relationships: '19:00',
    };

    return times[focusArea] || '09:00';
  }

  /**
   * Helper: Get optimal focus session time
   */
  private getOptimalFocusTime(cadence: DailyCadence): string {
    const times: Record<DailyCadence, string> = {
      morning_person: '09:00',
      evening_person: '14:00',
      throughout_day: '10:00',
      weekly_planner: '10:00',
    };

    return times[cadence] || '10:00';
  }

  /**
   * Helper: Get optimal focus duration
   */
  private getOptimalFocusDuration(focusArea: FocusArea): number {
    const durations: Record<FocusArea, number> = {
      work: 60,
      health: 30,
      budgeting: 30,
      routines: 20,
      relationships: 45,
      learning: 45,
      creativity: 60,
    };

    return durations[focusArea] || 45;
  }

  /**
   * Helper: Generate deterministic ID
   */
  private generateId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}-${timestamp}-${random}`;
  }
}

/**
 * Public API for generating seeded content
 */
export function generateSeededContent(
  onboardingData: Partial<OnboardingData>,
  config?: Partial<SeedingConfig>,
): SeedingResult {
  const generator = new SeededContentGenerator(onboardingData, config);
  return generator.generate();
}
