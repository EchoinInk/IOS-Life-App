# Mobile Behavioral Foundation Architecture

**Status:** Architecture Definition Phase  
**Date:** 2026-05-19  
**Phase:** Mobile Behavioral Foundation Architecture

---

## Executive Summary

This document defines the behavioral interaction foundation for Lumo Mobile. Unlike the web experience, mobile is designed around quick capture, thumb-first interaction, low cognitive load, and emotional safety. This architecture prioritizes behavioral reinforcement over feature density.

---

## PHASE 1: Existing Mobile Scaffold Audit

### Current Structure Map

#### Navigation Flow
- **Type:** Stack navigation (React Navigation Native Stack)
- **Screens:** Today → Capture → Settings
- **Pattern:** Linear, modal-style navigation
- **Depth:** 1-2 levels maximum
- **Entry Points:** FAB on Today screen

#### Primitives
```
src/primitives/
├── Screen.tsx      (View wrapper, hardcoded #F5F5F5 background)
├── Button.tsx     (TouchableOpacity, hardcoded #007AFF)
├── Text.tsx       (RNText wrapper, no styling)
├── Stack.tsx      (View with flexDirection: column)
├── Surface.tsx    (View with #FFFFFF, borderRadius: 8, padding: 16)
├── Pressable.tsx  (TouchableOpacity wrapper)
└── Row.tsx        (View with flexDirection: row)
```
**Status:** Temporary scaffolding. No design tokens, no variant system, no theming.

#### Stores (Zustand)
```
src/state/
├── session-store.ts  (lastOpened, onboardingComplete)
├── ui-store.ts       (lowEnergy, density: 'normal' | 'reduced')
└── task-store.ts     (tasks[], addTask, completeTask)
```
**Status:** Functional but minimal. Manual persistence calls, no middleware.

#### Persistence
```
src/persistence/storage.ts
├── getTasks() / setTasks()
├── getSession() / setSession()
└── AsyncStorage wrapper
```
**Status:** Basic key-value storage. No migrations, no schema versioning, no conflict resolution.

#### Orchestration
```
src/orchestration/events.ts
└── Re-exports from @lumo/core (emit, subscribe)
```
**Current Events:** TASK_CAPTURED, TASK_COMPLETED, LOW_ENERGY_ENABLED, LOW_ENERGY_DISABLED
**Status:** Stable foundation from core package.

#### Screen Structure
```
src/features/
├── today/
│   ├── TodayScreen.tsx   (Task list + FAB)
│   └── TaskCard.tsx      (Pressable task item)
├── capture/
│   └── CaptureSheet.tsx  (TextInput + Button)
└── settings/
    └── SettingsScreen.tsx (Low energy toggle)
```
**Status:** Minimal scaffold implementations. No loading states, no error handling, no animations.

#### Feature Boundaries
- **today/**: Task viewing and completion
- **capture/**: Quick task creation
- **settings/**: App preferences (currently only low energy mode)
- **domains/**: Re-exports from @lumo/core (Task, Session types)

---

### Stable Foundations

**Keep These:**
1. **Zustand** for state management - lightweight, no boilerplate
2. **AsyncStorage** for local persistence - standard, reliable
3. **React Navigation** - industry standard, well-maintained
4. **@lumo/core** domain models - shared type safety
5. **Event system** from @lumo/core - decoupled orchestration
6. **Basic folder structure** - clear separation of concerns

### Temporary Scaffolding

**Replace or Enhance:**
1. **All primitive components** - need design system integration
2. **Hardcoded styles** - need token-based theming
3. **Manual persistence calls** - need middleware pattern
4. **Minimal screen implementations** - need behavioral polish
5. **No error boundaries** - need graceful degradation
6. **No loading states** - need perceived performance
7. **No gesture system** - need swipe actions
8. **No animation system** - need micro-interactions

### Missing Behavioral Infrastructure

**Critical Gaps:**
1. **Offline queue** - no sync strategy, no conflict resolution
2. **Optimistic updates** - no immediate feedback pattern
3. **Interruption handling** - no state preservation on app close
4. **Quick capture gestures** - no swipe-to-capture, no long-press
5. **Habit logging** - no streak tracking, no reinforcement
6. **Recovery from overwhelm** - no focus mode, no task limiting
7. **Thumb-zone optimization** - no bottom-sheet-first design
8. **Cognitive load reduction** - no progressive disclosure
9. **Emotional safety** - no deletion confirmation, no undo system
10. **Touch feedback** - no haptic integration, no press states
11. **Keyboard handling** - no auto-dismiss, no smart positioning
12. **Accessibility** - no screen reader optimization, no dynamic type

---

## PHASE 2: Behavioral Interaction Principles

### 1. Quick Capture

**Goal:** Capture a thought in under 3 seconds, thumb-zone accessible.

**Principles:**
- **Single-tap entry:** FAB always visible, thumb-zone positioned
- **Minimal input:** Text field auto-focuses, no required fields
- **Smart defaults:** Auto-save on blur, no explicit save button
- **Gesture capture:** Swipe up from bottom edge, long-press anywhere
- **Voice capture:** Optional dictation button (Phase 2+)
- **Context preservation:** Capture sheet remembers last used context

**Anti-Patterns:**
- Multiple steps before capture
- Required fields beyond text
- Small touch targets
- Keyboard dismissal required to save

### 2. Task Completion

**Goal:** Celebrate completion, reinforce behavior, reduce friction.

**Principles:**
- **One-tap complete:** Swipe right or tap checkbox
- **Immediate feedback:** Haptic vibration, confetti animation
- **Visual celebration:** Task transforms, not disappears
- **Undo always available:** 5-second undo window
- **Streak counter:** Show completion streak on completion
- **No deletion anxiety:** Completed tasks archive, don't delete

**Anti-Patterns:**
- Confirmation dialogs
- Multi-step completion
- No feedback
- Immediate disappearance

### 3. Habit Logging

**Goal:** Invisible tracking, visible reinforcement.

**Principles:**
- **Automatic tracking:** Capture actions count as habit events
- **Visual streaks:** Fire icons, day-by-day calendar
- **Milestone celebrations:** 3-day, 7-day, 30-day rewards
- **No pressure:** Streaks don't break, they pause
- **Contextual reminders:** Gentle nudge at usual capture time
- **Shareable moments:** Optional milestone sharing (Phase 2+)

**Anti-Patterns:**
- Manual logging
- Streak shame
- Aggressive notifications
- Complex habit setup

### 4. Recovery From Overwhelm

**Goal:** Reduce cognitive load when task count is high.

**Principles:**
- **Focus mode:** Show only 3 tasks at a time
- **Smart ordering:** Most important first (simple recency for now)
- **Hide completed:** Archive immediately, don't clutter
- **Energy mode:** Larger touch targets, simpler UI
- **Quick archive:** Swipe left to archive without completion
- **Task limiting:** Soft cap at 10, suggest archiving

**Anti-Patterns:**
- Long task lists
- Complex prioritization
- No filtering options
- Dense information

### 5. Low Cognitive Load

**Goal:** App requires zero mental effort to use.

**Principles:**
- **Single screen focus:** One primary action per screen
- **Progressive disclosure:** Show details on demand, not by default
- **Predictable layout:** Same structure every time
- **No decision fatigue:** Default to last action
- **Minimal text:** Icons where possible, short labels
- **Clear affordances:** Obvious tappable areas

**Anti-Patterns:**
- Dashboard-style layouts
- Multiple actions per screen
- Complex navigation
- Dense information displays

### 6. Forgiving UX

**Goal:** No irreversible actions, no anxiety about mistakes.

**Principles:**
- **Undo everywhere:** 5-second undo on all destructive actions
- **Soft delete:** Archive instead of delete
- **Auto-save:** No save buttons, preserve all input
- **Recovery path:** Easy access to archived items
- **No confirmations:** Use undo instead of dialogs
- **Graceful errors:** Clear error messages, recovery actions

**Anti-Patterns:**
- Confirmation dialogs
- Hard delete
- Unsaved state loss
- Cryptic error messages

### 7. Thumb-First Interaction

**Goal:** All primary actions reachable with thumb, one-handed.

**Principles:**
- **Bottom-zone primary:** FAB, primary actions in bottom 30%
- **Top-zone secondary:** Settings, history in top zone
- **Edge gestures:** Swipe from edges for common actions
- **Reachable touch targets:** Minimum 48x48pt
- **No stretch required:** Nothing in top corners requiring two hands
- **Bottom sheets:** Modal interactions slide from bottom

**Anti-Patterns:**
- Top-right buttons
- Small touch targets
- Two-handed required actions
- Top-heavy layouts

### 8. Offline-First Behavior

**Goal:** Works perfectly without network, syncs seamlessly when connected.

**Principles:**
- **Local-first storage:** All data lives on device first
- **Optimistic updates:** UI updates immediately, syncs in background
- **Offline queue:** Actions queue until network available
- **Conflict resolution:** Last-write-wins for now (enhance later)
- **Sync indicators:** Subtle dot showing sync status
- **No blocking:** Never wait for network to render

**Anti-Patterns:**
- Network required for basic actions
- Loading spinners on every action
- Sync errors blocking UI
- No offline indication

---

## PHASE 3: Mobile Navigation Philosophy

### Primary Navigation Structure

**Single-Stack with Bottom Sheet Modals**

```
Root Stack (Single screen visible at all times)
└── Today Screen (Home, always present)

Modal Stack (Overlays, dismissible)
├── Capture Sheet (Bottom sheet, swipe to dismiss)
├── Archive Sheet (Bottom sheet, swipe to dismiss)
├── Settings Sheet (Bottom sheet, swipe to dismiss)
└── Focus Mode Sheet (Full screen, swipe to dismiss)
```

**Rationale:**
- Single stack reduces cognitive load
- Bottom sheets feel native on mobile
- Always return to Today (home base)
- No tab bar = fewer decisions, less clutter

### Fast-Access Surfaces

**Thumb-Zone Actions (Bottom 30%):**
1. **FAB** - Primary capture entry (bottom-right, always visible)
2. **Swipe up** - Quick capture gesture from bottom edge
3. **Swipe right on task** - Complete task
4. **Swipe left on task** - Archive task
5. **Long press** - Context menu (delete, edit, move)

**Top-Zone Actions (Top 30%):**
1. **Settings icon** - Top-right, secondary
2. **Streak counter** - Top-left, motivational
3. **Sync status** - Subtle dot, top-right near settings

### Low-Friction Flows

**Capture Flow (3 seconds max):**
1. Tap FAB or swipe up
2. Capture sheet slides up (300ms animation)
3. Text field auto-focuses
4. Type task
5. Auto-save on blur or tap outside
6. Sheet dismisses

**Complete Flow (1 second max):**
1. Swipe right on task
2. Haptic feedback
3. Task transforms (scale down, fade)
4. Confetti animation
5. Undo toast appears (5s window)
6. Task moves to archive

**Archive Flow (2 seconds max):**
1. Swipe left on task
2. Task slides away
3. Undo toast appears
4. Task archived

### Interruption Handling

**State Preservation:**
- Capture sheet text auto-saves on app background
- Current scroll position preserved
- Active task selection remembered
- Energy mode state persisted

**Recovery on Return:**
- "Resume capture" toast if text in progress
- "You have X tasks" summary if many added while away
- No jarring state changes
- Gentle re-entry animation

**App Lifecycle:**
```
Foreground → Background
  ├─ Save capture draft
  ├─ Persist current scroll
  └─ Schedule gentle reminder (if idle > 4h)

Background → Foreground
  ├─ Restore scroll position
  ├─ Show draft reminder if exists
  └─ Show summary if tasks changed
```

### Capture Entry Points

**Primary Entry Points:**
1. **FAB** - Always visible, bottom-right
2. **Swipe up gesture** - From bottom edge, anywhere on screen
3. **Long press** - On empty space

**Secondary Entry Points:**
1. **Notification action** - "Capture thought" button on notification
2. **Share sheet** - Add from other apps (Phase 2+)
3. **Widget** - Quick capture widget (Phase 2+)

**Entry Point Hierarchy:**
- FAB: 80% of captures (discoverable, always visible)
- Swipe up: 15% (power user, faster)
- Long press: 5% (discoverable alternative)

### Recovery Paths

**From Empty State:**
- "Tap + to add your first task"
- Animated FAB pulse
- No empty state anxiety

**From Overwhelm (10+ tasks):**
- "Focus mode" suggestion
- Auto-enable focus mode (show 3 tasks)
- "Archive old tasks" suggestion

**From Mistake (wrong action):**
- Undo toast always available
- 5-second undo window
- No confirmation dialogs

**From Archive (need to restore):**
- Archive sheet accessible from settings
- Search in archive
- One-tap restore

---

## PHASE 4: Mobile State Architecture

### Local State Boundaries

**In-Memory State (Not Persisted):**
- Current scroll position
- Draft capture text (temporary)
- Active sheet state
- Animation states
- Focus state

**Rationale:** These are transient UI states that should reset on app restart.

### Persisted State Boundaries

**AsyncStorage Keys:**
```
lumo:tasks              // Task array
lumo:session           // Session metadata
lumo:capture_draft     // In-progress capture text
lumo:scroll_position   // Last scroll Y position
lumo:energy_mode       // Low energy preference
lumo:archive           // Archived tasks
lumo:streaks           // Habit streak data
lumo:last_sync         // Last sync timestamp
```

**State Schema:**
```typescript
interface TasksState {
  tasks: Task[];
  archivedTasks: Task[];
  lastUpdated: number;
}

interface SessionState {
  lastOpened: string;
  onboardingComplete: boolean;
  streakDays: number;
  lastCaptureDate: string;
}

interface DraftState {
  text: string;
  timestamp: number;
}

interface SyncState {
  lastSync: number;
  pendingActions: PendingAction[];
  syncStatus: 'synced' | 'pending' | 'error';
}
```

### Server Synchronization Philosophy

**Phase 1 (No Server):**
- Local-only storage
- No sync needed
- Focus on local behavior

**Phase 2 (Basic Sync):**
- Simple REST endpoint
- Full sync on app open
- Conflict resolution: last-write-wins
- Background sync every 5 minutes

**Phase 3 (Advanced Sync):**
- Incremental sync
- Offline queue with retry
- Conflict resolution UI
- Real-time sync (WebSocket)

**Current Phase:** Phase 1 (Local-only)

### Optimistic Update Strategy

**Pattern:**
```typescript
// 1. Update UI immediately
const taskId = createOptimisticId();
setTasks(prev => [...prev, { id: taskId, title, completed: false }]);

// 2. Queue action for sync
queueAction({ type: 'ADD_TASK', payload: { taskId, title } });

// 3. Persist to local storage
await persistTasks();

// 4. Sync in background (when server exists)
syncQueue();
```

**Benefits:**
- Instant feedback
- No network dependency
- Perceived performance
- Natural offline behavior

### Offline Queue Strategy

**Queue Structure:**
```typescript
interface PendingAction {
  id: string;
  type: 'ADD_TASK' | 'COMPLETE_TASK' | 'ARCHIVE_TASK';
  payload: any;
  timestamp: number;
  retries: number;
}
```

**Queue Behavior:**
- Actions added to queue on every state change
- Queue processed when network available
- Retry failed actions up to 3 times
- After 3 failures, show error to user
- Queue persisted to AsyncStorage

**Conflict Resolution (Phase 2+):**
- Last-write-wins for now
- Timestamp-based comparison
- Server wins for critical data
- Client wins for local-only data

### Hydration Lifecycle

**App Startup:**
```
1. Load session from AsyncStorage
2. Load tasks from AsyncStorage
3. Load archive from AsyncStorage
4. Load streaks from AsyncStorage
5. Load draft from AsyncStorage
6. Restore scroll position
7. Check for pending sync actions
8. Initialize stores
9. Render UI (with loading state if needed)
```

**App Background:**
```
1. Save current scroll position
2. Save draft if exists
3. Persist all store state
4. Queue any pending actions
```

**App Foreground:**
```
1. Rehydrate stores from AsyncStorage
2. Restore scroll position
3. Check for draft (show reminder if exists)
4. Process sync queue
5. Show summary if tasks changed
```

**Error Handling:**
- AsyncStorage errors: Show toast, retry with exponential backoff
- Parse errors: Clear corrupted data, show error toast
- Sync errors: Queue action, show sync status indicator

---

## PHASE 5: Mobile Design Foundation

### Spacing System

**4pt Base Scale:**
```typescript
const spacing = {
  xs: 4,   // 4pt  - Icon padding, tight spacing
  sm: 8,   // 8pt  - Related items
  md: 16,  // 16pt - Default padding, card spacing
  lg: 24,  // 24pt - Section spacing
  xl: 32,  // 32pt - Screen padding
  xxl: 48, // 48pt - Major sections
};
```

**Usage:**
- `xs`: Icon internal padding
- `sm`: Space between icon and text
- `md`: Card padding, default margin
- `lg`: Space between sections
- `xl`: Screen edge padding
- `xxl`: Major vertical spacing

### Typography Scale

**Font Family:**
- iOS: SF Pro (system font)
- Android: Roboto (system font)
- Fallback: sans-serif

**Type Scale:**
```typescript
const typography = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  subtext: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};
```

**Energy Mode Adjustments:**
- All sizes +2pt in low energy mode
- Line height +4pt for readability
- Weight increased by 100 for contrast

### Interaction Sizing

**Touch Targets (Minimum 48x48pt):**
```typescript
const touchTargets = {
  small: 48,   // 48pt - Minimum touch target
  medium: 56,  // 56pt - FAB size
  large: 64,   // 64pt - Energy mode FAB
  xl: 72,      // 72pt - Major actions
};
```

**Hit Areas:**
- All interactive elements expand to 48x48pt minimum
- Visual element can be smaller, hit area expands invisibly
- 8pt padding around visual element

### Touch Targets

**Primary Actions:**
- FAB: 56x56pt (64x64pt in energy mode)
- Task card: Full width, 48pt height
- Swipe zones: Full height, 80pt width

**Secondary Actions:**
- Settings icon: 48x48pt hit area
- Checkbox: 48x48pt hit area
- Delete button: 48x48pt hit area

**Energy Mode:**
- All touch targets +8pt
- Minimum 56x56pt
- Larger hit areas for thumb reach

### Surface Hierarchy

**Elevation Levels:**
```typescript
const elevation = {
  flat: 0,        // Background, no shadow
  card: 2,        // Task cards, subtle shadow
  floating: 4,    // FAB, moderate shadow
  modal: 8,       // Bottom sheets, strong shadow
  overlay: 16,    // Full screen modals
};
```

**Surface Colors:**
```typescript
const colors = {
  background: '#F5F5F5',      // App background
  surface: '#FFFFFF',         // Card/sheet background
  surfaceDim: '#F0F0F0',      // Disabled surface
  primary: '#007AFF',         // Primary actions
  primaryDim: '#0056B3',      // Pressed primary
  text: '#000000',            // Primary text
  textSecondary: '#666666',   // Secondary text
  textTertiary: '#999999',    // Tertiary text
  divider: '#E0E0E0',         // Separators
  error: '#FF3B30',           // Error states
  success: '#34C759',         // Success states
};
```

**Energy Mode Colors:**
- Higher contrast (darker text on lighter backgrounds)
- Reduced saturation (calmer colors)
- Larger color differences (more distinct)

### Visual Pacing

**Animation Durations:**
```typescript
const duration = {
  instant: 150,   // Instant feedback (tap, press)
  fast: 300,      // Quick transitions (sheet slide)
  normal: 500,    // Standard transitions
  slow: 700,      // Deliberate animations (celebration)
};
```

**Animation Curves:**
```typescript
const easing = {
  easeOut: 'ease-out',           // Fast start, slow end (most common)
  easeIn: 'ease-in',             // Slow start, fast end (rare)
  easeInOut: 'ease-in-out',      // Smooth both ends
  spring: 'spring(1, 0.5, 0, 1)', // Natural motion
};
```

**Pacing Principles:**
- Micro-interactions: 150ms (instant feedback)
- Sheet transitions: 300ms (fast but visible)
- Task completion: 500ms (celebratory)
- Streak celebrations: 700ms (deliberate)
- Energy mode: All durations +100ms (slower, calmer)

### Motion Philosophy

**Core Principles:**
1. **Purposeful motion:** Every animation has a reason
2. **Natural feel:** Use spring physics, not linear
3. **Respect preferences:** Reduce motion if enabled
4. **Never block:** Animations never prevent interaction
5. **Subtle reinforcement:** Motion reinforces behavior, not decorates

**Animation Types:**

**Micro-Interactions (Always On):**
- Button press: Scale down to 0.95, spring back
- Task complete: Scale down, fade, confetti
- Swipe: Follow finger, spring to snap point
- FAB pulse: Subtle scale 1.0 → 1.05 → 1.0

**Transitions (Standard):**
- Sheet slide: Slide up from bottom, fade in
- Screen push: Slide from right, fade in
- Task delete: Slide left, fade out

**Celebrations (Deliberate):**
- Confetti: Particle explosion on completion
- Streak milestone: Fire animation, scale pulse
- First capture: Welcome animation, guide

**Energy Mode Motion:**
- All durations +100ms
- Reduce spring bounciness
- Simpler easing curves
- No particle effects (optional toggle)

---

## Missing Infrastructure List

### Critical (Must Have for V1)

1. **Design Token System**
   - Token file for spacing, typography, colors
   - Theme provider for energy mode
   - Primitive component refactoring to use tokens

2. **Undo System**
   - Undo toast component
   - 5-second undo window logic
   - Action history queue

3. **Gesture System**
   - Swipe-to-complete gesture
   - Swipe-to-archive gesture
   - Long-press context menu
   - Bottom-edge swipe to capture

4. **Draft Persistence**
   - Auto-save capture draft
   - Draft reminder on app return
   - Draft restoration

5. **Archive System**
   - Archive storage
   - Archive sheet UI
   - Restore from archive

6. **Focus Mode**
   - Task limiting logic (show 3 at a time)
   - Focus mode toggle
   - Task ordering (recency for now)

7. **Haptic Feedback**
   - Haptic integration
   - Feedback on complete, capture, error
   - Respect system haptic preferences

8. **Animation System**
   - Micro-interaction library
   - Confetti component
   - Sheet transition animations

### Important (Should Have for V1)

9. **Streak Tracking**
   - Streak counter logic
   - Streak display component
   - Milestone celebrations

10. **Error Boundaries**
    - Error boundary component
    - Graceful error UI
    - Error reporting (optional)

11. **Loading States**
    - Skeleton loaders
    - Loading spinners (minimal use)
    - Optimistic UI updates

12. **Keyboard Handling**
    - Auto-dismiss on scroll
    - Avoid keyboard overlap
    - Smart positioning

### Nice to Have (V2+)

13. **Voice Capture**
    - Dictation integration
    - Voice-to-text

14. **Share Sheet**
    - Add from other apps
    - Share to other apps

15. **Widgets**
    - Home screen widget
    - Quick capture widget

16. **Advanced Sync**
    - Real-time sync
    - Conflict resolution UI
    - Offline queue UI

---

## Recommended Implementation Order

### Sprint 1: Behavioral Foundation (Week 1-2)

**Goal:** Core behavioral interactions working

1. **Design Tokens** (2 days)
   - Create token file
   - Refactor primitives to use tokens
   - Implement energy mode theme

2. **Gesture System** (3 days)
   - Swipe-to-complete
   - Swipe-to-archive
   - Long-press context menu

3. **Undo System** (2 days)
   - Undo toast component
   - Action history queue
   - 5-second undo logic

4. **Draft Persistence** (1 day)
   - Auto-save draft
   - Draft reminder
   - Draft restoration

### Sprint 2: Polish & Completion (Week 3)

**Goal:** Delightful interactions, emotional safety

5. **Haptic Feedback** (2 days)
   - Integrate haptics
   - Add feedback to all actions
   - Respect preferences

6. **Animation System** (3 days)
   - Micro-interactions
   - Sheet transitions
   - Confetti component

7. **Archive System** (2 days)
   - Archive storage
   - Archive sheet UI
   - Restore functionality

### Sprint 3: Focus & Habits (Week 4)

**Goal:** Reduce overwhelm, reinforce behavior

8. **Focus Mode** (2 days)
   - Task limiting logic
   - Focus mode UI
   - Task ordering

9. **Streak Tracking** (3 days)
   - Streak counter logic
   - Streak display
   - Milestone celebrations

10. **Error Handling** (2 days)
    - Error boundaries
    - Graceful error UI
    - Loading states

### Sprint 4: Final Polish (Week 5)

**Goal:** Production-ready

11. **Keyboard Handling** (1 day)
    - Auto-dismiss
    - Smart positioning

12. **Accessibility** (2 days)
    - Screen reader optimization
    - Dynamic type support
    - Touch target audit

13. **Performance** (2 days)
    - Animation optimization
    - Lazy loading
    - Memory profiling

---

## Success Metrics

### Behavioral Metrics

- **Capture Speed:** Average time from app open to task capture < 3s
- **Completion Rate:** % of captured tasks completed > 70%
- **Daily Active Users:** % of users who capture at least 1 task/day
- **Streak Retention:** % of users with 7+ day streaks
- **Undo Usage:** % of actions undone (target: < 10%, indicates good UX)
- **Energy Mode Adoption:** % of users who enable energy mode

### Technical Metrics

- **App Load Time:** < 1s to interactive
- **Animation FPS:** 60fps on all animations
- **Storage Size:** < 10MB for typical user
- **Crash Rate:** < 0.1%
- **Battery Impact:** < 2% battery per hour of active use

---

## Architecture Principles Summary

1. **Behavior over Features:** Every design decision serves a behavioral goal
2. **Thumb-First:** All primary actions reachable with thumb
3. **Forgiving:** No irreversible actions, undo everywhere
4. **Calm:** Low cognitive load, predictable, no surprises
5. **Fast:** Instant feedback, no waiting, optimistic updates
6. **Emotionally Safe:** No anxiety, no shame, no pressure
7. **Offline-First:** Works perfectly without network
8. **Simple:** Minimal code, minimal complexity, maximal impact

---

## Next Steps

1. **Review this document** with team
2. **Approve architecture** before implementation
3. **Begin Sprint 1** with design tokens
4. **Weekly reviews** to assess behavioral metrics
5. **Iterate** based on user feedback

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-19  
**Author:** Cascade Architecture System  
**Status:** Ready for Review
