import { type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

type TextTone = "primary" | "secondary" | "muted" | "inverse" | "accent" | "brand";
type TextWeight = "regular" | "medium" | "semibold" | "bold";
type TextAlign = "left" | "center" | "right";
type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";

interface TextBaseProps {
  as?: ElementType;
  children: ReactNode;
  tone?: TextTone;
  weight?: TextWeight;
  size?: TextSize;
  align?: TextAlign;
  truncate?: boolean;
  className?: string;
}

// ============================================================================
// Style Maps
// ============================================================================

const toneClass: Record<TextTone, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  inverse: "text-text-on-primary",
  accent: "text-accent",
  brand: "text-secondary",
};

const weightClass: Record<TextWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const sizeClass: Record<TextSize, string> = {
  xs: "text-xs leading-4",
  sm: "text-sm leading-5",
  base: "text-base leading-6",
  lg: "text-lg leading-7",
  xl: "text-xl leading-7",
  "2xl": "text-2xl leading-8",
  "3xl": "text-3xl leading-9",
};

// ============================================================================
// Base Component
// ============================================================================

function TextBase<C extends ElementType = "span">({
  as,
  children,
  tone = "primary",
  weight = "regular",
  size = "base",
  align = "left",
  truncate = false,
  className,
  ...props
}: TextBaseProps & Omit<ComponentPropsWithoutRef<C>, keyof TextBaseProps>) {
  const Component = as || "span";

  return (
    <Component
      className={clsx(
        toneClass[tone],
        weightClass[weight],
        sizeClass[size],
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
          truncate,
        },
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// Semantic Components
// ============================================================================

interface TextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  tone?: TextTone;
}

/** Page title - largest heading */
export function Title({ children, className, as = "h1" }: TextProps) {
  return (
    <TextBase as={as} size="3xl" weight="bold" tone="primary" className={className}>
      {children}
    </TextBase>
  );
}

/** Section heading */
export function Heading({ children, className, as = "h2" }: TextProps) {
  return (
    <TextBase as={as} size="xl" weight="semibold" tone="primary" className={className}>
      {children}
    </TextBase>
  );
}

/** Subsection heading */
export function Subheading({ children, className, as = "h3" }: TextProps) {
  return (
    <TextBase as={as} size="lg" weight="semibold" tone="primary" className={className}>
      {children}
    </TextBase>
  );
}

/** Standard body text */
export function Body({ children, className }: TextProps) {
  return (
    <TextBase as="p" size="base" weight="regular" tone="primary" className={className}>
      {children}
    </TextBase>
  );
}

/** Secondary/muted body text */
export function BodySmall({ children, className }: TextProps) {
  return (
    <TextBase as="p" size="sm" weight="regular" tone="secondary" className={className}>
      {children}
    </TextBase>
  );
}

/** Caption text - smallest size */
export function Caption({ children, className }: TextProps) {
  return (
    <TextBase as="span" size="xs" weight="regular" tone="muted" className={className}>
      {children}
    </TextBase>
  );
}

/** Label for inputs and sections */
export function Label({ children, className }: TextProps) {
  return (
    <TextBase as="label" size="sm" weight="medium" tone="secondary" className={className}>
      {children}
    </TextBase>
  );
}

/** Emphasized/accent text */
export function Accent({ children, className }: TextProps) {
  return (
    <TextBase as="span" size="base" weight="semibold" tone="accent" className={className}>
      {children}
    </TextBase>
  );
}

/** Metric/number display */
export function Metric({ children, className, as = "span" }: TextProps) {
  return (
    <TextBase as={as} size="2xl" weight="bold" tone="primary" className={className}>
      {children}
    </TextBase>
  );
}

/** Button/CTA text */
export function ButtonText({ children, className }: TextProps) {
  return (
    <TextBase as="span" size="sm" weight="semibold" tone="inverse" className={className}>
      {children}
    </TextBase>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { TextBase as Text };

// ============================================================================
// Aliases (semantic compatibility)
// ============================================================================

/** Hero/large display title */
export function HeroTitle({ children, className, as = "h2", tone = "primary" }: TextProps) {
  return (
    <TextBase as={as} size="2xl" weight="bold" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Supporting text under a hero title */
export function HeroSubtext({ children, className, tone = "secondary" }: TextProps) {
  return (
    <TextBase as="p" size="base" weight="medium" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Smaller supporting text under a hero */
export function HeroSupport({ children, className, tone = "muted" }: TextProps) {
  return (
    <TextBase as="p" size="sm" weight="regular" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Meta / auxiliary text */
export function Meta({ children, className, tone = "muted" }: TextProps) {
  return (
    <TextBase as="span" size="xs" weight="regular" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Soft label */
export function LabelSoft({ children, className, tone = "muted" }: TextProps) {
  return (
    <TextBase as="span" size="sm" weight="medium" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Call-to-action text */
export function CTA({ children, className, tone = "primary" }: TextProps) {
  return (
    <TextBase as="span" size="sm" weight="semibold" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}

/** Highlighted text */
export function Highlight({ children, className, tone = "accent" }: TextProps) {
  return (
    <TextBase as="span" size="base" weight="semibold" tone={tone} className={className}>
      {children}
    </TextBase>
  );
}
