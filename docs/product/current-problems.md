# UX Problems

## Cognitive Load

- Dashboard feels cluttered
- Too much information visible simultaneously
- Visual hierarchy unclear in some screens
- Some screens require excessive scanning

## Task UX

- Too many actions on task cards
- Quick actions are not optimized for speed
- Task completion flow feels heavier than necessary
- Overdue handling may create pressure/shame loops

## Navigation

- Navigation hierarchy unclear
- Feature discoverability inconsistent
- Important actions not always thumb-accessible
- Mobile navigation patterns not fully optimized

## Meals + Planning

- Meal flow feels slow
- Planning requires too many steps
- Grocery generation flow could be tighter
- Relationship between meals/recipes/shopping not fully streamlined

## Interaction Friction

- Some workflows require too many taps
- Repeated actions not optimized
- Fast logging patterns inconsistent

## Visual Design

- Some areas too visually dense
- Card hierarchy inconsistent
- Dashboard widgets compete for attention
- Some screens feel desktop-oriented

# Architecture Problems

## State Management

- Some Zustand stores becoming too large
- Potential selector sprawl
- Shared state boundaries unclear in some domains
- Risk of duplicated derived state

## Feature Architecture

- Feature boundaries blurry in some areas
- Dashboard orchestration becoming too centralized
- Cross-feature dependencies increasing
- Some business logic may exist too close to UI

## Component Structure

- Some components getting oversized
- Deep JSX nesting risk
- Potential rerender hotspots
- Shared UI primitives may need further standardization

## Scalability Risks

- Increasing feature complexity
- Risk of dashboard becoming monolithic
- Mobile and web concerns currently mixed
- Shared core extraction not yet formalized

## Technical Debt

- Existing web assumptions may block mobile UX
- Some flows likely optimized for desktop interaction patterns
- Incremental architecture drift risk as features expand

# Mobile Problems

## Layout Problems

- Current layouts too desktop-oriented
- Some screens likely rely on horizontal space
- Dense dashboards do not translate cleanly to mobile

## Interaction Problems

- Interactions require too many taps
- Some actions too small for comfortable touch usage
- Important actions may sit outside thumb reach

## Navigation Problems

- Navigation not fully thumb-friendly
- Screen transitions and hierarchy may not match mobile expectations
- Mobile-first flows not yet clearly prioritized

## Data Presentation

- Tables do not translate well to mobile
- Information density too high in some views
- Some desktop patterns need complete mobile redesigns

## Mobile Architecture

- React DOM assumptions embedded in UI layer
- Current component library not reusable in React Native
- Native interaction patterns not yet defined