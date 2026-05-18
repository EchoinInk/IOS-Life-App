/**
 * Intelligence Hook
 * Provides easy access to the intelligence layer
 */

import { useMemo } from 'react';
import { 
  IntelligenceEngine
} from '../index';

// Mock data providers - these would be replaced with actual data hooks
const useTasksData = () => {
  // This would be replaced with actual tasks hook
  return [];
};

const useBudgetData = () => {
  // This would be replaced with actual budget hook
  return [];
};

const useMealsData = () => {
  // This would be replaced with actual meals hook
  return [];
};

const useMomentumData = () => {
  // This would be replaced with actual momentum hook
  return [];
};

const useUserPreferences = () => {
  // This would be replaced with actual preferences hook
  return {
    focusAreas: ['work', 'health'],
    preferredCategories: ['tasks', 'budget'],
    planningStyle: 'balanced' as const,
    workHours: { start: 9, end: 17 },
    budgetAlerts: true,
    taskReminders: true
  };
};

/**
 * Main intelligence hook
 */
export const useIntelligence = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const intelligence = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.generateIntelligence(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return intelligence;
};

/**
 * Hook for insights only
 */
export const useInsights = (limit: number = 5) => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const insights = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getInsights(context, limit);
  }, [tasks, budget, meals, momentum, userPreferences, limit]);

  return insights;
};

/**
 * Hook for recommendations only
 */
export const useRecommendations = (limit: number = 3) => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const recommendations = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getRecommendations(context, limit);
  }, [tasks, budget, meals, momentum, userPreferences, limit]);

  return recommendations;
};

/**
 * Hook for patterns only
 */
export const usePatterns = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const patterns = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getPatterns(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return patterns;
};

/**
 * Hook for high-priority items
 */
export const useHighPriorityItems = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const highPriorityItems = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getHighPriorityItems(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return highPriorityItems;
};

/**
 * Hook for actionable items
 */
export const useActionableItems = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const actionableItems = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getActionableItems(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return actionableItems;
};

/**
 * Hook for category-specific intelligence
 */
export const useCategoryIntelligence = (category: 'tasks' | 'budget' | 'meals' | 'routines') => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const categoryIntelligence = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getCategoryIntelligence(context, category);
  }, [tasks, budget, meals, momentum, userPreferences, category]);

  return categoryIntelligence;
};

/**
 * Hook for dashboard summary
 */
export const useDashboardSummary = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const summary = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getDashboardSummary(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return summary;
};

/**
 * Hook for time-based intelligence
 */
export const useTimeBasedIntelligence = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const timeBasedIntelligence = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.getTimeBasedIntelligence(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return timeBasedIntelligence;
};

/**
 * Hook for attention check
 */
export const useNeedsAttention = () => {
  const tasks = useTasksData();
  const budget = useBudgetData();
  const meals = useMealsData();
  const momentum = useMomentumData();
  const userPreferences = useUserPreferences();

  const needsAttention = useMemo(() => {
    const context = IntelligenceEngine.createContext(tasks, budget, meals, momentum, userPreferences);
    return IntelligenceEngine.needsAttention(context);
  }, [tasks, budget, meals, momentum, userPreferences]);

  return needsAttention;
};
