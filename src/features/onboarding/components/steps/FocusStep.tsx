/**
 * Focus Areas step - User selects their primary focus areas
 * Multi-select with visual icons and descriptions
 */

import { useEffect } from 'react';
import { OnboardingStepProps } from '../../types/onboarding.types';
import { FOCUS_AREA_LABELS, type FocusArea } from '../../types/onboarding.types';
import { Heading, Body } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';
import { useOnboardingAnalytics } from '@/analytics/analyticsHooks';

const focusAreaIcons: Record<FocusArea, string> = {
  work: '💼',
  health: '🏃',
  budgeting: '💰',
  routines: '📅',
  relationships: '❤️',
  learning: '📚',
  creativity: '🎨'
};

const focusAreaDescriptions: Record<FocusArea, string> = {
  work: 'Career goals, projects, and productivity',
  health: 'Fitness, nutrition, and wellness habits',
  budgeting: 'Saving, investing, and financial planning',
  routines: 'Daily habits and consistency building',
  relationships: 'Family, friends, and social connections',
  learning: 'Skills, education, and personal growth',
  creativity: 'Artistic projects and creative expression'
};

export const FocusStep = ({ data, updateData, onNext }: OnboardingStepProps) => {
  const { stepViewed, stepCompleted } = useOnboardingAnalytics();
  
  const selectedAreas = data.primaryFocusAreas || [];

  // Track step view
  useEffect(() => {
    stepViewed('focus', 2, 5);
  }, [stepViewed]);

  const toggleArea = (area: FocusArea) => {
    const isSelected = selectedAreas.includes(area);
    let newSelection: FocusArea[];

    if (isSelected) {
      newSelection = selectedAreas.filter(a => a !== area);
    } else {
      newSelection = [...selectedAreas, area];
    }

    updateData({ primaryFocusAreas: newSelection });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAreas.length > 0) {
      stepCompleted('focus', 2);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heading className="text-center">
          What's your focus?
        </Heading>
        <Body className="text-center text-text-secondary">
          Choose the areas you want to improve. You can always change these later.
        </Body>
      </div>

      {/* Focus Areas Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(FOCUS_AREA_LABELS).map(([area, label]) => {
            const isSelected = selectedAreas.includes(area as FocusArea);
            const focusArea = area as FocusArea;

            return (
              <Surface
                key={area}
                onClick={() => toggleArea(focusArea)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'border-2 border-transparent hover:bg-surface-elevated'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-2xl text-center">
                    {focusAreaIcons[focusArea]}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      isSelected ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {label}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {focusAreaDescriptions[focusArea]}
                    </div>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>

        {/* Selection Summary */}
        {selectedAreas.length > 0 && (
          <Surface className="p-3 bg-surface-elevated">
            <Body className="text-sm text-text-secondary">
              Selected: {selectedAreas.length} {selectedAreas.length === 1 ? 'area' : 'areas'}
            </Body>
          </Surface>
        )}

        {/* Helper Text */}
        <div className="text-center">
          <Body className="text-xs text-text-muted">
            Select at least one area to continue
          </Body>
        </div>
      </form>
    </div>
  );
};
