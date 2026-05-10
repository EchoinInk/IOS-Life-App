# Component Philosophy

Lumo components are not UI decorations; they are behavioral surfaces. They exist to:
- Reduce cognitive load — components make decisions easier, not harder
- Support inconsistent capacity — components adapt when the user has less energy
- Maintain emotional safety — components never shame, pressure, or overwhelm
- Adapt to user state — components change based on capacity, not just preference
- Minimize interaction cost — every tap, decision, and moment of friction matters
- Create predictable, low-friction flows — users know what to expect

Components must be:
- **Simple** — easy to understand, easy to use, easy to maintain
- **Predictable** — consistent behavior across the app
- **Domain-aligned** — components map to domain concepts, not abstract UI patterns
- **State-driven** — components render from domain state, not internal assumptions
- **Event-aware** — components emit meaningful events, not noise
- **Low-density by default** — components start minimal, expand only when appropriate
- **Adaptive in behavior, not appearance** — components change how they work, not just how they look

---

## Core Principles

The principles that govern all components:

### Behavior-First
Components exist to support behavioral loops, not to express visual identity. A task component is not a "card" — it is a surface for completing, deferring, or engaging with a task. The visual presentation serves the behavior, not the reverse.

### State-Driven
Components render based on domain state, not internal assumptions. A task component receives task state from the Tasks Domain. It does not guess, infer, or maintain parallel state. The component is a view onto domain truth.

### Event-Minimal
Components emit only meaningful events; no noise, no micro-events. A task completion emits `task.completed`. It does not emit `button.pressed`, `animation.started`, `view.updated`. Events describe what happened in domain terms.

### Adaptive Density
Components expand or collapse based on user capacity and context. In low-energy mode, a task component shows only the title and a single completion button. In high-momentum mode, it may show metadata, actions, and detail. The same component adapts its density.

### Low Interaction Cost
Every component must minimize taps, decisions, and friction. Primary actions require one tap. Secondary actions require at most two. Text input is optional, never required for core flows. Every interaction is measured and minimized.

### Predictable Patterns
Components behave consistently across domains. A task completion works like a routine completion. A meal capture works like a task capture. Patterns established in one domain transfer to others. Users learn once, apply everywhere.

### No Over-Abstraction
Prefer explicit, domain-aligned components over generic UI abstractions. A `TaskCard` is better than a `Card` with task props. A `MealPicker` is better than a `Picker` with meal options. Abstraction introduces indirection; indirection introduces cognitive load.

### Cognitive Safety
Components avoid overwhelming layouts, surprise states, or punitive feedback. Components do not flash red for missed tasks. They do not celebrate loudly for completions. They do not present unexpected complexity. They remain calm, predictable, and safe.

---

## Component Categories

Components are organized into three categories with clear responsibilities.

### 1. Domain Components

These represent domain concepts: Tasks, Meals, Routines, Habits, Calendar Items.

**They:**
- Map directly to domain state — one component per domain concept
- Emit domain events — `task.completed`, `routine.started`, not `button.clicked`
- Never contain cross-domain logic — a Task component knows nothing about Routines
- Are stable and long-lived — domain concepts persist, so do their components
- Define the behavioral contract for their domain — how users interact with this concept

**Examples:**
- `TaskItem` — displays a task, emits task events
- `RoutineRow` — displays a routine, emits routine events
- `MealCard` — displays a meal entry, emits meal events
- `HabitStreak` — displays habit progress, emits habit events

**Rules:**
- Domain components import domain state selectors only
- Domain components emit only their domain's events
- Domain components do not import other domain components
- Domain components adapt based on Adaptive State, but do not own adaptive logic

### 2. Interaction Components

These manage user interaction patterns: Sheets, Pickers, Toggles, Editors.

**They:**
- Handle structured input — dates, times, choices, text
- Enforce low cognitive load — minimal options, smart defaults, clear hierarchy
- Support adaptive pacing — expand or simplify based on capacity
- Avoid multi-step flows unless necessary — single-screen interaction preferred

**Examples:**
- `QuickCaptureSheet` — fast entry with minimal fields
- `PriorityPicker` — low-friction priority selection
- `DateEditor` — simple date adjustment
- `ConfirmationToggle` — gentle on/off with confirmation

**Rules:**
- Interaction components receive state via props, never import domain state directly
- Interaction components emit interaction events, not domain events
- Interaction components adapt their own complexity, not domain complexity
- Interaction components enforce accessibility and thumb-zone ergonomics

### 3. Primitive Components

These are minimal building blocks: Text, Button, Row, Column, Surface.

**They:**
- Contain no domain logic — pure presentation and ergonomics
- Enforce spacing, layout, and interaction ergonomics — consistent touch targets, safe areas
- Remain stable across the app — primitives do not change frequently
- Support accessibility and one-handed usage — screen reader support, thumb-zone placement

**Examples:**
- `Text` — typography with adaptive sizing
- `Button` — touch target with consistent feedback
- `Row` / `Column` — layout with adaptive spacing
- `Surface` — container with adaptive elevation and density
- `TouchTarget` — minimum 44x44dp touch area

**Rules:**
- Primitives never import domain logic
- Primitives never emit events (except basic interaction handlers)
- Primitives enforce platform constraints (accessibility, safe areas, thumb zones)
- Primitives support density adaptation through spacing and sizing props

---

## Component Boundaries

Boundaries enforce clean architecture and prevent coupling.

### Boundary Rules

- **Domain components never import primitives directly** — they compose interaction components, which internally use primitives
- **Interaction components never contain domain logic** — they receive state and emit events, but do not know what a "task" or "routine" is
- **Primitives never contain behavior** — they only express structure and ergonomics
- **Cross-domain imports are prohibited** — a Task component cannot import Routine state or components
- **Components must not manage their own state beyond ephemeral UI state** — `expanded`, `focused`, `editing` are allowed; `taskData`, `routineStatus` are not

### State Ownership

- Domain state lives in domains, not components
- Components receive state via props or selectors
- Components may maintain UI-only state (isExpanded, isFocused)
- Components may not cache or duplicate domain state
- Components may not modify domain state directly (only via events)

### Import Hierarchy

```
Domain Components
  ↓ import
Interaction Components
  ↓ import
Primitives
```

Domain components do not import primitives directly. This ensures interaction patterns remain consistent and accessible.

---

## Adaptive Behavior Rules

How components adapt without increasing cognitive load.

### Adaptation Triggers

Components may collapse, summarize, or hide detail based on:
- **User capacity signals** — low, medium, high energy states
- **Recency of interaction** — new vs familiar items
- **Task urgency** — due soon vs due later vs no due date
- **Routine familiarity** — established vs new routines

### Adaptation Patterns

- **Collapsing** — Show summary, hide detail behind expansion
- **Simplifying** — Reduce available actions to essentials only
- **Prioritizing** — Reorder to show most important first
- **Hiding** — Remove non-essential elements entirely

### Adaptation Constraints

- **Adaptation must be gentle** — gradual changes, not abrupt switches
- **Adaptation must be predictable** — users learn what to expect
- **Adaptation must be reversible** — user can return to previous state
- **No component may change structure in a way that surprises the user** — no hidden elements appearing unexpectedly
- **Adaptation must never feel like punishment or pressure** — reduced density is support, not shame

### Implementation

Components receive adaptive state via context or props:
```
TaskItem receives:
  - task: Task (domain state)
  - capacity: 'low' | 'medium' | 'high' (adaptive state)
  - density: 'collapsed' | 'simplified' | 'expanded' (derived)
```

Component renders conditionally based on these inputs, not based on internal logic.

---

## Interaction Cost Constraints

Strict rules ensuring minimal friction.

### Tap Constraints

- **No component may require more than one tap to perform its primary action**
  - Task completion: one tap
  - Routine start: one tap
  - Capture initiation: one tap
- **Secondary actions: maximum two taps**
  - Edit task: tap task, tap edit
  - Reschedule: tap task, tap defer
- **Tertiary actions: available but not prominent**
  - Delete, archive: hidden behind menu, require confirmation

### Editor Constraints

- **Editors must open in sheets, not full screens, unless complexity requires it**
  - Quick edits: bottom sheet
  - Single-field changes: inline or sheet
  - Multi-field creation: sheet or focused screen
- **Full screens reserved for:**
  - Complex multi-step flows
  - Rich content creation
  - Settings and configuration

### List Constraints

- **Lists must support inline interaction when safe**
  - Completion: inline checkbox or tap
  - Defer: inline swipe or button (if not destructive)
- **Destructive actions:** require confirmation, not inline
  - Delete, archive: confirmation sheet
- **Lists must not require navigation for primary actions**
  - Complete without opening detail
  - Start routine without opening detail

### Confirmation Constraints

- **Confirmation steps used only when emotional safety requires it**
  - Destructive actions: delete, archive
  - Irreversible actions: complete (if completion is significant)
  - State changes: pause routine, quit flow
- **Skip confirmation for:**
  - Low-stakes actions: defer, edit, reschedule
  - Reversible actions: most completions
  - Frequent actions: capture, check off

---

## Event Philosophy

How components emit events.

### Event Categories

Components emit only two categories of events:

1. **Domain Events** — Describe what happened in domain terms
   - `task.completed`
   - `routine.started`
   - `meal.logged`
   - `habit.checked`

2. **Interaction Events** — Describe user interaction with the component
   - `sheet.opened`
   - `picker.selected`
   - `editor.submitted`
   - `toggle.changed`

### Event Constraints

- **No component emits UI-only events that do not affect state**
  - No `button.pressed`, `view.scrolled`, `animation.completed`
  - These are implementation details, not meaningful events
- **Events must be meaningful** — describe something that matters to the system
- **Events must be minimal** — one event per meaningful action, not a stream
- **Events must be predictable** — same action, same event, every time

### Prohibited Events

Components must not emit:
- Lifecycle events: `component.mounted`, `component.updated`, `component.unmounted`
- Passive events: `user.scrolled`, `user.viewed`, `time.elapsed`
- Micro-events: `button.highlighted`, `input.focused`, `gesture.detected`
- Derived events: `task.probably.completed`, `user.seems.overwhelmed`

### Event Timing

- **Components must not emit events on mount** — initialization is not user action
- **Components must not emit events on unmount** — cleanup is not user action
- **Components must not emit events on passive changes** — scrolling, viewing, waiting are not actions
- **Components emit events only on intentional user action** — tap, swipe, submit, confirm

---

## Stability and Evolution

How components evolve without breaking the system.

### Stability Principles

- **Components must remain stable as domains grow** — new domain features do not require component rewrites
- **New features must not require rewriting primitives** — primitives are foundational, not feature-specific
- **Domain components may gain new states but not new responsibilities** — a TaskItem may show new states, but it still only handles tasks
- **Interaction components may gain new modes but not new domain logic** — a Picker may support new selection modes, but it still does not know what a task is

### Evolution Rules

**Adding new domain concepts:**
- Create new domain component (e.g., `BudgetItem` for new Budget domain)
- Follow existing domain component patterns
- Do not modify existing domain components

**Adding new interactions:**
- Create new interaction component or extend existing
- Ensure it enforces low cognitive load
- Do not embed domain logic

**Adding new primitives:**
- Rarely needed — existing primitives should suffice
- If required, ensure it supports accessibility and ergonomics
- Do not duplicate existing primitive functionality

**Modifying existing components:**
- Domain components: add states, not responsibilities
- Interaction components: add modes, not domain logic
- Primitives: add props, not behavior

### Deprecation

- Components are deprecated, not deleted
- Deprecated components remain until all usages migrated
- Migration path documented for each deprecation
- No breaking changes without migration period

### Testing Stability

- Component behavior tested in all adaptive states
- Component events verified for correctness
- Component boundaries enforced via lint rules
- Component changes reviewed for architectural alignment

---

*This component philosophy ensures the mobile interface remains simple, adaptive, and emotionally safe while supporting the behavioral core of the Lumo platform.*
