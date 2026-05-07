import { Heading } from "@/components/ui/Text";
import { UpNextCard } from "@/features/today/components/UpNextCard";
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
 */
export const UpNextSection = ({ task, onPress }: UpNextSectionProps) => {
  return (
    <div className="animate-[fadeIn_0.65s_ease-out]">
      <div className="flex items-center justify-between mb-3">
        <Heading className="text-base text-muted">Up Next</Heading>
      </div>

      <UpNextCard task={task} onPress={onPress} />
    </div>
  );
};
