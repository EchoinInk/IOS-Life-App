import { Streak } from "./streaks.types";
import { getToday } from "@/shared/lib/date";

export const getStreakMessage = (streak: Streak): string => {
  if (streak.current === 0) {
    return "Start your streak today!";
  }
  
  if (streak.current === 1) {
    return "Day 1 - Keep it going!";
  }
  
  if (streak.current === streak.longest && streak.current > 1) {
    return `Personal best: ${streak.current} days! 🔥`;
  }
  
  if (streak.current >= 7) {
    return `${streak.current} day streak! You're unstoppable!`;
  }
  
  if (streak.current >= 3) {
    return `${streak.current} day streak - Nice work!`;
  }
  
  return `${streak.current} day streak`;
};

export const shouldUpdateStreak = (completed: boolean, lastUpdated: number): boolean => {
  if (!completed) return false;
  
  const today = getToday();
  const lastUpdateDate = new Date(lastUpdated).toDateString();
  const todayDate = new Date(today).toDateString();
  
  // Only update if it's a new day
  return lastUpdateDate !== todayDate;
};

export const getStreakEmoji = (current: number): string => {
  if (current === 0) return "🌱";
  if (current === 1) return "🌿";
  if (current === 3) return "🌳";
  if (current >= 7) return "🔥";
  return "✨";
};
