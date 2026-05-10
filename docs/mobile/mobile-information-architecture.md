# Mobile Information Architecture
Explain that this document defines:
- screen ownership
- domain placement
- hierarchy depth
- cognitive load boundaries
- progressive disclosure strategy

# Today Tab
Define exactly what appears on the Today screen:
- Focus Card
- Today Tasks
- Today Meals
- Quick Actions
- Momentum Snapshot
- Reminders
- Routines due today
- Calendar highlights

For each item, specify:
- purpose
- interaction depth (inline, sheet, or navigation)
- frequency of use
- cognitive load impact

## Focus Card
- **Purpose**: Primary engagement point, shows daily progress and next action
- **Interaction depth**: Inline (toggles, quick actions)
- **Frequency of use**: Daily, multiple times
- **Cognitive load impact**: Low (single focus point, clear visual hierarchy)

## Today Tasks
- **Purpose**: Show incomplete tasks for today, quick completion
- **Interaction depth**: Inline (toggle) + Sheet (add/edit)
- **Frequency of use**: Daily, multiple times
- **Cognitive load impact**: Medium (requires attention, but focused on today only)

## Today Meals
- **Purpose**: Show meals planned for today, quick logging
- **Interaction depth**: Inline (view) + Sheet (add/edit)
- **Frequency of use**: Daily, meal times
- **Cognitive load impact**: Low (simple list, time-based)

## Quick Actions
- **Purpose**: Rapid capture for tasks, meals, expenses, shopping
- **Interaction depth**: Sheet (creation flows)
- **Frequency of use**: Daily, as needed
- **Cognitive load impact**: Low (predictive defaults, minimal decisions)

## Momentum Snapshot
- **Purpose**: Show daily momentum score and streak information
- **Interaction depth**: Inline (view) + Navigation (details)
- **Frequency of use**: Daily, motivational check-ins
- **Cognitive load impact**: Low (visual, no decisions required)

## Reminders
- **Purpose**: Show time-based reminders and notifications
- **Interaction depth**: Inline (dismiss) + Navigation (manage)
- **Frequency of use**: Daily, when reminders trigger
- **Cognitive load impact**: Low (action-oriented, clear CTAs)

## Routines due today
- **Purpose**: Show scheduled routines and focus sessions
- **Interaction depth**: Inline (start) + Navigation (details)
- **Frequency of use**: Daily, routine times
- **Cognitive load impact**: Medium (requires time management decisions)

## Calendar highlights
- **Purpose**: Show calendar events and appointments
- **Interaction depth**: Inline (view) + Navigation (details)
- **Frequency of use**: Daily, when events exist
- **Cognitive load impact**: Low (informational only)

# Plan Tab
Define the planning domain:
- Tasks
- Calendar
- Routines
- Meal Planning
- Shopping Planning

For each, specify:
- ownership
- hierarchy depth
- cross-domain relationships

## Tasks
- **Ownership**: Tasks domain
- **Hierarchy depth**: Root (primary tab)
- **Cross-domain relationships**: Feeds into Today, integrates with Routines

## Calendar
- **Ownership**: Shared domain (Tasks + Routines + Events)
- **Hierarchy depth**: Stack under Tasks
- **Cross-domain relationships**: Connects to Tasks, Routines, external calendars

## Routines
- **Ownership**: Routines domain
- **Hierarchy depth**: Root (primary tab) or Stack under Plan
- **Cross-domain relationships**: Generates tasks, integrates with Momentum

## Meal Planning
- **Ownership**: Meals domain
- **Hierarchy depth**: Root (primary tab) or Stack under Plan
- **Cross-domain relationships**: Feeds into Today, connects to Recipes

## Shopping Planning
- **Ownership**: Shopping domain
- **Hierarchy depth**: Stack under Plan or Root (primary tab)
- **Cross-domain relationships**: Connects to Recipes, feeds into Today

# Track Tab
Define the tracking domain:
- Habits
- Fitness
- Calories
- Progress
- Streaks
- Insights

For each, specify:
- data source
- interaction model
- navigation depth
- frequency of access

## Habits
- **Data source**: Routines + Momentum tracking
- **Interaction model**: View-only + drill-down to details
- **Navigation depth**: 2 levels (Track → Habit Details)
- **Frequency of access**: Daily to weekly

## Fitness
- **Data source**: External integrations + manual entry
- **Interaction model**: Editable + view-only dashboards
- **Navigation depth**: 2-3 levels (Track → Fitness → Details)
- **Frequency of access**: Weekly to monthly

## Calories
- **Data source**: Meals domain + manual entry
- **Interaction model**: View-only + manual entry
- **Navigation depth**: 2 levels (Track → Calories)
- **Frequency of access**: Daily to weekly

## Progress
- **Data source**: Momentum + Intelligence + all domains
- **Interaction model**: View-only + drill-down
- **Navigation depth**: 2-3 levels (Track → Progress → Details)
- **Frequency of access**: Weekly

## Streaks
- **Data source**: Momentum + Routines + Habits
- **Interaction model**: View-only + celebration interactions
- **Navigation depth**: 2 levels (Track → Streaks)
- **Frequency of access**: Daily to weekly

## Insights
- **Data source**: Intelligence + all behavioral data
- **Interaction model**: View-only + actionable insights
- **Navigation depth**: 2 levels (Track → Insights)
- **Frequency of access**: Weekly to monthly

# More Tab
Define the overflow domain:
- Settings
- Profile
- Recipes
- Exports
- Advanced Systems
- Integrations
- Help

For each, specify:
- why it lives here
- navigation type (stack or modal)
- depth allowed

## Settings
- **Why it lives here**: Low-frequency, high-complexity configuration
- **Navigation type**: Stack (multi-level navigation)
- **Depth allowed**: Yes (multiple setting categories)

## Profile
- **Why it lives here**: Low-frequency personal information management
- **Navigation type**: Stack (profile sections)
- **Depth allowed**: Yes (profile editing, preferences)

## Recipes
- **Why it lives here**: Medium-frequency, complex content management
- **Navigation type**: Stack (recipe list → details → edit)
- **Depth allowed**: Yes (multi-level recipe management)

## Exports
- **Why it lives here**: Low-frequency utility function
- **Navigation type**: Modal (simple selection and export)
- **Depth allowed**: No (single-purpose flow)

## Advanced Systems
- **Why it lives here**: Low-frequency, high-complexity features
- **Navigation type**: Stack (advanced configuration)
- **Depth allowed**: Yes (complex configuration flows)

## Integrations
- **Why it lives here**: Low-frequency setup and management
- **Navigation type**: Stack (integration list → setup)
- **Depth allowed**: Yes (multi-step integration flows)

## Help
- **Why it lives here**: Low-frequency, problem-resolution focused
- **Navigation type**: Stack (help topics → details)
- **Depth allowed**: Yes (help hierarchy, contact forms)

# Cross-Domain Rules
Define rules for:
- where new features should live
- maximum navigation depth
- bottom sheet vs full screen
- progressive disclosure boundaries
- cognitive load thresholds
- one-handed usage constraints

## Where new features should live
- **Daily-use features**: Primary tabs (Today, Plan, Track)
- **Weekly-use features**: Primary tabs or top-level stacks
- **Monthly-use features**: More tab overflow
- **Setup/configuration**: More tab overflow
- **Utility functions**: More tab overflow

## Maximum navigation depth
- **Maximum depth**: 3 levels from any entry point
- **Today tab**: 0-1 levels (inline + sheets)
- **Primary tabs**: 0-2 levels (root + one stack)
- **More tab**: 2-3 levels (complex flows allowed)
- **Emergency exit**: Always return to Today in 1-2 taps

## Bottom sheet vs full screen
- **Creation flows**: Bottom sheets (quick capture)
- **Configuration flows**: Full screens (complex forms)
- **Selection flows**: Bottom sheets (quick choices)
- **Detail views**: Full screens (rich content)
- **Confirmation flows**: Bottom sheets (quick actions)

## Progressive disclosure boundaries
- **Today screen**: Maximum 7 sections, 5 items per section
- **Primary tabs**: Maximum 10 items per screen before pagination
- **Lists**: Collapse after 8 items, show "Show more"
- **Forms**: Maximum 5 fields per screen, break into steps
- **Settings**: Group into logical categories, max 5 per level

## Cognitive load thresholds
- **Today screen**: Low load (informational, minimal decisions)
- **Planning screens**: Medium load (requires decisions, but focused)
- **Tracking screens**: Low to medium load (mostly informational)
- **Configuration screens**: High load (complex decisions allowed)
- **Emergency flows**: Minimal load (single focus, clear path)

## One-handed usage constraints
- **Primary actions**: Bottom 25% of screen
- **Navigation**: Bottom tab bar only
- **Quick capture**: Center FAB or bottom sheet
- **Critical actions**: Thumb-reachable zones
- **Secondary actions**: Top half of screen allowed

# Information Density Guidelines
Define:
- maximum items visible
- collapse rules
- pagination thresholds
- summary vs detail rules

## Maximum items visible
- **Today screen**: 7 sections, 5 items per section
- **List screens**: 12 items visible, 20 total before pagination
- **Grid screens**: 9 items visible, 18 total before pagination
- **Settings screens**: 8 items per category
- **Modal screens**: 5 form fields or 8 list items

## Collapse rules
- **Collapse after**: 8 visible items
- **Show more**: After 8 items, expand to show 12 more
- **Auto-collapse**: Completed sections, old items
- **Manual control**: User can expand/collapse sections
- **Visual indicators**: Clear expand/collapse affordances

## Pagination thresholds
- **Paginate lists**: After 20 items total
- **Chunk content**: Break long forms into 3-4 steps
- **Virtualize lists**: For 50+ items
- **Lazy load**: Images and rich content
- **Progressive reveal**: Load essential data first

## Summary vs detail rules
- **Use summaries**: For overview screens, quick references
- **Show full detail**: For dedicated detail screens, editing
- **Progressive detail**: Summary → key details → full details
- **Contextual summaries**: Show relevant info based on context
- **Drill-down pattern**: Summary → details → actions

# Onboarding Clarity
Define:
- landing tab
- what is visible without setup
- what is hidden until configured
- how the app teaches its structure

## Landing tab
- **First-time users**: Today tab (minimal setup required)
- **Returning users**: Last used tab or Today
- **Post-onboarding**: Today tab with personalized content
- **Empty state**: Today tab with quick capture prominent

## What is visible without setup
- **Today tab**: Basic focus card, quick actions
- **Quick capture**: Task, meal, expense creation
- **Basic navigation**: All tabs visible but empty
- **Help access**: Always available in More tab
- **Settings access**: Basic settings available

## What is hidden until configured
- **Personalized insights**: Require initial data entry
- **Advanced features**: Hidden behind setup flows
- **Integrations**: Require explicit connection
- **Custom routines**: Require template creation
- **Historical data**: Builds up over time

## How the app teaches its structure
- **Progressive disclosure**: Reveal features as needed
- **Contextual hints**: Show tips when relevant
- **Empty state education**: Explain what each area does
- **Success celebration**: Reinforce correct usage patterns
- **Feature discovery**: Highlight new features when available
