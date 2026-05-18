import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import { tokens } from "./src/theme/tokens";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],

  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "430px", // mobile-first constraint
      },
    },

    extend: {
      colors: {
        /* SURFACE (CSS VARIABLES) */
        background: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-glass": "var(--surface-glass)",
        "surface-hover": "var(--surface-hover)",
        "surface-active": "var(--surface-active)",
        "surface-inset": "var(--surface-inset)",

        /* TEXT */
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-on-primary": "var(--text-on-primary)",

        /* BORDER */
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",

        /* SEMANTIC */
        primary: {
          DEFAULT: "var(--primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
        },
        success: {
          DEFAULT: "var(--success)",
        },
        error: {
          DEFAULT: "var(--error)",
        },
        warning: {
          DEFAULT: "var(--warning)",
        },
        info: {
          DEFAULT: "var(--info)",
        },
      },

      backgroundImage: {
        "gradient-primary": tokens.gradients.primary,
        "gradient-signature": tokens.gradients.signature,
        "gradient-soft": tokens.gradients.soft,
        "gradient-accent": tokens.gradients.accent,
        "gradient-action": tokens.gradients.action,
      },

      boxShadow: {
        xs: tokens.shadows.xs,
        sm: tokens.shadows.sm,
        md: tokens.shadows.md,
        lg: tokens.shadows.lg,
        xl: tokens.shadows.xl,
        focus: tokens.shadows.focus,
        "focus-visible": tokens.shadows.focusVisible,
      },

      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
        "2xl": tokens.radius["2xl"],
      },

      spacing: {
        "0.5": tokens.spacing[0.5],
        "1.5": tokens.spacing[1.5],
        "2.5": tokens.spacing[2.5],
        "3.5": tokens.spacing[3.5],
      },

      transitionDuration: {
        "50": "50ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
      },

      transitionTimingFunction: {
        "motion-out": "cubic-bezier(0, 0, 0.2, 1)",
        "motion-out-sharp": "cubic-bezier(0.33, 1, 0.68, 1)",
        "motion-in": "cubic-bezier(0.4, 0, 1, 1)",
        "motion-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "motion-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "motion-momentum": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  safelist: [
    "bg-primary",
    "bg-secondary",
    "bg-accent",
    "bg-success",
    "bg-error",
    "bg-warning",
    "bg-info",

    "text-primary",
    "text-secondary",
    "text-accent",
    "text-success",
    "text-error",
    "text-warning",
    "text-info",

    "border-primary",
    "border-secondary",
    "border-accent",
    "border-success",
    "border-error",
    "border-warning",
    "border-info",
  ],

  plugins: [
    tailwindcssAnimate,

    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
} satisfies Config;