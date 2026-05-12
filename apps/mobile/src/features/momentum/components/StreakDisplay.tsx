/**
 * Streak Display - Shows current streak information
 * Subtle, elegant streak visualization without gamification
 */

import React from 'react';
import { Streak } from '../types/momentum.types';
import { STREAK_TYPE_LABELS } from '../types/momentum.types';

interface StreakDisplayProps {
  streak: Streak;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showMotivation?: boolean;
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streak,
  size = 'md',
  showLabel = true,
  showMotivation = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { iconSize: 'text-lg', textSize: 'text-sm', spacing: 'space-y-1' },
    md: { iconSize: 'text-xl', textSize: 'text-base', spacing: 'space-y-2' },
    lg: { iconSize: 'text-2xl', textSize: 'text-lg', spacing: 'space-y-3' }
  };

  const config = sizeConfig[size];

  const getStreakIcon = (currentLength: number): string => {
    if (currentLength === 0) return '🔥';
    if (currentLength < 3) return '✨';
    if (currentLength < 7) return '🌟';
    if (currentLength < 14) return '⭐';
    if (currentLength < 30) return '💫';
    return '🌠';
  };

  const getStreakColor = (level: string): string => {
    switch (level) {
      case 'excelling':
        return 'text-accent';
      case 'growing':
        return 'text-success';
      case 'maintaining':
        return 'text-info';
      default:
        return 'text-warning';
    }
  };

  const getMotivationMessage = (streak: Streak): string => {
    if (streak.currentLength === 0) {
      return 'Start your streak today';
    }
    
    if (streak.currentLength === 1) {
      return 'You\'re on a roll';
    }
    
    if (streak.currentLength < 7) {
      return 'Keep it going';
    }
    
    if (streak.currentLength < 30) {
      return 'Amazing consistency';
    }
    
    return 'Legendary dedication';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Streak icon */}
      <div className={`${config.iconSize} ${getStreakColor(streak.momentumLevel)}`}>
        {getStreakIcon(streak.currentLength)}
      </div>
      
      {/* Streak info */}
      <div className={config.spacing}>
        {showLabel && (
          <div className="text-xs text-text-muted">
            {STREAK_TYPE_LABELS[streak.type]}
          </div>
        )}
        
        <div className={`${config.textSize} font-semibold text-text-primary`}>
          {streak.currentLength} {streak.currentLength === 1 ? 'day' : 'days'}
        </div>
        
        {showMotivation && streak.currentLength > 0 && (
          <div className="text-xs text-text-secondary">
            {getMotivationMessage(streak)}
          </div>
        )}
      </div>
    </div>
  );
};
