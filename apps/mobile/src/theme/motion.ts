/**
 * Lumo Motion System — Premium Momentum-Focused Animations
 *
 * Design Principles:
 * - Responsiveness first: immediate feedback on interaction
 * - Continuity second: smooth state transitions
 * - Delight third: subtle enhancements without distraction
 *
 * Motion Style:
 * - Fast: 50-250ms for most interactions
 * - Subtle: opacity and transform only, minimal movement
 * - Intentional: every animation reinforces momentum/progress
 * - Calm: no bounce, no overshoot, no flash
 *
 * Performance:
 * - CSS transforms and opacity only (GPU accelerated)
 * - will-change applied strategically
 * - Reduced motion respected via media query
 */

// ============================================================================
// DURATIONS
// ============================================================================

/**
 * Duration tokens for consistent timing across the app.
 * All values in milliseconds.
 */
export const DURATION = {
  /** Instant feedback - 50ms */
  instant: 50,
  /** Micro-interactions - 100ms */
  micro: 100,
  /** Fast interactions - 150ms */
  fast: 150,
  /** Standard transitions - 200ms */
  normal: 200,
  /** Emphasis animations - 300ms */
  slow: 300,
  /** Page transitions - 400ms */
  page: 400,
} as const;

export type Duration = keyof typeof DURATION;

// ============================================================================
// EASING CURVES
// ============================================================================

/**
 * Premium easing curves for refined motion.
 * Uses cubic-bezier for precise control.
 */
export const EASING = {
  /** Linear for continuous animations */
  linear: "linear",
  /** Standard ease-out: deceleration only */
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  /** Sharp ease-out: faster deceleration */
  easeOutSharp: "cubic-bezier(0.33, 1, 0.68, 1)",
  /** Standard ease-in: acceleration only */
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  /** Standard ease-in-out: gentle acceleration and deceleration */
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Spring-like but subtle: minimal bounce */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Momentum: emphasizes forward movement */
  momentum: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export type Easing = keyof typeof EASING;

// ============================================================================
// STAGGER DELAYS
// ============================================================================

/**
 * Stagger timing for list and grid animations.
 */
export const STAGGER = {
  /** Tight stagger - 30ms */
  tight: 30,
  /** Standard stagger - 50ms */
  normal: 50,
  /** Relaxed stagger - 80ms */
  relaxed: 80,
  /** Page section stagger - 100ms */
  section: 100,
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Pre-configured animation combinations for common patterns.
 * Each preset includes duration, easing, and CSS properties.
 */
export const PRESETS = {
  // --------------------------------------------------------------------------
  // INTERACTION STATES
  // --------------------------------------------------------------------------

  /** Hover state transition - subtle lift */
  hover: {
    duration: DURATION.fast,
    easing: EASING.easeOut,
    properties: ["background-color", "border-color", "box-shadow"],
  },

  /** Active/pressed state - immediate feedback */
  active: {
    duration: DURATION.micro,
    easing: EASING.easeOutSharp,
    properties: ["transform", "opacity"],
  },

  /** Focus state - clear but subtle */
  focus: {
    duration: DURATION.fast,
    easing: EASING.easeOut,
    properties: ["box-shadow", "outline"],
  },

  /** Disabled state - gradual fade */
  disabled: {
    duration: DURATION.normal,
    easing: EASING.easeInOut,
    properties: ["opacity", "transform"],
  },

  // --------------------------------------------------------------------------
  // ENTRANCE ANIMATIONS
  // --------------------------------------------------------------------------

  /** Fade in - for subtle appearance */
  fadeIn: {
    duration: DURATION.normal,
    easing: EASING.easeOut,
    properties: ["opacity"],
  },

  /** Fade in up - for cards and content */
  fadeInUp: {
    duration: DURATION.normal,
    easing: EASING.momentum,
    properties: ["opacity", "transform"],
    transform: "translateY(8px) translateY(0)",
  },

  /** Fade in down - for dropdowns and modals */
  fadeInDown: {
    duration: DURATION.normal,
    easing: EASING.momentum,
    properties: ["opacity", "transform"],
    transform: "translateY(-8px) translateY(0)",
  },

  /** Scale in - for modals and dialogs */
  scaleIn: {
    duration: DURATION.slow,
    easing: EASING.spring,
    properties: ["opacity", "transform"],
    transform: "scale(0.96) scale(1)",
  },

  /** Slide in from bottom - for mobile sheets */
  slideInBottom: {
    duration: DURATION.page,
    easing: EASING.momentum,
    properties: ["transform"],
    transform: "translateY(100%) translateY(0)",
  },

  /** Slide in from right - for navigation */
  slideInRight: {
    duration: DURATION.page,
    easing: EASING.momentum,
    properties: ["transform"],
    transform: "translateX(100%) translateX(0)",
  },

  // --------------------------------------------------------------------------
  // EXIT ANIMATIONS
  // --------------------------------------------------------------------------

  /** Fade out - for subtle disappearance */
  fadeOut: {
    duration: DURATION.fast,
    easing: EASING.easeIn,
    properties: ["opacity"],
  },

  /** Scale out - for modals and dialogs */
  scaleOut: {
    duration: DURATION.fast,
    easing: EASING.easeIn,
    properties: ["opacity", "transform"],
    transform: "scale(1) scale(0.96)",
  },

  /** Slide out to bottom - for mobile sheets */
  slideOutBottom: {
    duration: DURATION.normal,
    easing: EASING.easeIn,
    properties: ["transform"],
    transform: "translateY(0) translateY(100%)",
  },

  // --------------------------------------------------------------------------
  // PROGRESS & MOMENTUM
  // --------------------------------------------------------------------------

  /** Progress bar fill - smooth and responsive */
  progressFill: {
    duration: DURATION.slow,
    easing: EASING.easeOut,
    properties: ["width"],
  },

  /** Ring progress - SVG stroke animation */
  ringProgress: {
    duration: DURATION.slow,
    easing: EASING.momentum,
    properties: ["stroke-dashoffset"],
  },

  /** Completion celebration - subtle success feedback */
  completion: {
    duration: DURATION.slow,
    easing: EASING.spring,
    properties: ["transform", "opacity"],
  },

  /** Streak pulse - subtle rhythm indication */
  streakPulse: {
    duration: 2000,
    easing: EASING.easeInOut,
    properties: ["opacity", "transform"],
  },

  // --------------------------------------------------------------------------
  // LOADING STATES
  // --------------------------------------------------------------------------

  /** Skeleton shimmer - elegant loading indication */
  skeleton: {
    duration: 1500,
    easing: EASING.easeInOut,
    properties: ["background-position"],
  },

  /** Spinner continuous - minimal rotation */
  spinner: {
    duration: 800,
    easing: EASING.linear,
    properties: ["transform"],
  },

  /** Content placeholder fade - smooth reveal */
  contentReveal: {
    duration: DURATION.slow,
    easing: EASING.easeOut,
    properties: ["opacity"],
  },
} as const;

export type MotionPreset = keyof typeof PRESETS;

// ============================================================================
// TACTILE FEEDBACK
// ============================================================================

/**
 * Tactile feedback configurations for interactive elements.
 * Combines scale, opacity, and timing for satisfying interactions.
 */
export const TACTILE = {
  /** Button press - subtle compression */
  button: {
    scale: "scale-[0.97]",
    opacity: 0.9,
    duration: DURATION.micro,
    easing: EASING.easeOutSharp,
  },

  /** Card press - deeper compression */
  card: {
    scale: "scale-[0.98]",
    opacity: 0.95,
    duration: DURATION.micro,
    easing: EASING.easeOutSharp,
  },

  /** List item press - minimal feedback */
  listItem: {
    scale: "scale-[0.99]",
    opacity: 0.95,
    duration: DURATION.instant,
    easing: EASING.easeOut,
  },

  /** Quick action press - satisfying response */
  quickAction: {
    scale: "scale-[0.95]",
    opacity: 0.9,
    duration: DURATION.micro,
    easing: EASING.easeOutSharp,
  },
} as const;

// ============================================================================
// DEPTH & ELEVATION
// ============================================================================

/**
 * Shadow and elevation transitions for depth feedback.
 * Shadow values reference the design tokens from tokens.ts
 */
export const DEPTH = {
  /** Rest state - minimal shadow (xs from tokens) */
  rest: {
    shadowClass: "shadow-xs",
    transform: "translateY(0)",
  },

  /** Hover state - slight lift (md from tokens) */
  hover: {
    shadowClass: "shadow-md",
    transform: "translateY(-1px)",
    transition: `${DURATION.fast}ms ${EASING.easeOut}`,
  },

  /** Active state - pressed down (xs from tokens) */
  active: {
    shadowClass: "shadow-xs",
    transform: "translateY(0.5px)",
    transition: `${DURATION.micro}ms ${EASING.easeOutSharp}`,
  },

  /** Elevated - card on surface (md from tokens) */
  elevated: {
    shadowClass: "shadow-md",
    transition: `${DURATION.normal}ms ${EASING.easeOut}`,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion.
 * Safe for SSR - returns false if window is not defined.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get motion-safe duration (0ms if reduced motion preferred).
 */
export const getMotionDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};

/**
 * Create a CSS transition string from preset.
 */
export const createTransition = (
  preset: MotionPreset,
  customProperties?: string[]
): string => {
  const config = PRESETS[preset];
  const properties = customProperties || config.properties;
  return `${properties.join(", ")} ${config.duration}ms ${config.easing}`;
};

/**
 * Create animation style object for inline styles.
 */
export const createAnimationStyle = (
  preset: MotionPreset,
  delay?: number
): React.CSSProperties => {
  const config = PRESETS[preset];
  return {
    animationDuration: `${getMotionDuration(config.duration)}ms`,
    animationTimingFunction: config.easing,
    animationFillMode: "forwards",
    animationDelay: delay ? `${delay}ms` : undefined,
    willChange: config.properties.join(", "),
  };
};

/**
 * Calculate stagger delay for list items.
 */
export const calculateStagger = (
  index: number,
  baseDelay: number = STAGGER.normal,
  maxDelay: number = 500
): number => {
  const delay = index * baseDelay;
  return Math.min(delay, maxDelay);
};

/**
 * Hardware acceleration hints for smooth animations.
 */
export const hardwareAccelerated: React.CSSProperties = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
  perspective: 1000,
};

// ============================================================================
// TAILWIND CLASSES
// ============================================================================

/**
 * Tailwind CSS class combinations for common motion patterns.
 * These provide consistent utility classes for the design system.
 * Note: Components use inline classes instead for better tree-shaking.
 */
export const MOTION_CLASSES = {
  // Reduced motion
  reducedMotion: "motion-reduce:transition-none motion-reduce:animate-none",
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  DURATION,
  EASING,
  STAGGER,
  PRESETS,
  TACTILE,
  DEPTH,
  MOTION_CLASSES,
  prefersReducedMotion,
  getMotionDuration,
  createTransition,
  createAnimationStyle,
  calculateStagger,
  hardwareAccelerated,
};
