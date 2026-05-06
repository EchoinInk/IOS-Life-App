import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type CardVariant = "default" | "hero" | "glass" | "budget";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantClass: Record<CardVariant, string> = {
  default: "bg-surface border border-default shadow-card",
  hero: "bg-gradient-primary text-on-primary shadow-elevated",
  glass: "bg-surface/80 backdrop-blur-md border border-default shadow-soft",
  budget: "bg-gradient-primary text-on-primary shadow-elevated",
};

export const Card = ({ variant = "default", className, children, ...props }: CardProps) => (
  <div className={clsx("rounded-2xl overflow-hidden", variantClass[variant], className)} {...props}>
    {children}
  </div>
);

interface CardHeaderProps {
  title: ReactNode;
  id?: string;
  className?: string;
}

export const CardHeader = ({ title, id, className }: CardHeaderProps) => (
  <div className={clsx("px-4 pt-4 pb-2", className)}>
    <h3 id={id} className="text-base font-semibold text-text-primary">
      {title}
    </h3>
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={clsx("px-4 pb-4", className)}>{children}</div>
);
