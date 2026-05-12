import { memo, useCallback } from "react";
import { Heading } from "@/components/ui/Text";
import { UpNextCard } from "@/features/today/components/UpNextCard";
import { TAILWIND_ANIMATIONS } from "@/theme/animations";
import type { Task } from "@/features/tasks/types/types";

export interface UpNextSectionProps {
  task: Task | null;
  onPress: () => void;
}

/**
 * Up Next Section
 * 
 * Displays the next task to complete.
 * Wraps UpNextCard with section heading and animation.
 * 
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses centralized animation utilities
 * - Memoized callback to prevent child re-renders
 */
export const UpNextSection = memo(({ task, onPress }: UpNextSectionProps) => {
  // Memoize callback to prevent UpNextCard from re-rendering when parent re-renders
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <div className={TAILWIND_ANIMATIONS.fadeIn}>
      <div className="flex items-center justify-between mb-3">
        <Heading className="text-base text-muted">Up Next</Heading>
      </div>

      <UpNextCard task={task} onPress={handlePress} />
    </div>
  );
});

UpNextSection.displayName = 'UpNextSection';
