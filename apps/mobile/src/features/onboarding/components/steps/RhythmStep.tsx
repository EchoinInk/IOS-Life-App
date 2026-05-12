/**
 * Rhythm step - User selects their daily planning style and cadence
 * Single selection for planning style and daily rhythm
 */

import { useEffect } from 'react';
import { OnboardingStepProps } from '../../types/onboarding.types';
import { CADENCE_LABELS, PLANNING_STYLE_LABELS, type DailyCadence, type PlanningStyle } from '../../types/onboarding.types';
import { Heading, Body } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';
import { useOnboardingAnalytics } from '@/analytics/analyticsHooks';

const cadenceIcons: Record<DailyCadence, string> = {
  morning_person: '🌅',
  evening_person: '🌙',
  throughout_day: '⏰',
  weekly_planner: '📆'
};

const cadenceDescriptions: Record<DailyCadence, string> = {
  morning_person: 'Plan your day over coffee and start strong',
  evening_person: 'Reflect and plan before bed for tomorrow',
  throughout_day: 'Check in and adjust as you go',
  weekly_planner: 'Set your week and let it flow'
};

const styleIcons: Record<PlanningStyle, string> = {
  minimal: '📝',
  detailed: '📋',
  visual: '🎨',
  time_based: '⏱️'
};

const styleDescriptions: Record<PlanningStyle, string> = {
  minimal: 'Quick lists and simple tracking',
  detailed: 'Comprehensive plans and progress tracking',
  visual: 'Charts, graphs, and visual organization',
  time_based: 'Scheduled blocks and time management'
};

export const RhythmStep = ({ data, updateData, onNext }: OnboardingStepProps) => {
  const { stepViewed, stepCompleted } = useOnboardingAnalytics();
  
  const selectedCadence = data.dailyCadence || 'throughout_day';
  const selectedStyle = data.planningStyle || 'minimal';

  // Track step view
  useEffect(() => {
    stepViewed('rhythm', 1, 5);
  }, [stepViewed]);

  const handleCadenceChange = (cadence: DailyCadence) => {
    updateData({ dailyCadence: cadence });
  };

  const handleStyleChange = (style: PlanningStyle) => {
    updateData({ planningStyle: style });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stepCompleted('rhythm', 1);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heading className="text-center">
          Your daily rhythm
        </Heading>
        <Body className="text-center text-text-secondary">
          How do you like to plan and organize your day?
        </Body>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Daily Cadence */}
        <div className="space-y-3">
          <Body className="text-sm font-medium text-text-primary">
            When do you prefer to plan?
          </Body>
          <div className="space-y-2">
            {Object.entries(CADENCE_LABELS).map(([cadence, label]) => {
              const isSelected = selectedCadence === cadence as DailyCadence;
              const dailyCadence = cadence as DailyCadence;

              return (
                <Surface
                  key={cadence}
                  onClick={() => handleCadenceChange(dailyCadence)}
                  className={`p-4 cursor-pointer transition-[background-color,transform] duration-200 ${
                    isSelected 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'border-2 border-transparent hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {cadenceIcons[dailyCadence]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {label}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {cadenceDescriptions[dailyCadence]}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>

        {/* Planning Style */}
        <div className="space-y-3">
          <Body className="text-sm font-medium text-text-primary">
            What's your planning style?
          </Body>
          <div className="space-y-2">
            {Object.entries(PLANNING_STYLE_LABELS).map(([style, label]) => {
              const isSelected = selectedStyle === style as PlanningStyle;
              const planningStyle = style as PlanningStyle;

              return (
                <Surface
                  key={style}
                  onClick={() => handleStyleChange(planningStyle)}
                  className={`p-4 cursor-pointer transition-[background-color,transform] duration-200 ${
                    isSelected 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'border-2 border-transparent hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {styleIcons[planningStyle]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {label}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {styleDescriptions[planningStyle]}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>

        {/* Selection Summary */}
        <Surface className="p-3 bg-surface-elevated">
          <Body className="text-sm text-text-secondary">
            {CADENCE_LABELS[selectedCadence]} • {PLANNING_STYLE_LABELS[selectedStyle]}
          </Body>
        </Surface>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={onNext}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </form>
    </div>
  );
};
