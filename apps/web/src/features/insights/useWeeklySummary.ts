import { useMemo } from "react";
import { useTasksStore } from "@/features/tasks/store/useTasksStore";
import { useMealsStore } from "@/features/meals/store/useMealsStore";
import { useBudgetStore } from "@/features/budget/store/useBudgetStore";
import { getToday, parseDateKey } from "@/shared/lib/date";
import type { DateKey } from "@/shared/lib/date";
import { selectTasksByDate } from "@/features/tasks/selectors/taskSelectors";

const subDays = (date: DateKey, days: number): DateKey => {
  const d = parseDateKey(date);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0] as DateKey;
};

export interface WeeklySummary {
  tasksCompleted: number;
  totalTasks: number;
  totalSpent: number;
  mealsLogged: number;
  bestDay: string;
  completionRate: number;
  dailyBreakdown: Array<{
    date: DateKey;
    tasksCompleted: number;
    tasksTotal: number;
    mealsLogged: number;
    spent: number;
  }>;
}

export const useWeeklySummary = (): WeeklySummary => {
  const tasks = useTasksStore((state) => state.tasks);
  const meals = useMealsStore((state) => state.meals);
  const expenses = useBudgetStore((state) => state.expenses);

  return useMemo(() => {
    const today = getToday();
    const weekDays = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      weekDays.push(subDays(today, i));
    }

    let totalTasksCompleted = 0;
    let totalTasks = 0;
    let totalSpent = 0;
    let totalMealsLogged = 0;
    let bestDay = "";
    let bestDayScore = -1;

    const dailyBreakdown = weekDays.map(date => {
      // Tasks for this day
      const dayTasks = selectTasksByDate(tasks, date);
      const dayTasksCompleted = dayTasks.filter(task => 
        task.completed
      ).length;
      
      // Meals for this day
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayWeekday = weekdays[new Date(date).getDay()];
      const dayMeals = meals.filter(meal => meal.day === dayWeekday).length;
      
      // Expenses for this day (since expenses don't have dates, we'll use today's expenses for all days for now)
      // This is a limitation of the current expense structure
      const daySpent = expenses.reduce((sum, expense) => sum + expense.amount, 0) / 7; // Distribute evenly

      // Calculate day score for "best day" determination
      const taskScore = dayTasks.length > 0 ? dayTasksCompleted / dayTasks.length : 0;
      const mealScore = dayMeals / 3; // Target is 3 meals
      const dayScore = taskScore + mealScore;

      if (dayScore > bestDayScore) {
        bestDayScore = dayScore;
        bestDay = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }

      totalTasksCompleted += dayTasksCompleted;
      totalTasks += dayTasks.length;
      totalSpent += daySpent;
      totalMealsLogged += dayMeals;

      return {
        date,
        tasksCompleted: dayTasksCompleted,
        tasksTotal: dayTasks.length,
        mealsLogged: dayMeals,
        spent: daySpent,
      };
    });

    const completionRate = totalTasks > 0 ? Math.round((totalTasksCompleted / totalTasks) * 100) : 0;

    return {
      tasksCompleted: totalTasksCompleted,
      totalTasks,
      totalSpent,
      mealsLogged: totalMealsLogged,
      bestDay: bestDay || "No data",
      completionRate,
      dailyBreakdown,
    };
  }, [tasks, meals, expenses]);
};
