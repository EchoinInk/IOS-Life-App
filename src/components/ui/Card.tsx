import { cn } from "@/shared/lib/cn";

type CardProps = {
  children: React.ReactNode;
  variant?: "default" | "budget" | "surface";
  className?: string;
};

export const Card = ({ children, variant = "default", className }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background shadow-sm",
        variant === "budget" && "border-primary/20 bg-primary/5",
        variant === "surface" && "border-border bg-surface",
        className
      )}
    >
      {children}
    </div>
  );
};

type CardHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export const CardHeader = ({ title, children, className }: CardHeaderProps) => {
  return (
    <div className={cn("border-b px-6 py-4", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {children}
    </div>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export const CardBody = ({ children, className }: CardBodyProps) => {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
};
