# State Management

## Rules
- One store per feature
- No cross-store mutation
- No derived state in stores

## Access Pattern
```ts
useTasksStore(s => s.tasks)
```

## Updates
```ts
set(state => ({
  tasks: [...state.tasks, newTask]
}))
```
