// src/features/today/components/TodayQuickActionsGrid.tsx

import { Body, Heading, Meta } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";

import taskillustration from "@/assets/tasksquickactions.webp";
import mealillustration from "@/assets/mealquickactions.webp";
import budgetillustration from "@/assets/budgetquickactions.webp";
import routineillustration from "@/assets/3d-clipboard.webp";

interface CardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

interface Props {
  tasks: number;
  meals: number;
  remaining: number;
  routinesCompleted: number;
  routinesTotal: number;
  onAddTask?: () => void;
  onAddMeal?: () => void;
  onAddExpense?: () => void;
  onStartRoutine?: () => void;
}

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  onClick,
  ariaLabel,
}: CardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative w-full text-left active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-[transform] duration-200 ease-motion-out min-h-14 hover:-translate-y-0.5 motion-reduce:active:scale-100 motion-reduce:hover:translate-y-0"
    >
      <Card
        variant="subtle"
        className="p-4 opacity-90"
      >
        <div className="flex items-center gap-3">
          {/* Left: text */}
          <div className="flex-1 min-w-0 flex flex-col">
            <Body tone="muted">{title}</Body>

            <Heading className="mt-1 tracking-tight">
              {value}
            </Heading>

            <Meta tone="muted" className="mt-1">
              {subtitle}
            </Meta>
          </div>

          {/* Right: icon - no background, larger size */}
          <div className="shrink-0 opacity-80">
            {icon}
          </div>
        </div>
      </Card>
    </button>
  );
};

const TodayQuickActionsGrid = ({
  tasks,
  meals,
  remaining,
  routinesCompleted,
  routinesTotal,
  onAddTask,
  onAddMeal,
  onAddExpense,
  onStartRoutine,
}: Props) => {
  const routinePercentage = routinesTotal > 0 ? Math.round((routinesCompleted / routinesTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <SummaryCard
        title="Tasks"
        value={tasks}
        subtitle="To do"
        ariaLabel={`Tasks: ${tasks} to do`}
        icon={
          <img
            src={taskillustration}
            srcSet={`${taskillustration} 1x`}
            sizes="(max-width: 768px) 48px, 48px"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="object-contain"
          />
        }
                onClick={onAddTask || (() => {})}
      />

      <SummaryCard
        title="Meals"
        value={meals}
        subtitle="Planned"
        ariaLabel={`Meals: ${meals} planned`}
        icon={
          <img
            src={mealillustration}
            srcSet={`${mealillustration} 1x`}
            sizes="(max-width: 768px) 48px, 48px"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="object-contain"
          />
        }
        onClick={onAddMeal || (() => {})}
      />

      <SummaryCard
        title="Budget"
        value={`$${remaining}`}
        subtitle="Left this week"
        ariaLabel={`Budget: $${remaining} left this week`}
        icon={
          <img
            src={budgetillustration}
            srcSet={`${budgetillustration} 1x`}
            sizes="(max-width: 768px) 48px, 48px"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="object-contain"
          />
        }
        onClick={onAddExpense || (() => {})}
      />

      <SummaryCard
        title="Routines"
        value={routinePercentage}
        subtitle="Complete"
        ariaLabel={`Routines: ${routinePercentage}% complete`}
        icon={
          <img
            src={routineillustration}
            srcSet={`${routineillustration} 1x`}
            sizes="(max-width: 768px) 48px, 48px"
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="object-contain"
          />
        }
        onClick={onStartRoutine || (() => {})}
      />
    </div>
  );
};

export default TodayQuickActionsGrid;
