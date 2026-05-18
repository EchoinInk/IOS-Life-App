/**
 * Section — Content grouping primitive
 *
 * A container for grouping related content with consistent spacing.
 * Part of the Lumo Design System primitives.
 */
import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type SectionSpacing = "none" | "sm" | "md" | "lg";
type SectionPadding = "none" | "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  spacing?: SectionSpacing;
  padding?: SectionPadding;
  className?: string;
}

const spacingClass: Record<SectionSpacing, string> = {
  none: "space-y-0",
  sm: "space-y-2",
  md: "space-y-3",
  lg: "space-y-4",
};

const paddingClass: Record<SectionPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export const Section = ({
  children,
  spacing = "md",
  padding = "none",
  className,
  ...props
}: SectionProps) => {
  return (
    <section
      className={clsx(
        spacingClass[spacing],
        paddingClass[padding],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section;
