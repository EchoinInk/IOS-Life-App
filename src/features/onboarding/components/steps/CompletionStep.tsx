/**
 * Completion step - Shows summary and gets user ready to start
 * Displays personalized setup summary and next steps
 */

import { useEffect } from 'react';
import { OnboardingStepProps } from '../../types/onboarding.types';
import { FOCUS_AREA_LABELS, GOAL_LABELS, MODULE_LABELS, CADENCE_LABELS, PLANNING_STYLE_LABELS } from '../../types/onboarding.types';
import { Heading, Body, Accent } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';
import { useOnboardingAnalytics } from '@/analytics/analyticsHooks';
import { useSeededExperienceIntegration } from '../../utils/seededExperienceIntegration';
import { useOnboardingActions } from '../../store/useOnboardingStore';
import { useUserIdentification } from '@/analytics/analyticsHooks';

export const CompletionStep = ({ data, onNext }: OnboardingStepProps) => {
  const { stepViewed, completed } = useOnboardingAnalytics();
  const { integrateSeededExperience } = useSeededExperienceIntegration();
  const { completeOnboarding } = useOnboardingActions();
  const { identify } = useUserIdentification();
  
  const userName = data.userName || 'there';
  const focusAreas = data.primaryFocusAreas || [];
  const goals = data.productivityGoals || [];
  const modules = data.preferredModules || ['tasks'];
  const cadence = data.dailyCadence || 'throughout_day';
  const planningStyle = data.planningStyle || 'minimal';

  // Track step view
  useEffect(() => {
    stepViewed('completion', 4, 5);
  }, [stepViewed]);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track onboarding completion
    completed(
      0, // duration - would need to be calculated from start time
      goals.length,
      cadence,
      planningStyle,
      modules.length
    );
    
    // Complete onboarding
    completeOnboarding();
    
    // Identify user with PostHog using anonymous ID — no PII (real name) sent
    identify('user-' + crypto.randomUUID(), {
      focus_areas: focusAreas,
      goals: goals,
      modules: modules,
      cadence: cadence,
      planning_style: planningStyle,
    });
    
    // Integrate seeded experience
    await integrateSeededExperience(data);
    
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Heading className="text-center">
          You're all set, {userName}!
        </Heading>
        <Body className="text-center text-text-secondary">
          Your personalized Lumo experience is ready. Here's what we've set up for you.
        </Body>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Focus Areas */}
        <Surface className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <Accent>Your Focus Areas</Accent>
          </div>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map(area => (
              <span 
                key={area}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {FOCUS_AREA_LABELS[area]}
              </span>
            ))}
          </div>
        </Surface>

        {/* Goals */}
        <Surface className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <Accent>Your Goals</Accent>
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map(goal => (
              <span 
                key={goal}
                className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
              >
                {GOAL_LABELS[goal]}
              </span>
            ))}
          </div>
        </Surface>

        {/* Modules */}
        <Surface className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🛠️</span>
            <Accent>Your Tools</Accent>
          </div>
          <div className="flex flex-wrap gap-2">
            {modules.map(module => (
              <span 
                key={module}
                className="px-3 py-1 bg-surface-elevated text-text-primary text-sm rounded-full"
              >
                {MODULE_LABELS[module]}
              </span>
            ))}
          </div>
        </Surface>

        {/* Planning Style */}
        <Surface className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📅</span>
            <Accent>Your Planning Style</Accent>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Rhythm:</span>
              <span className="text-sm font-medium text-text-primary">
                {CADENCE_LABELS[cadence]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Style:</span>
              <span className="text-sm font-medium text-text-primary">
                {PLANNING_STYLE_LABELS[planningStyle]}
              </span>
            </div>
          </div>
        </Surface>
      </div>

      {/* What's Next */}
      <Surface className="p-4 bg-primary/5 border border-primary/20">
        <div className="space-y-3">
          <Accent className="text-primary">What's next?</Accent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <Body className="text-sm text-text-primary">
                Personalized dashboard with your focus areas
              </Body>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <Body className="text-sm text-text-primary">
                Smart suggestions based on your goals
              </Body>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <Body className="text-sm text-text-primary">
                Starter content to help you begin
              </Body>
            </div>
          </div>
        </div>
      </Surface>

      {/* Get Started Button */}
      <form onSubmit={handleGetStarted}>
        <button
          type="submit"
          className="w-full py-3 bg-primary text-text-on-primary rounded-lg font-semibold hover:brightness-105 active:scale-[0.98] transition-[filter,transform] duration-200 motion-reduce:active:scale-100"
        >
          Start Using Lumo
        </button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <Body className="text-xs text-text-muted">
          You can always change these settings later in preferences
        </Body>
      </div>
    </div>
  );
};
