# Lumo Motion System

A premium, momentum-focused animation system designed for perceived responsiveness, continuity, and emotional polish.

## Design Principles

- **Responsiveness First**: Immediate feedback on every interaction (50-100ms)
- **Continuity Second**: Smooth state transitions without jarring jumps
- **Delight Third**: Subtle enhancements that reinforce momentum without distraction

## Motion Style

- **Fast**: 50-250ms for most interactions
- **Subtle**: Opacity and transform only, minimal movement (2-5% scale)
- **Intentional**: Every animation reinforces progress or completion
- **Calm**: No bounce, no overshoot, no flash

## Architecture

### Core Files

| File | Purpose |
|------|---------|
| `src/theme/motion.ts` | Centralized animation tokens, presets, and utilities |
| `src/index.css` | Keyframe definitions and CSS motion variables |
| `tailwind.config.ts` | Tailwind animation utilities and custom keyframes |

### Token Structure

```typescript
// Durations (ms)
DURATION.instant  // 50ms  - Micro-feedback
DURATION.micro    // 100ms - Active/pressed states
DURATION.fast     // 150ms - Hover transitions
DURATION.normal   // 200ms - Standard transitions
DURATION.slow     // 300ms - Emphasis animations
DURATION.page     // 400ms - Page transitions

// Easing Curves
EASING.easeOut        // cubic-bezier(0, 0, 0.2, 1)       - Deceleration
EASING.easeOutSharp   // cubic-bezier(0.33, 1, 0.68, 1)   - Fast deceleration
EASING.momentum       // cubic-bezier(0.16, 1, 0.3, 1)    - Emphasizes movement
EASING.spring         // cubic-bezier(0.34, 1.56, 0.64, 1) - Subtle bounce
```

## Animation Presets

### Interaction States
- `hover`: 150ms, ease-out, background/border/shadow
- `active`: 100ms, sharp ease-out, transform/opacity
- `focus`: 150ms, ease-out, ring transitions
- `disabled`: 200ms, ease-in-out, opacity fade

### Entrance Animations
- `fadeIn`: 200ms opacity fade
- `fadeInUp`: 200ms fade + 8px upward slide (momentum easing)
- `scaleIn`: 300ms fade + scale from 96% (spring easing)
- `slideInBottom`: 400ms slide from bottom (mobile sheets)

### Progress & Momentum
- `progressFill`: 300ms width transition (momentum easing)
- `ringProgress`: 500ms SVG stroke animation
- `completion`: Success pop animation (spring)

### Loading States
- `skeleton`: 1.5s shimmer animation
- `spinner`: 800ms smooth rotation
- `contentReveal`: 300ms fade-in

## Component Implementations

### Button
```tsx
// Fast 100ms response, subtle 2% scale, shadow feedback
transition-[filter,transform,box-shadow] duration-100 ease-motion-out-sharp
active:scale-[0.98] active:shadow-none
```

### Card
```tsx
// Lift on hover, compression on press
transition-all duration-150 ease-motion-out
hover:-translate-y-0.5 hover:shadow-md
active:translate-y-0 active:scale-[0.99]
```

### Surface
```tsx
// Background shift with depth
transition-all duration-150 ease-motion-out
hover:bg-surface-elevated hover:shadow-sm
active:scale-[0.99] active:bg-surface-active
```

### BottomNav
```tsx
// Smooth active indicator, icon scale feedback
transition-all duration-150 ease-motion-out
active:scale-[0.97]
// Active indicator with scale animation
transition-all duration-200 ease-motion-out
isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
```

### ProgressBar
```tsx
// Momentum easing for progress feel
transition-[width] duration-300 ease-motion-momentum
// Completion celebration
isComplete && "animate-success-pop"
// Shimmer overlay
animate-shimmer
```

### BottomSheetDialog
```tsx
// Backdrop fade
bg-background/80 backdrop-blur-sm
transition-opacity duration-200 ease-motion-out
// Sheet slide with momentum
transition-transform duration-300 ease-motion-momentum
isClosing ? "translate-y-full" : "translate-y-0"
```

## Accessibility

### Reduced Motion Support
All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-in-up,
  /* ... */ {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

### Implementation Pattern
```tsx
className={clsx(
  "transition-all duration-150 ease-motion-out",
  "motion-reduce:transition-none",
  interactive && "hover:shadow-md active:scale-[0.99]"
)}
```

## CSS Custom Properties

```css
:root {
  /* Durations */
  --motion-instant: 50ms;
  --motion-micro: 100ms;
  --motion-fast: 150ms;
  --motion-normal: 200ms;
  --motion-slow: 300ms;
  --motion-page: 400ms;

  /* Easing */
  --motion-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --motion-ease-out-sharp: cubic-bezier(0.33, 1, 0.68, 1);
  --motion-momentum: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Stagger */
  --motion-stagger-normal: 50ms;
}
```

## Tailwind Utilities

### Custom Animations
```html
<div class="animate-fade-in">
<div class="animate-fade-in-up">
<div class="animate-scale-in">
<div class="animate-slide-in-bottom">
<div class="animate-spin-smooth">
<div class="animate-skeleton">
<div class="animate-success-pop">
```

### Custom Timing
```html
<div class="duration-50">
<div class="duration-100">
<div class="ease-motion-out">
<div class="ease-motion-momentum">
```

## Usage Examples

### Basic Hover/Active Pattern
```tsx
<button className="
  transition-all duration-150 ease-motion-out
  hover:bg-surface-elevated hover:shadow-sm
  active:scale-[0.98] active:bg-surface-active
  motion-reduce:transition-none
">
```

### Staggered List Entrance
```tsx
<ul>
  {items.map((item, i) => (
    <li
      key={item.id}
      className="animate-fade-in-up"
      style={{ animationDelay: `${i * 50}ms` }}
    >
      {item.name}
    </li>
  ))}
</ul>
```

### Progress with Momentum
```tsx
<div
  className="
    transition-[width] duration-300 ease-motion-momentum
    motion-reduce:transition-none
  "
  style={{ width: `${percentage}%` }}
/>
```

## Performance Notes

- All animations use `transform` and `opacity` only (GPU accelerated)
- `will-change` is applied strategically via CSS
- Animations are disabled for reduced motion preference
- Exit animations use faster durations (100-150ms) than entrance (200-400ms)

## Design Targets

Inspired by:
- **Linear**: Subtle, fast, professional
- **Arc Browser**: Smooth, continuous motion
- **Apple apps**: Native-quality responsiveness
- **Superhuman**: Fast, intentional, polished

## Not

- Gamified (no points, badges, celebrations)
- Flashy (no parallax, no complex sequences)
- Over-animated (no entrance on every element)
- Dopamine-heavy (calm, not stimulating)
