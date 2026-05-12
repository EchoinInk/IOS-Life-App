/**
 * Up Next Priority
 *
 * The primary focal point of the dashboard - designed for maximum
 * urgency and immediate action. High contrast, clear hierarchy.
 *
 * Design: Productivity OS command center
 * - Dominant visual weight
 * - Clear task preview
 * - Immediate action affordance
 */
import { memo, useCallback } from "react";
import { ChevronRight, Clock, Play } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";
import { getCategoryMetadata } from "@/features/tasks/domain/taskDomain";
import { getColorClasses } from "@/shared/lib/colorMapper";
import type { Task } from "@/features/tasks/types/types";

export interface UpNextPriorityProps {
  task: Task | null;
  onPress: () => void;
}

const EmptyState = () => (
  <Surface variant="subtle" padding="md" radius="lg" className="w-full">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
        <span className="text-xl">🎉</span>
      </div>
      <div className="flex-1">
        <Text size="base" weight="semibold" tone="primary">
          All caught up
        </Text>
        <Text size="sm" tone="muted" className="mt-0.5">
          No upcoming tasks
        </Text>
      </div>
    </div>
  </Surface>
);

const UrgencyBadge = ({ time }: { time?: string }) => {
  if (!time) return null;

  const timeStr: string = time;
  const hour = parseInt(timeStr.split(":")[0] || "0", 10);
  const isUrgent = hour < 12; // Morning tasks
  const isSoon = hour >= 12 && hour < 17; // Afternoon tasks

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
        ${
          isUrgent
            ? "bg-error/10 text-error"
            : isSoon
            ? "bg-warning/10 text-warning"
            : "bg-surface-elevated text-text-secondary"
        }
      `}>
      <Clock size={12} />
      {time}
    </div>
  );
};

export const UpNextPriority = memo(({ task, onPress }: UpNextPriorityProps) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  if (!task) {
    return <EmptyState />;
  }

  const meta = getCategoryMetadata(task.category);
  const classes = getColorClasses(meta.bg);

  return (
    <button
      type="button"
      onClick={handlePress}
      className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 rounded-lg"
      aria-label={`Complete task: ${task.label}`}
    >
      <Surface
        variant="elevated"
        padding="lg"
        radius="lg"
        className="w-full transition-[shadow,transform] duration-200 group-hover:shadow-sm group-active:scale-[0.98]"
      >
        <div className="flex items-start gap-4">
          {/* Left: Category Icon */}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${classes.bg}`}
          >
            <img
              src={meta.icon}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              decoding="async"
              className="w-5 h-5 object-contain"
            />
          </div>

          {/* Middle: Task Info */}
          <div className="flex-1 min-w-0">
            {/* Label + Time */}
            <div className="flex items-center gap-2 mb-1">
              <Text
                size="base"
                weight="semibold"
                tone="primary"
                className="truncate"
              >
                {task.label}
              </Text>
            </div>

            {/* Category + Time Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Text size="xs" tone="muted">
                {task.category || "Task"}
              </Text>
              {task.time && (
                <>
                  <span className="text-border">•</span>
                  <UrgencyBadge time={task.time} />
                </>
              )}
            </div>
          </div>

          {/* Right: Action Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={12} className="text-primary ml-0.5" />
            </div>
            <ChevronRight
              size={16}
              className="text-text-muted group-hover:text-text-primary transition-colors"
            />
          </div>
        </div>
      </Surface>
    </button>
  );
});

UpNextPriority.displayName = "UpNextPriority";
export default UpNextPriority;
