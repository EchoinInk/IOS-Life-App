import clsx from "clsx";

/**
 * LoadingState Motion System
 * - Smooth 800ms spinner rotation with linear easing
 * - Subtle 2s pulse for text
 * - Staggered appearance for visual interest
 * - Reduced motion support
 */
interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingState = ({ message = "Loading...", size = "md" }: LoadingStateProps) => {
  const sizeClass = {
    sm: "min-h-[120px]",
    md: "min-h-[200px]",
    lg: "min-h-[280px]"
  };

  const spinnerSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClass[size]} text-sm text-text-muted`}>
      {/* Spinner with smooth rotation */}
      <div
        className={clsx(
          spinnerSize[size],
          "border-2 border-border border-t-primary rounded-full",
          "animate-spin-smooth motion-reduce:animate-none",
          "mb-3"
        )}
      />
      {/* Message with subtle pulse */}
      {message && (
        <div
          className={clsx(
            "animate-pulse-subtle motion-reduce:animate-none",
            "transition-opacity duration-300"
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingState;
