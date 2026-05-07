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

export const usePersonalizedHome = () => {
  const onboardingData = useOnboardingData();

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
