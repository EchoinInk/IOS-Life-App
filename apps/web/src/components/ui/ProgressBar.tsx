import { memo } from "react";
import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "muted";
  className?: string;
  ariaLabel?: string;
}

/**
 * ProgressBar Motion System
 * - Momentum easing (cubic-bezier 0.16, 1, 0.3, 1) for progress feel
 * - 300ms duration for visible but not sluggish progress
 * - Subtle shimmer on complete for positive feedback
 * - Smooth width transitions using CSS custom properties
 */
const ProgressBarBase = ({
  value,
  max = 100,
  size = "md",
  variant = "gradient",
  className,
  ariaLabel,
}: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isComplete = pct >= 100;

  const sizeClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const trackClass = {
    default: "bg-surface-elevated",
    gradient: "bg-surface-elevated",
    muted: "bg-surface-elevated",
  };

  const fillClass = {
    default: "bg-primary",
    gradient: "bg-gradient-primary",
    muted: "bg-text-muted",
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={clsx(
        "w-full rounded-full overflow-hidden",
        sizeClass[size],
        trackClass[variant],
        className,
      )}
    >
      <div
        className={clsx(
          "h-full rounded-full relative",
          "transition-[width] duration-300 ease-motion-momentum",
          "motion-reduce:transition-none",
          fillClass[variant],
          isComplete && "animate-success-pop motion-reduce:animate-none"
        )}
        style={{ width: `${pct}%` }}
      >
        {/* Subtle shimmer overlay for visual interest */}
        <div
          className={clsx(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "animate-shimmer motion-reduce:animate-none"
          )}
        />
      </div>
    </div>
  );
};

export const ProgressBar = memo(ProgressBarBase);
