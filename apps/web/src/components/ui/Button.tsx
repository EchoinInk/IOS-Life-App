import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Button Motion System
 * - Fast 100ms active response for immediate tactile feedback
 * - Subtle 2% scale reduction on press (not too deep)
 * - 150ms hover transitions for smooth state changes
 * - Consistent focus rings for accessibility
 */
const baseClass = `
  inline-flex items-center justify-center gap-2 font-semibold rounded-lg
  transition-[filter,transform,opacity] duration-150 ease-motion-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2
  disabled:pointer-events-none disabled:opacity-50 disabled:scale-100
  motion-reduce:transition-none
`;

const variantClass: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-text-on-primary
    hover:brightness-105 hover:shadow-sm
    active:scale-[0.98] active:brightness-95 active:shadow-none
    transition-[filter,transform,box-shadow] duration-100 ease-motion-out-sharp
  `,
  secondary: `
    bg-surface border border-border text-text-primary
    hover:bg-surface-elevated hover:border-border-subtle hover:shadow-sm
    active:scale-[0.98] active:bg-surface-active active:shadow-none
    transition-[background-color,border-color,transform,box-shadow] duration-100 ease-motion-out-sharp
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface-elevated hover:text-text-primary
    active:scale-[0.98] active:bg-surface-active
    transition-[background-color,color,transform] duration-100 ease-motion-out-sharp
  `,
  danger: `
    bg-error text-text-on-primary
    hover:brightness-105 hover:shadow-sm
    active:scale-[0.98] active:brightness-95 active:shadow-none
    transition-[filter,transform,box-shadow] duration-100 ease-motion-out-sharp
  `,
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          baseClass,
          variantClass[variant],
          sizeClass[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
