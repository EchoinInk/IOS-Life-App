/**
 * Seeded Experience Integration
 * 
 * Integrates the seeded experience system with the onboarding flow
 * Handles the transition from onboarding to first-session with seeded content
 */

import { useTasksStore } from '@/features/tasks/store/useTasksStore';
import { useFirstSessionStore } from '../store/useFirstSessionStore';
import { useDashboardEvolutionStore } from '../store/useDashboardEvolutionStore';
import type { OnboardingData } from '../types/onboarding.types';
import type { SeededContentPackage, SeededTask } from '../types/seededExperience.types';
import { generateSeededContent } from './seededContentGenerator';

/**
 * Integrates seeded content into the app stores after onboarding completion
 */
export class SeededExperienceIntegrator {
  private onboardingData: Partial<OnboardingData>;

  constructor(onboardingData: Partial<OnboardingData>) {
    this.onboardingData = onboardingData;
  }

  /**
   * Main integration method - generates and applies seeded content
   */
  async integrate(): Promise<{
    success: boolean;
    contentPackage: SeededContentPackage | null;
    error?: string;
  }> {
    try {
      // Generate seeded content
      const result = generateSeededContent(this.onboardingData);

      if (!result.success || !result.contentPackage) {
        return {
          success: false,
          contentPackage: null,
          error: result.error || 'Failed to generate seeded content',
        };
      }

      const contentPackage = result.contentPackage;

      // Apply seeded tasks
      this.applySeededTasks(contentPackage.tasks);

      // Apply first win task (if exists)
      if (contentPackage.firstWinTask) {
        this.applySeededTasks([contentPackage.firstWinTask]);
      }

      // Initialize first session state
      if (result.firstSessionState) {
        this.initializeFirstSession(result.firstSessionState);
      }

      // Initialize dashboard evolution
      this.initializeDashboardEvolution(contentPackage.dashboardState);

      // Mark onboarding as complete with seeded experience
      this.markSeededExperienceApplied();

      return {
        success: true,
        contentPackage,
      };
    } catch (error) {
      return {
        success: false,
        contentPackage: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Apply seeded tasks to the tasks store
   */
  private applySeededTasks(seededTasks: SeededTask[]): void {
    const tasksStore = useTasksStore.getState();

    seededTasks.forEach((seededTask) => {
      // Convert SeededTask to CreateTaskInput
      const taskInput = {
        label: seededTask.title,
        date: seededTask.date,
        time: seededTask.time,
        category: seededTask.category,
        notes: seededTask.notes,
        priority: seededTask.priority,
      };

      tasksStore.addTask(taskInput);
    });
  }

  /**
   * Initialize first session state
   */
  private initializeFirstSession(_firstSessionState: unknown): void {
    const firstSessionStore = useFirstSessionStore.getState();
    firstSessionStore.startFirstSession();
  }

  /**
   * Initialize dashboard evolution state
   */
  private initializeDashboardEvolution(dashboardState: { currentStage: string }): void {
    const dashboardStore = useDashboardEvolutionStore.getState();
    
    // Set initial stage to seeded
    if (dashboardState.currentStage === 'seeded') {
      dashboardStore.achieveMilestone('first_task_added');
    }
  }

  /**
   * Mark that seeded experience has been applied
   * This prevents re-seeding on subsequent app opens
   */
  private markSeededExperienceApplied(): void {
    // Store a flag in localStorage to prevent re-seeding
    localStorage.setItem('lumo-seeded-experience-applied', 'true');
    localStorage.setItem(
      'lumo-seeded-experience-version',
      '1.0.0'
    );
    localStorage.setItem(
      'lumo-seeded-experience-date',
      new Date().toISOString()
    );
  }

  /**
   * Check if seeded experience has already been applied
   */
  static hasSeededExperienceBeenApplied(): boolean {
    return localStorage.getItem('lumo-seeded-experience-applied') === 'true';
  }

  /**
   * Get seeded experience metadata
   */
  static getSeededExperienceMetadata(): {
    applied: boolean;
    version: string | null;
    date: string | null;
  } {
    return {
      applied: localStorage.getItem('lumo-seeded-experience-applied') === 'true',
      version: localStorage.getItem('lumo-seeded-experience-version'),
      date: localStorage.getItem('lumo-seeded-experience-date'),
    };
  }

  /**
   * Clear seeded experience flag (for testing or reset)
   */
  static clearSeededExperienceFlag(): void {
    localStorage.removeItem('lumo-seeded-experience-applied');
    localStorage.removeItem('lumo-seeded-experience-version');
    localStorage.removeItem('lumo-seeded-experience-date');
  }
}

/**
 * Hook to integrate seeded experience after onboarding
 */
export function useSeededExperienceIntegration() {
  const integrateSeededExperience = async (
    onboardingData: Partial<OnboardingData>
  ) => {
    // Check if already applied
    if (SeededExperienceIntegrator.hasSeededExperienceBeenApplied()) {
      return {
        success: true,
        alreadyApplied: true,
        contentPackage: null,
      };
    }

    const integrator = new SeededExperienceIntegrator(onboardingData);
    return await integrator.integrate();
  };

  const checkSeededExperienceStatus = () => {
    return SeededExperienceIntegrator.getSeededExperienceMetadata();
  };

  const resetSeededExperience = () => {
    SeededExperienceIntegrator.clearSeededExperienceFlag();
  };

  return {
    integrateSeededExperience,
    checkSeededExperienceStatus,
    resetSeededExperience,
  };
}
