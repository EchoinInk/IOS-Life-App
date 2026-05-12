/**
 * Personalized home dashboard hook
 * Integrates onboarding data to create personalized experience
 */

import { useMemo } from 'react';
import { useOnboardingData } from '@/features/onboarding/store/useOnboardingStore';
import { 
  generatePersonalizedDefaults, 
  getPersonalizedDashboardLayout, 
  getPersonalizedWelcomeMessage 
} from '@/features/onboarding/utils/personalization.utils';
import { useRoutineData } from '@/features/routines/hooks/useRoutineData';
import { selectMorningEveningStatus } from '@/features/routines/selectors/routineSelectors';
import type { RoutineInstance } from '@/features/routines/types/routineTypes';

export const usePersonalizedHome = () => {
  const onboardingData = useOnboardingData();
  const routineData = useRoutineData();

  // Generate personalized defaults
  const personalizedDefaults = useMemo(() => {
    return generatePersonalizedDefaults(onboardingData);
  }, [onboardingData]);

  // Get dashboard layout preferences
  const dashboardLayout = useMemo(() => {
    return getPersonalizedDashboardLayout(onboardingData);
  }, [onboardingData]);

  // Get personalized welcome message
  const welcomeMessage = useMemo(() => {
    return getPersonalizedWelcomeMessage(onboardingData);
  }, [onboardingData]);

  // Determine if user is new (just completed onboarding)
  const isNewUser = useMemo(() => {
    if (!onboardingData.completedAt) return false;
    const completedTime = new Date(onboardingData.completedAt);
    const now = new Date();
    const hoursSinceCompletion = (now.getTime() - completedTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceCompletion < 24; // Less than 24 hours
  }, [onboardingData.completedAt]);

  // Get focus areas for UI
  const focusAreas = useMemo(() => {
    return onboardingData.primaryFocusAreas || [];
  }, [onboardingData.primaryFocusAreas]);

  // Get preferred modules for quick actions
  const preferredModules = useMemo(() => {
    return onboardingData.preferredModules || ['tasks'];
  }, [onboardingData.preferredModules]);

  // Get daily cadence for timing recommendations
  const dailyCadence = useMemo(() => {
    return onboardingData.dailyCadence || 'throughout_day';
  }, [onboardingData.dailyCadence]);

  // Get planning style for UI preferences
  const planningStyle = useMemo(() => {
    return onboardingData.planningStyle || 'minimal';
  }, [onboardingData.planningStyle]);

  // Get user name for personalization
  const userName = useMemo(() => {
    return onboardingData.userName || 'there';
  }, [onboardingData.userName]);

  // Routine integration
  const routineStatus = useMemo(() => {
    // Convert array to record for selector
    const routineRecord = routineData.todayRoutines.reduce((acc, routine) => {
      acc[routine.id] = routine;
      return acc;
    }, {} as Record<string, RoutineInstance>);
    return selectMorningEveningStatus(routineRecord);
  }, [routineData.todayRoutines]);

  const routineProgress = useMemo(() => {
    const total = routineData.todayRoutines.length;
    const completed = routineData.todayRoutines.filter(r => r.status === 'completed').length;
    return {
      morningCompleted: routineStatus.morning.completed,
      eveningCompleted: routineStatus.evening.completed,
      routinePercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      activeRoutine: routineData.activeFocusSession?.id || null
    };
  }, [routineData.todayRoutines, routineData.activeFocusSession, routineStatus]);

  return {
    // Personalized content
    personalizedDefaults,
    welcomeMessage,
    
    // User preferences
    focusAreas,
    preferredModules,
    dailyCadence,
    planningStyle,
    userName,
    
    // UI configuration
    dashboardLayout,
    
    // User state
    isNewUser,
    hasOnboardingData: !!onboardingData.completedAt,
    
    // Routine data
    routineProgress,
    routineStatus,
    
    // Helper booleans
    isWorkFocused: focusAreas.includes('work'),
    isHealthFocused: focusAreas.includes('health'),
    isBudgetFocused: focusAreas.includes('budgeting'),
    isRoutineFocused: focusAreas.includes('routines'),
    wantsDetailedPlanning: planningStyle === 'detailed',
    wantsVisualPlanning: planningStyle === 'visual',
    isMorningPerson: dailyCadence === 'morning_person',
    isEveningPerson: dailyCadence === 'evening_person'
  };
};
