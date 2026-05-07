/**
 * Intelligent Empty State - Contextual, encouraging, and useful empty states
 * Creates emotional momentum for new users with smart guidance
 */

import React from 'react';
import { Surface } from './Surface';
import { Body, Caption, Title } from './Text';
import { Button } from './Button';
import { MomentumRing } from '@/features/momentum/components/MomentumRing';

interface IntelligentEmptyStateProps {
  // Context
  context: 'tasks' | 'meals' | 'budget' | 'lists' | 'routines' | 'insights';
  
  // User state awareness
  isFirstTime?: boolean;
  _hasOnboarded?: boolean;
  
  // Customization
  className?: string;
  action?: React.ReactNode;
  
  // Momentum integration
  showMomentum?: boolean;
  momentumScore?: number;
}

export const IntelligentEmptyState: React.FC<IntelligentEmptyStateProps> = ({
  context,
  isFirstTime = false,
  _hasOnboarded = true,
  className = '',
  action,
  showMomentum = false,
  momentumScore = 0
}) => {
  const getContent = () => {
    switch (context) {
      case 'tasks':
        return {
          icon: '🎯',
          title: isFirstTime ? 'Plan your first focus session' : 'Ready for today\'s priorities',
          description: isFirstTime 
            ? 'Start building momentum with your first task. Small steps create big progress.'
            : 'Add your most important task to maintain your daily momentum streak.',
          suggestion: isFirstTime ? 'Try: "Complete project proposal draft"' : 'Try: "Review morning emails"',
          ctaText: isFirstTime ? 'Add First Task' : 'Add Today\'s Priority'
        };
        
      case 'meals':
        return {
          icon: '🥗',
          title: isFirstTime ? 'Plan your first meal' : 'Build your meal routine',
          description: isFirstTime
            ? 'Meal planning saves time and reduces decision fatigue. Start with one meal.'
            : 'Consistent meal planning supports your daily momentum and energy.',
          suggestion: 'Try: "Quick lunch salad" or "Dinner prep"',
          ctaText: 'Plan First Meal'
        };
        
      case 'budget':
        return {
          icon: '💰',
          title: isFirstTime ? 'Track your first transaction' : 'Maintain financial clarity',
          description: isFirstTime
            ? 'Start building awareness of your spending patterns. Every transaction counts.'
            : 'Continue tracking expenses to maintain your financial momentum.',
          suggestion: 'Try: "Morning coffee" or "Grocery run"',
          ctaText: 'Add Transaction'
        };
        
      case 'lists':
        return {
          icon: '📝',
          title: isFirstTime ? 'Create your first list' : 'Organize your thoughts',
          description: isFirstTime
            ? 'Lists help capture ideas and reduce mental clutter. Start simple.'
            : 'Keep your momentum going by organizing today\'s thoughts and tasks.',
          suggestion: 'Try: "Weekend errands" or "Meeting notes"',
          ctaText: 'Create List'
        };
        
      case 'routines':
        return {
          icon: '⏰',
          title: isFirstTime ? 'Build your first routine' : 'Strengthen your daily flow',
          description: isFirstTime
            ? 'Routines create automatic progress. Start with a simple morning ritual.'
            : 'Consistent routines are the foundation of sustained momentum.',
          suggestion: 'Try: "Morning review" or "Evening planning"',
          ctaText: 'Create Routine'
        };
        
      case 'insights':
        return {
          icon: '📊',
          title: isFirstTime ? 'Start building your insights' : 'Your momentum story awaits',
          description: isFirstTime
            ? 'Insights emerge from consistent action. Start tracking to see your patterns.'
            : 'Continue your daily activities to unlock new insights about your progress.',
          suggestion: 'Complete a few tasks to see your first insights',
          ctaText: 'Start Building Momentum'
        };
        
      default:
        return {
          icon: '🌟',
          title: 'Begin your journey',
          description: 'Start building momentum with small, consistent actions.',
          suggestion: 'Choose your first step',
          ctaText: 'Get Started'
        };
    }
  };

  const content = getContent();

  return (
    <Surface className={`p-6 text-center ${className}`}>
      {/* Momentum indicator */}
      {showMomentum && (
        <div className="mb-6 flex justify-center">
          <MomentumRing 
            score={momentumScore} 
            size="md" 
            showPercentage={true}
            showLabel={false}
          />
        </div>
      )}

      {/* Icon with gradient background */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sky to-indigo flex items-center justify-center shadow-sm">
        <span className="text-2xl">{content.icon}</span>
      </div>

      {/* Main content */}
      <Title className="mb-2 text-text-primary">
        {content.title}
      </Title>
      
      <Body className="mb-4 text-text-secondary max-w-sm mx-auto">
        {content.description}
      </Body>

      {/* Smart suggestion */}
      <div className="mb-6 p-3 bg-surface-elevated rounded-lg border border-border-subtle">
        <Caption className="text-text-muted mb-1">Suggested first step:</Caption>
        <Body className="text-sm text-text-primary font-medium">
          {content.suggestion}
        </Body>
      </div>

      {/* Action button */}
      {action || (
        <Button 
          variant="primary" 
          size="md"
          className="bg-gradient-to-r from-sky to-indigo hover:from-sky/90 hover:to-indigo/90"
        >
          {content.ctaText}
        </Button>
      )}

      {/* Encouraging footer */}
      <Caption className="mt-4 text-text-muted">
        {isFirstTime 
          ? 'Every expert was once a beginner. Start today.' 
          : 'Consistency creates momentum. You\'re doing great.'
        }
      </Caption>
    </Surface>
  );
};
