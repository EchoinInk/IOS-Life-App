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

export const Card = ({ variant = "default", interactive = false, className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      "rounded-xl overflow-hidden",
      variantClass[variant],
      interactive && "transition-all duration-150 ease-out hover:shadow-md active:scale-[0.98]",
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
