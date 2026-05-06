import { cn } from "@/shared/lib/cn";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted max-w-sm">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};
