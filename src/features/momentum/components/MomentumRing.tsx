/**
 * Momentum Ring - Circular progress indicator for momentum score
 * Premium, calm visualization without gamification
 * Uses momentum easing for smooth progress feel
 */

import React from 'react';
import clsx from 'clsx';
import { MomentumLevel } from '../types/momentum.types';

interface MomentumRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  level?: MomentumLevel;
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export const MomentumRing: React.FC<MomentumRingProps> = ({
  score,
  size = 'md',
  level = 'building',
  showLabel = true,
  showPercentage = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { width: 60, height: 60, strokeWidth: 4 },
    md: { width: 80, height: 80, strokeWidth: 6 },
    lg: { width: 120, height: 120, strokeWidth: 8 }
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getProgressColor = (level: MomentumLevel) => {
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
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-surface-elevated"
        />
        
        {/* Progress circle with momentum animation */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx(
            getProgressColor(level),
            "transition-all duration-500 ease-motion-momentum",
            "motion-reduce:transition-none",
            score >= 100 && "animate-success-pop motion-reduce:animate-none"
          )}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className={`text-lg font-semibold ${getLabelColor(level)}`}>
            {Math.round(score)}
          </span>
        )}
        {showLabel && (
          <span className="text-xs text-text-muted">
            Momentum
          </span>
        )}
      </div>
    </div>
  );
};
