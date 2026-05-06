import { type ReactNode } from "react";
import clsx from "clsx";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => (
  <div className={clsx("text-center py-8 px-4", className)}>
    <p className="text-sm font-semibold text-text-primary">{title}</p>
    {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);
