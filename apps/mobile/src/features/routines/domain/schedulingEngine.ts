/**
 * Scheduling Engine - Handles routine scheduling and time-based logic
 * Isolated domain logic for scheduling and timing
 */

import type { RoutineTemplate, RoutineInstance, FocusSession } from '../types/routineTypes';
import { getTodayString } from '../utils/dateUtils';

/**
 * Check if a routine should be scheduled for a specific date
 */
export const shouldScheduleRoutine = (
  template: RoutineTemplate,
  targetDate: string
): boolean => {
  if (!template.isActive) return false;

  const targetDateObj = new Date(targetDate);
  const today = new Date(getTodayString());

  // Don't schedule for past dates
  if (targetDateObj < today) return false;

  switch (template.frequency) {
    case 'daily':
      return true;
    
    case 'weekly':
      // Schedule weekly routines on Mondays (day 1)
      return targetDateObj.getDay() === 1;
    
    case 'monthly':
      // Schedule monthly routines on the 1st of each month
      return targetDateObj.getDate() === 1;
    
    default:
      return false;
  }
};

/**
 * Generate scheduled routine instances for a date range
 */
export const generateScheduledRoutines = (
  templates: RoutineTemplate[],
  startDate: string,
  endDate: string
): RoutineInstance[] => {
  const instances: RoutineInstance[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0];
    
    if (dateString) {
      templates.forEach(template => {
        if (shouldScheduleRoutine(template, dateString)) {
          const instance: RoutineInstance = {
            id: `${template.id}-${dateString}`,
            templateId: template.id,
            date: dateString,
            type: template.type,
            status: 'pending',
            steps: template.steps.map(step => ({
              id: `${step.id}-${dateString}`,
              stepId: step.id,
              status: step.defaultCompleted ? 'completed' : 'pending',
              completedAt: step.defaultCompleted ? new Date().toISOString() : undefined,
              momentum: step.defaultCompleted ? 2 : 0
            })),
            momentum: 0,
            insights: []
          };
          instances.push(instance);
        }
      });
    }
  }

  return instances;
};

/**
 * Get upcoming scheduled routines
 */
export const getUpcomingRoutines = (
  templates: RoutineTemplate[],
  daysAhead: number = 7
): RoutineInstance[] => {
  const today = getTodayString();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysAhead);
  
  const endDateString = endDate.toISOString().split('T')[0];
  return generateScheduledRoutines(
    templates,
    today,
    endDateString || today
  );
};

/**
 * Check if a focus session should be scheduled
 */
export const shouldScheduleFocusSession = (
  session: FocusSession,
  currentTime: Date
): boolean => {
  const scheduledStart = new Date(session.scheduledStart);
  const scheduledEnd = new Date(session.scheduledEnd);
  
  return currentTime >= scheduledStart && currentTime <= scheduledEnd;
};

/**
 * Get active focus sessions for current time
 */
export const getActiveFocusSessions = (
  sessions: FocusSession[],
  currentTime: Date = new Date()
): FocusSession[] => {
  return sessions.filter(session => 
    session.status === 'scheduled' && 
    shouldScheduleFocusSession(session, currentTime)
  );
};

/**
 * Calculate optimal scheduling time for routine type
 */
export const getOptimalScheduleTime = (
  routineType: RoutineTemplate['type']
): { hour: number; minute: number } => {
  switch (routineType) {
    case 'morning':
      return { hour: 7, minute: 0 }; // 7:00 AM
    case 'evening':
      return { hour: 19, minute: 0 }; // 7:00 PM
    case 'weekly':
      return { hour: 9, minute: 0 }; // 9:00 AM on Monday
    case 'focus':
      return { hour: 10, minute: 0 }; // 10:00 AM
    case 'planning':
      return { hour: 8, minute: 30 }; // 8:30 AM
    default:
      return { hour: 9, minute: 0 };
  }
};

/**
 * Generate suggested focus session times
 */
export const generateFocusSessionSuggestions = (
  duration: number,
  count: number = 3
): { start: string; end: string }[] => {
  const suggestions: { start: string; end: string }[] = [];
  const now = new Date();
  
  // Common focus times
  const focusTimes = [
    { hour: 9, minute: 0 },   // 9:00 AM
    { hour: 11, minute: 0 },  // 11:00 AM
    { hour: 14, minute: 0 },  // 2:00 PM
    { hour: 16, minute: 0 },  // 4:00 PM
  ];

  for (let i = 0; i < Math.min(count, focusTimes.length); i++) {
    const time = focusTimes[i];
    if (!time) continue;
    
    const start = new Date();
    start.setHours(time.hour, time.minute, 0, 0);
    
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);
    
    // Only suggest future times today
    if (end > now) {
      suggestions.push({
        start: start.toISOString(),
        end: end.toISOString()
      });
    }
  }

  return suggestions;
};
