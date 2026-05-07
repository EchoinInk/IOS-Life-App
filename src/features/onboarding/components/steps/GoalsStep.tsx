/**
 * Goals step - User selects their productivity goals
 * Multi-select based on their focus areas
 */

import { useEffect } from 'react';
import { OnboardingStepProps } from '../../types/onboarding.types';
import { GOAL_LABELS, type ProductivityGoal } from '../../types/onboarding.types';
import { Heading, Body } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';
import { useOnboardingAnalytics } from '@/analytics/analyticsHooks';

const goalIcons: Record<ProductivityGoal, string> = {
  reduce_stress: '🧘',
  build_consistency: '🎯',
  save_money: '💵',
  improve_health: '💪',
  be_more_productive: '⚡',
  stay_organized: '📋'
};

const goalDescriptions: Record<ProductivityGoal, string> = {
  reduce_stress: 'Better work-life balance and mental clarity',
  build_consistency: 'Create lasting habits and routines',
  save_money: 'Track expenses and reach financial goals',
  improve_health: 'Build healthier lifestyle choices',
  be_more_productive: 'Get more done in less time',
  stay_organized: 'Keep everything tidy and structured'
};

export const GoalsStep = ({ data, updateData, onNext }: OnboardingStepProps) => {
  const { stepViewed, stepCompleted } = useOnboardingAnalytics();
  
  const selectedGoals = data.productivityGoals || [];
  const focusAreas = data.primaryFocusAreas || [];

  // Track step view
  useEffect(() => {
    stepViewed('goals', 0, 5);
  }, [stepViewed]);

  const toggleGoal = (goal: ProductivityGoal) => {
    const isSelected = selectedGoals.includes(goal);
    let newSelection: ProductivityGoal[];

    if (isSelected) {
      newSelection = selectedGoals.filter(g => g !== goal);
    } else {
      newSelection = [...selectedGoals, goal];
    }

    updateData({ productivityGoals: newSelection });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoals.length > 0) {
      stepCompleted('goals', 0);
      onNext();
    }
  };

  // Get recommended goals based on focus areas
  const getRecommendedGoals = (): ProductivityGoal[] => {
    const recommendations: ProductivityGoal[] = [];
    
    if (focusAreas.includes('work')) {
      recommendations.push('be_more_productive', 'reduce_stress');
    }
    if (focusAreas.includes('health')) {
      recommendations.push('improve_health', 'build_consistency');
    }
    if (focusAreas.includes('budgeting')) {
      recommendations.push('save_money', 'stay_organized');
    }
    if (focusAreas.includes('routines')) {
      recommendations.push('build_consistency', 'stay_organized');
    }
    
    return recommendations;
  };

  const recommendedGoals = getRecommendedGoals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heading className="text-center">
          What are your goals?
        </Heading>
        <Body className="text-center text-text-secondary">
          Tell us what you want to achieve with Lumo.
        </Body>
      </div>

      {/* Recommended Goals */}
      {recommendedGoals.length > 0 && (
        <Surface className="p-3 bg-primary/5 border border-primary/20">
          <Body className="text-sm text-primary font-medium mb-2">
            💡 Recommended for you
          </Body>
          <div className="flex flex-wrap gap-2">
            {recommendedGoals.map(goal => (
              <span 
                key={goal}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {GOAL_LABELS[goal]}
              </span>
            ))}
          </div>
        </Surface>
      )}

      {/* Goals Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {Object.entries(GOAL_LABELS).map(([goal, label]) => {
            const isSelected = selectedGoals.includes(goal as ProductivityGoal);
            const isRecommended = recommendedGoals.includes(goal as ProductivityGoal);
            const productivityGoal = goal as ProductivityGoal;

            return (
              <Surface
                key={goal}
                onClick={() => toggleGoal(productivityGoal)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'border-2 border-transparent hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {goalIcons[productivityGoal]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {label}
                      </div>
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {goalDescriptions[productivityGoal]}
                    </div>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>

        {/* Selection Summary */}
        {selectedGoals.length > 0 && (
          <Surface className="p-3 bg-surface-elevated">
            <Body className="text-sm text-text-secondary">
              Selected: {selectedGoals.length} {selectedGoals.length === 1 ? 'goal' : 'goals'}
            </Body>
          </Surface>
        )}

        {/* Helper Text */}
        <div className="text-center">
          <Body className="text-xs text-text-muted">
            Select at least one goal to continue
          </Body>
        </div>
      </form>
    </div>
  );
};
