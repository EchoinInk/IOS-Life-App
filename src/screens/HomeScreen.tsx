/**
 * ARCHITECTURE RULES:
 * - No filtering / sorting in UI
 * - No business logic in components  
 * - Use selectors or hooks
 * 
 * HomeScreen is now a route-level wrapper that:
 * - Provides layout shell
 * - Handles provider wiring
 * - Delegates to container/view architecture
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
  if (h < 12) return "Good morning 👋";
  if (h < 18) return "Good afternoon 👋";
  return "Good evening 👋";
};

/**
 * Home Screen (Route-Level Wrapper)
 * 
 * Responsibilities:
 * - Route-level layout shell
 * - Provider wiring
 * - Modal rendering
 * - Background styling
 * 
 * Business logic and orchestration are delegated to:
 * - useHomeDashboard (data and actions)
 * - useHomeModals (modal state)
 * - HomeDashboardView (pure UI)
 */
const HomeScreen = () => {
  // Container hooks for orchestration
  const data = useHomeDashboard();
  const modals = useHomeModals();

  // Simple presentation logic
  const greeting = greetingFor(new Date());

  return (
    <>
      {/* PAGE WRAPPER */}
      <div className="relative min-h-screen bg-background overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              top-[-40px]
              left-1/2 -translate-x-1/2
              w-[320px] h-[320px]
              blur-2xl
              opacity-15
              bg-gradient-primary
            "
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full max-w-[430px] mx-auto px-4 pt-4 pb-[calc(96px+env(safe-area-inset-bottom))] space-y-4">
          {/* HEADER */}
          <HomeHeader greeting={greeting} />

          {/* DASHBOARD VIEW */}
          <HomeDashboardView data={data} modals={modals} />
        </div>
      </div>

      {/* MODALS */}
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
