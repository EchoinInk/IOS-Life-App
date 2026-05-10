# Architecture Migration Audit: Shared Core vs Platform-Specific

This document identifies what can become a SHARED CORE vs what must be rebuilt as platform-specific UI for React Native/mobile transition.

---

# Tasks

## Shared Core Candidates (KEEP / SHARED)

### Domain & Business Logic
- `/src/features/tasks/domain/taskDomain.ts`
  - **Why portable**: Pure business logic with no UI dependencies
  - **Contains**: `isTaskCompleted()`, `getCategoryMetadata()`, `formatTaskDisplayDate()`, `formatTaskDateTime()`
  - **Examples**: Task status calculations, date formatting utilities, category metadata mapping

### Types & Interfaces
- `/src/features/tasks/types/types.ts`
  - **Why portable**: Pure TypeScript definitions, platform-agnostic
  - **Contains**: `Task`, `CreateTaskInput`, `EntityId`, `TaskCategory`, `TaskRecurrence`, `TaskPriority`, `TasksState`
  - **Examples**: Core domain entities, input validation types, store state contracts

### Utilities
- `/src/features/tasks/utils/taskUtils.ts`
  - **Why portable**: Pure utility functions, no web dependencies
  - **Contains**: `getTaskPriorityColor()`, `formatTaskTime()`, `getTaskCompletionText()`, `isTaskOverdue()`
  - **Examples**: Priority calculations, time formatting, completion status logic

### Data Access Layer
- `/src/features/tasks/api.ts`
  - **Why portable**: Clean API surface, exports domain logic and types
  - **Contains**: Public interface exports, domain re-exports
  - **Examples**: Stable public API for cross-platform consumption

### Selectors
- `/src/features/tasks/selectors/taskSelectors.ts`
  - **Why portable**: Pure data transformation functions
  - **Contains**: `selectTasksByDate()`, `selectCompletedTasks()`, `selectTodayTasks()`, etc.
  - **Examples**: Data filtering, sorting, and derived state calculations

### Store & Actions (Abstracted)
- `/src/features/tasks/store/useTasksStore.ts`
- `/src/features/tasks/hooks/useTaskActions.ts`
- `/src/features/tasks/hooks/useTaskData.ts`
  - **Why portable**: Zustand store with abstraction hooks, no UI coupling
  - **Contains**: State management, action dispatchers, data selectors
  - **Examples**: `addTask()`, `toggleTask()`, `updateTask()`, `deleteTask()`

## Web-Specific (REBUILD)

### UI Components
- `/src/features/tasks/components/TaskRow.tsx`
  - **Why web-only**: Direct DOM manipulation, Tailwind classes, web-specific interactions
  - **Contains**: Checkbox button, hover states, web styling
  - **Examples**: `onClick` handlers, `className` styling, web layout patterns

- `/src/features/tasks/components/TaskRowNew.tsx` (inferred)
- `/src/features/tasks/components/TaskSections.tsx`
  - **Why web-only**: Complex layout logic, web-specific state management (expand/collapse)
  - **Contains**: Section rendering, expand/collapse state, web styling
  - **Examples**: `useState` for UI state, Tailwind grid layouts, hover interactions

- `/src/features/tasks/components/TaskSection.tsx`
- `/src/features/tasks/components/CalendarStrip.tsx`
- `/src/features/tasks/components/CategoryList.tsx`
- `/src/features/tasks/components/FloatingAddButton.tsx`
- `/src/features/tasks/components/TaskInsights.tsx`
- `/src/features/tasks/components/TaskProgress.tsx`
- `/src/features/tasks/components/TasksHeroCard.tsx`

### Modal Components
- `/src/features/tasks/components/AddTaskModal/` (entire directory)
- `/src/features/tasks/components/EditTaskModal/` (entire directory)
  - **Why web-only**: Modal patterns, web form handling, desktop interactions
  - **Contains**: Form inputs, modal containers, web-specific UX patterns

### Pages
- `/src/features/tasks/pages/TasksPage.tsx`
  - **Why web-only**: Page-level layout, routing integration, desktop composition
  - **Contains**: Page structure, component composition, web layout patterns

## Refactor Candidates (MIXED)

### TaskSections.tsx (HIGH PRIORITY)
- **What's mixed**: Data filtering logic + UI rendering + state management
- **Extract to**: `/src/features/tasks/services/taskOrganizationService.ts`
- **Suggested extraction**: 
  - Move `selectIncompleteTasks()`, `selectCompletedTasks()` calls to service layer
  - Create `organizeTasksBySections()` function
  - Keep only rendering logic in component
- **Problem**: 132 lines mixing business logic with presentation

### Form Hooks (MEDIUM PRIORITY)
- `/src/features/tasks/hooks/useAddTaskForm.ts`
- `/src/features/tasks/hooks/useEditTaskForm.ts`
  - **What's mixed**: Form validation + state management + potential UI logic
  - **Extract to**: `/src/features/tasks/services/taskFormService.ts`
  - **Suggested extraction**: 
    - Move validation logic to service
    - Create `validateTaskInput()`, `prepareTaskForSubmission()`
    - Keep only React state in hooks

---

# Dashboard (Home)

## Shared Core Candidates (KEEP / SHARED)

### Orchestration Logic
- `/src/features/home/hooks/useHomeDashboard.ts`
  - **Why portable**: Pure orchestration, no UI dependencies
  - **Contains**: Cross-feature data coordination, action preparation
  - **Examples**: Task/budget/meal action coordination, derived state calculation

### Personalization Engine
- `/src/features/home/hooks/usePersonalizedHome.ts`
  - **Why portable**: Business logic for personalization, no UI coupling
  - **Contains**: User preference processing, layout calculation, messaging logic
  - **Examples**: `generatePersonalizedDefaults()`, `getPersonalizedDashboardLayout()`, routine integration

## Web-Specific (REBUILD)

### **CRITICAL FINDING**: No UI components in home feature
- The home feature contains only orchestration hooks
- All UI components live in `/src/components/` or specific feature pages
- **Migration impact**: Home UI components need to be identified in shared component directories

## Refactor Candidates (MIXED)

### useHomeDashboard.ts (LOW PRIORITY)
- **What's mixed**: Cross-feature orchestration + action preparation
- **Current state**: Well-abstracted, minimal mixing
- **Suggestion**: Keep as-is - good separation of concerns
- **Why low priority**: Already follows clean architecture patterns

### usePersonalizedHome.ts (LOW PRIORITY)
- **What's mixed**: Personalization logic + routine integration + UI preference calculation
- **Current state**: Good separation, mostly pure logic
- **Suggestion**: Consider extracting routine integration to separate service
- **Why low priority**: Business logic is already well-contained

---

# Meals

## Shared Core Candidates (KEEP / SHARED)

### Types & Constants
- `/src/features/meals/types/types.ts`
  - **Why portable**: Pure TypeScript definitions
  - **Contains**: `Meal`, `Weekday`, `CreateMealInput`
  - **Examples**: Domain entities, input types

- `/src/features/meals/constants/weekdays.ts`
  - **Why portable**: Pure constants, no dependencies
  - **Contains**: Weekday definitions, arrays
  - **Examples**: Static configuration data

### Data Access Layer
- `/src/features/meals/api.ts`
  - **Why portable**: Clean API surface, type exports
  - **Contains**: Public interface exports
  - **Examples**: Stable API contract

### Store & Actions (Abstracted)
- `/src/features/meals/store/useMealsStore.ts`
- `/src/features/meals/hooks/useMealActions.ts`
- `/src/features/meals/hooks/useMealData.ts`
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: `addMeal()`, data selection, state management
  - **Examples**: Pure state management, no UI coupling

### Selectors
- `/src/features/meals/selectors/mealSelectors.ts`
  - **Why portable**: Pure data transformation functions
  - **Contains**: `selectMealsByDay()`, `selectMealsByDays()`, `selectMealStats()`
  - **Examples**: Data grouping, statistics calculation

## Web-Specific (REBUILD)

### UI Components
- `/src/features/meals/components/AddMealModal.tsx`
  - **Why web-only**: Modal pattern, web form handling, BottomSheetDialog usage
  - **Contains**: Form inputs, modal state, web-specific UX
  - **Examples**: `BottomSheetDialog`, form submission, web styling

### Pages
- `/src/features/meals/pages/MealPlannerPage.tsx`
  - **Why web-only**: Page layout, Card components, web composition
  - **Contains**: Page structure, component composition, web layout
  - **Examples**: `Card`, `Header`, `Button` usage, desktop layout patterns

## Refactor Candidates (MIXED)

### AddMealModal.tsx (MEDIUM PRIORITY)
- **What's mixed**: Form validation + modal state + UI rendering + async handling
- **Extract to**: `/src/features/meals/services/mealFormService.ts`
- **Suggested extraction**:
  - Move `canSave` validation logic to service
  - Create `validateMealInput()`, `prepareMealForSubmission()`
  - Extract meal type and day constants
  - Keep only React state and rendering in component
- **Problem**: 121 lines with form logic, validation, and UI mixed

### MealPlannerPage.tsx (LOW PRIORITY)
- **What's mixed**: Data fetching + page layout + empty state handling
- **Current state**: Reasonably well-separated
- **Suggestion**: Extract empty state logic to service layer
- **Why low priority**: Already uses abstraction hooks effectively

---

## Cross-Cutting Concerns

### Duplicated Logic Patterns
1. **Form validation**: Similar patterns in tasks and meals forms
2. **Modal state management**: Repeated across features
3. **Date/weekday handling**: Similar logic in meals and tasks

### Tight Coupling Issues
1. **BottomSheetDialog**: Mobile-first component that may not translate well to web
2. **Card/Header/Button**: Shared components that may need platform variants
3. **Tailwind styling**: Web-specific styling system

### Migration Recommendations

#### Immediate Actions (High Priority)
1. **Extract TaskSections business logic** to service layer
2. **Extract AddMealModal validation** to service layer  
3. **Create shared form validation utilities** across features

#### Medium Priority
1. **Standardize modal patterns** across features
2. **Create shared date/weekday utilities**
3. **Audit shared components** for platform-specific assumptions

#### Low Priority
1. **Refactor usePersonalizedHome** routine integration
2. **Standardize empty state handling**
3. **Create consistent page layout patterns**

### Architecture Strengths
- Clean separation of domain logic in `/features/*/domain/`
- Well-abstracted store patterns with hooks
- Consistent selector patterns for derived state
- Good type safety across features

---

# Budget

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/budget/types/types.ts`
  - **Why portable**: Pure TypeScript definitions, platform-agnostic
  - **Contains**: `Expense`, `CreateExpenseInput`
  - **Examples**: Domain entities, input validation types

### Data Access Layer
- `/src/features/budget/api.ts`
  - **Why portable**: Clean API surface, type exports
  - **Contains**: Public interface exports, `BudgetSummary` type
  - **Examples**: Stable API contract

### Store & Actions (Abstracted)
- `/src/features/budget/store/useBudgetStore.ts`
- `/src/features/budget/hooks/useBudgetActions.ts`
- `/src/features/budget/hooks/useBudgetData.ts`
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: `addExpense()`, `setIncome()`, budget calculations
  - **Examples**: Pure state management, derived state calculations

### Selectors
- `/src/features/budget/selectors/budgetSelectors.ts`
  - **Why portable**: Pure data transformation functions
  - **Contains**: `selectBudgetSummary()`, percentage calculations
  - **Examples**: Budget aggregation, remaining calculations

## Web-Specific (REBUILD)

### UI Components
- `/src/features/budget/components/AddExpenseModal.tsx`
- `/src/features/budget/components/AddIncomeModal.tsx`
  - **Why web-only**: Modal patterns, web form handling, BottomSheetDialog usage
  - **Contains**: Form inputs, modal state, web-specific UX
  - **Examples**: Number inputs, form validation UI, web styling

### Pages
- `/src/features/budget/pages/BudgetPage.tsx`
  - **Why web-only**: Page layout, Card components, web composition
  - **Contains**: Page structure, progress bars, grid layouts
  - **Examples**: `ProgressBar`, `Card`, `ListItemBase` usage, desktop layout patterns

## Refactor Candidates (MIXED)

### AddExpenseModal.tsx (MEDIUM PRIORITY)
- **What's mixed**: Form validation + modal state + UI rendering + async handling
- **Extract to**: `/src/features/budget/services/budgetFormService.ts`
- **Suggested extraction**:
  - Move `canSave` validation logic to service
  - Create `validateExpenseInput()`, `prepareExpenseForSubmission()`
  - Keep only React state and rendering in component
- **Problem**: 96 lines with form logic, validation, and UI mixed

### BudgetPage.tsx (LOW PRIORITY)
- **What's mixed**: Data fetching + page layout + empty state handling
- **Current state**: Reasonably well-separated
- **Suggestion**: Extract budget display logic to service layer
- **Why low priority**: Already uses abstraction hooks effectively

---

# Recipes

## Shared Core Candidates (KEEP / SHARED)

### Types & Constants
- `/src/features/recipes/types/types.ts`
  - **Why portable**: Pure TypeScript definitions
  - **Contains**: `Recipe`, `CreateRecipeInput`
  - **Examples**: Domain entities, input types

### Data Access Layer
- `/src/features/recipes/api.ts`
  - **Why portable**: Clean API surface, type exports
  - **Contains**: Public interface exports
  - **Examples**: Stable API contract

### Store & Actions (Abstracted)
- `/src/features/recipes/store/useRecipesStore.ts`
- `/src/features/recipes/hooks/useRecipes.ts`
- `/src/features/recipes/hooks/useApplyRecipe.ts`
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: `addRecipe()`, recipe application logic
  - **Examples**: Pure state management, no UI coupling

### Services & Utilities
- `/src/features/recipes/services/recipeWorkflow.ts`
  - **Why portable**: Pure business logic, cross-feature integration
  - **Contains**: `buildRecipeWorkflow()`, ingredient categorization
  - **Examples**: Recipe-to-meal/task/shopping conversion, weekday mapping

- `/src/features/recipes/utils/recipeUtils.ts`
  - **Why portable**: Pure utility functions, no dependencies
  - **Contains**: `parseIngredients()`, `formatIngredients()`
  - **Examples**: String manipulation, data formatting

## Web-Specific (REBUILD)

### UI Components
- `/src/features/recipes/components/AddRecipeModal.tsx`
  - **Why web-only**: Modal pattern, web form handling, BottomSheetDialog usage
  - **Contains**: Form inputs, modal state, web-specific UX
  - **Examples**: Textarea, select fields, form validation UI

### Pages
- `/src/features/recipes/pages/RecipesPage.tsx`
  - **Why web-only**: Page layout, Card components, web composition
  - **Contains**: Page structure, recipe grid, empty states
  - **Examples**: `Card`, `Button`, `EmptyState` usage, desktop layout patterns

## Refactor Candidates (MIXED)

### AddRecipeModal.tsx (LOW PRIORITY)
- **What's mixed**: Form validation + modal state + UI rendering
- **Current state**: Well-separated with utility usage
- **Suggestion**: Extract form validation logic to service layer
- **Why low priority**: Already uses `parseIngredients()` utility, minimal mixing

### RecipesPage.tsx (LOW PRIORITY)
- **What's mixed**: Data fetching + page layout + empty state handling
- **Current state**: Reasonably well-separated
- **Suggestion**: Extract recipe display logic to service layer
- **Why low priority**: Already uses abstraction hooks effectively

---

# Shopping

## Shared Core Candidates (KEEP / SHARED)

### Types & Constants
- `/src/features/shopping/types/types.ts`
  - **Why portable**: Pure TypeScript definitions
  - **Contains**: `ShoppingItem`, `ShoppingCategory`, `CreateShoppingItemInput`
  - **Examples**: Domain entities, category types, input types

### Data Access Layer
- `/src/features/shopping/api.ts`
  - **Why portable**: Clean API surface, type exports
  - **Contains**: Public interface exports
  - **Examples**: Stable API contract

### Store & Actions (Abstracted)
- `/src/features/shopping/store/useShoppingStore.ts`
- `/src/features/shopping/hooks/useShoppingActions.ts`
- `/src/features/shopping/hooks/useShoppingData.ts`
- `/src/features/shopping/hooks/useShoppingList.ts`
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: `addShoppingItem()`, `toggleShoppingItem()`, data selection
  - **Examples**: Pure state management, no UI coupling

### Selectors
- `/src/features/shopping/selectors/shoppingSelectors.ts`
  - **Why portable**: Pure data transformation functions
  - **Contains**: Shopping list filtering, categorization
  - **Examples**: Data grouping, status calculations

## Web-Specific (REBUILD)

### UI Components
- `/src/features/shopping/components/ShoppingRow.tsx`
  - **Why web-only**: Direct DOM manipulation, Tailwind classes, web interactions
  - **Contains**: Checkbox interactions, styling, hover states
  - **Examples**: `CheckboxRow`, `ListItemBase` usage, web layout patterns

- `/src/features/shopping/components/AddShoppingItemModal.tsx`
  - **Why web-only**: Modal pattern, web form handling, BottomSheetDialog usage
  - **Contains**: Form inputs, modal state, web-specific UX
  - **Examples**: Category selection, form validation UI

### Pages
- `/src/features/shopping/pages/ShoppingListPage.tsx`
  - **Why web-only**: Page layout, list composition, web interactions
  - **Contains**: Page structure, item management, desktop layout
  - **Examples**: List rendering, modal integration, web layout patterns

## Refactor Candidates (MIXED)

### ShoppingRow.tsx (LOW PRIORITY)
- **What's mixed**: Data presentation + interaction handling + styling
- **Current state**: Well-separated with shared components
- **Suggestion**: Extract interaction logic to service layer
- **Why low priority**: Already uses `CheckboxRow` abstraction, minimal mixing

---

# Bills

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/bills/types/types.ts`
  - **Why portable**: Pure TypeScript definitions, shared date types
  - **Contains**: `Bill`, `CreateBillInput`, `DateKey` usage
  - **Examples**: Domain entities, input validation types

### Data Access Layer
- `/src/features/bills/index.ts`
  - **Why portable**: Clean API surface, type exports
  - **Contains**: Public interface exports
  - **Examples**: Stable API contract

### Store & Hooks (Abstracted)
- `/src/features/bills/store/useBillsStore.ts`
- `/src/features/bills/hooks/useBills.ts`
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: `addBill()`, bill view transformation
  - **Examples**: Pure state management, data formatting

## Web-Specific (REBUILD)

### UI Components
- `/src/features/bills/components/AddBillModal/` (entire directory)
- `/src/features/bills/components/AddBillModal.tsx`
  - **Why web-only**: Modal patterns, web form handling, desktop interactions
  - **Contains**: Form inputs, modal containers, web-specific UX patterns

## Refactor Candidates (MIXED)

### useBills.ts (LOW PRIORITY)
- **What's mixed**: Data transformation + view formatting + state access
- **Extract to**: `/src/features/bills/services/billViewService.ts`
- **Suggested extraction**:
  - Move `toBillViews()` function to service
  - Create `formatBillForDisplay()`, `calculateBillMetrics()`
  - Keep only data access in hook
- **Problem**: Mixing data transformation with view formatting

---

# Insights

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/insights/types/types.ts`
  - **Why portable**: Pure TypeScript definitions, comprehensive insight model
  - **Contains**: `Insight`, `SmartSummary`, `Recommendation`, `InsightState`
  - **Examples**: Cross-feature insight types, priority systems

### Business Logic Engines
- `/src/features/insights/insights.utils.ts`
  - **Why portable**: Pure business logic, cross-feature analysis
  - **Contains**: Insight generation, trend analysis, smart messaging
  - **Examples**: Pattern detection, recommendation algorithms

- `/src/features/insights/smartMessaging.utils.ts`
  - **Why portable**: Pure message generation logic
  - **Contains**: Smart message templates, contextual messaging
  - **Examples**: Dynamic message creation, user personalization

### Streaks System
- `/src/features/insights/streaks.types.ts`
- `/src/features/insights/streaks.utils.ts`
  - **Why portable**: Pure streak calculation logic
  - **Contains**: Streak tracking, consistency metrics
  - **Examples**: Streak algorithms, trend calculations

### Data Stores
- `/src/features/insights/useStreaksStore.ts`
- `/src/features/insights/useWeeklySummary.ts`
  - **Why portable**: Zustand stores with abstraction hooks
  - **Contains**: Insight state, weekly summaries
  - **Examples**: Pure state management, derived calculations

## Web-Specific (REBUILD)

### UI Components
- `/src/features/insights/components/InsightsCard.container.tsx`
- `/src/features/insights/components/InsightsCard.view.tsx`
  - **Why web-only**: Container/view pattern, web-specific rendering
  - **Contains**: Card layouts, web styling, interaction patterns
  - **Examples**: Desktop card layouts, hover states, web composition

## Refactor Candidates (MIXED)

### InsightsCard Components (LOW PRIORITY)
- **What's mixed**: Data processing + UI rendering + interaction handling
- **Current state**: Well-separated with container/view pattern
- **Suggestion**: Extract insight processing to service layer
- **Why low priority**: Already follows good separation patterns

---

# Intelligence

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/intelligence/types/intelligence.types.ts`
  - **Why portable**: Comprehensive TypeScript definitions, AI/ML types
  - **Contains**: `SmartInsight`, `Recommendation`, `Pattern`, `IntelligenceContext`
  - **Examples**: Cross-feature data models, confidence scoring, temporal context

### Intelligence Engines
- `/src/features/intelligence/intelligenceEngine.ts`
  - **Why portable**: Pure AI/ML logic, no UI dependencies
  - **Contains**: Core intelligence processing, insight generation
  - **Examples**: Pattern analysis, recommendation algorithms

- `/src/features/intelligence/insightGenerator.ts`
  - **Why portable**: Pure insight generation logic
  - **Contains**: Smart insight creation, contextual analysis
  - **Examples**: Dynamic insight generation, user behavior analysis

- `/src/features/intelligence/patternDetection.ts`
  - **Why portable**: Pure pattern recognition algorithms
  - **Contains**: User behavior patterns, trend detection
  - **Examples**: Temporal patterns, category preferences, consistency analysis

- `/src/features/intelligence/recommendationEngine.ts`
  - **Why portable**: Pure recommendation algorithms
  - **Contains**: Personalized recommendations, impact scoring
  - **Examples**: Action suggestions, priority calculations, confidence scoring

### Data Access Layer
- `/src/features/intelligence/index.ts`
- `/src/features/intelligence/hooks/useIntelligence.ts`
  - **Why portable**: Clean API surface, abstraction hooks
  - **Contains**: Public interface, data access patterns
  - **Examples**: Stable API contract, state management

## Web-Specific (REBUILD)

**CRITICAL FINDING**: No UI components in intelligence feature
- The intelligence feature contains only pure business logic
- All UI components live in shared component directories
- **Migration impact**: Intelligence UI components need to be identified in shared directories

## Refactor Candidates (MIXED)

### None Identified
- **Current state**: Excellent separation of concerns
- **Architecture**: Pure business logic with no UI mixing
- **Migration readiness**: Fully prepared for cross-platform sharing

---

# Momentum

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/momentum/types/momentum.types.ts`
  - **Why portable**: Comprehensive TypeScript definitions, scoring system
  - **Contains**: `DailyMomentumScore`, `Streak`, `MomentumTrend`, `ConsistencyMetrics`
  - **Examples**: Scoring algorithms, trend analysis, streak tracking

### Business Logic Engines
- `/src/features/momentum/momentumEngine.ts`
  - **Why portable**: Pure momentum calculation logic
  - **Contains**: Score calculation, trend analysis, momentum levels
  - **Examples**: Daily scoring, momentum algorithms, level calculations

- `/src/features/momentum/dailyScore.ts`
  - **Why portable**: Pure daily score calculation
  - **Contains**: Score algorithms, activity weighting
  - **Examples**: Activity contribution, score normalization

- `/src/features/momentum/streakCalculator.ts`
  - **Why portable**: Pure streak calculation logic
  - **Contains**: Streak algorithms, consistency tracking
  - **Examples**: Streak length, momentum levels, trend directions

### Analytics & Insights
- `/src/features/momentum/consistencyMetrics.ts`
- `/src/features/momentum/weeklyConsistency.ts`
- `/src/features/momentum/trendInsights.ts`
- `/src/features/momentum/trendSummary.ts`
  - **Why portable**: Pure analytics logic, no UI dependencies
  - **Contains**: Pattern analysis, trend calculations, insight generation
  - **Examples**: Consistency scoring, trend analysis, momentum insights

### Data Processing
- `/src/features/momentum/progressSelectors.ts`
  - **Why portable**: Pure data transformation functions
  - **Contains**: Progress calculation, data aggregation
  - **Examples**: Derived state, metrics calculation

### Store & Hooks
- `/src/features/momentum/store/useMomentumStore.ts`
- `/src/features/momentum/hooks/` (directory)
  - **Why portable**: Zustand store with abstraction hooks
  - **Contains**: State management, data access
  - **Examples**: Pure state management, computed properties

## Web-Specific (REBUILD)

### UI Components
- `/src/features/momentum/components/` (directory)
  - **Why web-only**: Momentum visualization, charts, progress displays
  - **Contains**: Charts, progress bars, trend visualizations
  - **Examples**: Web-specific charts, desktop layouts, interactive displays

## Refactor Candidates (MIXED)

### None Identified
- **Current state**: Excellent separation of concerns
- **Architecture**: Pure business logic with clear boundaries
- **Migration readiness**: Fully prepared for cross-platform sharing

---

# Onboarding

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/onboarding/types/onboarding.types.ts`
  - **Why portable**: Comprehensive TypeScript definitions, user preference model
  - **Contains**: `OnboardingData`, `FocusArea`, `ProductivityGoal`, `PersonalizedDefaults`
  - **Examples**: User preferences, personalization data, flow control

### Business Logic Services
- `/src/features/onboarding/utils/` (directory)
  - **Why portable**: Pure personalization logic, no UI dependencies
  - **Contains**: Default generation, preference processing, personalization algorithms
  - **Examples**: Smart defaults, user profiling, preference mapping

### Data Stores
- `/src/features/onboarding/store/` (directory)
- `/src/features/onboarding/hooks/` (directory)
  - **Why portable**: Zustand stores with abstraction hooks
  - **Contains**: Onboarding state, flow management, data persistence
  - **Examples**: Progress tracking, step validation, data management

## Web-Specific (REBUILD)

### UI Components
- `/src/features/onboarding/OnboardingScreen.tsx`
- `/src/features/onboarding/components/` (directory)
  - **Why web-only**: Onboarding flow, step screens, web interactions
  - **Contains**: Multi-step flow, form screens, progress indicators
  - **Examples**: Web-specific onboarding patterns, desktop layouts

## Refactor Candidates (MIXED)

### OnboardingScreen.tsx (MEDIUM PRIORITY)
- **What's mixed**: Flow control + form handling + UI rendering + state management
- **Extract to**: `/src/features/onboarding/services/onboardingFlowService.ts`
- **Suggested extraction**:
  - Move step validation logic to service
  - Create `validateOnboardingStep()`, `processOnboardingData()`
  - Extract flow control logic
  - Keep only React state and rendering in component
- **Problem**: Large component mixing business logic with presentation

---

# Routines

## Shared Core Candidates (KEEP / SHARED)

### Types & Interfaces
- `/src/features/routines/types/routineTypes.ts`
  - **Why portable**: Comprehensive TypeScript definitions, routine system model
  - **Contains**: `RoutineTemplate`, `RoutineInstance`, `FocusSession`, `RecurringTaskTemplate`
  - **Examples**: Complex domain model, status management, template system

### Domain Logic
- `/src/features/routines/domain/` (directory)
  - **Why portable**: Pure business logic, routine algorithms
  - **Contains**: Routine execution, template processing, focus session logic
  - **Examples**: Routine scheduling, step processing, momentum calculation

### Integration Services
- `/src/features/routines/integration/` (directory)
  - **Why portable**: Cross-feature integration, no UI dependencies
  - **Contains**: Task integration, calendar sync, momentum calculation
  - **Examples**: Routine-to-task conversion, focus session integration

### Data Processing
- `/src/features/routines/selectors/` (directory)
- `/src/features/routines/utils/` (directory)
  - **Why portable**: Pure data transformation, utility functions
  - **Contains**: Routine filtering, status calculation, time utilities
  - **Examples**: Progress calculation, status aggregation, time-based filtering

### Store & Hooks
- `/src/features/routines/store/` (directory)
- `/src/features/routines/hooks/` (directory)
  - **Why portable**: Zustand stores with abstraction hooks
  - **Contains**: Complex state management, routine lifecycle
  - **Examples**: Template management, instance tracking, focus session handling

## Web-Specific (REBUILD)

**CRITICAL FINDING**: No UI components in routines feature
- The routines feature contains only business logic and data management
- All UI components live in shared component directories
- **Migration impact**: Routines UI components need to be identified in shared directories

## Refactor Candidates (MIXED)

### None Identified
- **Current state**: Excellent separation of concerns
- **Architecture**: Pure business logic with comprehensive domain modeling
- **Migration readiness**: Fully prepared for cross-platform sharing

---

# Today

## Shared Core Candidates (KEEP / SHARED)

### Data Orchestration
- `/src/features/today/hooks/useTodayData.ts`
  - **Why portable**: Pure data orchestration, no UI dependencies
  - **Contains**: Cross-feature data aggregation, focus calculation
  - **Examples**: Multi-feature integration, priority calculation, summary generation

### Types & Interfaces
- `TodayData` type in useTodayData.ts
  - **Why portable**: Pure TypeScript definitions
  - **Contains**: Focus metrics, summary data, cross-feature types
  - **Examples**: Aggregated data models, calculation results

## Web-Specific (REBUILD)

### UI Components
- `/src/features/today/components/` (directory)
  - **Why web-only**: Today dashboard, focus displays, summary cards
  - **Contains**: Dashboard layout, progress displays, interactive elements
  - **Examples**: Web-specific dashboard patterns, desktop layouts

## Refactor Candidates (MIXED)

### useTodayData.ts (LOW PRIORITY)
- **What's mixed**: Data orchestration + calculation logic + cross-feature integration
- **Current state**: Well-separated with memoization
- **Suggestion**: Extract calculation logic to service layer
- **Why low priority**: Already uses abstraction hooks effectively, minimal mixing

---

## Updated Cross-Cutting Concerns

### Duplicated Logic Patterns (Updated)
1. **Form validation**: Similar patterns in tasks, meals, budget, recipes, shopping forms
2. **Modal state management**: Repeated across all modal-based features
3. **Date/weekday handling**: Similar logic in meals, tasks, routines, today
4. **Cross-feature integration**: Repeated patterns in recipes, today, home
5. **Progress calculation**: Similar metrics in momentum, today, insights

### Tight Coupling Issues (Updated)
1. **BottomSheetDialog**: Used across meals, budget, recipes, shopping, bills
2. **Card/Header/Button**: Shared components that may need platform variants
3. **Form patterns**: Similar form structures across multiple features
4. **Modal patterns**: Repeated modal implementations
5. **Chart components**: Momentum visualizations may need platform variants

### Updated Migration Recommendations

#### Immediate Actions (High Priority)
1. **Extract TaskSections business logic** to service layer
2. **Extract AddMealModal validation** to service layer  
3. **Extract AddExpenseModal validation** to service layer
4. **Extract OnboardingScreen flow logic** to service layer
5. **Create shared form validation utilities** across features

#### Medium Priority
1. **Standardize modal patterns** across features
2. **Create shared date/weekday utilities**
3. **Audit shared components** for platform-specific assumptions
4. **Extract useBills view formatting** to service layer
5. **Create cross-feature integration utilities**

#### Low Priority
1. **Refactor usePersonalizedHome** routine integration
2. **Standardize empty state handling**
3. **Create consistent page layout patterns**
4. **Extract useTodayData calculations** to service layer
5. **Optimize modal state management**

### Updated Architecture Strengths
- Clean separation of domain logic in `/features/*/domain/`
- Well-abstracted store patterns with hooks
- Consistent selector patterns for derived state
- Good type safety across features
- **NEW**: Excellent pure business logic in intelligence, momentum, routines
- **NEW**: Strong cross-feature integration patterns
- **NEW**: Comprehensive domain modeling in complex features

### Updated Architecture Risks
- Mixed components (TaskSections, AddMealModal, AddExpenseModal, OnboardingScreen) will complicate mobile migration
- Web-specific UI patterns in shared component directories
- Potential platform assumptions in utility functions
- **NEW**: Modal pattern duplication across features
- **NEW**: Form validation logic scattered across features
- **NEW**: Cross-feature integration complexity may increase coupling