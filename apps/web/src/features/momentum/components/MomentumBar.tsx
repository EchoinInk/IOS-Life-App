/**
 * Momentum Bar - Horizontal progress indicator for momentum
 * Clean, minimalist progress visualization
 */

import React from 'react';
import { MomentumLevel } from '../types/momentum.types';

interface MomentumBarProps {
  score: number;
  level?: MomentumLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export const MomentumBar: React.FC<MomentumBarProps> = ({
  score,
  level = 'building',
  size = 'md',
  showLabel = true,
  showPercentage = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { height: 'h-2' },
    md: { height: 'h-3' },
    lg: { height: 'h-4' }
  };

  const getGradientClass = (level: MomentumLevel) => {
    switch (level) {
      case 'building':
        return 'bg-gradient-to-r from-warning to-warning';
      case 'maintaining':
        return 'bg-gradient-to-r from-info to-info';
      case 'growing':
        return 'bg-gradient-to-r from-success to-success';
      case 'excelling':
        return 'bg-gradient-to-r from-accent to-accent';
      default:
        return 'bg-gradient-to-r from-text-muted to-text-muted';
    }
  };

  const getLabelColor = (level: MomentumLevel) => {
    switch (level) {
      case 'building':
        return 'text-warning';
      case 'maintaining':
        return 'text-info';
      case 'growing':
        return 'text-success';
      case 'excelling':
        return 'text-accent';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center">
          {showLabel && (
            <span className="text-sm font-medium text-text-primary">
              Momentum
            </span>
          )}
          {showPercentage && (
            <span className={`text-sm font-semibold ${getLabelColor(level)}`}>
              {Math.round(score)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-surface-elevated rounded-full overflow-hidden ${sizeConfig[size].height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getGradientClass(level)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};
