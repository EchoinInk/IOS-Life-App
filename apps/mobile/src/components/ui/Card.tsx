import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type CardVariant = "default" | "elevated" | "hero" | "subtle" | "budget";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  interactive?: boolean;
}

const variantClass: Record<CardVariant, string> = {
  default: "bg-surface border border-border shadow-sm",
  elevated: "bg-surface-elevated border border-border shadow-md",
  hero: "bg-gradient-primary text-text-on-primary shadow-md",
  subtle: "bg-surface-subtle border border-border-subtle",
  budget: "bg-gradient-primary text-text-on-primary shadow-md",
};

/**
 * Card Motion System
 * - 150ms transitions for smooth state changes
 * - 1px lift on hover for depth feedback
 * - 2% scale compression on press for tactile feel
 * - Shadow progression: none → sm → md on hover
 */
export const Card = ({ variant = "default", interactive = false, className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      "rounded-xl overflow-hidden",
      variantClass[variant],
      interactive && [
        "transition-[transform,box-shadow] duration-150 ease-motion-out",
        "hover:-translate-y-0.5 hover:shadow-md",
        "active:translate-y-0 active:scale-[0.99] active:shadow-sm",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      ],
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: ReactNode;
  id?: string;
  className?: string;
}

export const CardHeader = ({ title, id, className }: CardHeaderProps) => (
  <div className={clsx("px-3 pt-3 pb-1.5", className)}>
    <h3 id={id} className="text-sm font-semibold text-text-primary">
      {title}
    </h3>
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={clsx("px-3 pb-3", className)}>{children}</div>
);
