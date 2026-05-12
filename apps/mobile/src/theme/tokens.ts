/**
 * Lumo Design Tokens — Premium Productivity OS Aesthetic
 *
 * Design Principles:
 * - Reduced glassmorphism for clarity
 * - Tighter spacing for information density
 * - Stronger typography hierarchy
 * - Subtle, refined elevation
 * - Consistent interaction states
 *
 * Rules:
 * - No raw hex values outside this file
 * - Import from this file only
 * - No duplication, no legacy aliases
 */

const brand = {
  sky: "#0EA5E9",
  indigo: "#4F46E5",
  violet: "#7C3AED",
  magenta: "#EC4899",
  coral: "#F97316",
  lime: "#22C55E",
} as const;

export const tokens = {
  colors: {
    brand,
    surface: {
      light: {
        background: "#F8FAFC",
        default: "#FFFFFF",
        elevated: "#F1F5F9",
        subtle: "#F8FAFC",
        inset: "#E2E8F0",
      },
      dark: {
        background: "#0A0F1E",
        default: "#111827",
        elevated: "#1E293B",
        subtle: "#0F172A",
        inset: "#020617",
      },
    },
    text: {
      light: {
        primary: "#0F172A",
        secondary: "#475569",
        muted: "#94A3B8",
        placeholder: "#CBD5E1",
        onPrimary: "#FFFFFF",
        onDark: "#0F172A",
      },
      dark: {
        primary: "#F8FAFC",
        secondary: "#94A3B8",
        muted: "#64748B",
        placeholder: "#475569",
        onPrimary: "#0F172A",
        onDark: "#FFFFFF",
      },
    },
    border: {
      light: "#E2E8F0",
      lightSubtle: "#F1F5F9",
      dark: "#1E293B",
      darkSubtle: "#0F172A",
    },
    semantic: {
      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
      info: "#0EA5E9",
    },
  },

  gradients: {
    primary: `linear-gradient(135deg, ${brand.sky} 0%, ${brand.indigo} 100%)`,
    signature: `linear-gradient(135deg, ${brand.sky} 0%, ${brand.violet} 50%, ${brand.magenta} 100%)`,
    soft: `linear-gradient(135deg, ${brand.sky} 0%, ${brand.indigo} 100%)`,
    accent: `linear-gradient(135deg, ${brand.violet} 0%, ${brand.magenta} 100%)`,
    action: `linear-gradient(135deg, ${brand.sky} 0%, ${brand.indigo} 100%)`,
    hero: `linear-gradient(135deg, ${brand.indigo} 0%, ${brand.violet} 100%)`,
  },

  typography: {
    display: {
      size: "1.5rem",    // 24px
      lineHeight: "2rem", // 32px
      letterSpacing: "-0.02em",
      weight: 700,
    },
    title: {
      size: "1.25rem",    // 20px
      lineHeight: "1.75rem", // 28px
      letterSpacing: "-0.01em",
      weight: 600,
    },
    body: {
      size: "0.875rem",   // 14px
      lineHeight: "1.5rem",  // 24px
      letterSpacing: "0",
      weight: 400,
    },
    label: {
      size: "0.75rem",    // 12px
      lineHeight: "1rem", // 16px
      letterSpacing: "0.01em",
      weight: 500,
    },
    caption: {
      size: "0.6875rem",  // 11px
      lineHeight: "1rem", // 16px
      letterSpacing: "0.01em",
      weight: 400,
    },
  },

  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",   // 2px
    1: "0.25rem",      // 4px
    1.5: "0.375rem",   // 6px
    2: "0.5rem",       // 8px
    2.5: "0.625rem",   // 10px
    3: "0.75rem",      // 12px
    3.5: "0.875rem",   // 14px
    4: "1rem",         // 16px
    5: "1.25rem",      // 20px
    6: "1.5rem",       // 24px
    8: "2rem",         // 32px
    10: "2.5rem",      // 40px
    12: "3rem",        // 48px
  },

  radius: {
    none: "0",
    sm: "0.25rem",     // 4px
    md: "0.375rem",    // 6px
    lg: "0.5rem",      // 8px
    xl: "0.75rem",     // 12px
    "2xl": "1rem",     // 16px
    full: "9999px",
  },

  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 1px -1px rgba(0, 0, 0, 0.02)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.02)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
    focus: "0 0 0 2px rgba(79, 70, 229, 0.2)",
    focusVisible: "0 0 0 2px rgba(79, 70, 229, 0.3), 0 0 0 4px rgba(79, 70, 229, 0.1)",
  },

  blur: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },

  opacity: {
    disabled: 0.4,
    subtle: 0.06,
    muted: 0.12,
    hover: 0.08,
    pressed: 0.12,
    overlay: 0.5,
  },

  states: {
    hover: {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
      scale: "scale-[0.98]",
      brightness: "brightness-105",
    },
    active: {
      transition: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
      scale: "scale-[0.96]",
      brightness: "brightness-95",
    },
    pressed: {
      transition: "50ms cubic-bezier(0.4, 0, 0.2, 1)",
      scale: "scale-95",
      brightness: "brightness-90",
    },
    disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    loading: {
      opacity: 0.7,
      cursor: "wait",
    },
  },

  zIndex: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

export type Tokens = typeof tokens;
