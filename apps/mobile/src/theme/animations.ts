/**
 * Tailwind animation class names for use in components.
 * Kept minimal and static for tree-shaking friendliness.
 */
export const TAILWIND_ANIMATIONS = {
  fadeIn: "animate-in fade-in duration-300",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-2 duration-300",
  fadeInDown: "animate-in fade-in slide-in-from-top-2 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  slideInBottom: "animate-in slide-in-from-bottom-full duration-300",
  slideInRight: "animate-in slide-in-from-right-full duration-300",
} as const;
