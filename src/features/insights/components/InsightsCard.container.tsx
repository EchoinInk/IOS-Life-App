import { InsightsCardView, type InsightsCardViewModel } from "./InsightsCard.view";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { useBudgetData } from "@/features/budget/hooks/useBudgetData";
import { useStreaksStore } from "@/features/insights/useStreaksStore";
import { generateInsights, getTopInsights, type InsightData } from "@/features/insights/insights.utils";
import { useMemo } from "react";

export const InsightsCardContainer = () => {
  const today = useTodayData();
  const budgetData = useBudgetData();
  const streaks = useStreaksStore((state) => state.streaks);

  const viewModel = useMemo(() => {
    const insightData: InsightData = {
      tasksCompleted: today.summary.tasks.completed,
      tasksTotal: today.summary.tasks.total,
      expenses: [],
      mealsLogged: today.summary.meals.logged,
      mealsTarget: today.summary.meals.target,
      budgetRemaining: today.summary.budget.remaining,
      budgetTotal: budgetData.weeklyBudget,
      shoppingCompleted: 0,
      shoppingTotal: 0,
      streakTasks: streaks.tasks.current,
      streakMeals: streaks.meals.current,
      routinesCompleted: 0,
      routinesTotal: 0,
      routineStreak: 0,
      morningRoutineCompleted: false,
      eveningRoutineCompleted: false,
    };

    const allInsights = generateInsights(insightData);
    const topInsights = getTopInsights(allInsights, 2);

    return {
      insights: topInsights,
    } as InsightsCardViewModel;
  }, [today, budgetData.weeklyBudget, streaks]);

  return <InsightsCardView model={viewModel} />;
};
