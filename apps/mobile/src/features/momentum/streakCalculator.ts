import type { 
  DailyMomentumScore, 
  Streak, 
  StreakType, 
  MomentumLevel 
} from "./types/momentum.types";
import { getToday, parseDateKey } from "@/shared/lib/date";

/**
 * Helper function to get days between two dates
 */
const getDaysBetween = (date: string, offset: number): string => {
  const dateObj = parseDateKey(date);
  dateObj.setDate(dateObj.getDate() + offset);
  const result = dateObj.toISOString().split('T')[0];
  return result || date;
};

/**
 * Streak Calculator
 * 
 * Calculates and tracks streaks for different activity types.
 * A streak is maintained by completing the daily goal (score >= 80).
 */

/**
 * Calculate streak for a specific type
 */
export const calculateStreak = (
  dailyScores: DailyMomentumScore[],
  type: StreakType = 'planning'
): Streak => {
  if (dailyScores.length === 0) {
    return {
      type,
      currentLength: 0,
      longestLength: 0,
      startDate: '',
      lastActivityDate: '',
      isActive: false,
      momentumLevel: 'building',
      trendDirection: 'stable'
    };
  }

  // Sort by date descending
  const sortedScores = [...dailyScores].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = getToday();
  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletedDate: string | null = null;
  let streakStartDate: string | null = null;

  // Determine if a day qualifies for streak (score >= 60 for maintaining momentum)
  const qualifiesForStreak = (score: DailyMomentumScore): boolean => {
    return score.totalScore >= 60; // Maintaining threshold
  };

  // Check if today/yesterday completed to start counting current streak
  const todayScore = sortedScores.find(s => s.date === today);
  const yesterdayScore = sortedScores.find(s => s.date === getDaysBetween(today, -1));

  if (todayScore && qualifiesForStreak(todayScore)) {
    currentStreak = 1;
    lastCompletedDate = today;
    streakStartDate = today;
  } else if (yesterdayScore && qualifiesForStreak(yesterdayScore)) {
    currentStreak = 1;
    lastCompletedDate = yesterdayScore.date;
    streakStartDate = yesterdayScore.date;
  } else {
    // Streak broken - find last completed day
    const lastQualified = sortedScores.find(s => qualifiesForStreak(s));
    lastCompletedDate = lastQualified?.date || null;
    streakStartDate = lastCompletedDate;
  }

  // Calculate current streak by counting consecutive qualified days
  let checkDate = lastCompletedDate;
  while (checkDate) {
    const score = sortedScores.find(s => s.date === checkDate);
    if (score && qualifiesForStreak(score)) {
      currentStreak++;
      streakStartDate = checkDate;
      checkDate = getDaysBetween(checkDate, -1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  let tempLongest = 0;

  for (let i = 0; i < sortedScores.length; i++) {
    const score = sortedScores[i];
    if (score && qualifiesForStreak(score)) {
      tempStreak++;
      tempLongest = Math.max(tempLongest, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  longestStreak = Math.max(currentStreak, tempLongest);

  // Determine momentum level based on current streak
  const getMomentumLevel = (streakLength: number): MomentumLevel => {
    if (streakLength >= 30) return 'excelling';
    if (streakLength >= 14) return 'growing';
    if (streakLength >= 7) return 'maintaining';
    return 'building';
  };

  // Calculate trend direction
  const getTrendDirection = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current === previous) return 'stable';
    return current > previous ? 'up' : 'down';
  };

  return {
    type,
    currentLength: currentStreak,
    longestLength: longestStreak,
    startDate: streakStartDate || '',
    lastActivityDate: lastCompletedDate || '',
    isActive: currentStreak > 0,
    momentumLevel: getMomentumLevel(currentStreak),
    trendDirection: getTrendDirection(currentStreak, longestStreak)
  };
};

/**
 * Calculate all streaks for different types
 */
export const calculateAllStreaks = (dailyScores: DailyMomentumScore[]): Record<StreakType, Streak> => {
  const planning = calculateStreak(dailyScores, 'planning');
  const completion = calculateStreak(dailyScores, 'completion');
  const routine = calculateStreak(dailyScores, 'routine');
  const consistency = calculateStreak(dailyScores, 'consistency');
  const focus = calculateStreak(dailyScores, 'focus');
  const wellness = calculateStreak(dailyScores, 'wellness');

  return {
    planning,
    completion,
    routine,
    consistency,
    focus,
    wellness,
  };
};

/**
 * Check if streak is in danger (no completion today/yesterday)
 */
export const isStreakInDanger = (streak: Streak): boolean => {
  if (streak.currentLength === 0) return false;
  if (!streak.lastActivityDate) return false;
  
  const today = getToday();
  const lastDate = new Date(streak.lastActivityDate);
  const todayDate = new Date(today);
  const daysSince = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // If last completed was 2+ days ago, streak is in danger
  return daysSince >= 2;
};

/**
 * Get streak motivation message
 */
export const getStreakMotivation = (streak: Streak): string => {
  if (streak.currentLength === 0) {
    return "Start your streak today!";
  }
  
  if (streak.currentLength === 1) {
    return "You're on a roll! Keep going!";
  }
  
  if (streak.currentLength < 7) {
    return `${streak.currentLength} day streak! Keep it up.`;
  }
  
  if (streak.currentLength < 30) {
    return `${streak.currentLength} day streak! Amazing consistency!`;
  }
  
  if (streak.currentLength < 100) {
    return `${streak.currentLength} day streak! You're unstoppable!`;
  }
  
  return `${streak.currentLength} day streak! Legendary! 🏆`;
};
