import { memo } from "react";
import { TodayHeroCard } from "@/features/today/components/TodayHeroCard";
import { TAILWIND_ANIMATIONS } from "@/theme/animations";

export interface TodayFocusSectionProps {
  percentage: number;
  total: number;
  completed: number;
  onAddTask: () => void;
}

/**
 * Today Focus Section
 * 
 * Displays the hero card showing today's task progress.
 * Wraps TodayHeroCard with home-specific context.
 * 
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses centralized animation utilities
 */
export const TodayFocusSection = memo(({ 
  percentage, 
  total, 
  completed, 
  onAddTask 
}: TodayFocusSectionProps) => {
  return (
    <div className={TAILWIND_ANIMATIONS.fadeIn}>
      <TodayHeroCard
        percentage={percentage}
        total={total}
        completed={completed}
        onAddTask={onAddTask}
      />
    </div>
  );
});

TodayFocusSection.displayName = 'TodayFocusSection';
