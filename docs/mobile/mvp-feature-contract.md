# MVP Feature Contract

This document defines the **minimum viable behavioral system** required to deliver Lumo's core value:
- Emotional safety — no shame, no pressure, no judgment
- Reduced cognitive load — minimal decisions, minimal friction
- Adaptive interaction cost — user can reduce demands when overwhelmed
- Gentle re-entry — returning users feel welcomed, not burdened
- Low-energy support — app remains usable at minimal capacity

The MVP is not a full behavioral engine. It is a **thin vertical slice** of the core loops. The goal is to validate the adaptive approach with the smallest possible surface area, not to build a complete product.

---

## 1. MVP Behavioral Loops

The loops that MUST exist in v1. These define the core value of the platform.

### 1.1 Capture Loop

- **Quick add for tasks, meals, notes** — single-tap entry point
- **Minimal fields** — title required, everything else optional or defaulted
- **One-step capture** — no multi-step flows, no mandatory categorization
- **Sheet-based editor** — slides up from bottom, preserves context
- **No advanced metadata** — no priorities, no tags, no complex scheduling

**Success criteria:** User can capture an item in under 10 seconds, with one hand, without cognitive load.

### 1.2 Today Loop

- **Shows only what matters today** — filtered to relevant, timely items
- **Adaptive density (simple version)** — manual toggle or rule-based reduction
- **Inline completion** — one-tap to complete, no confirmation required
- **Gentle recovery prompts** — supportive messaging for returning users

**Success criteria:** User can see what needs attention, complete items quickly, and feel capable rather than overwhelmed.

### 1.3 Low-Energy Mode

- **Manual toggle** — user explicitly selects reduced mode (auto-detection excluded)
- **Reduces interaction cost** — fewer taps, larger targets, minimal text input
- **Collapses density** — fewer items visible, simplified layout
- **Prioritizes essentials** — only most important items shown

**Success criteria:** User can engage meaningfully even when capacity is minimal. App does not demand more than user can give.

### 1.4 Recovery Loop

- **Triggered by inactivity or user request** — simple detection (3+ days), not complex inference
- **Simple, supportive re-entry** — welcoming message, no guilt, no backlog dump
- **No complex inference** — no behavioral modeling, no "we noticed you..."

**Success criteria:** User returning after absence feels safe to re-engage. No shame, no overwhelming catch-up requirements.

### Loop Integrity

These loops must work end-to-end. A loop is complete when:
- Entry point is accessible
- Core action is completable
- Exit is clean and non-punitive
- Emotional safety is preserved throughout

---

## 2. MVP Adaptive Behavior

What adaptive behavior is REAL in v1 versus what is deferred.

### 2.1 Included

- **Manual low-energy toggle** — user-controlled capacity reduction
- **Simple density reduction** — fewer items, larger spacing, minimal options
- **Basic momentum tracking** — simple completion counts, no complex modeling
- **Gentle recovery suggestions** — supportive copy for returning users
- **Capacity-aware interaction cost (rule-based)** — simple rules, not ML

**Implementation approach:** Rule-based adaptation using simple heuristics (time since last use, number of overdue items, manual toggle state).

### 2.2 Excluded (Future)

- **Predictive burnout detection** — complex pattern recognition
- **Automatic capacity inference** — ML-based energy estimation
- **Deep behavioral modeling** — tracking and modeling user patterns over time
- **Multi-factor adaptive orchestration** — complex cross-domain adaptation
- **AI-driven personalization** — learning and predicting user needs

**Reason for exclusion:** These require significant data, complex algorithms, and extensive testing. They risk unstable or surprising behavior. v1 prioritizes predictability.

### Adaptation Requirements

Adaptation in v1 must be:
- **Rule-based** — simple if-then logic, not ML
- **Predictable** — users understand why the app changed
- **Stable** — no flickering, no rapid changes, no unexpected shifts
- **Easy to debug** — developers can trace and understand behavior

---

## 3. MVP Screens

The minimal screen set required to deliver the behavioral loops.

1. **Today** — primary surface showing daily items, adaptive density
2. **Capture Sheet** — bottom sheet for quick task/meal/note entry
3. **Task/Meal Editor** — simple editor for basic metadata (title, optional details)
4. **Low-Energy Mode** — reduced view activated by toggle
5. **Recovery Flow** — modal or simplified view for re-entry after absence
6. **Settings (minimal)** — toggle for low-energy mode, basic preferences

### Explicitly Excluded

- **Dashboards** — overview screens, analytics summaries
- **Analytics** — progress views, statistics, charts
- **Multi-surface navigation** — tabs for different domains, complex navigation

**Reason:** These add complexity without validating core behavioral value. Focus on the loops, not the views.

---

## 4. MVP Navigation

The minimal navigation structure. Navigation must be simple, shallow, and unobtrusive.

- **Single tab: Today** — primary destination, always accessible
- **Sheets for capture + editing** — bottom sheets preserve context, reduce navigation steps
- **Modal for recovery flow** — modal presentation for re-entry flow
- **Settings accessible from header** — minimal settings, not a dedicated tab

### Explicitly Excluded

- **Multi-tab navigation** — no bottom tab bar with multiple destinations
- **Deep stacks** — no nested navigation hierarchies
- **Nested flows** — no multi-step wizards beyond basic editing

**Navigation principle:** User can reach any screen in 2 taps or fewer. No cognitive load from navigation decisions.

---

## 5. MVP State Scope

What state exists in v1. Minimal state surface area reduces complexity and bugs.

### 5.1 Included

- **Tasks** — title, completion status, optional due date
- **Meals** — name, time, optional notes
- **Routines (simple)** — recurring flag, basic pattern
- **Session state (capacity, low-energy)** — manual toggle, temporary flags
- **Momentum (basic)** — simple completion tracking
- **Persistence (local only)** — AsyncStorage/MMKV, no backend

### 5.2 Excluded

- **Cloud sync** — no server, no synchronization
- **Multi-device state** — single device only
- **Advanced routines** — complex recurrence, conditional routines
- **Long-term analytics** — historical tracking, trend analysis
- **Cross-domain orchestration** — complex state coordination

**State principle:** v1 proves the behavioral approach locally before adding sync complexity.

---

## 6. MVP Persistence

The minimal persistence rules. Simple, reliable, predictable.

- **Local storage only** — AsyncStorage or MMKV
- **Immediate persistence** — save on meaningful changes, no batching
- **Optimistic updates** — UI updates immediately, persists in background
- **No background sync** — no network operations, no sync queue
- **No conflict resolution** — no multi-device conflicts to resolve

**Persistence principle:** Data must never be lost, but persistence must never block or slow the UI.

---

## 7. MVP Interaction Components

The minimal component set. Fewer components = fewer bugs, less complexity.

- **Text input** — basic input with smart defaults
- **Button** — touch target with consistent feedback
- **Row/Column primitives** — layout with adaptive spacing
- **TaskCard (simple)** — title, checkbox, optional due date
- **MealCard (simple)** — name, time indicator
- **Sheet** — bottom sheet for capture and editing
- **Modal** — modal presentation for recovery flow
- **Toggle** — on/off for low-energy mode and preferences

### Explicitly Excluded

- **Advanced components** — complex pickers, multi-select, rich editors
- **Animations beyond essentials** — no complex transitions, no micro-interactions

**Component principle:** Components serve behavior, not visual polish. Minimal set, maximal behavioral coverage.

---

## 8. MVP Exclusions

What is explicitly NOT in v1. These are intentionally excluded to protect velocity and focus.

- **AI features** — no ML, no predictive models, no smart suggestions
- **Predictive adaptation** — no automatic capacity detection, no behavioral inference
- **Complex onboarding** — no multi-step tutorials, no feature tours
- **Advanced scheduling** — no time blocks, no complex due date logic
- **Calendar integration** — no external calendar sync, no event import
- **Notifications (beyond basic)** — no reminder system, no push notifications
- **Habit streaks** — no streak counting, no streak visualization
- **Progress analytics** — no charts, no statistics, no trend views
- **Multi-surface navigation** — no tabs, no complex navigation structure
- **Theme customization** — no dark mode, no color themes, no layout options
- **Advanced motion** — no complex animations, no gesture libraries

**Exclusion principle:** Every excluded feature is a decision to protect behavioral integrity. Complexity deferred is behavioral safety preserved.

---

## 9. MVP Success Criteria

What "done" means. The MVP is complete when these criteria are met.

### Behavioral Criteria

- **User can capture something quickly** — under 10 seconds, minimal friction
- **User can see what matters today** — Today view shows relevant items, hides noise
- **User can complete items with low friction** — one-tap completion, no obstacles
- **User can reduce interaction cost when overwhelmed** — Low-Energy Mode genuinely easier
- **User can re-enter after inactivity without shame** — Recovery flow is gentle, supportive

### Emotional Criteria

- **App feels calm, predictable, and emotionally safe** — no anxiety from using the app
- **No cognitive cliffs** — no sudden complexity, no overwhelming screens
- **No overwhelming density** — density scales appropriately, user never feels buried
- **No unstable adaptive behavior** — adaptation is predictable, not surprising

### Technical Criteria

- **No critical bugs** — crashes, data loss, or blocking issues
- **Performance is acceptable** — no noticeable lag, no jank
- **State is stable** — no unexpected resets, no data corruption
- **Architecture is clean** — no technical debt that blocks future growth

### Validation

MVP is validated when:
- Users complete the core loops without frustration
- Users report feeling supported, not pressured
- Users can use the app during low-energy periods
- Returning users re-engage without guilt

---

*This MVP Feature Contract ensures Lumo ships a focused, behavioral-first product that validates the adaptive approach without over-engineering.*
