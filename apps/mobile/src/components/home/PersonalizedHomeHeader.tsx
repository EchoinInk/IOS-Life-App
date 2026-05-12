/**
 * Personalized home header component
 * Uses onboarding data to customize greeting and focus areas
 */

import { useMemo } from 'react';
import { usePersonalizedHome } from '@/features/home/hooks/usePersonalizedHome';
import { Heading, Body } from '@/components/ui/Text';

const focusAreaIcons: Record<string, string> = {
  work: '💼',
  health: '🏃',
  budgeting: '💰',
  routines: '📅',
  relationships: '❤️',
  learning: '📚',
  creativity: '🎨'
};

export const PersonalizedHomeHeader = () => {
  const { 
    welcomeMessage, 
    focusAreas, 
    isNewUser,
    isWorkFocused,
    isHealthFocused,
    isBudgetFocused 
  } = usePersonalizedHome();

  // Get hero message based on focus
  const heroMessage = useMemo(() => {
    if (isNewUser) {
      return "Welcome to your personalized dashboard! Let's start building great habits.";
    }

    if (isWorkFocused) {
      return "Ready to make today productive? Your work focus is prioritized.";
    }

    if (isHealthFocused) {
      return "Let's focus on your wellness goals today. Every step counts!";
    }

    if (isBudgetFocused) {
      return "Time to stay on top of your finances. Small changes add up!";
    }

    return "How can Lumo help you achieve your goals today?";
  }, [isNewUser, isWorkFocused, isHealthFocused, isBudgetFocused]);

  // Get focus area display
  const focusAreaDisplay = useMemo(() => {
    if (focusAreas.length === 0) return null;
    
    if (focusAreas.length === 1) {
      const area = focusAreas[0];
      if (area) {
        return {
          icon: focusAreaIcons[area] || '🎯',
          label: area.charAt(0).toUpperCase() + area.slice(1)
        };
      }
    }

    // Multiple focus areas
    return {
      icon: '🎯',
      label: `${focusAreas.length} focus areas`
    };
  }, [focusAreas]);

  return (
    <div className="space-y-4">
      {/* Main greeting */}
      <div className="text-center space-y-2">
        <Heading className="text-center">
          {welcomeMessage}
        </Heading>
        <Body className="text-center text-text-secondary">
          {heroMessage}
        </Body>
      </div>

      {/* Focus area indicator */}
      {focusAreaDisplay && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{focusAreaDisplay.icon}</span>
          <div className="text-center">
            <Body className="text-sm font-medium text-text-primary">
              {focusAreaDisplay.label}
            </Body>
            {isNewUser && (
              <Body className="text-xs text-text-muted">
                Just getting started
              </Body>
            )}
          </div>
        </div>
      )}

      {/* New user welcome banner */}
      {isNewUser && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
          <Body className="text-sm text-primary font-medium">
            🎉 Your personalized setup is ready!
          </Body>
          <Body className="text-xs text-text-muted mt-1">
            We've customized everything based on your preferences
          </Body>
        </div>
      )}
    </div>
  );
};
