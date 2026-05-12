export interface InsightData {
  tasksCompleted: number;
  tasksTotal: number;
  expenses: number[];
  mealsLogged: number;
  mealsTarget: number;
  budgetRemaining: number;
  budgetTotal: number;
  shoppingCompleted: number;
  shoppingTotal: number;
  streakTasks: number;
  streakMeals: number;
  // Routine integration
  routinesCompleted: number;
  routinesTotal: number;
  routineStreak: number;
  morningRoutineCompleted: boolean;
  eveningRoutineCompleted: boolean;
}

export interface Insight {
  id: string;
  type: "achievement" | "encouragement" | "warning" | "tip";
  message: string;
  priority: "high" | "medium" | "low";
}

export const generateInsights = (data: InsightData): Insight[] => {
  const insights: Insight[] = [];

  // Task completion insights
  if (data.tasksTotal > 0 && data.tasksCompleted === data.tasksTotal) {
    insights.push({
      id: "all-tasks-complete",
      type: "achievement",
      message: "You completed all tasks today 🎉",
      priority: "high",
    });
  }

  if (data.tasksCompleted === 0 && data.tasksTotal > 0) {
    insights.push({
      id: "no-tasks-started",
      type: "encouragement",
      message: "Try completing at least one task to build momentum",
      priority: "medium",
    });
  }

  if (data.tasksCompleted > 0 && data.tasksCompleted < data.tasksTotal) {
    insights.push({
      id: "partial-progress",
      type: "encouragement",
      message: `Great progress! ${data.tasksTotal - data.tasksCompleted} task${data.tasksTotal - data.tasksCompleted !== 1 ? 's' : ''} to go`,
      priority: "medium",
    });
  }

  // Streak insights
  if (data.streakTasks >= 7) {
    insights.push({
      id: "week-streak",
      type: "achievement",
      message: `${data.streakTasks} day task streak! You're unstoppable 🔥`,
      priority: "high",
    });
  } else if (data.streakTasks >= 3) {
    insights.push({
      id: "good-streak",
      type: "achievement",
      message: `${data.streakTasks} day streak - Keep it going!`,
      priority: "medium",
    });
  }

  if (data.streakMeals >= 7) {
    insights.push({
      id: "meal-streak",
      type: "achievement",
      message: `${data.streakMeals} days of consistent meal logging! 🥗`,
      priority: "high",
    });
  }

  // Meal insights
  if (data.mealsLogged === 0 && data.mealsTarget > 0) {
    insights.push({
      id: "no-meals",
      type: "tip",
      message: "Remember to log your meals for better tracking",
      priority: "low",
    });
  }

  if (data.mealsLogged >= data.mealsTarget) {
    insights.push({
      id: "meals-target",
      type: "achievement",
      message: "All meals logged today! Great job 🍽️",
      priority: "medium",
    });
  }

  // Budget insights
  if (data.budgetRemaining <= 0) {
    insights.push({
      id: "budget-exhausted",
      type: "warning",
      message: "Weekly budget used up. Plan carefully for the rest of the week",
      priority: "high",
    });
  } else if (data.budgetRemaining < data.budgetTotal * 0.2) {
    insights.push({
      id: "budget-low",
      type: "warning",
      message: "Only 20% of budget remaining. Watch your spending",
      priority: "medium",
    });
  }

  // Shopping insights
  if (data.shoppingCompleted > 0 && data.shoppingCompleted === data.shoppingTotal) {
    insights.push({
      id: "shopping-complete",
      type: "achievement",
      message: "All shopping items checked off! 🛒",
      priority: "medium",
    });
  }

  // Expense frequency insights
  if (data.expenses.length > 5) {
    insights.push({
      id: "frequent-spending",
      type: "warning",
      message: "You're spending frequently today",
      priority: "medium",
    });
  }

  // Productivity insights
  const taskCompletionRate = data.tasksTotal > 0 ? data.tasksCompleted / data.tasksTotal : 0;
  if (taskCompletionRate >= 0.8) {
    insights.push({
      id: "high-productivity",
      type: "achievement",
      message: "You're highly productive today! Keep up the great work",
      priority: "medium",
    });
  }

  // Routine insights
  if (data.routinesTotal > 0 && data.routinesCompleted === data.routinesTotal) {
    insights.push({
      id: "all-routines-complete",
      type: "achievement",
      message: "All routines completed today! Great consistency 🌟",
      priority: "high",
    });
  }

  if (data.routineStreak >= 7) {
    insights.push({
      id: "routine-streak-week",
      type: "achievement",
      message: `${data.routineStreak} day routine streak! Amazing consistency 🔥`,
      priority: "high",
    });
  } else if (data.routineStreak >= 3) {
    insights.push({
      id: "routine-streak-good",
      type: "achievement",
      message: `${data.routineStreak} day routine streak - Keep it going!`,
      priority: "medium",
    });
  }

  if (!data.morningRoutineCompleted && data.routinesTotal > 0) {
    insights.push({
      id: "morning-routine-missing",
      type: "tip",
      message: "Morning routine not started yet. Start your day with intention",
      priority: "low",
    });
  }

  if (!data.eveningRoutineCompleted && data.routinesTotal > 0) {
    const hour = new Date().getHours();
    if (hour >= 17) {
      insights.push({
        id: "evening-routine-missing",
        type: "tip",
        message: "Evening review pending. Reflect on your day",
        priority: "low",
      });
    }
  }

  const routineCompletionRate = data.routinesTotal > 0 ? data.routinesCompleted / data.routinesTotal : 0;
  if (routineCompletionRate >= 0.8 && routineCompletionRate < 1) {
    insights.push({
      id: "routines-progress",
      type: "encouragement",
      message: `Great routine progress! ${data.routinesTotal - data.routinesCompleted} to go`,
      priority: "medium",
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const getTopInsights = (insights: Insight[], count: number = 2): Insight[] => {
  return insights.slice(0, count);
};
