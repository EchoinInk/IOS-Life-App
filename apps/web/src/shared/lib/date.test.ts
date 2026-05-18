import { describe, expect, it, vi } from "vitest";
import {
  toDateString,
  getToday,
  getYesterday,
  parseDateKey,
  compareDates,
  isDateAfter,
  isDateBefore,
  isDateSame,
  formatDisplayDate,
} from "./date";

describe("Date Utilities", () => {
  describe("toDateString", () => {
    it("should convert Date to YYYY-MM-DD format", () => {
      const date = new Date("2026-04-21T12:00:00.000Z");
      const result = toDateString(date);
      expect(result).toBe("2026-04-21");
    });

    it("should handle timezone offset correctly", () => {
      const date = new Date("2026-04-21T00:00:00.000Z");
      const result = toDateString(date);
      expect(result).toBe("2026-04-21");
    });

    it("should handle edge cases", () => {
      const date = new Date("2026-01-01T00:00:00.000Z");
      const result = toDateString(date);
      expect(result).toBe("2026-01-01");
    });
  });

  describe("getToday", () => {
    it("should return today's date string", () => {
      const mockDate = new Date("2026-04-21T12:00:00.000Z");
      vi.setSystemTime(mockDate);
      
      const result = getToday();
      expect(result).toBe("2026-04-21");
      
      vi.useRealTimers();
    });
  });

  describe("getYesterday", () => {
    it("should return yesterday's date string", () => {
      const mockDate = new Date("2026-04-21T12:00:00.000Z");
      vi.setSystemTime(mockDate);
      
      const result = getYesterday();
      expect(result).toBe("2026-04-20");
      
      vi.useRealTimers();
    });

    it("should handle month boundaries", () => {
      const mockDate = new Date("2026-03-01T12:00:00.000Z");
      vi.setSystemTime(mockDate);
      
      const result = getYesterday();
      expect(result).toBe("2026-02-28");
      
      vi.useRealTimers();
    });

    it("should handle year boundaries", () => {
      const mockDate = new Date("2026-01-01T12:00:00.000Z");
      vi.setSystemTime(mockDate);
      
      const result = getYesterday();
      expect(result).toBe("2025-12-31");
      
      vi.useRealTimers();
    });

    it("should accept custom date parameter", () => {
      const customDate = new Date("2026-04-15T12:00:00.000Z");
      const result = getYesterday(customDate);
      expect(result).toBe("2026-04-14");
    });
  });

  describe("parseDateKey", () => {
    it("should parse YYYY-MM-DD format to Date", () => {
      const result = parseDateKey("2026-04-21");
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(3); // April is 3 (0-indexed)
      expect(result.getDate()).toBe(21);
    });

    it("should handle invalid date keys gracefully", () => {
      const result = parseDateKey("invalid");
      expect(result.getFullYear()).toBe(0);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("should handle empty date key", () => {
      const result = parseDateKey("");
      expect(result.getFullYear()).toBe(0);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it("should handle partial date keys", () => {
      const result = parseDateKey("2026-04");
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(1);
    });
  });

  describe("compareDates", () => {
    it("should return positive number when date1 is after date2", () => {
      const result = compareDates("2026-04-22", "2026-04-21");
      expect(result).toBeGreaterThan(0);
    });

    it("should return negative number when date1 is before date2", () => {
      const result = compareDates("2026-04-20", "2026-04-21");
      expect(result).toBeLessThan(0);
    });

    it("should return zero when dates are the same", () => {
      const result = compareDates("2026-04-21", "2026-04-21");
      expect(result).toBe(0);
    });

    it("should handle edge cases with invalid dates", () => {
      const result1 = compareDates("invalid", "2026-04-21");
      const result2 = compareDates("2026-04-21", "invalid");
      expect(typeof result1).toBe("number");
      expect(typeof result2).toBe("number");
    });
  });

  describe("isDateAfter", () => {
    it("should return true when date1 is after date2", () => {
      expect(isDateAfter("2026-04-22", "2026-04-21")).toBe(true);
    });

    it("should return false when date1 is before date2", () => {
      expect(isDateAfter("2026-04-20", "2026-04-21")).toBe(false);
    });

    it("should return false when dates are the same", () => {
      expect(isDateAfter("2026-04-21", "2026-04-21")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isDateAfter("invalid", "2026-04-21")).toBe(false);
      expect(isDateAfter("2026-04-21", "invalid")).toBe(false);
    });
  });

  describe("isDateBefore", () => {
    it("should return true when date1 is before date2", () => {
      expect(isDateBefore("2026-04-20", "2026-04-21")).toBe(true);
    });

    it("should return false when date1 is after date2", () => {
      expect(isDateBefore("2026-04-22", "2026-04-21")).toBe(false);
    });

    it("should return false when dates are the same", () => {
      expect(isDateBefore("2026-04-21", "2026-04-21")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isDateBefore("invalid", "2026-04-21")).toBe(false);
      expect(isDateBefore("2026-04-21", "invalid")).toBe(false);
    });
  });

  describe("isDateSame", () => {
    it("should return true when dates are the same", () => {
      expect(isDateSame("2026-04-21", "2026-04-21")).toBe(true);
    });

    it("should return false when dates are different", () => {
      expect(isDateSame("2026-04-20", "2026-04-21")).toBe(false);
      expect(isDateSame("2026-04-22", "2026-04-21")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isDateSame("invalid", "2026-04-21")).toBe(false);
      expect(isDateSame("2026-04-21", "invalid")).toBe(false);
    });
  });

  describe("formatDisplayDate", () => {
    it("should format valid dates correctly", () => {
      const result = formatDisplayDate("2026-04-21");
      expect(result).toBe("21 Apr");
    });

    it("should return input string for invalid dates", () => {
      expect(formatDisplayDate("invalid")).toBe("invalid");
      expect(formatDisplayDate("")).toBe("");
      expect(formatDisplayDate("Today")).toBe("Today");
    });

    it("should handle different date formats", () => {
      expect(formatDisplayDate("2026-01-01")).toBe("01 Jan");
      expect(formatDisplayDate("2026-12-31")).toBe("31 Dec");
    });

    it("should handle edge cases", () => {
      expect(formatDisplayDate("not-a-date")).toBe("not-a-date");
      expect(formatDisplayDate("2026-13-01")).toBe("2026-13-01"); // Invalid month
      expect(formatDisplayDate("2026-04-32")).toBe("2026-04-32"); // Invalid day
    });
  });

  describe("Edge Cases and Large Lists", () => {
    it("should handle large date ranges efficiently", () => {
      const dates = Array.from({ length: 10000 }, (_, i) => {
        const date = new Date("2026-01-01");
        date.setDate(date.getDate() + i);
        return toDateString(date);
      });

      // Test comparisons
      expect(isDateAfter(dates[9999]!, dates[0]!)).toBe(true);
      expect(isDateBefore(dates[0]!, dates[9999]!)).toBe(true);
      expect(isDateSame(dates[5000]!, dates[5000]!)).toBe(true);
    });

    it("should handle leap years correctly", () => {
      expect(isDateAfter("2024-02-29", "2024-02-28")).toBe(true);
      expect(isDateBefore("2024-02-28", "2024-02-29")).toBe(true);
      expect(formatDisplayDate("2024-02-29")).toBe("29 Feb");
    });

    it("should handle daylight saving time transitions", () => {
      // These dates should work regardless of DST
      expect(formatDisplayDate("2026-03-14")).toBe("14 Mar");
      expect(formatDisplayDate("2026-11-07")).toBe("07 Nov");
    });
  });
});
