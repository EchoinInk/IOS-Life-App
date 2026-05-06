import clsx from "clsx";
import { type HTMLAttributes } from "react";

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("animate-pulse rounded-md bg-muted/50", className)} {...props} />
);
