import { lazy, Suspense, memo } from "react";
import { TAILWIND_ANIMATIONS } from "@/theme/animations";

// Lazy load Insights (correct pattern)
const InsightsCardContainer = lazy(() =>
  import("@/features/insights/components/InsightsCard.container").then((m) => ({ default: m.InsightsCardContainer })),
);

/**
 * Insights Panel
 * 
 * Displays the insights card with loading fallback.
 * Wraps InsightsCardContainer with Suspense and animation.
 * 
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses centralized animation utilities
 * - Lazy loading for code splitting
 */
export const InsightsPanel = memo(() => {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse bg-muted opacity-20 rounded-lg" />}>
      <div className={TAILWIND_ANIMATIONS.fadeIn}>
        <InsightsCardContainer />
      </div>
    </Suspense>
  );
});

InsightsPanel.displayName = 'InsightsPanel';
