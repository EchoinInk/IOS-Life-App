import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  Heading,
  HeroTitle,
  HeroSubtext,
  HeroSupport,
  CTA,
} from "@/components/ui/Text";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import clipboardIllustration from "@/assets/3d-clipboard.webp";

export interface TodayHeroCardViewModel {
  percentage: number;
  total: number;
  remaining: number;
  progressText: string;
  motivation: string | null;
  onAddTask?: () => void;
  isLoading?: boolean;
}

export const TodayHeroCardView = ({
  model,
}: {
  model: TodayHeroCardViewModel;
}) => {
  const {
    percentage,
    total,
    remaining,
    progressText,
    motivation,
    onAddTask,
    isLoading = false,
  } = model;

  const navigate = useNavigate();

  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <Card variant="hero" className="overflow-hidden p-0 shadow-pop">
      <div className="flex items-center gap-5 px-6 py-10">
        {/* Progress ring */}
        <div className="relative shrink-0 h-[104px] w-[104px]">
          <svg viewBox="0 0 72 72" className="w-full h-full">
            <circle
              stroke="currentColor"
              className="text-on-primary/30"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="currentColor"
              className="text-on-primary origin-center -rotate-90 transition-[stroke-dashoffset] duration-500 ease-out"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-on-primary/70 tracking-wide">
              Progress
            </span>
            <Heading className="text-on-primary text-shadow-soft text-lg">
              {percentage}%
            </Heading>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Title */}
          <HeroTitle className="text-on-primary text-shadow-soft">
            Today’s Tasks
          </HeroTitle>

          {/* Primary info (stronger clarity) */}
          <HeroSubtext className="text-on-primary/90">
            {total === 0
              ? "No tasks yet today"
              : remaining === 0
              ? "All tasks completed 🎉"
              : progressText}
          </HeroSubtext>

          {/* Secondary support */}
          {motivation && (
            <HeroSupport className="text-on-primary/75">
              {motivation}
            </HeroSupport>
          )}

          {/* CTA / Status */}
          {isLoading ? (
            <Skeleton className="h-8 w-32 rounded-full mt-2" />
          ) : total === 0 ? (
            <button
              type="button"
              onClick={() => {
                if (onAddTask) {
                  onAddTask();
                } else {
                  navigate("/tasks");
                }
              }}
              aria-label={total === 0 ? "Add your first task" : "Add a task"}
              className="
                mt-3
                px-4 py-2
                rounded-full
                bg-primary-foreground
                text-foreground
                shadow-cta
                active:scale-[0.97] motion-reduce:active:scale-100
                transition
                flex items-center gap-1
                w-fit
                font-medium
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80
              "
            >
              <CTA className="flex items-center gap-1 tracking-tight">
                Add your first task
                <ArrowRight size={14} className="opacity-60" />
              </CTA>
            </button>
          ) : (
            <span
              className="
                mt-3
                px-3 py-1
                rounded-full
                bg-primary-foreground/20
                text-on-primary
                text-xs
                font-medium
                w-fit
              "
            >
              {remaining === 0
                ? "All done 🎉"
                : remaining === 1
                ? "1 task left"
                : `${remaining} tasks left`}
            </span>
          )}
        </div>

        {/* Illustration */}
        <img
          src={clipboardIllustration}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width={84}
          height={84}
          className="
            hidden sm:block
            w-[84px] h-[84px]
            object-contain
            shrink-0
            opacity-90
          "
        />
      </div>
    </Card>
  );
};