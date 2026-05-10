# Mobile Design System (Behavioral-First)

This is not a traditional visual design system. This defines the behavioral, cognitive, and adaptive rules that shape the mobile experience. This system prioritizes emotional safety, low cognitive load, and adaptive support.

---

## Purpose

The design system exists to:
- Reduce cognitive load — every design decision reduces mental effort
- Support low-energy usage — works when the user has minimal capacity
- Maintain emotional safety — no shame, no pressure, no judgment in visual design
- Ensure consistent adaptive behavior — surfaces adapt predictably
- Guide component behavior, not just appearance — how things work matters more than how they look
- Create a calm, predictable, supportive mobile environment — the interface itself reduces anxiety

---

## Density System

The adaptive density modes control how much information and interaction is visible at once.

### Low Density (Default)
- **Spacing rules:** 24-32px between elements, generous whitespace
- **Visible elements:** 3-5 items maximum per screen
- **Collapsed sections:** Secondary information collapsed by default
- **Interaction effort:** Single-tap primary actions, minimal scrolling
- **Use case:** Standard usage, low-to-medium capacity states

### Reduced Density (Burnout / Overwhelm)
- **Spacing rules:** 32-48px between elements, expanded breathing room
- **Visible elements:** 1-3 items maximum, single focus when possible
- **Collapsed sections:** All non-essential content hidden
- **Interaction effort:** One-tap completion, no scrolling required
- **Use case:** Detected or user-selected low-capacity state

### Focused Density (Single-Task Mode)
- **Spacing rules:** Full-screen breathing room around single item
- **Visible elements:** 1 item only, everything else removed
- **Collapsed sections:** Complete removal of secondary elements
- **Interaction effort:** Single action only, no decisions
- **Use case:** Extreme low-energy, need to complete just one thing

### Expanded Density (High-Momentum)
- **Spacing rules:** Standard 16-24px spacing
- **Visible elements:** 5-7 items, more information visible
- **Collapsed sections:** Secondary information optionally expanded
- **Interaction effort:** Multiple actions available, moderate scrolling acceptable
- **Use case:** User indicates high capacity, wants to see more

### Density Transition Rules
- Transitions must be gradual, never abrupt
- User must understand why density changed
- User can manually override automatic adjustments
- No density change should feel punitive

---

## Interaction Cost Rules

Rules governing how much effort interactions require.

### Maximum Taps in Low-Energy Mode
- **Capture:** 1-2 taps maximum to complete
- **Task completion:** 1 tap
- **Navigation:** 2 taps maximum to reach any Tier 1 screen
- **Settings:** 3 taps maximum for essential adjustments

### Thumb-Reach Zones
- **Primary zone (easy reach):** Bottom 1/3 of screen, center 60%
- Place all essential actions in primary zone
- **Secondary zone (reachable):** Middle 1/3 of screen, center 80%
- Place helpful but non-critical actions here
- **Avoid zone (requires stretch):** Top 1/3 of screen, edges
- No required actions in avoid zone

### One-Handed Operation Requirements
- All Tier 1 actions must be reachable with one hand
- No two-handed gestures required for core loops
- Swipe actions optional, never required

### Minimal Text Input Expectations
- Default to no text input in low-energy mode
- Smart defaults for all text fields
- Voice input as alternative where possible
- Quick-select options preferred over typing

### Gesture Safety
- **No hidden critical actions:** Swipes and long-presses must be discoverable
- **No destructive gestures:** No delete or archive via gesture without confirmation
- **No required gestures:** All actions available via tap
- **Gesture hints:** First-time users see subtle gesture indicators

### Core Principle
**Interaction cost must decrease as user capacity decreases.**

Low-energy mode reduces taps, increases touch targets, eliminates text input, and moves all actions to the primary thumb zone.

---

## Adaptive Typography Hierarchy

Typography rules that support cognitive clarity and reduce reading load.

### Reduced Reading Load
- **Short line lengths:** 40-60 characters maximum
- **Short paragraphs:** 2-3 sentences maximum
- **Frequent breaks:** Visual separation every 2-3 lines of content
- **Scannable structure:** Headings, bullets, and white space guide the eye

### Chunked Information Blocks
- **One concept per block:** Each visual unit contains a single idea
- **Clear separation:** 16-24px between information blocks
- **Progressive revelation:** Detail available on demand, not displayed by default

### Clear Hierarchy Without Visual Noise
- **Maximum 3 levels:** Primary (headlines), secondary (labels), tertiary (metadata)
- **Weight differentiation:** Bold for primary, regular for secondary, lighter for tertiary
- **Minimal size variation:** 2-3 sizes maximum (e.g., 24px, 16px, 12px)
- **No decorative fonts:** Single typeface family throughout

### Increased Line-Height in Low-Energy Mode
- **Standard:** 1.4-1.5 line-height
- **Low-energy:** 1.6-1.8 line-height for easier reading
- **Relaxed tracking:** Slightly increased letter-spacing for reduced density

### Reduced Density Typography for Burnout Mode
- **Larger base size:** Minimum 16px, preferably 18px
- **Simplified hierarchy:** Reduce to 2 levels (primary/secondary only)
- **Increased contrast:** Higher contrast for easier parsing
- **Reduced variation:** Single weight, single size for body text

### Core Principle
**Typography must support cognitive clarity, not aesthetic flourish.**

Every typographic choice reduces reading effort and supports comprehension.

---

## Motion Philosophy

Rules governing animation and transitions.

### Gentle Transitions
- **Duration:** 200-300ms for standard transitions
- **Easing:** Soft ease-out curves, never abrupt linear or bouncy
- **Direction:** Consistent directional language (e.g., forward pushes right, back slides left)

### Low-Stimulation Motion
- **No flashing:** No rapid color or brightness changes
- **No pulsing:** No attention-grabbing pulsing animations
- **No shaking:** No shake or wobble effects
- **Subtle opacity:** Gentle fade transitions preferred over movement

### Informative, Not Decorative
- Motion indicates state change (e.g., item added, completed)
- Motion guides attention (e.g., new item appears)
- Motion provides feedback (e.g., action confirmed)
- No motion for pure decoration

### Reversible Animations
- Users can interrupt transitions mid-animation
- State remains consistent even if animation doesn't complete
- No dependency on animation completion for functionality

### No Dopamine-Driven Micro-Interactions
- **No celebration animations for basic actions:** Completion is its own reward
- **No points or badges with animations:** No gamification
- **No streak animations:** No pressure-inducing visual rewards
- **Micro-wins are subtle:** Gentle acknowledgment, not celebration

### No Abrupt State Changes
- Density changes animate over 200-400ms
- Content appearing/disappearing fades rather than snaps
- State transitions feel like gentle shifts, not jarring cuts

### Core Principle
**Motion must reduce anxiety, not increase stimulation.**

Animation exists to inform and reassure, not to excite or addict.

---

## Adaptive Component States

Components adapt based on user state, not user configuration.

### Collapsed
- **Definition:** Secondary information hidden, primary action visible
- **Trigger:** Default in low and medium density modes
- **Behavior:** User can expand for detail, but never required to
- **Example:** Task shows title only; details hidden behind tap

### Simplified
- **Definition:** Reduced functionality, minimal options
- **Trigger:** Low-energy mode, detected overwhelm
- **Behavior:** Only essential actions available, advanced options removed
- **Example:** Task completion only; no edit, delete, or reschedule

### Focused
- **Definition:** Single element dominates, everything else minimized
- **Trigger:** Extreme low-energy, user manually selects focus mode
- **Behavior:** One task visible, full-screen breathing room, one action
- **Example:** Single task fills screen, one "done" button

### Expanded
- **Definition:** Full functionality, all options visible
- **Trigger:** High-momentum state, user indicates capacity
- **Behavior:** Complete feature set available, higher density acceptable
- **Example:** Task with all metadata, actions, and options visible

### State Transition Rules
- Components can transition between states automatically (based on adaptive state)
- Components can be manually overridden by user
- State changes animate gently
- No state change feels like punishment or reward

---

## Visual Calmness Rules

Rules ensuring the interface itself does not create stress.

### Minimal Simultaneous Focal Points
- **One primary focal point per screen:** User knows exactly where to look
- **Secondary focal points (if any):** Clearly subordinate, never competing
- **No visual shouting:** No bold, bright, or animated elements competing for attention

### Soft Contrast Shifts
- **Gradual transitions:** Contrast changes subtly, not abruptly
- **Limited high-contrast elements:** Only primary actions get full contrast
- **Reduced contrast in low-energy mode:** Less visual stimulation overall

### Limited Color Accents
- **Neutral base:** Grays, soft whites, gentle earth tones
- **Single accent color:** One warm, calming color for emphasis
- **No bright alerts:** No red, orange, or bright yellow for "attention"
- **State colors (if any):** Soft blues, gentle greens — never alarming

### Predictable Spatial Rhythm
- **Consistent spacing:** Same gaps between similar elements
- **Consistent sizing:** Same touch targets for same action types
- **Grid alignment:** Elements align to clear, simple grid
- **No visual surprises:** Layout behaves predictably

### No Sudden Density Changes
- Content density shifts gradually
- No screens that feel "completely different" from others
- Structural consistency even when content density changes

### Core Principle
**Calmness is a functional requirement, not a stylistic choice.**

The interface must actively reduce anxiety through its visual design.

---

## Cognitive Hierarchy

Rules for organizing information to prevent overwhelm.

### Primary Actions (1–2 Maximum)
- **Definition:** The one or two things the user most likely wants to do
- **Visibility:** Prominent, always accessible
- **Effort:** Single tap, primary thumb zone
- **Examples:** Complete task, capture new task

### Secondary Actions (Optional)
- **Definition:** Useful but not essential actions
- **Visibility:** Available but not prominent
- **Effort:** Two taps or secondary thumb zone
- **Examples:** Edit task, reschedule, view details

### Tertiary Actions (Hidden or Deferred)
- **Definition:** Rarely needed or edge-case actions
- **Visibility:** Hidden behind menus, "more" options, or deep settings
- **Effort:** Multiple taps, intentional seeking
- **Examples:** Delete task, complex configuration, advanced features

### Progressive Disclosure Rules
- **Default minimal:** Show least information necessary
- **Expand on demand:** Detail available via intentional action
- **No mandatory expansion:** User never forced to expand to complete core loop
- **Remember preferences:** If user expands, remember for next time

### "No Cognitive Cliffs" Principle
- **No sudden information walls:** No screens with overwhelming density
- **No hidden complexity:** Complexity doesn't suddenly appear mid-flow
- **Gradual exposure:** Complexity introduced gradually as user indicates capacity
- **Easy retreat:** User can always return to simpler view

### Core Principle
**Hierarchy must prevent overwhelm and support low working memory.**

Users should never feel lost, overwhelmed, or unsure what to do next.

---

## Adaptive Surfaces

The surfaces that must express the behavioral intelligence of the system.

### Today
- **Must adapt:** Item count, density, tone, available actions
- **Behavioral expression:** Primary adaptive surface, shows system understanding user capacity
- **Critical requirement:** Must feel genuinely different in low vs high energy states

### Capture
- **Must adapt:** Field count, friction level, smart defaults
- **Behavioral expression:** Entry point remains accessible at lowest capacity
- **Critical requirement:** Must remain sub-10-second completion even in burnout

### Recovery
- **Must adapt:** Messaging, content shown, options presented
- **Behavioral expression:** Re-entry without guilt or overwhelm
- **Critical requirement:** Must protect users returning from absence

### Low-Energy Mode
- **Must adapt:** Everything — this is the behavioral state itself
- **Behavioral expression:** Proof the platform works for all human states
- **Critical requirement:** Must be meaningfully easier, not just different

### Momentum Indicators
- **Must adapt:** Visibility, tone, prominence
- **Behavioral expression:** Gentle feedback without pressure
- **Critical requirement:** Must feel supportive, never shaming

### Surface Adaptation Rules
- Each surface queries adaptive state to determine presentation
- Surfaces do not embed adaptive logic — they respond to it
- User can manually override for any surface
- Surfaces adapt consistently (same rules across app)

---

## Out of Scope (For Now)

What is explicitly NOT part of the design system yet. These come after behavioral validation.

### Full Color Palette
- **Not yet:** Comprehensive color system, dark mode, accessibility variations
- **Now:** Single warm neutral palette that works

### Branding Polish
- **Not yet:** Logo refinement, brand voice, marketing materials
- **Now:** Behavioral consistency is the brand

### Advanced Component Variants
- **Not yet:** Dozens of button styles, card variations, input types
- **Now:** Minimal component set that supports adaptive states

### Animation Library
- **Not yet:** Comprehensive animation system, Lottie files, complex sequences
- **Now:** Simple, gentle transitions only

### Iconography System
- **Not yet:** Custom icon set, comprehensive icon library
- **Now:** Minimal icon set, text labels preferred

### Complex Theming
- **Not yet:** User-selectable themes, seasonal variations, personalization
- **Now:** Single, consistent, calm visual system

### Why Deferred
These elements add complexity without validating core behavioral value. Build the behavioral system first, then polish. The app must work adaptively before it looks polished.

---

*This behavioral-first design system ensures the mobile experience reduces cognitive load, supports emotional safety, and adapts intelligently to user capacity.*
