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
  default: "bg-surface border border-border shadow-sm",
  elevated: "bg-surface-elevated border border-border shadow-md",
  subtle: "bg-surface-subtle border border-border-subtle",
  inset: "bg-surface-inset shadow-inner",
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

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = "default", padding = "md", radius = "lg", interactive = false, as: Tag = "div", ...props }, ref) => {
    return (
      <Tag
        ref={ref as never}
        className={clsx(
          variantClass[variant],
          paddingClass[padding],
          radiusClass[radius],
          interactive && "transition-all duration-150 ease-out hover:bg-surface-elevated active:scale-[0.98]",
          className,
        )}
        {...props}
      />
    );
  },
);

Surface.displayName = "Surface";
