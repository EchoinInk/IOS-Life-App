# Screen Priority Map

This document defines the execution order of mobile screens. This ensures the adaptive platform is built in the correct sequence, with minimal scope and maximum behavioral impact.

---

## Purpose

The screen priority map exists to:
- Prevent scope explosion — limit what gets built first
- Focus on the core behavioral loops — screens that enable adaptive behavior
- Avoid premature complexity — defer features that add noise
- Ensure adaptive surfaces are built first — adaptation is the core value
- Create a clear MVP path — know exactly what must ship
- Protect simplicity — complexity creeps in when priorities are unclear

---

## Tier 1 Screens (MVP-Critical)

The minimum screens required for the core user journey. Without these, the adaptive behavioral system cannot function.

### Onboarding (Progressive, Minimal)
- **Purpose:** First impression, sets emotional tone, establishes adaptive expectations
- **Why essential:** Users must understand this is not a productivity app
- **Must include:** Reassurance, normalization of inconsistency, minimal steps
- **Must avoid:** Feature dumps, tutorials, pressure to configure everything

### Capture (Fast, Low-Friction)
- **Purpose:** The entry point for all user input — tasks, thoughts, routines
- **Why essential:** Without capture, the system has nothing to adapt to
- **Must include:** One-tap entry, minimal fields, smart defaults
- **Must avoid:** Multi-step flows, mandatory categorization, complex scheduling

### Today (Adaptive, Reduced Density Capable)
- **Purpose:** The primary surface where users engage with their day
- **Why essential:** The core adaptive experience lives here
- **Must include:** Variable density, low-energy mode, simplified views
- **Must avoid:** Fixed layouts, overwhelming lists, time pressure

### Recovery Flow
- **Purpose:** Re-entry after absence without guilt or overwhelm
- **Why essential:** Protects users who struggle with consistency
- **Must include:** Gentle welcome, no backlog dump, fresh start option
- **Must avoid:** "While you were away" summaries, catch-up pressure, missed day counts

### Low-Energy Mode Surface
- **Purpose:** Reduced-capacity experience when user has minimal energy
- **Why essential:** Core promise of the platform — works for humans in all states
- **Must include:** Minimal items, one-tap actions, supportive tone
- **Must avoid:** Full feature access, complex options, achievement emphasis

### Settings (Minimal, Essential Only)
- **Purpose:** User control over the experience
- **Why essential:** Users must be able to reduce pressure, pause, customize
- **Must include:** Reminder frequency, quiet hours, pause options, tone preferences
- **Must avoid:** Deep customization, feature toggles, complex configuration

---

## Tier 2 Screens (Important, Not Blocking)

Screens that enhance the experience but are not required for the first behavioral loop. Build these only after Tier 1 validates the core loops.

### Task Details
- **Purpose:** View and edit individual tasks
- **Why deferred:** Capture and Today cover the core loop; details are secondary
- **Build when:** Users need more than minimal task management

### Routine Details
- **Purpose:** View and configure recurring patterns
- **Why deferred:** Onboarding sets up initial routines; details come later
- **Build when:** Users want to modify or create new routines

### Momentum View
- **Purpose:** Gentle progress visualization without pressure
- **Why deferred:** Today view provides enough initial feedback
- **Build when:** Users express interest in seeing patterns

### History / Past Days
- **Purpose:** Access to previous days without overwhelm
- **Why deferred:** Recovery flow handles re-entry; history is optional
- **Build when:** Users request ability to review or adjust past items

### Notifications Settings
- **Purpose:** Granular control over reminders and messages
- **Why deferred:** Basic quiet hours and pause suffice initially
- **Build when:** Users need more control than minimal settings provide

### Basic Analytics (Lightweight)
- **Purpose:** Simple insights without complexity
- **Why deferred:** Not required for core adaptive behavior
- **Build when:** Platform needs data for improvement; users express curiosity

---

## Tier 3 Screens (Deferred)

Screens that should explicitly NOT be built yet. These add complexity without validating the behavioral core.

### Deep Analytics
- **Why deferred:** Complex data visualization contradicts low-energy philosophy
- **Risk:** Overwhelms users, creates pressure to "optimize"
- **Build only if:** Users explicitly request and can opt out entirely

### Advanced Customization
- **Why deferred:** More options increase cognitive load
- **Risk:** Users spend time configuring instead of doing
- **Build only if:** Clear evidence that defaults fail for many users

### Complex Routine Builders
- **Why deferred:** Multi-step routine creation creates friction
- **Risk:** Users abandon before completing setup
- **Build only if:** Simple routine capture proves insufficient

### Social Features
- **Why deferred:** Social pressure contradicts non-judgmental philosophy
- **Risk:** Comparison, shame, performance anxiety
- **Build only if:** Explicitly requested and carefully designed for opt-in only

### Gamification Layers
- **Why deferred:** Points, badges, leaderboards create external pressure
- **Risk:** Undermines intrinsic motivation, creates shame when "failing"
- **Build only if:** Never — incompatible with platform philosophy

### AI Copilots or Assistants
- **Why deferred:** AI suggestions can feel prescriptive or judgmental
- **Risk:** Users feel watched, criticized, or managed
- **Build only if:** Extensive validation that tone remains supportive

### Multi-Step Planning Tools
- **Why deferred:** Complex planning increases cognitive load
- **Risk:** Users overwhelmed before they begin
- **Build only if:** Simple capture proves insufficient for user needs

---

## Core Behavioral Loops (Execution Focus)

The loops that must be supported by Tier 1 screens. These loops define the MVP.

### Capture Loop
- **Flow:** User has thought → Opens app → Captures in under 10 seconds → Returns to life
- **Screens:** Capture, minimal Today feedback
- **Success metric:** Capture friction low enough for daily use

### Reduce Overwhelm Loop
- **Flow:** System detects overwhelm → Today view simplifies → User feels capable → Continues engagement
- **Screens:** Today (adaptive), Low-Energy Mode
- **Success metric:** Users stay engaged during low-capacity periods

### Regain Momentum Loop
- **Flow:** User completes small action → Micro-win acknowledged → Confidence builds → Next action easier
- **Screens:** Today (adaptive), minimal celebration
- **Success metric:** Users report feeling supported, not pressured

### Recovery After Absence Loop
- **Flow:** User returns after break → No guilt or backlog → Fresh start offered → User re-engages gently
- **Screens:** Recovery Flow, Today (simplified)
- **Success metric:** Return users not overwhelmed, re-engagement rate high

### Low-Energy Support Loop
- **Flow:** User has minimal capacity → System detects or user selects → Experience reduces → User can still engage
- **Screens:** Low-Energy Mode, Today (adaptive)
- **Success metric:** App remains usable during burnout or low-energy states

---

## Adaptive Critical Paths

Screens that must support adaptive behavior from day one. These surfaces must adapt density, tone, pacing, and interaction friction.

### Today
- **Must adapt:** Item count, visual density, tone of messaging, interaction complexity
- **Why critical:** Primary daily surface — where adaptation is most visible
- **Adaptive behaviors:** Show 1-3 items in low state, 5-7 in medium, more in high; soft colors in low, standard in high; gentle pacing always

### Capture
- **Must adapt:** Field count, required inputs, friction level
- **Why critical:** Entry point must remain accessible even at lowest capacity
- **Adaptive behaviors:** One-field minimum in low state; smart defaults; optional fields hidden

### Recovery
- **Must adapt:** Messaging tone, content shown, options presented
- **Why critical:** Re-entry is when users are most vulnerable to overwhelm
- **Adaptive behaviors:** No counts or backlogs visible; gentle language; fresh start prominent

### Low-Energy Mode
- **Must adapt:** Everything — this is the adaptive state itself
- **Why critical:** Proof that the platform works for humans in all states
- **Adaptive behaviors:** Minimal presentation, single focus, one-tap actions, supportive tone

---

## What Is Explicitly Out of Scope

Features and screens that must NOT be built yet. Protecting simplicity is essential for adaptive clarity.

### Advanced Productivity Features
- Time blocking, deep work modes, focus timers
- **Why out:** Contradicts low-energy, flexible philosophy

### Complex Scheduling
- Calendar integration, recurring scheduling rules, deadline management
- **Why out:** Increases pressure and cognitive load

### Deep Customization
- Themes, layouts, advanced preferences, feature toggles
- **Why out:** Defaults should work; customization adds noise

### Multi-Layered Navigation
- Nested menus, tabs, complex hierarchies
- **Why out:** Increases cognitive load, contradicts simplicity

### Heavy Analytics
- Detailed reports, trend analysis, data visualization
- **Why out:** Overwhelming, creates pressure to "improve"

### AI-Driven Planning
- Smart suggestions, auto-scheduling, predictive task management
- **Why out:** Prescriptive AI contradicts adaptive, user-controlled philosophy

---

## Execution Principles

Rules for building Tier 1 screens:

- **Build the smallest version of each Tier 1 screen** — minimal viable, then iterate
- **Prioritize adaptive behavior over visual polish** — function matters more than aesthetics
- **Avoid premature component abstraction** — don't build for reuse before validating need
- **Avoid building for future features** — build what exists now, not what might exist
- **Validate behavioral loops before expanding scope** — prove the core works before adding

### Sequence
1. Capture (fastest path to user value)
2. Today (adaptive surface)
3. Onboarding (sets expectations)
4. Recovery (protects consistency)
5. Low-Energy Mode (validates core promise)
6. Settings (user control)

### Validation Criteria
Tier 1 is complete when:
- User can capture in under 10 seconds
- Today view adapts visibly to different states
- User returning after absence feels welcomed, not overwhelmed
- Low-energy mode feels genuinely easier, not just different
- User can reduce pressure through settings

---

*This priority map ensures the platform remains focused, simple, and adaptively effective from day one.*
