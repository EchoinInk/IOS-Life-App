import { useEffect, useRef, useMemo } from 'react';
import { useTasksStore } from '@/features/tasks/store/useTasksStore';
import { useMealsStore } from '@/features/meals/store/useMealsStore';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { requestNotificationPermission, sendRelevantNotification, canSendNotifications } from '@/shared/lib/notifications';
import { selectTodayTasks, selectIncompleteTodayTasks } from '@/features/tasks/selectors/taskSelectors';
import { getToday } from "@/shared/lib/date";

/**
 * Hook to handle browser notifications for daily activity reminders
 */
export const useNotifications = () => {
  const hasRequestedPermission = useRef(false);
  const today = getToday();
  
  const tasks = useTasksStore((state) => state.tasks);
  const todayTasks = useMemo(() => selectTodayTasks(tasks, today), [tasks, today]);
  const incompleteTasks = useMemo(() => selectIncompleteTodayTasks(tasks, today), [tasks, today]);
  const meals = useMealsStore((state) => state.meals);
  const weeklyBudget = useBudgetStore((state) => state.weeklyBudget);
  const expenses = useBudgetStore((state) => state.expenses);

  // Request permission on first hook use
  useEffect(() => {
    if (!hasRequestedPermission.current) {
      requestNotificationPermission();
      hasRequestedPermission.current = true;
    }
  }, []);

  // Trigger notifications on app open
  useEffect(() => {
    if (!canSendNotifications()) return;

    // Notify about incomplete tasks
    if (todayTasks.length > 0 && incompleteTasks.length > 0) {
      const taskWord = incompleteTasks.length === 1 ? 'task' : 'tasks';
      sendRelevantNotification(
        'Lumo',
        `You have ${incompleteTasks.length} ${taskWord} to complete today`,
        true
      );
    }

    // Notify about meal logging
    const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMeals = meals.filter((meal) => meal.day === todayWeekday);
    
    if (todayMeals.length === 0) {
      sendRelevantNotification(
        'Lumo',
        "Don't forget to log your meals today",
        true
      );
    }

    // Notify about budget status
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = weeklyBudget - totalExpenses;
    
    if (remainingBudget < weeklyBudget * 0.2 && remainingBudget > 0) {
      sendRelevantNotification(
        'Lumo',
        `You have $${Math.round(remainingBudget)} left in your weekly budget`,
        true
      );
    }
  }, [todayTasks, incompleteTasks, meals, weeklyBudget, expenses]);

  // Time-based notification triggers
  useEffect(() => {
    if (!canSendNotifications()) return;

    // Set up a 4-hour reminder
    const reminderTimer = setTimeout(() => {
      if (incompleteTasks.length > 0) {
        sendRelevantNotification(
          'Lumo',
          'Check your daily tasks and progress',
          true
        );
      }
    }, 1000 * 60 * 60 * 4); // 4 hours

    return () => clearTimeout(reminderTimer);
  }, [incompleteTasks]);

  return {
    canSendNotifications: canSendNotifications(),
    requestPermission: requestNotificationPermission,
  };
};
