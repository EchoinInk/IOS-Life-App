/**
 * Today Focus Card — single dominant focal point.
 * Combines daily progress, the next task, and the primary CTA into
 * one dense, high-signal surface.
 */
import { memo, useCallback } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";
import { getCategoryMetadata } from "@/features/tasks/domain/taskDomain";
import type { Task } from "@/features/tasks/types/types";

export interface TodayFocusCardProps {
  percentage: number;
  total: number;
  completed: number;
  remaining: number;
  nextTask: Task | null;
  onAddTask: () => void;
  onCompleteNext: () => void;
  // Routine integration props
  routineProgress?: {
    morningCompleted: boolean;
    eveningCompleted: boolean;
    routinePercentage: number;
    activeRoutine: string | null;
  };
}

const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const TodayFocusCard = memo(
  ({
    percentage,
    total,
    completed,
    remaining,
    nextTask,
    onAddTask,
    onCompleteNext,
    routineProgress,
  }: TodayFocusCardProps) => {
    const isEmpty = total === 0;
    const isDone = !isEmpty && remaining === 0;

    const handleComplete = useCallback(() => {
      if (nextTask) onCompleteNext();
    }, [nextTask, onCompleteNext]);

    const meta = nextTask ? getCategoryMetadata(nextTask.category) : null;

    // Routine progress indicators
    const showRoutineProgress = routineProgress && (routineProgress.morningCompleted || routineProgress.eveningCompleted || routineProgress.activeRoutine);

    return (
      <Surface
        variant="default"
        padding="none"
        radius="lg"
        className="w-full overflow-hidden"
      >
        {/* HEADER ROW — date + progress score */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
              Today
            </span>
            <span className="text-[11px] text-text-secondary">·</span>
            <span className="text-[11px] text-text-secondary">{formatDate()}</span>
            {showRoutineProgress && (
              <>
                <span className="text-[11px] text-text-secondary">·</span>
                <span className="text-[11px] font-medium text-text-primary">
                  {routineProgress?.routinePercentage}% routines
                </span>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <Text size="sm" weight="bold" tone="primary">
              {completed}
            </Text>
            <Text size="xs" weight="medium" tone="secondary">
              / {total} done
            </Text>
          </div>
        </div>

        {/* PROGRESS BAR — slim, sharp */}
        <div className="px-4 pb-3">
          <div className="h-1.5 w-full bg-surface-inset rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-500 ease-out shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>

        {/* NEXT TASK ROW — the dominant focal element */}
        <div className="px-4 pb-3.5">
          {isEmpty ? (
            <button
              type="button"
              onClick={onAddTask}
              className="group w-full flex items-center justify-between rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border/50 hover:border-border px-3 py-2.5 transition-all duration-200 active:scale-[0.99] active:bg-surface-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                  <Plus size={16} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <Text size="sm" weight="bold" tone="primary">
                    Plan your day
                  </Text>
                  <Text size="xs" weight="medium" tone="secondary" className="mt-0.5">
                    Add your first task
                  </Text>
                </div>
              </div>
              <ArrowRight size={15} className="text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          ) : isDone ? (
            <div className="flex items-center justify-between rounded-lg bg-success/10 border border-success/20 px-3 py-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center shadow-sm">
                  <Check size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <Text size="sm" weight="bold" tone="primary">
                    All clear for today
                  </Text>
                  <Text size="xs" weight="medium" tone="secondary" className="mt-0.5">
                    {completed} {completed === 1 ? "task" : "tasks"} completed
                  </Text>
                </div>
              </div>
              <button
                type="button"
                onClick={onAddTask}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Add more
              </button>
            </div>
          ) : nextTask ? (
            <div className="flex items-stretch gap-2">
              {/* Complete checkbox — large primary affordance */}
              <button
                type="button"
                onClick={handleComplete}
                aria-label={`Complete ${nextTask.label}`}
                className="shrink-0 w-10 h-10 rounded-lg border-2 border-border/60 bg-surface-elevated hover:bg-primary/10 hover:border-primary/50 hover:text-primary text-text-secondary transition-all duration-200 flex items-center justify-center active:scale-95 active:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shadow-sm"
              >
                <Check size={16} strokeWidth={2.5} />
              </button>

              {/* Task body */}
              <div className="flex-1 min-w-0 rounded-lg bg-surface-elevated border border-border/30 px-3 py-2 flex items-center gap-3 shadow-sm">
                {meta && (
                  <img
                    src={meta.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain shrink-0 opacity-90"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Text
                    size="sm"
                    weight="bold"
                    tone="primary"
                    className="truncate leading-tight"
                  >
                    {nextTask.label}
                  </Text>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Text size="xs" weight="medium" tone="secondary" className="truncate">
                      Up next
                      {nextTask.category ? ` · ${nextTask.category}` : ""}
                    </Text>
                    {nextTask.time && (
                      <span className="text-[11px] tabular-nums text-text-primary font-semibold">
                        {nextTask.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer meta — remaining count */}
          {!isEmpty && !isDone && (
            <div className="mt-2.5 flex items-center justify-between">
              <Text size="xs" weight="medium" tone="secondary">
                {remaining} {remaining === 1 ? "task" : "tasks"} left ·{" "}
                {percentage}% complete
              </Text>
              <button
                type="button"
                onClick={onAddTask}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                + Add task
              </button>
            </div>
          )}
        </div>
      </Surface>
    );
  },
);

TodayFocusCard.displayName = "TodayFocusCard";
export default TodayFocusCard;
