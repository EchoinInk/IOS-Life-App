import { cn } from "@/shared/lib/cn";

type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
};

export const CheckboxRow = ({ checked, onToggle, children, className }: CheckboxRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 cursor-pointer transition-colors hover:bg-muted/50",
        className
      )}
      onClick={onToggle}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
            checked
              ? "border-primary bg-primary"
              : "border-border bg-background"
          )}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
