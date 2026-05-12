# Lumo Onboarding System

A comprehensive first-run onboarding and personalization system designed to increase user retention and emotional investment from first launch.

## Overview

The onboarding system guides new users through a 6-step flow to personalize their Lumo experience based on their goals, focus areas, and preferences. The system generates smart defaults and personalized content to avoid empty dashboards.

## Features

### Phase 1: First Run Experience
- **6-step onboarding flow** (< 90 seconds)
- **Personal data collection**: name, focus areas, goals, module preferences
- **Daily rhythm and planning style** assessment
- **Calm, premium UX** with no gamification spam

### Phase 2: Personalized Home
- **Personalized greetings** based on user name and time of day
- **Focus-aware content** and recommendations
- **Customized quick actions** based on preferred modules
- **Smart empty states** with starter content

### Phase 3: Smart Default Content
- **Suggested tasks** based on focus areas and goals
- **Personalized routines** aligned with daily cadence
- **Relevant insights** and tips
- **Prioritized modules** in quick actions

### Phase 4: Persistence & Architecture
- **Zustand-based state management** with persistence
- **Modular component architecture**
- **Type-safe data models**
- **Cloud-sync ready** architecture

## Architecture

### Data Flow
```
Onboarding Data → Personalization Engine → Smart Defaults → Personalized UI
```

### Key Components

#### 1. Types & Data Models (`types/onboarding.types.ts`)
- `OnboardingData`: Core user preference data
- `PersonalizedDefaults`: Generated content based on preferences
- Type-safe enums for focus areas, goals, modules, etc.

#### 2. State Management (`store/useOnboardingStore.ts`)
- Zustand store with persistence middleware
- Step-by-step flow management
- Progress tracking and validation

#### 3. Personalization Engine (`utils/personalization.utils.ts`)
- Generates personalized content based on user data
- Creates smart defaults and recommendations
- Provides dashboard layout preferences

#### 4. Component Flow (`components/` + `steps/`)
- `OnboardingFlow`: Main container with navigation
- 6 step components: Welcome → Focus → Goals → Modules → Rhythm → Completion
- Reusable UI components with consistent styling

#### 5. Integration Layer
- `useOnboardingCheck`: Auto-redirects to onboarding when needed
- `usePersonalizedHome`: Personalizes home dashboard
- App routing integration

## Usage

### Basic Integration
```tsx
import { useOnboardingCheck } from '@/features/onboarding';

// In your app root or home screen
const App = () => {
  useOnboardingCheck(); // Auto-redirects to onboarding if needed
  
  return <YourApp />;
};
```

### Personalized Home Components
```tsx
import { PersonalizedHomeHeader, PersonalizedQuickActions } from '@/features/home';

// In your home screen
const HomeScreen = () => {
  return (
    <div>
      <PersonalizedHomeHeader />
      <PersonalizedQuickActions />
      {/* Other home components */}
    </div>
  );
};
```

### Accessing Onboarding Data
```tsx
import { useOnboardingData, usePersonalizedHome } from '@/features/onboarding';

const MyComponent = () => {
  const onboardingData = useOnboardingData();
  const personalized = usePersonalizedHome();
  
  // Use personalized content
  console.log(personalized.welcomeMessage);
  console.log(personalized.personalizedDefaults);
};
```

## Onboarding Steps

### 1. Welcome
- Collects user name
- Provides introduction to Lumo
- Sets friendly, premium tone

### 2. Focus Areas
- Multi-select from 7 focus areas
- Icons and descriptions for each area
- Visual feedback for selections

### 3. Goals
- Multi-select from 6 productivity goals
- Smart recommendations based on focus areas
- Goal descriptions and benefits

### 4. Module Preferences
- Select preferred Lumo modules
- Recommendations based on focus areas
- Core module (tasks) always included

### 5. Daily Rhythm
- Single selection for planning cadence
- Single selection for planning style
- Time-based recommendations

### 6. Completion
- Summary of all selections
- Personalized welcome message
- Clear next steps and expectations

## Personalization Features

### Smart Content Generation
- **Tasks**: Generated based on focus areas and goals
- **Routines**: Aligned with daily cadence preferences
- **Quick Actions**: Prioritized by module preferences
- **Insights**: Relevant tips based on user goals

### Dashboard Personalization
- **Layout**: Compact vs detailed based on planning style
- **Charts**: Shown/hidden based on visual preference
- **Modules**: Priority ordering based on user preferences
- **Greeting**: Personalized with name and time of day

### Focus Area Intelligence
- **Work**: Productivity tips, task prioritization
- **Health**: Wellness reminders, habit tracking
- **Budgeting**: Financial tips, expense tracking
- **Routines**: Consistency building, scheduling
- **Relationships**: Connection reminders, social planning
- **Learning**: Skill development, progress tracking
- **Creativity**: Project management, inspiration

## Technical Details

### State Persistence
- Uses Zustand's persist middleware
- Stores in localStorage by default
- Cloud-sync ready architecture
- Automatic hydration handling

### Type Safety
- Full TypeScript coverage
- Strict type checking
- No `any` types in core logic
- Comprehensive type exports

### Performance
- Lazy-loaded components
- Optimized re-renders with selectors
- Minimal bundle impact
- Fast sub-90 second flow

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- High contrast support

## Styling & Design

### Design Principles
- **Calm & Premium**: No overwhelming gamification
- **Apple-like Simplicity**: Clean, minimal interfaces
- **Duolingo Quality**: Engaging but respectful
- **Linear Efficiency**: Fast, focused interactions

### Component System
- Uses existing Lumo UI components
- Consistent spacing and typography
- Semantic color tokens
- Responsive design patterns

## Testing

### Manual Testing Checklist
- [ ] Complete onboarding flow end-to-end
- [ ] Test skip functionality on optional steps
- [ ] Verify data persistence across refresh
- [ ] Test personalization in home dashboard
- [ ] Validate all focus area combinations
- [ ] Check accessibility features
- [ ] Test on mobile and desktop

### Integration Testing
- [ ] Verify auto-redirect to onboarding
- [ ] Test personalized content generation
- [ ] Validate state management
- [ ] Check routing integration

## Future Enhancements

### Phase 5: Advanced Personalization
- AI-powered recommendations
- Adaptive learning from user behavior
- Dynamic content adjustment
- Predictive task suggestions

### Phase 6: Analytics & Insights
- Onboarding completion metrics
- User preference analytics
- A/B testing framework
- Conversion optimization

### Phase 7: Team & Collaboration
- Team onboarding flows
- Shared preference management
- Collaborative goal setting
- Group insights

## Contributing

When modifying the onboarding system:

1. **Maintain type safety** - All new features should have proper TypeScript types
2. **Test all paths** - Ensure all user journeys work correctly
3. **Follow design patterns** - Use existing component patterns and styling
4. **Update documentation** - Keep this README current with changes
5. **Consider accessibility** - Ensure new features are accessible to all users

## Support

For questions or issues with the onboarding system:
- Check the component documentation
- Review the type definitions
- Test with different user preference combinations
- Verify state persistence behavior
