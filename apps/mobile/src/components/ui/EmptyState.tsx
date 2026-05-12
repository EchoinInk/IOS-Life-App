import { type ReactNode } from "react";
import clsx from "clsx";
import { Text } from "@/components/ui/Text";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => (
  <div className={clsx("text-center py-8 px-4", className)}>
    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-subtle flex items-center justify-center">
      <span className="text-2xl opacity-60">📋</span>
    </div>
    <Text size="sm" weight="semibold" tone="primary" className="mb-1">
      {title}
    </Text>
    {description && (
      <Text size="xs" tone="muted" className="mb-3">
        {description}
      </Text>
    )}
    {action && <div>{action}</div>}
  </div>
);
