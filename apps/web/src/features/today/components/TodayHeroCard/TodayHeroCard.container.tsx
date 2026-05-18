import { TodayHeroCardView, type TodayHeroCardViewModel } from "./TodayHeroCard.view";
import { useMemo } from "react";

interface TodayHeroCardProps {
  percentage: number;
  total: number;
  completed: number;
  onAddTask?: () => void;
  isLoading?: boolean;
}

export const TodayHeroCard = ({
  percentage,
  total,
  completed,
  onAddTask,
  isLoading = false,
}: TodayHeroCardProps) => {
  const model = useMemo(() => {
    const remaining = total - completed;
    const progressText = total === 0 
      ? "No tasks today 🎉"
      : remaining === 0 
      ? "All tasks completed 🎉"
      : `${completed} of ${total} completed`;
    
    const motivation = total === 0 
      ? null 
      : percentage >= 75 
      ? "You're doing great!" 
      : percentage >= 50 
      ? "Keep going!" 
      : "Let's get started!";

    return {
      percentage,
      total,
      remaining,
      progressText,
      motivation,
      onAddTask,
      isLoading,
    } as TodayHeroCardViewModel;
  }, [percentage, total, completed, onAddTask, isLoading]);

  return <TodayHeroCardView model={model} />;
};
