/**
 * Date utilities for routines system
 * Isolated from store to prevent circular dependencies
 */

import { format, startOfWeek, endOfWeek, addDays, isSameDay, isAfter, isBefore } from 'date-fns';

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Get start of week for a given date
 */
export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
};

/**
 * Get end of week for a given date
 */
export const getWeekEnd = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 }); // Monday
};

/**
 * Check if a date is within this week
 */
export const isThisWeek = (date: Date): boolean => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  return !isBefore(date, weekStart) && !isAfter(date, weekEnd);
};

/**
 * Check if a date is within this month
 */
export const isThisMonth = (date: Date): boolean => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (start: Date, end: Date): number => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, formatStr: string = 'MMM d'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Check if two dates are the same day
 */
export const isSameDayCheck = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Get day of week (0-6, Sunday-Saturday)
 */
export const getDayOfWeek = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDay();
};

/**
 * Get day of month (1-31)
 */
export const getDayOfMonth = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDate();
};
