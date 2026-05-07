/**
 * Screen — Full-screen layout primitive
 *
 * A container for full-screen views with safe area handling.
 * Part of the Lumo Design System primitives.
 */
import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type ScreenPadding = "none" | "sm" | "md" | "lg";

interface ScreenProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: ScreenPadding;
  withBottomNav?: boolean;
  className?: string;
}

const paddingClass: Record<ScreenPadding, string> = {
  none: "",
  sm: "px-3 pt-3",
  md: "px-4 pt-4",
  lg: "px-5 pt-5",
};

export const Screen = ({
  children,
  padding = "md",
  withBottomNav = true,
  className,
  ...props
}: ScreenProps) => {
  return (
    <div
      className={clsx(
        "min-h-screen bg-background",
        paddingClass[padding],
        withBottomNav && "pb-[calc(80px+env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-[430px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Screen;
