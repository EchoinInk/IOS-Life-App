
# ~~**Step 1 — Create Safety Branch**~~

~~In your current repo:~~

```bash
git checkout -b mobile-migration-foundation
```

---

# ~~**Step 2 — Freeze Major Feature Development**~~

~~For now:~~

- ~~stop adding major features~~
- ~~stop redesigning screens~~
- ~~stop adding experimental systems~~

~~Focus becomes:~~

- ~~architecture cleanup~~
- ~~shared logic extraction~~
- ~~mobile readiness~~

~~This is critical.~~

---

# **PHASE 1 — PREPARE THE ARCHITECTURE**

# ~~**Step 3 — Audit Current Structure**~~

Your goal is to identify:

## **KEEP**

- business logic
- Zustand stores
- services
- types
- validators
- utility functions

## **REBUILD FOR MOBILE**

- UI components
- layouts
- navigation
- modals
- desktop interactions

---

# **Step 4 — Create Monorepo Structure**

At repo root:

```txt
/apps
  /web
  /mobile

/packages
  /core
```

---

# **Step 5 — Move Current App Into /apps/web**

Current:

```txt
/
  src
  public
  package.json
```

Becomes:

```txt
/apps/web
```

Do NOT refactor logic yet.

Just move it.

---

# **Step 6 — Create Shared Core Package**

Create:

```txt
/packages/core
```

Inside:

```txt
/api
/domain
/services
/types
/utils
/validators
```

---

# **PHASE 2 — EXTRACT SHARED LOGIC**

# **Step 7 — Move Shared Types First**

Move:

- Task types
- Meal types
- Budget types
- Habit types

into:

```txt
/packages/core/types
```

This is LOW RISK.

Start here.

---

# **Step 8 — Move Validators**

Move:

- zod schemas
- form validators
- parsing logic

into:

```txt
/packages/core/validators
```

---

# **Step 9 — Move Services**

Move:

- API calls
- database functions
- Supabase services
- sync logic

into:

```txt
/packages/core/services
```

---

# **Step 10 — Keep Zustand Separate Initially**

IMPORTANT.

Do NOT immediately try sharing Zustand stores.

First:

- stabilize domain structure
- stabilize mobile patterns

Later:

- selectively share store logic if useful

---

# **PHASE 3 — CREATE REACT NATIVE APP**

# **Step 11 — Create Expo App**

From repo root:

```bash
npx create-expo-app apps/mobile
```

Choose:

- TypeScript template

---

# **Step 12 — Install Core Dependencies**

Inside mobile app:

```bash
npm install zustand
npm install @tanstack/react-query
npm install nativewind
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-reanimated
npm install expo-router
```

---

# **Step 13 — Configure NativeWind**

Install:

```bash
npm install nativewind
npm install tailwindcss
```

Create:

- tailwind.config.js
- babel config

This gives you Tailwind-style workflow.

---

# **Step 14 — Install Expo Router**

This gives:

- scalable navigation
- file-based routing
- production-friendly structure

---

# **PHASE 4 — BUILD MOBILE FOUNDATION**

# **Step 15 — Create Mobile Folder Structure**

Inside:

```txt
/apps/mobile/src
```

Create:

```txt
/app
/components
/features
/hooks
/services
/store
/theme
/types
/utils
```

---

# **Step 16 — Build Design Tokens FIRST**

Create:

```txt
/theme/tokens.ts
```

Define:

- spacing
- typography
- colors
- radii
- shadows

DO THIS BEFORE BUILDING SCREENS.

Otherwise UI consistency collapses.

---

# **Step 17 — Build UI Primitives**

FIRST components:

```txt
Button
Card
Text
Input
Screen
Stack
Row
EmptyState
LoadingState
```

Do NOT build feature screens yet.

Build the design system foundation first.

---

# **PHASE 5 — BUILD ONLY CORE MOBILE FLOWS**

# **Step 18 — Build Authentication**

Connect:

- Supabase auth
- session persistence
- onboarding

Keep this simple.

---

# **Step 19 — Build Home Dashboard**

ONLY include:

- today tasks
- habits due
- next meal
- budget snapshot

NO analytics overload.

---

# **Step 20 — Build Task Flow**

Focus on:

```txt
Quick Add
Today
Complete
Reschedule
Recurring
```

This is the highest retention system.

---

# **Step 21 — Build Habit Logging**

Optimize for:

```txt
1 tap completion
```

NOT:

- giant habit analytics
- complex charts
- excessive settings

---

# **Step 22 — Build Notifications**

Add:

- task reminders
- habit reminders
- payment reminders

This massively increases engagement.

---

# **PHASE 6 — CONNECT SHARED CORE**

# **Step 23 — Import Shared Services**

Mobile app imports:

```txt
/packages/core
```

Reuse:

- types
- validators
- services
- APIs

---

# **Step 24 — Create Mobile-Specific Stores**

Do NOT force web stores into mobile.

Mobile interaction patterns differ.

Reuse:

- selectors
- business rules

But mobile stores should optimize:

- performance
- offline state
- quick interactions

---

# **PHASE 7 — MOBILE UX OPTIMIZATION**

# **Step 25 — Redesign Flows for Thumb UX**

Every screen should answer:

```txt
Can this be completed in under 5 seconds?
```

If not:

- simplify
- reduce taps
- reduce decisions

---

# **Step 26 — Add Offline Support**

Critical for planner apps.

At minimum:

- cached tasks
- cached habits
- queued mutations

---

# **Step 27 — Add Widgets + Shortcuts Later**

AFTER stability:

- quick-add widgets
- notification actions
- Siri/Google shortcuts

These are retention multipliers.

---

# **PHASE 8 — RELEASE STRATEGY**

# **Step 28 — Internal TestFlight Build**

DO THIS EARLY.

Do NOT wait for perfection.

Real mobile usage exposes:

- friction
- logging pain
- navigation issues

immediately.

---

# **Step 29 — Release MVP**

MVP should ONLY include:

✅ Dashboard  
✅ Tasks  
✅ Habits  
✅ Calendar  
✅ Meals  
✅ Notifications

NOT everything.

---

# **Step 30 — Add Remaining Domains Gradually**

Then add:

- fitness
- weight
- body measurements
- calories
- cleaning
- advanced budgeting

incrementally.

---

# **MOST IMPORTANT RULES**

# **RULE 1**

Do NOT rebuild everything.

---

# **RULE 2**

Do NOT duplicate business logic.

---

# **RULE 3**

Do NOT port desktop UI directly.

---

# **RULE 4**

Optimize for:

- fast logging
- low cognitive load
- daily retention

NOT feature count.

---

# **RULE 5**

Your mobile app should feel:

```txt
calm
fast
forgiving
simple
```

NOT:

- dense
- analytical
- spreadsheet-like

---

# **FINAL RECOMMENDATION**

Your best path is:

```txt
Existing App
        ↓
Extract Shared Core
        ↓
Build Thin React Native Client
        ↓
Launch Small
        ↓
Expand Carefully
```

This is:

- safest
- fastest
- most scalable
- lowest risk
- most production-ready

for your current architecture.