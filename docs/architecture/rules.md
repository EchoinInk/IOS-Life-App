# Engineering Rules

## Purpose
Maintain consistency and prevent regressions.

## Data Model
Use canonical Task structure. Never use legacy fields.

## State
- Immutable updates
- Raw data only

## Selectors
Always use selectors, never full store access.

## Components
- UI: presentational only
- Features: composition

## Hooks
Contain logic and derived data.

## Performance
- Use selectors
- Memoize
