import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { HeroTitle, HeroSubtext, HeroSupport } from "@/components/ui/Text";
import { IntelligentEmptyState } from "@/components/ui/IntelligentEmptyState";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import clipboardIllustration from "@/assets/3d-clipboard.webp";
import { CategoryList } from "./CategoryList";

interface CategorySummary {
  category: string;
  active: number;
  total: number;
  completed: number;
}

interface Props {
  percentage: number;
  total: number;
  completed: number;
  categories?: CategorySummary[];
  onAddTask?: () => void;
  onViewAll?: () => void;
  onCategoryClick?: (category: string) => void;
  isLoading?: boolean;
}

const TasksHeroCard = ({
  percentage,
  total,
  completed,
  categories = [],
  onAddTask,
  onViewAll,
  onCategoryClick,
  isLoading = false,
}: Props) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = useMemo(
    () => circumference - (percentage / 100) * circumference,
    [circumference, percentage],
  );

  const { progressText, motivation } = useMemo(() => {
  const remaining = Math.max(0, total - completed);

  return {
    progressText:
      total === 0 ? "No tasks today" : `${completed} of ${total} completed`,

    motivation:
      remaining === 0
        ? "All done! 🎉"
        : remaining === 1
        ? "1 task left"
        : `${remaining} tasks left`,
  };
}, [total, completed]);

  return (
    <Card variant="hero" className="relative overflow-hidden">
      <div className="relative p-6">
        {/* PROGRESS RING */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg
              width={radius * 2}
              height={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="var(--border)"
                strokeWidth={stroke}
                fill="none"
              />
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="var(--primary)"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <HeroTitle tone="inverse">
                {Math.round(percentage)}%
              </HeroTitle>
            </div>
          </div>
        </div>

        {/* PROGRESS TEXT */}
        <div className="text-center mb-4">
          <HeroSubtext tone="inverse">
            {progressText}
          </HeroSubtext>
          <HeroSupport tone="inverse">
            {motivation}
          </HeroSupport>
        </div>

        {/* CATEGORIES */}
        <div className="space-y-2">
          {isLoading ? (
            <ul className="space-y-2">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="flex-1 h-4 rounded" />
                </li>
              ))}
            </ul>
          ) : (
            <CategoryList 
              categories={categories}
              onCategoryClick={onCategoryClick}
            />
          )}
          {categories.length === 0 && (
            <IntelligentEmptyState
              context="tasks"
              isFirstTime={true}
              action={
                onAddTask && (
                  <button
                    type="button"
                    onClick={onAddTask}
                    className="text-on-primary text-xs opacity-90 hover:opacity-100 transition-opacity"
                    aria-label="Add your first task"
                  >
                    Add Task
                  </button>
                )
              }
            />
          )}
        </div>

        {/* ACTIONS */}
        {(onAddTask || onViewAll) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-default">
            {onAddTask && (
              <button
                type="button"
                onClick={onAddTask}
                className="flex-1 py-2 px-3 bg-surface-elevated/20 hover:bg-surface-elevated/30 rounded-lg transition-colors text-on-primary text-sm font-medium"
                aria-label="Add new task"
              >
                Add Task
              </button>
            )}
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="flex-1 py-2 px-3 bg-surface-elevated/20 hover:bg-surface-elevated/30 rounded-lg transition-colors text-on-primary text-sm font-medium"
                aria-label="View all tasks"
              >
                View All
              </button>
            )}
          </div>
        )}
      </div>

      {/* BACKGROUND ILLUSTRATION */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={clipboardIllustration}
          alt=""
          loading="lazy"
          decoding="async"
          width={96}
          height={96}
          className="absolute bottom-0 right-0 w-24 h-24 opacity-20"
        />
      </div>
    </Card>
  );
};

TasksHeroCard.displayName = "TasksHeroCard";

export default TasksHeroCard;
