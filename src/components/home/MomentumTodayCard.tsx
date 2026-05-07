/**
 * Momentum Today Card - Enhanced today card with momentum insights
 * Integrates momentum system into home dashboard
 */

import React from 'react';
import { Surface } from '@/components/ui/Surface';
import { Body, Caption } from '@/components/ui/Text';
import { MomentumRing } from '@/features/momentum/components/MomentumRing';
import { StreakDisplay } from '@/features/momentum/components/StreakDisplay';
import { useMomentumToday } from '@/features/momentum/hooks/useMomentumToday';
import { useRoutineMomentumSummary } from '@/features/routines/integration/routineMomentumHook';

export const MomentumTodayCard: React.FC = () => {
  const { todayScore, momentumLevel, longestStreak, weeklyTrend, insights } = useMomentumToday();
  const routineSummary = useRoutineMomentumSummary();

  const getMomentumMessage = (level: string, score: number): string => {
    if (score === 0) return 'Start building your momentum today';
    
    switch (level) {
      case 'excelling':
        return 'You\'re performing at an elite level';
      case 'growing':
        return 'Your momentum is building strong';
      case 'maintaining':
        return 'You\'re keeping steady progress';
      default:
        return 'Building your foundation';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <Surface className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Body className="font-medium text-text-primary">
            Today's Momentum
          </Body>
          <div className="flex items-center space-x-1">
            <span className="text-sm">{getTrendIcon(weeklyTrend)}</span>
            <Caption className="text-text-muted">
              {weeklyTrend === 'up' ? 'Improving' : weeklyTrend === 'down' ? 'Declining' : 'Stable'}
            </Caption>
          </div>
        </div>

        {/* Main content */}
        <div className="flex items-center space-x-4">
          {/* Momentum ring */}
          <MomentumRing 
            score={todayScore} 
            level={momentumLevel}
            size="lg"
            showPercentage={true}
            showLabel={false}
          />
          
          {/* Momentum info */}
          <div className="flex-1 space-y-2">
            <Body className="text-lg font-semibold text-text-primary">
              {getMomentumMessage(momentumLevel, todayScore)}
            </Body>
            
            <Caption className="text-text-secondary">
              {Math.round(todayScore)}% daily score
            </Caption>
            
            {/* Longest streak */}
            <div className="flex items-center space-x-2">
              <StreakDisplay 
                streak={longestStreak}
                size="sm"
                showLabel={false}
                showMotivation={false}
              />
            </div>
          </div>
        </div>

        {/* Key insights */}
        {insights.length > 0 && (
          <div className="border-t border-border pt-3">
            <Caption className="text-text-muted mb-2">
              Today's Insights
            </Caption>
            <div className="space-y-1">
              {insights.slice(0, 2).map((insight) => (
                <div key={insight.id} className="flex items-start space-x-2">
                  <span className="text-xs mt-0.5">
                    {insight.isPositive ? '💡' : '🎯'}
                  </span>
                  <Caption className="text-text-secondary flex-1">
                    {insight.content}
                  </Caption>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routine progress */}
        {routineSummary.totalRoutines > 0 && (
          <div className="border-t border-border pt-3">
            <Caption className="text-text-muted mb-2">
              Routine Progress
            </Caption>
            <div className="flex items-center justify-between">
              <Caption className="text-text-secondary">
                {routineSummary.completedRoutines}/{routineSummary.totalRoutines} completed
              </Caption>
              <Caption className="text-text-primary font-medium">
                {routineSummary.completionRate}%
              </Caption>
            </div>
            {routineSummary.longestStreak > 0 && (
              <Caption className="text-text-muted mt-1">
                Best streak: {routineSummary.longestStreak} days
              </Caption>
            )}
          </div>
        )}
      </div>
    </Surface>
  );
};
