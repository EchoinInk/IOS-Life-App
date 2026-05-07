/**
 * Hook to check if onboarding is needed
 * Determines if user should see onboarding flow or main app
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingState } from '../store/useOnboardingStore';

export const useOnboardingCheck = () => {
  const navigate = useNavigate();
  const { isCompleted, data } = useOnboardingState();

  useEffect(() => {
    // Check if onboarding is needed
    // - Not completed yet
    // - Or missing essential data (like user name)
    const needsOnboarding = !isCompleted || !data.userName;

    if (needsOnboarding) {
      navigate('/onboarding');
    }
  }, [isCompleted, data.userName, navigate]);

  return {
    needsOnboarding: !isCompleted || !data.userName,
    isCompleted,
    onboardingData: data
  };
};
