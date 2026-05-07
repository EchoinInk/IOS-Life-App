import { lazy, Suspense } from "react";

// Lazy load Insights (correct pattern)
const InsightsCardContainer = lazy(() =>
  import("@/features/insights/components/InsightsCard.container").then((m) => ({ default: m.InsightsCardContainer })),
);

/**
 * Insights Panel
 * 
 * Displays the insights card with loading fallback.
 * Wraps InsightsCardContainer with Suspense and animation.
 */
export const InsightsPanel = () => {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse bg-muted opacity-20 rounded-lg" />}>
      <div className="animate-[fadeIn_1.05s_ease-out]">
        <InsightsCardContainer />
      </div>
    </Suspense>
  );
};
