/**
 * Stack — Vertical layout primitive
 *
 * A foundational layout component for vertical stacking with consistent spacing.
 * Part of the Lumo Design System primitives.
 */
import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type StackSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between" | "around";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spacing?: StackSpacing;
  align?: StackAlign;
  justify?: StackJustify;
  as?: "div" | "section" | "article" | "aside" | "main" | "header" | "footer";
  className?: string;
}

const spacingClass: Record<StackSpacing, string> = {
  none: "gap-0",
  xs: "gap-1",       // 4px
  sm: "gap-2",       // 8px
  md: "gap-3",       // 12px
  lg: "gap-4",       // 16px
  xl: "gap-6",       // 24px
};

const alignClass: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClass: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const Stack = ({
  children,
  spacing = "md",
  align = "stretch",
  justify = "start",
  as: Tag = "div",
  className,
  ...props
}: StackProps) => {
  return (
    <Tag
      className={clsx(
        "flex flex-col",
        spacingClass[spacing],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Stack;
