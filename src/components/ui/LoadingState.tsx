import { cn } from "@/shared/lib/cn";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export const LoadingState = ({
  label = "Loading...",
  className,
}: LoadingStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 text-muted",
        className
      )}
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
};