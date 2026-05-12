export type StreakType = "tasks" | "meals";

export interface Streak {
  type: StreakType;
  current: number;
  longest: number;
  lastUpdated: number;
}

export interface StreaksState {
  tasks: Streak;
  meals: Streak;
}
