# PostHog Analytics Integration

**Date:** 2026-05-07
**Status:** ✅ Complete

---

## Summary

PostHog analytics has been successfully integrated into Lumo. The implementation follows best practices for privacy, performance, and maintainability.

---

## Architecture

### Directory Structure
```
src/analytics/
├── analyticsEvents.ts    # Event type definitions and factory functions
├── eventTracker.ts      # PostHog integration and core tracking API
└── analyticsHooks.ts    # React hooks for component-level tracking
```

### Key Features

1. **Privacy-Conscious**
   - User opt-in/opt-out support via localStorage
   - Session recording disabled by default
   - Person profiles only created when user is identified
   - No PII in default event properties

2. **Type-Safe**
   - Full TypeScript support with event schemas
   - Deterministic event naming (category:action)
   - Factory functions for event creation

3. **Abstraction Layer**
   - No direct PostHog calls in UI components
   - Centralized event definitions
   - Easy to swap analytics providers

4. **Server-Side Ready**
   - `createServerSideTracker` interface for future API route analytics
   - Supports both client and server tracking

---

## Event Categories

### Onboarding Events
- `onboarding:started` - User begins onboarding
- `onboarding:step_viewed` - User views a specific step
- `onboarding:step_completed` - User completes a step
- `onboarding:completed` - User finishes onboarding
- `onboarding:skipped` - User skips a step

### Routine Events
- `routine:created` - Routine created
- `routine:started` - Routine started
- `routine:completed` - Routine completed with metrics
- `routine:skipped` - Routine skipped
- `routine:template_selected` - Template selected

### Momentum Events
- `momentum:viewed` - Momentum ring viewed
- `momentum:score_changed` - Score changes with trigger
- `momentum:level_up` - User levels up
- `momentum:streak_started` - Streak begins
- `momentum:streak_broken` - Streak ends

### Dashboard Events
- `dashboard:viewed` - Dashboard view with context
- `dashboard:quick_action_used` - Quick action clicked
- `dashboard:filter_changed` - Filter applied

### Task Events
- `task:created` - Task created
- `task:completed` - Task completed with timing
- `task:deleted` - Task deleted
- `task:snoozed` - Task snoozed

### Empty State Events
- `empty_state:viewed` - Empty state displayed
- `empty_state:cta_clicked` - CTA button clicked
- `empty_state:dismissed` - Empty state dismissed

### Navigation Events
- `navigation:tab_changed` - Bottom tab changed
- `navigation:deep_link_opened` - Deep link opened

---

## Components with Analytics

### Onboarding
- **CompletionStep.tsx** - Tracks completion with user selections
- **GoalsStep.tsx** - Tracks goals selection
- **RhythmStep.tsx** - Tracks rhythm/style selection
- **FocusStep.tsx** - Tracks focus areas selection
- **ModulesStep.tsx** - Tracks module selection

### Momentum
- **MomentumRing.tsx** - Tracks momentum views

### Dashboard
- **TodayCommandCenter.tsx** - Tracks dashboard views and quick actions
- **TodayFocusCard.tsx** - Tracks task completion and empty state CTAs

### Empty States
- **RoutineEmptyState.tsx** - Tracks template selection and dismissals

---

## Configuration

### Environment Variables
Add to `.env` file:
```bash
VITE_POSTHOG_API_KEY=your_posthog_api_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

See `.env.example` for reference.

### Initialization
Analytics is initialized in `main.tsx`:
```typescript
import { initializeTracker } from "./analytics/eventTracker";
initializeTracker();
```

---

## Usage Examples

### Using Hooks in Components

```typescript
import { useOnboardingAnalytics } from '@/analytics/analyticsHooks';

export const MyComponent = () => {
  const { stepViewed, stepCompleted } = useOnboardingAnalytics();

  useEffect(() => {
    stepViewed('goals', 0, 5);
  }, [stepViewed]);

  const handleNext = () => {
    stepCompleted('goals', 0);
    // ... navigation logic
  };

  // ...
};
```

### Direct Event Tracking

```typescript
import { trackEvent } from '@/analytics/eventTracker';
import { EventFactory } from '@/analytics/analyticsEvents';

trackEvent(EventFactory.taskCreated(
  taskId,
  category,
  priority
));
```

### User Identification

```typescript
import { identifyUser } from '@/analytics/eventTracker';

// When user logs in
identifyUser('user-123', {
  email: 'user@example.com',
  plan: 'premium'
});
```

### Consent Management

```typescript
import { useAnalyticsConsent } from '@/analytics/analyticsHooks';

export const ConsentBanner = () => {
  const { consent, enable, disable } = useAnalyticsConsent();

  if (consent === 'not_set') {
    return (
      <div>
        <button onClick={enable}>Enable Analytics</button>
        <button onClick={disable}>Disable</button>
      </div>
    );
  }

  return null;
};
```

---

## Best Practices

1. **No Direct PostHog in Components**
   - Always use hooks from `analyticsHooks.ts`
   - Never import posthog-js directly in UI components

2. **Deterministic Event Names**
   - Use `category:action` format
   - All event names defined in `analyticsEvents.ts`

3. **Privacy First**
   - Don't include PII in event properties
   - Respect user consent preferences
   - Use user properties for persistent data

4. **No Event Spam**
   - Track meaningful user actions, not every interaction
   - Use deduplication in hooks (already implemented)
   - Avoid tracking hover states or passive views

5. **Future Server-Side**
   - Use `createServerSideTracker` for API routes
   - Keep event schemas compatible with both client and server

---

## Next Steps

1. **Add PostHog API Key**
   - Get API key from PostHog dashboard
   - Add to environment variables

2. **Add User Identification**
   - Call `identifyUser` when users log in
   - Set user properties for segmentation

3. **Add Page View Tracking**
   - Use `usePageViewTracking` in route components
   - Track navigation patterns

4. **Monitor Analytics**
   - Set up PostHog dashboards
   - Create funnels for onboarding
   - Track retention metrics

5. **Server-Side Analytics**
   - Implement `createServerSideTracker` for API routes
   - Track webhook events
   - Track server-side conversions

---

## Notes

- Analytics is disabled if no API key is configured
- User consent is stored in localStorage
- Debug mode is enabled in development
- Session recording is disabled for privacy
