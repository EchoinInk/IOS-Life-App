import { safeDate } from "@/utils/safeDate";

export type DateKey = string;

export const toDateString = (date: Date): DateKey => {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const iso = adjusted.toISOString();
  return iso.split("T")[0] ?? "";
};

export const getToday = (): string => {
  const date = new Date().toISOString().split("T")[0];

  if (!date) {
    throw new Error("getToday() failed");
  }

  return date;
};
export const getYesterday = (date: Date = new Date()) => {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return toDateString(previous);
};

export const parseDateKey = (dateKey: DateKey): Date => {
  // Parse YYYY-MM-DD format to Date object
  const parts = dateKey.split("-").map(Number);
  const [year, month, day] = parts;
  return new Date(year || 0, (month || 1) - 1, day || 1);
};

export const compareDates = (date1: DateKey, date2: DateKey): number => {
  const d1 = parseDateKey(date1);
  const d2 = parseDateKey(date2);
  return d1.getTime() - d2.getTime();
};

export const isDateAfter = (date1: DateKey, date2: DateKey): boolean => {
  return compareDates(date1, date2) > 0;
};

export const isDateBefore = (date1: DateKey, date2: DateKey): boolean => {
  return compareDates(date1, date2) < 0;
};

export const isDateSame = (date1: DateKey, date2: DateKey): boolean => {
  return compareDates(date1, date2) === 0;
};

export const formatDisplayDate = (date: string) => {
  const d = safeDate(date);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};
