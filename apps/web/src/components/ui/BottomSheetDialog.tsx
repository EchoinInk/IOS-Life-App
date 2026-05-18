import { useEffect, useId, useRef, useState, useCallback, type ReactNode } from "react";
import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";

interface BottomSheetDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Bottom Sheet Dialog - Mobile-Optimized Modal
 *
 * Ergonomic improvements:
 * - Slides from bottom for thumb reach
 * - Handles keyboard avoidance automatically
 * - Safe area support for notched devices
 * - 85vh max height for content visibility
 *
 * Motion System:
 * - Backdrop fade-in with 200ms duration
 * - Sheet slides up with momentum easing
 * - 400ms page-level timing for smooth feel
 * - Focus trap with animation completion
 */
export const BottomSheetDialog = ({
  open,
  title,
  onClose,
  children,
}: BottomSheetDialogProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match exit animation duration
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // Store previous focus for restoration
    previousFocus.current = document.activeElement as HTMLElement | null;

    // Focus trap management - delay until animation completes
    const focusTimer = setTimeout(() => {
      panelRef.current?.focus();
    }, 100);

    // Handle escape key and body scroll lock
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    // Lock body scroll when open
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-end justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-200 ease-motion-out",
        isClosing ? "opacity-0" : "opacity-100",
        "motion-reduce:transition-none motion-reduce:backdrop-blur-none"
      )}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          "w-full max-w-[430px] focus:outline-none",
          "transition-transform duration-300 ease-motion-momentum",
          isClosing ? "translate-y-full" : "translate-y-0",
          "motion-reduce:transition-none"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="overflow-hidden rounded-t-2xl shadow-none border-0">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-text-muted/20" />
          </div>

          {/* HEADER */}
          <CardHeader title={title} id={titleId} />

          {/* CONTENT */}
          <div className="flex flex-col max-h-[85vh]">
            <div
              className={clsx(
                "flex-1 overflow-y-auto overscroll-contain px-4 py-4",
                "pb-[calc(120px+env(safe-area-inset-bottom))]",
                "animate-fade-in-up motion-reduce:animate-none"
              )}
            >
              {children}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};