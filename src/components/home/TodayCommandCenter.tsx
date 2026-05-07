/**
 * Today Command Center
 *
 * A compact, dashboard-style daily overview that provides
 * high-signal information density without visual clutter.
 *
 * Design: Premium productivity OS aesthetic
 * - Linear-style metric display
 * - Arc Browser-inspired density
 * - Raycast-level scan speed
 */
import { memo } from "react";
import { CheckCircle2, Circle, TrendingUp, Calendar } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";

export interface TodayCommandCenterProps {
  percentage: number;
  total: number;
  completed: number;
  remaining: number;
  onAddTask: () => void;
}

const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-surface-inset rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs font-medium text-text-secondary w-10 text-right">
      {percentage}%
    </span>
  </div>
);

const MetricItem = ({
  icon: Icon,
  value,
  label,
  tone = "primary",
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  tone?: "primary" | "success" | "muted";
}) => {
  const toneClass = {
    primary: "text-text-primary",
    success: "text-success",
    muted: "text-text-muted",
  };

  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className={`${toneClass[tone]} opacity-70`} />
      <span className={`text-sm font-semibold ${toneClass[tone]}`}>{value}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
};

export const TodayCommandCenter = memo(({
  percentage,
  total,
  completed,
  remaining,
  onAddTask,
}: TodayCommandCenterProps) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const isComplete = remaining === 0 && total > 0;
  const isEmpty = total === 0;

  return (
    <Surface
      variant="default"
      padding="md"
      radius="lg"
      className="w-full"
    >
      <div className="space-y-3">
        {/* Header Row: Date + Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-text-muted" />
            <Text size="sm" weight="medium" tone="secondary">
              {today}
            </Text>
          </div>
          <div className="flex items-center gap-1.5">
            {isComplete ? (
              <>
                <CheckCircle2 size={14} className="text-success" />
                <Text size="xs" weight="medium" tone="primary" className="text-success">
                  All done
                </Text>
              </>
            ) : isEmpty ? (
              <>
                <Circle size={14} className="text-text-muted" />
                <Text size="xs" tone="muted">No tasks</Text>
              </>
            ) : (
              <>
                <TrendingUp size={14} className="text-primary" />
                <Text size="xs" weight="medium" tone="primary">
                  {remaining} left
                </Text>
              </>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <ProgressBar percentage={percentage} />

        {/* Metrics Row */}
        <div className="flex items-center gap-4 pt-1">
          <MetricItem
            icon={CheckCircle2}
            value={completed}
            label="done"
            tone={completed > 0 ? "success" : "muted"}
          />
          <div className="w-px h-4 bg-border-subtle" />
          <MetricItem
            icon={Circle}
            value={remaining}
            label="left"
            tone={remaining > 0 ? "primary" : "muted"}
          />
          <div className="w-px h-4 bg-border-subtle" />
          <MetricItem
            icon={TrendingUp}
            value={total}
            label="total"
            tone="muted"
          />
        </div>

        {/* Action Row - Only show when empty */}
        {isEmpty && (
          <button
            onClick={onAddTask}
            className="w-full py-2 px-3 bg-surface-elevated hover:bg-surface text-text-primary text-sm font-medium rounded-md transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            + Add your first task
          </button>
        )}
      </div>
    </Surface>
  );
});

TodayCommandCenter.displayName = "TodayCommandCenter";
export default TodayCommandCenter;
