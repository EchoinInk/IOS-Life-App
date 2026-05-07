/**
 * Personalized quick actions panel
 * Shows actions based on user's preferred modules
 */

import { useMemo } from 'react';
import { usePersonalizedHome } from '@/features/home/hooks/usePersonalizedHome';
import { Surface } from '@/components/ui/Surface';
import { Body } from '@/components/ui/Text';

interface QuickActionProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const QuickAction = ({ icon, label, onClick }: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 p-3 bg-surface hover:bg-surface-elevated rounded-lg transition-colors duration-200 text-center"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-text-primary">{label}</div>
    </button>
  );
};

export const PersonalizedQuickActions = () => {
  const { personalizedDefaults } = usePersonalizedHome();

  // Map module to action handlers
  const getActionHandler = (module: string) => {
    switch (module) {
      case 'tasks':
        return () => {
          // Open add task modal
          console.log('Open add task modal');
        };
      case 'budget':
        return () => {
          // Open add expense modal
          console.log('Open add expense modal');
        };
      case 'meals':
        return () => {
          // Open add meal modal
          console.log('Open add meal modal');
        };
      case 'shopping':
        return () => {
          // Open add shopping item modal
          console.log('Open add shopping item modal');
        };
      case 'recipes':
        return () => {
          // Open add recipe modal
          console.log('Open add recipe modal');
        };
      case 'bills':
        return () => {
          // Open add bill modal
          console.log('Open add bill modal');
        };
      default:
        return () => {};
    }
  };

  // Get quick actions from personalized defaults
  const quickActions = useMemo(() => {
    return personalizedDefaults.quickActions.map(action => ({
      ...action,
      onClick: getActionHandler(action.module)
    }));
  }, [personalizedDefaults.quickActions]);

  // If no personalized actions, show default tasks action
  if (quickActions.length === 0) {
    return (
      <Surface className="p-4">
        <Body className="text-sm font-medium text-text-primary mb-3">
          Quick Actions
        </Body>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            icon="✅"
            label="Add Task"
            onClick={() => console.log('Open add task modal')}
          />
        </div>
      </Surface>
    );
  }

  return (
    <Surface className="p-4">
      <Body className="text-sm font-medium text-text-primary mb-3">
        Quick Actions
      </Body>
      <div className={`grid gap-3 ${
        quickActions.length === 1 ? 'grid-cols-1' :
        quickActions.length === 2 ? 'grid-cols-2' :
        quickActions.length === 3 ? 'grid-cols-3' :
        'grid-cols-4'
      }`}>
        {quickActions.map((action) => (
          <QuickAction
            key={action.id}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
          />
        ))}
      </div>
    </Surface>
  );
};
