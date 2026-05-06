import { type ReactNode } from "react";
import clsx from "clsx";

interface ListItemBaseProps {
  label: ReactNode;
  right?: ReactNode;
  left?: ReactNode;
  className?: string;
}

export const ListItemBase = ({ label, right, left, className }: ListItemBaseProps) => (
  <div className={clsx("flex items-center gap-3 min-h-10", className)}>
    {left && <div className="shrink-0">{left}</div>}
    <div className="flex-1 min-w-0">{label}</div>
    {right && <div className="shrink-0">{right}</div>}
  </div>
);
