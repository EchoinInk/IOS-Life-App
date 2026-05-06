import { cn } from "@/shared/lib/cn";

type ListItemBaseProps = {
  label: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const ListItemBase = ({
  label,
  right,
  className,
  onClick,
}: ListItemBaseProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-2",
        onClick && "cursor-pointer hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="flex-1">{label}</div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
};
