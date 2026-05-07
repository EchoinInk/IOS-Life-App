import { TodayHeroCard } from "@/features/today/components/TodayHeroCard";

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
 */
export const TodayFocusSection = ({ 
  percentage, 
  total, 
  completed, 
  onAddTask 
}: TodayFocusSectionProps) => {
  return (
    <div className="animate-[fadeIn_0.45s_ease-out]">
      <TodayHeroCard
        percentage={percentage}
        total={total}
        completed={completed}
        onAddTask={onAddTask}
      />
    </div>
  );
};
