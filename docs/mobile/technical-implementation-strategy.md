# Technical Implementation Strategy

This document defines how Lumo will be implemented at a technical level while preserving:
- Emotional safety — no technical complexity that creates frustration
- Reduced cognitive load — implementation supports simplicity
- Adaptive behavior — technical foundations enable adaptation
- Low interaction cost — performance never blocks user action
- Predictable, stable flows — reliability is a behavioral requirement

Implementation decisions must always justify their cost in:
- **Complexity** — every layer adds mental overhead
- **Cognitive load** — implementation must not confuse future maintainers
- **Maintenance burden** — simple solutions persist, complex ones rot
- **Behavioral impact** — technical choices must serve the user experience

---

## 1. State Management Strategy

The behavioral-first state model that powers the adaptive platform.

### 1.1 Domain State

- **Lives in domain-specific stores** — one store per domain (tasks, routines, meals, habits)
- **Represents long-lived, persistent concepts** — tasks, meals, routines, progress, user preferences
- **Must be serializable** — can be saved, restored, and synced without loss
- **Must be event-driven** — changes flow through events, not direct mutation
- **No UI state allowed** — domain stores contain no `isExpanded`, `isFocused`, `scrollPosition`

**Implementation:**
- One Zustand store per domain
- Store contains source state only
- Mutations occur via store methods that emit events
- No derived values in stores

### 1.2 Local UI State

- **Lives inside components** — useState, useReducer for component-only concerns
- **Ephemeral only** — `expanded`, `editing`, `focused`, `animating`
- **Must never influence domain logic** — UI state is invisible to domains
- **Must never persist** — lost on unmount, not stored, not synced

**Implementation:**
- React useState for simple toggles
- useReducer for complex component state machines
- No prop drilling of UI state
- No UI state in global stores

### 1.3 Derived Selectors

- **Compute meaningful behavioral views of state** — what the UI needs to render
- **Must be memoized** — avoid recomputation on every render
- **Must avoid recomputation storms** — selectors should not cascade
- **Must not contain side effects** — pure functions only

**Implementation:**
- Selector functions outside stores
- Memoization via custom hooks or selector libraries
- Selectors receive domain state, return derived values
- No selectors that iterate large arrays without memoization keys

### 1.4 Orchestration State

- **Represents cross-domain behavioral flows** — momentum, pacing, recovery, burnout detection
- **Lives in a dedicated orchestration layer** — not scattered across domains
- **Must be event-driven, not component-driven** — responds to domain events, not UI callbacks

**Implementation:**
- Single orchestration store
- Listens to domain events via event bus
- Maintains cross-domain behavioral state
- Does not own domain data, only coordination state

### 1.5 Session State

- **Represents temporary, session-scoped values** — capacity signals, burnout indicators, navigation context
- **Must reset predictably** — clear on app close, clear on logout
- **Must not persist across app restarts** — ephemeral by design

**Implementation:**
- Session store separate from domain stores
- In-memory only, no persistence
- Cleared on app background/termination
- Available to components via context or hooks

### 1.6 Tooling Selection

The minimal tooling required, selected after reasoning through the above rules:

**State Store:** Zustand
- Lightweight, minimal boilerplate
- Supports event-driven patterns
- Easy selector memoization
- No provider nesting required

**Selector Utilities:**
- Custom memoized hooks
- Reselect if composition becomes complex
- Keep selectors close to components that need them

**Event Emitter:**
- Lightweight event emitter (EventEmitter3 or custom)
- Typed events via TypeScript
- Documented event catalog

**What We Avoid:**
- Redux — boilerplate overhead, unnecessary complexity
- Context API for state — provider nesting, performance issues
- Global state subscriptions — re-render storms
- Over-engineered state machines — simple stores suffice

---

## 2. Rendering Strategy

How the UI renders adaptively without performance collapse.

### 2.1 Adaptive Rendering Boundaries

- **Components must re-render only when their domain slice changes** — subscribe to minimal state
- **Adaptive density recalculations must be isolated** — capacity checks in dedicated hooks
- **No cascading re-renders across domains** — task completion does not re-render routines unnecessarily

**Implementation:**
- Components subscribe to specific store slices only
- Adaptive state via context or dedicated hook
- Memoized props to child components
- React.memo for stable components

### 2.2 Selector Memoization

- **All derived selectors must be memoized** — never recompute unless inputs change
- **Avoid selectors that depend on large arrays without keys** — O(n) selectors kill performance
- **Selector composition must preserve memoization** — composed selectors remain memoized

**Implementation:**
- useMemo for inline selectors
- Memoized selector functions for reuse
- Reselect createSelector for complex composition
- Avoid selectors inside render that iterate all tasks

### 2.3 Virtualization Strategy

- **Lists with unbounded growth must be virtualized** — Today list, history, search results
- **Virtualization must not break adaptive behavior** — virtual items still adapt to capacity
- **No virtualization for short lists where cognitive continuity matters** — 5-10 items, keep stable

**Implementation:**
- FlashList or react-native-recyclerview for long lists
- Estimated item heights for smooth scrolling
- Adaptive item height based on density mode
- Stable keys for list items

### 2.4 Rerender Storm Prevention

- **No global state subscriptions inside components** — use selectors, not store.subscribe
- **No derived state inside render functions** — compute before render, not during
- **No event listeners inside render paths** — attach once, not per render

**Implementation:**
- Zustand selectors in useStore hooks
- Event listeners in useEffect with cleanup
- Derived values computed in selectors, not render
- React DevTools Profiler to catch storms

---

## 3. Event Infrastructure

A minimal, predictable event system for cross-domain communication.

### 3.1 Event Bus

- **Lightweight emitter** — minimal overhead, minimal complexity
- **No global pub/sub complexity** — explicit subscriptions only
- **Events must be typed and documented** — TypeScript types, event catalog

**Implementation:**
- Single event emitter instance
- Typed event definitions
- Event names: `domain.action.outcome` format
- Payload: minimal, serializable objects

### 3.2 Orchestration Listeners

- **Listen to domain events** — orchestration responds to domain state changes
- **Update orchestration state** — cross-domain behavioral state
- **Must not trigger UI changes directly** — UI responds to state, not events

**Implementation:**
- Orchestration layer subscribes to relevant events
- Updates orchestration store on event receipt
- UI components query orchestration state, not events
- No event-to-UI direct wiring

### 3.3 Event Logging

- **Minimal debug logging** — development and staging only
- **Must be removable in production** — no performance cost in release
- **No analytics-driven noise** — behavioral analytics separate from debug logs

**Implementation:**
- `__DEV__` conditional logging
- Event name and payload only (no sensitive data)
- Optional: flipper or reactotron integration
- Removed via dead code elimination in production

### 3.4 Event Cleanup

- **Listeners must unsubscribe cleanly** — no memory leaks
- **No memory leaks** — subscriptions cleaned on unmount
- **No orphaned listeners** — track subscriptions, clean appropriately

**Implementation:**
- useEffect cleanup functions
- EventEmitter removeListener in return
- Component unmount = subscription cleanup
- Test for memory leaks in long-running sessions

---

## 4. Navigation Architecture

Navigation as a behavioral system, not a routing system.

### 4.1 Route Structure

- **Shallow route hierarchy** — no deep nesting, max 2 levels
- **No deep nesting** — flat structure preferred
- **Domains map to top-level routes** — tasks, routines, meals, settings

**Implementation:**
- React Navigation with stack navigators
- Domain-based screen grouping
- Tab navigator for primary surfaces (Today, Capture, Settings)
- No nested stack navigators beyond domain level

### 4.2 Adaptive Navigation Behavior

- **Navigation cost decreases when user capacity decreases** — fewer steps to complete goals
- **Fewer steps** — direct access to primary actions
- **More direct access to primary flows** — Today, Capture always reachable

**Implementation:**
- Deep links for primary flows
- Adaptive navigation shortcuts based on capacity
- Simplified navigation in low-energy mode
- Quick actions for common flows

### 4.3 Low-Energy Navigation Reduction

- **Reduce tab switching** — combine or hide secondary tabs in low mode
- **Reduce modal stacking** — no modal-on-modal in low energy
- **Provide predictable return paths** — always know how to go back

**Implementation:**
- Tab visibility controlled by adaptive state
- Modal presentation limited in low-energy mode
- Consistent back button behavior
- Gesture navigation optional, never required

### 4.4 Stack Boundaries

- **Each domain has its own stack** — task navigation separate from routine navigation
- **Cross-domain navigation must be explicit** — no implicit domain switching

**Implementation:**
- Domain-specific stack navigators
- Explicit navigation actions for cross-domain
- Clear stack reset on domain switch
- Stack state managed per domain

### 4.5 Modal + Sheet Philosophy

- **Sheets for editing** — quick, contextual, dismissible
- **Modals for high-sensitivity interactions** — destructive, important, requires focus
- **No full-screen editors unless necessary** — preserve context, reduce navigation

**Implementation:**
- React Native Bottom Sheet for editing
- Modal presentation for confirmations
- Inline editing where possible
- Full screens reserved for complex flows (multi-step onboarding)

---

## 5. Offline + Persistence Strategy

How Lumo maintains behavioral continuity without connectivity.

### 5.1 Immediate Persistence

- **Domain state persists immediately** — no batching that risks data loss
- **No risk of losing progress** — user action = saved state

**Implementation:**
- AsyncStorage or MMKV for local persistence
- Save on every meaningful state change
- Debounced for high-frequency changes (text input)
- Immediate for low-frequency changes (task completion)

### 5.2 Optimistic Updates

- **UI updates immediately** — user sees result without waiting
- **Sync resolves in background** — network operations non-blocking
- **Errors must not punish the user** — failed sync is gentle, not alarming

**Implementation:**
- Local state updates instantly
- Background sync queue
- Retry with exponential backoff
- User notification of sync issues only if persistent

### 5.3 Offline-First Expectations

- **App must remain functional offline** — core features work without network
- **Adaptive behavior must continue offline** — capacity detection, density adaptation
- **Sync must be gentle and invisible** — no blocking spinners, no modal dialogs

**Implementation:**
- All core features work offline
- Network status monitoring optional
- Sync attempts in background
- Conflict resolution favors local state

### 5.4 Recovery After Interruption

- **App must restore:**
  - Navigation position — user returns to same screen
  - Editing context — in-progress edits preserved
  - Session state (if safe) — capacity signals, temporary flags
- **Without overwhelming the user** — seamless restoration

**Implementation:**
- Navigation state persisted
- Form state auto-saved
- Session state cleared on termination (privacy)
- Graceful handling of restoration failures

---

## 6. Adaptive Evaluation Timing

When adaptive recalculations occur to preserve performance and predictability.

### 6.1 Capacity Evaluation

- **Triggered by meaningful events only** — not continuous polling
- **Not continuous** — no setInterval capacity checks
- **Not on every render** — no useEffect capacity recalculation

**Implementation:**
- Triggered by: task completion, session start/end, user interaction patterns
- Debounced: multiple rapid events batch into single evaluation
- Throttled: minimum time between evaluations (e.g., 30 seconds)
- Event-driven: evaluation responds to domain events

### 6.2 Burnout Evaluation

- **Triggered by:**
  - Repeated failures — task deferrals, routine skips
  - Long inactivity — session gaps, missed days
  - High friction interactions — repeated editing, cancellation

**Implementation:**
- Pattern detection over time (3+ events, not single occurrence)
- Session analysis for engagement drops
- Friction scoring based on interaction patterns
- Evaluation triggered by orchestration layer, not components

### 6.3 Momentum Evaluation

- **Triggered by:**
  - Successful completions — tasks done, routines completed
  - Streaks — consistent engagement over time
  - Re-entry moments — return after absence, successful re-engagement

**Implementation:**
- Momentum computed from completion patterns
- Streak calculation based on domain state
- Re-entry detection via session analysis
- Evaluation results in momentum state updates

### 6.4 Density Recalculation

- **Must be infrequent** — not on every state change
- **Must be predictable** — user understands why density changed
- **Must not cause layout instability** — no flashing, no jumping content

**Implementation:**
- Density derived from capacity + context (time of day, task load)
- Recalculation on capacity state changes only
- Animated transitions for density changes
- Layout stability via fixed containers with dynamic content

---

## 7. Implementation Sequencing

The order of implementation to avoid complexity cliffs.

### Phase 1: Primitive Components
- Text, Button, Row, Column, Surface, TouchTarget
- Spacing, typography, touch targets established
- No domain logic, no behavior

### Phase 2: Domain Stores
- Tasks store, Routines store, User store
- Event emission wired
- Persistence layer connected

### Phase 3: Event Bus
- Event emitter configured
- Typed event definitions
- Orchestration layer skeleton

### Phase 4: Orchestration Layer
- Adaptive state evaluation
- Capacity detection logic
- Cross-domain behavioral coordination

### Phase 5: Navigation Skeleton
- Tab navigator (Today, Capture, Settings)
- Stack navigators per domain
- Modal/sheet presentation configured

### Phase 6: Domain Components
- TaskItem, RoutineRow, MealCard
- Domain event emission
- Adaptive density support

### Phase 7: Interaction Components
- QuickCaptureSheet, DateEditor, PriorityPicker
- Low-friction input patterns
- Sheet and modal behaviors

### Phase 8: Adaptive Behavior Layer
- Capacity evaluation triggers
- Density recalculation
- Low-energy mode surfaces
- Recovery flow implementation

### Phase 9: Persistence + Offline
- AsyncStorage/MMKV integration
- Optimistic update patterns
- Background sync queue
- Offline-first testing

### Phase 10: Performance Tuning
- Selector memoization audit
- Re-render profiling
- List virtualization
- Memory leak detection

### Phase Completion Criteria

Each phase is stable before moving to the next:
- Tests pass
- No critical bugs
- Behavioral loops functional
- Architecture remains clean

---

*This technical implementation strategy ensures Lumo is built with engineering discipline that serves the behavioral and emotional goals of the platform.*
