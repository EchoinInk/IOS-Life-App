/**
 * Inline — Horizontal layout primitive
 *
 * A foundational layout component for horizontal inline stacking with consistent spacing.
 * Part of the Lumo Design System primitives.
 */
import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type InlineSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";
type InlineJustify = "start" | "center" | "end" | "between" | "around";

interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spacing?: InlineSpacing;
  align?: InlineAlign;
  justify?: InlineJustify;
  wrap?: boolean;
  className?: string;
}

const spacingClass: Record<InlineSpacing, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

const alignClass: Record<InlineAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const justifyClass: Record<InlineJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const Inline = ({
  children,
  spacing = "md",
  align = "center",
  justify = "start",
  wrap = false,
  className,
  ...props
}: InlineProps) => {
  return (
    <div
      className={clsx(
        "flex flex-row",
        spacingClass[spacing],
        alignClass[align],
        justifyClass[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Inline;
