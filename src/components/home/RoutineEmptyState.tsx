/**
 * Routine Empty State - Calm, premium onboarding for routines
 * Provides suggested starter routines without gamification
 */

import React from 'react';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { DEFAULT_ROUTINE_TEMPLATES } from '@/features/routines/types/routineTypes';
import type { RoutineTemplate } from '@/features/routines/types/routineTypes';
import { useEmptyStateAnalytics, useRoutineAnalytics } from '@/analytics/analyticsHooks';

export interface RoutineEmptyStateProps {
  onSelectTemplate: (template: RoutineTemplate) => void;
  onDismiss: () => void;
}

export const RoutineEmptyState: React.FC<RoutineEmptyStateProps> = ({
  onSelectTemplate,
  onDismiss
}) => {
  const { viewed: emptyStateViewed, ctaClicked: emptyStateCTAClicked, dismissed: emptyStateDismissed } = useEmptyStateAnalytics();
  const { templateSelected: routineTemplateSelected } = useRoutineAnalytics();
  
  const suggestedTemplates = DEFAULT_ROUTINE_TEMPLATES.slice(0, 3);

  // Track empty state view
  React.useEffect(() => {
    emptyStateViewed('routines', 0);
  }, [emptyStateViewed]);

  const handleSelectTemplate = (template: RoutineTemplate) => {
    routineTemplateSelected(template.name, 'suggested');
    emptyStateCTAClicked('routines', template.name, 'browse_templates');
    onSelectTemplate(template);
  };

  const handleDismiss = () => {
    emptyStateDismissed('routines');
    onDismiss();
  };

  return (
    <Surface variant="subtle" className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <Text size="base" weight="bold" tone="primary">
            Start Your Routines
          </Text>
          <Text size="sm" weight="medium" tone="secondary" className="mt-1">
            Build calm, consistent daily patterns
          </Text>
        </div>

        {/* Suggested Templates */}
        <div className="space-y-2">
          {suggestedTemplates.map((template) => (
            <button
              key={template.name}
              type="button"
              onClick={() => handleSelectTemplate(template as RoutineTemplate)}
              className="w-full text-left p-3 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border/50 transition-[background-color,transform] duration-200 active:scale-[0.98]"
            >
              <Text size="sm" weight="bold" tone="primary">
                {template.name}
              </Text>
              <Text size="xs" weight="medium" tone="secondary" className="mt-1">
                {template.description}
              </Text>
              <Text size="xs" weight="medium" tone="secondary" className="mt-2">
                {template.estimatedDuration} min · {template.steps.length} steps
              </Text>
            </button>
          ))}
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Maybe later
        </button>
      </div>
    </Surface>
  );
};
