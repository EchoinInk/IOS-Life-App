import { type ReactNode } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

interface CheckboxRowProps {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export const CheckboxRow = ({ checked, onToggle, children, className }: CheckboxRowProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={checked}
    className={clsx(
      "w-full flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      className,
    )}
  >
    <span
      className={clsx(
        "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
        checked ? "bg-primary border-primary text-on-primary" : "border-default bg-surface",
      )}
    >
      {checked && <Check size={14} />}
    </span>
    <span className="flex-1 min-w-0">{children}</span>
  </button>
);
