import { useState } from "react";

export interface HomeModalsState {
  taskOpen: boolean;
  expenseOpen: boolean;
  mealOpen: boolean;
}

export interface HomeModalsActions {
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openExpenseModal: () => void;
  closeExpenseModal: () => void;
  openMealModal: () => void;
  closeMealModal: () => void;
}

export interface HomeModalsReturn extends HomeModalsState, HomeModalsActions {}

/**
 * Home Modals Hook
 * 
 * Manages all modal state for the home dashboard.
 * Centralizes modal open/close logic to reduce complexity in components.
 * 
 * @returns HomeModalsReturn - Modal state and actions
 */
export const useHomeModals = (): HomeModalsReturn => {
  const [taskOpen, setTaskOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);

  return {
    taskOpen,
    expenseOpen,
    mealOpen,
    openTaskModal: () => setTaskOpen(true),
    closeTaskModal: () => setTaskOpen(false),
    openExpenseModal: () => setExpenseOpen(true),
    closeExpenseModal: () => setExpenseOpen(false),
    openMealModal: () => setMealOpen(true),
    closeMealModal: () => setMealOpen(false),
  };
};
