/**
 * HomeScreen — route shell.
 * Tighter spacing, no decorative glow, single cohesive surface system.
 */
import { AddTaskModal } from "@/features/tasks";
import AddExpense from "@/features/budget/components/AddExpenseModal";
import { AddMealModal } from "@/features/meals";

import { useHomeDashboard } from "@/features/home/hooks/useHomeDashboard";
import { useHomeModals } from "@/features/home/hooks/useHomeModals";

import { HomeDashboardView } from "@/components/home/HomeDashboardView";
import { HomeHeader } from "@/components/home/HomeHeader";

const greetingFor = (d: Date): string => {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const HomeScreen = () => {
  const data = useHomeDashboard();
  const modals = useHomeModals();
  const greeting = greetingFor(new Date());

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-[430px] mx-auto px-4 pt-3 pb-[calc(80px+env(safe-area-inset-bottom))] space-y-4">
          <HomeHeader greeting={greeting} />
          <HomeDashboardView data={data} modals={modals} />
        </div>
      </div>

      <AddTaskModal
        open={modals.taskOpen}
        onClose={modals.closeTaskModal}
        defaultDate={data.todayStr}
      />
      <AddMealModal
        open={modals.mealOpen}
        onClose={modals.closeMealModal}
        onSave={data.addMeal}
      />
      <AddExpense
        open={modals.expenseOpen}
        onClose={modals.closeExpenseModal}
        onSave={data.addExpense}
      />
    </>
  );
};

export default HomeScreen;
