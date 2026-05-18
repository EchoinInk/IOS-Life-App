import { forwardRef, type HTMLAttributes } from "react";
import clsx from "clsx";

type SurfaceVariant = "default" | "elevated" | "subtle" | "inset";
type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg";
type SurfaceRadius = "sm" | "md" | "lg" | "xl";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  interactive?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

const variantClass: Record<SurfaceVariant, string> = {
  default: "bg-surface border border-border",
  elevated: "bg-surface-elevated border border-border",
  subtle: "bg-surface-subtle border border-border-subtle",
  inset: "bg-surface-inset",
};

const paddingClass: Record<SurfacePadding, string> = {
  none: "",
  xs: "p-1.5",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

const radiusClass: Record<SurfaceRadius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
};

/**
 * Surface Motion System
 * - 150ms transitions for responsive feedback
 * - Subtle background color shift on hover
 * - 2% scale compression on press
 * - Smooth shadow transitions for depth
 */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = "default", padding = "md", radius = "lg", interactive = false, as: Tag = "div", ...props }, ref) => {
    return (
      <Tag
        ref={ref as never}
        className={clsx(
          variantClass[variant],
          paddingClass[padding],
          radiusClass[radius],
          interactive && [
            "transition-[background-color,transform,box-shadow] duration-150 ease-motion-out",
            "hover:bg-surface-elevated hover:shadow-sm",
            "active:scale-[0.99] active:bg-surface-active",
            "motion-reduce:transition-none",
          ],
          className,
        )}
        {...props}
      />
    );
  },
);

Surface.displayName = "Surface";
