import { ChevronRight } from "lucide-react";
import { Body, Meta } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { getCategoryMetadata } from "@/features/tasks/api";
import { getColorClasses } from "@/shared/lib/colorMapper";
import type { Task } from "@/features/tasks/types/types";

interface UpNextCardProps {
  task: Task | null;
  onPress?: () => void;
}

export const UpNextCard = ({ task, onPress }: UpNextCardProps) => {
  if (!task) {
    return (
      <Card variant="elevated" className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center">
            <span className="text-xl">🎉</span>
          </div>
          <div className="flex-1">
            <Body className="font-medium text-sm">No tasks for today</Body>
            <Meta tone="muted" className="text-xs">Enjoy your free day!</Meta>
          </div>
        </div>
      </Card>
    );
  }

  const meta = getCategoryMetadata(task.category ?? undefined);
  const classes = getColorClasses(meta.bg);

  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 rounded-xl"
    >
      <Card variant="elevated" interactive className="p-3">
        <div className="flex items-center gap-3">
          {/* Left: Icon */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${classes.bg}`}
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

          {/* Middle: Title + Subtitle */}
          <div className="flex-1 min-w-0">
            <Body className="font-medium text-sm truncate">{task.label}</Body>
            {task.time && (
              <Meta tone="muted" className="text-xs mt-0.5">
                {task.time}
              </Meta>
            )}
            {task.category && !task.time && (
              <Meta tone="muted" className="text-xs mt-0.5">
                {task.category}
              </Meta>
            )}
          </div>

          {/* Right: Chevron */}
          <ChevronRight size={18} className="text-text-muted shrink-0" />
        </div>
      </Card>
    </button>
  );
};

export default UpNextCard;
