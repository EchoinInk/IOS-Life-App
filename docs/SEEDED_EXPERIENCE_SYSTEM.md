# Seeded Experience System

## Overview

The Seeded Experience System is a premium first-run experience for Lumo that ensures new users immediately experience momentum, usefulness, and emotional payoff within their first session.

## Problem Solved

Even with onboarding, the product can feel emotionally empty before users create enough real data. This system generates contextual starter content based on onboarding selections, creating an immediate sense of progress and momentum.

## Key Features

### 1. Seeded Content Generation

**Location**: `src/features/onboarding/utils/seededContentGenerator.ts`

Deterministic generation of contextual starter content based on onboarding data:
- **Tasks**: Personalized task suggestions based on focus areas and goals
- **Routines**: Starter routines tailored to daily cadence preferences
- **Focus Sessions**: Scheduled focus sessions aligned with user's rhythm
- **Insights**: Sample insights relevant to user's priorities
- **First Win Task**: A simple, quick task designed for immediate completion

**Key Characteristics**:
- Deterministic (no randomness)
- Context-aware (based on onboarding selections)
- Lightweight (no backend dependency)
- Premium feel (calm, intelligent, encouraging)

### 2. First-Session Momentum System

**Location**: `src/features/onboarding/store/useFirstSessionStore.ts`

Tracks and manages the first-session experience:
- **Session Steps**: Guided steps to help users explore the app
- **Momentum Milestones**: Trackable achievements (first task, first completion, etc.)
- **Momentum Score**: Visual indicator of progress
- **Rewards**: Subtle, encouraging feedback for achievements

**Milestones**:
1. First Task Added
2. First Completion
3. First Routine
4. First Focus Session
5. First Planning

### 3. Dashboard Evolution

**Location**: `src/features/onboarding/store/useDashboardEvolutionStore.ts`

Makes the dashboard visibly evolve based on user progress:
- **Stages**: empty → seeded → first_completion → first_routine → active
- **Visual Changes**: Progressive reveal of dashboard elements
- **Celebrations**: Subtle visual celebrations for milestones

**Evolution Timeline**:
1. **Empty**: Basic dashboard layout
2. **Seeded**: Progress card appears after first task added
3. **First Completion**: Momentum ring and insights appear
4. **First Routine**: Routines card appears
5. **Active**: Full dashboard with all features

### 4. Personalized Empty States

**Location**: `src/components/ui/IntelligentEmptyState.tsx`

Enhanced empty states that use onboarding context:
- **Context-Aware Suggestions**: Different suggestions based on focus areas
- **Personalized Messaging**: Tailored descriptions and CTAs
- **Momentum Integration**: Shows momentum score when relevant

**Personalization Examples**:
- Work focus: "Plan your first focus session" / "Block focus time for deep work"
- Health focus: "Start your wellness journey" / "Schedule movement for today"
- Budgeting focus: "Track your first expense" / "Log morning coffee"

### 5. Integration Layer

**Location**: `src/features/onboarding/utils/seededExperienceIntegration.ts`

Connects the seeded experience with the onboarding flow:
- **Automatic Integration**: Triggers on onboarding completion
- **One-Time Application**: Prevents re-seeding on subsequent app opens
- **Store Updates**: Automatically populates task store with seeded content
- **State Initialization**: Sets up first-session and dashboard evolution stores

## Architecture

### Type System

**Location**: `src/features/onboarding/types/seededExperience.types.ts`

Complete type definitions for:
- Seeded content packages
- First-session state
- Dashboard evolution state
- Momentum milestones
- Visual changes

### Data Flow

```
Onboarding Completion
    ↓
Seeded Experience Integration
    ↓
Content Generation (based on onboarding data)
    ↓
Store Population (tasks, first-session, dashboard)
    ↓
User Interaction (completes first win task)
    ↓
Momentum Milestone Achievement
    ↓
Dashboard Evolution
```

## Implementation Details

### Seeded Content Generator

The `SeededContentGenerator` class uses onboarding data to create personalized content:

```typescript
const generator = new SeededContentGenerator(onboardingData);
const result = generator.generate();
```

**Focus Area Mapping**:
- Work → Task suggestions, focus sessions, productivity insights
- Health → Wellness tasks, movement routines, health tips
- Budgeting → Expense tracking, financial insights
- Routines → Morning/evening routines, habit-building content
- Learning → Educational tasks, focus sessions, growth insights
- Creativity → Creative projects, inspiration tasks
- Relationships → Connection tasks, communication insights

**Daily Cadence Integration**:
- Morning person → Morning routines, early focus sessions
- Evening person → Evening routines, later focus sessions
- Throughout day → Multiple check-ins, flexible scheduling
- Weekly planner → Weekly review rituals, planning sessions

### First Win Task

The "first win" is a specially designed task:
- **Quick**: 1-3 minutes to complete
- **Simple**: Clear, actionable step
- **Rewarding**: Immediate positive feedback
- **Non-deletable**: Ensures momentum opportunity
- **Personalized**: Based on primary focus area

**Examples**:
- Work: "Set today's top priority"
- Health: "Drink a glass of water"
- Budgeting: "Note today's budget"
- Routines: "Plan your morning routine"

### Dashboard Evolution Logic

The dashboard evolves through stages based on user actions:

```typescript
dashboardStore.achieveMilestone('first_task_added');
// Triggers visual change: showProgressCard = true

dashboardStore.achieveMilestone('first_task_completed');
// Triggers visual change: showMomentumRing = true, showInsightsCard = true
```

## Usage

### For Developers

**Integrating with Onboarding**:
```typescript
import { useSeededExperienceIntegration } from '@/features/onboarding/utils/seededExperienceIntegration';

const { integrateSeededExperience } = useSeededExperienceIntegration();
await integrateSeededExperience(onboardingData);
```

**Checking Seeded Status**:
```typescript
import { SeededExperienceIntegrator } from '@/features/onboarding/utils/seededExperienceIntegration';

const hasApplied = SeededExperienceIntegrator.hasSeededExperienceBeenApplied();
const metadata = SeededExperienceIntegrator.getSeededExperienceMetadata();
```

**Resetting (for testing)**:
```typescript
SeededExperienceIntegrator.clearSeededExperienceFlag();
```

**Using Personalized Empty States**:
```typescript
<IntelligentEmptyState
  context="tasks"
  isFirstTime={true}
  onboardingData={onboardingData}
  showMomentum={true}
  momentumScore={momentumScore}
/>
```

### For Designers

**Design Principles**:
- **Calm**: No gamification, no noise, no excessive celebrations
- **Premium**: Subtle animations, refined typography, thoughtful spacing
- **Intelligent**: Context-aware suggestions, smart defaults
- **Encouraging**: Positive reinforcement, progress visibility
- **Momentum-Focused**: Emphasis on forward movement

**Visual Evolution**:
- Start with minimal, clean interface
- Gradually reveal features as user progresses
- Use subtle animations for transitions
- Maintain consistency with existing design system

## Testing

### Manual Testing Checklist

1. **Fresh Install**:
   - Complete onboarding with different focus areas
   - Verify seeded tasks appear in task list
   - Verify first win task is present and quick to complete
   - Complete first win task and observe momentum feedback

2. **Dashboard Evolution**:
   - Track dashboard changes after each milestone
   - Verify visual changes match expected evolution
   - Check that celebrations are subtle and appropriate

3. **Empty States**:
   - Visit different modules with empty state
   - Verify suggestions match onboarding focus areas
   - Check personalization is working correctly

4. **Re-seeding Prevention**:
   - Close and reopen app after first session
   - Verify no new seeded content is added
   - Check that flag is properly set

### Automated Testing

Consider adding tests for:
- Content generation determinism
- Type safety of seeded content
- Store integration
- Milestone tracking
- Dashboard evolution logic

## Future Enhancements

### Potential Improvements

1. **Adaptive Seeding**: Adjust seeded content based on user interaction patterns
2. **Dynamic First Wins**: Generate multiple first win options based on context
3. **Progressive Loading**: Load seeded content in phases to avoid overwhelming
4. **A/B Testing**: Test different seeding strategies for effectiveness
5. **Analytics Integration**: Track which seeded content users engage with most

### Expansion Opportunities

1. **Module-Specific Seeding**: Deepen seeded content for each module (budget, meals, etc.)
2. **Time-Based Seeding**: Generate content based on time of day/week
3. **Seasonal Seeding**: Adjust content based on seasons or events
4. **Social Seeding**: Add social features to seeded experience (shared goals, etc.)

## Files Created/Modified

### New Files

1. `src/features/onboarding/types/seededExperience.types.ts` - Type definitions
2. `src/features/onboarding/utils/seededContentGenerator.ts` - Content generator
3. `src/features/onboarding/store/useFirstSessionStore.ts` - First-session state
4. `src/features/onboarding/store/useDashboardEvolutionStore.ts` - Dashboard evolution state
5. `src/features/onboarding/utils/seededExperienceIntegration.ts` - Integration layer

### Modified Files

1. `src/components/ui/IntelligentEmptyState.tsx` - Added onboarding context personalization
2. `src/features/onboarding/components/steps/CompletionStep.tsx` - Integrated seeded experience

## Constraints Met

✅ **Preserve current architecture** - All new code follows existing patterns
✅ **No backend dependency** - Pure client-side implementation
✅ **Deterministic seeded generation** - No randomness, consistent results
✅ **Lightweight implementation** - Minimal code footprint
✅ **Maintain current design system** - Uses existing components and styling

## UX Requirements Met

✅ **Calm** - No gamification, subtle feedback
✅ **Premium** - Refined interactions, thoughtful design
✅ **Intelligent** - Context-aware, personalized
✅ **Encouraging** - Positive reinforcement, momentum focus
✅ **Momentum-focused** - Emphasis on progress and movement

## Summary

The Seeded Experience System successfully addresses the emotional emptiness problem for new users by:

1. **Generating contextual starter content** that feels personally relevant
2. **Creating immediate momentum** through a quick first-win task
3. **Evolving the dashboard** to show progress and unlock features
4. **Personalizing empty states** to guide users based on their goals
5. **Integrating seamlessly** with the existing onboarding flow

The system is designed to be invisible to users who don't need it (by checking the applied flag) while providing a premium, supportive experience for new users who need that initial momentum to build lasting habits.
