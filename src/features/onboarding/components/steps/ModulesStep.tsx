/**
 * Modules step - User selects their preferred modules
 * Multi-select with descriptions of each module
 */

import { OnboardingStepProps } from '../../types/onboarding.types';
import { MODULE_LABELS, type PreferredModule } from '../../types/onboarding.types';
import { Heading, Body } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';

const moduleIcons: Record<PreferredModule, string> = {
  tasks: '✅',
  budget: '💳',
  meals: '🍽️',
  shopping: '🛒',
  recipes: '📖',
  bills: '📄'
};

const moduleDescriptions: Record<PreferredModule, string> = {
  tasks: 'Track projects, to-dos, and deadlines',
  budget: 'Manage expenses, income, and savings',
  meals: 'Plan meals and track nutrition',
  shopping: 'Organize grocery lists and purchases',
  recipes: 'Save and organize favorite recipes',
  bills: 'Track recurring payments and due dates'
};

export const ModulesStep = ({ data, updateData, onNext }: OnboardingStepProps) => {
  const selectedModules = data.preferredModules || ['tasks']; // Default to tasks
  const focusAreas = data.primaryFocusAreas || [];

  const toggleModule = (module: PreferredModule) => {
    const isSelected = selectedModules.includes(module);
    let newSelection: PreferredModule[];

    if (isSelected) {
      // Don't allow deselecting tasks if it's the only one
      if (selectedModules.length === 1 && selectedModules[0] === 'tasks') {
        return;
      }
      newSelection = selectedModules.filter(m => m !== module);
    } else {
      newSelection = [...selectedModules, module];
    }

    updateData({ preferredModules: newSelection });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModules.length > 0) {
      onNext();
    }
  };

  // Get recommended modules based on focus areas
  const getRecommendedModules = (): PreferredModule[] => {
    const recommendations: PreferredModule[] = [];
    
    if (focusAreas.includes('work')) {
      recommendations.push('tasks');
    }
    if (focusAreas.includes('health')) {
      recommendations.push('meals');
    }
    if (focusAreas.includes('budgeting')) {
      recommendations.push('budget', 'bills');
    }
    if (focusAreas.includes('routines')) {
      recommendations.push('tasks', 'meals');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  };

  const recommendedModules = getRecommendedModules();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heading className="text-center">
          Choose your tools
        </Heading>
        <Body className="text-center text-text-secondary">
          Select the modules you'll use most. You can always enable others later.
        </Body>
      </div>

      {/* Recommended Modules */}
      {recommendedModules.length > 0 && (
        <Surface className="p-3 bg-primary/5 border border-primary/20">
          <Body className="text-sm text-primary font-medium mb-2">
            💡 Recommended for your focus areas
          </Body>
          <div className="flex flex-wrap gap-2">
            {recommendedModules.map(module => (
              <span 
                key={module}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {moduleIcons[module]} {MODULE_LABELS[module]}
              </span>
            ))}
          </div>
        </Surface>
      )}

      {/* Modules Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {Object.entries(MODULE_LABELS).map(([module, label]) => {
            const isSelected = selectedModules.includes(module as PreferredModule);
            const isRecommended = recommendedModules.includes(module as PreferredModule);
            const preferredModule = module as PreferredModule;

            return (
              <Surface
                key={module}
                onClick={() => toggleModule(preferredModule)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'border-2 border-transparent hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {moduleIcons[preferredModule]}
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
                      {preferredModule === 'tasks' && (
                        <span className="px-1.5 py-0.5 bg-surface-elevated text-text-muted text-xs rounded-full">
                          Core
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {moduleDescriptions[preferredModule]}
                    </div>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>

        {/* Selection Summary */}
        <Surface className="p-3 bg-surface-elevated">
          <Body className="text-sm text-text-secondary">
            {selectedModules.length} {selectedModules.length === 1 ? 'module' : 'modules'} selected
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
