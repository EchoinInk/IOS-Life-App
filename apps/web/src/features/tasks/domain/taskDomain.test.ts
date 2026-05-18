import { describe, expect, it } from "vitest";
import {
  isTaskCompleted,
  getCategoryMetadata,
  formatTaskDisplayDate,
  formatTaskDateTime,
} from "@/features/tasks/domain/taskDomain";
import type { Task } from "@/features/tasks/types/types";

describe("Task Utilities", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      label: "Completed Task",
      date: "2026-04-21",
      completed: true,
    },
    {
      id: "2",
      label: "Incomplete Task",
      date: "2026-04-21",
      completed: false,
    },
  ];

  describe("isTaskCompleted", () => {
    it("should return true for completed tasks", () => {
      expect(isTaskCompleted(mockTasks[0]!)).toBe(true);
    });

    it("should return false for incomplete tasks", () => {
      expect(isTaskCompleted(mockTasks[1]!)).toBe(false);
    });
  });

  describe("getCategoryMetadata", () => {
    it("should return metadata for valid category", () => {
      const metadata = getCategoryMetadata("Home & Household");
      expect(metadata).toBeDefined();
      expect(typeof metadata.bg).toBe("string");
      expect(typeof metadata.icon).toBe("string");
    });

    it("should return fallback for unknown category", () => {
      const metadata = getCategoryMetadata("Unknown Category");
      expect(metadata).toBeDefined();
      expect(typeof metadata.bg).toBe("string");
      expect(typeof metadata.icon).toBe("string");
    });

    it("should return fallback for undefined category", () => {
      const metadata = getCategoryMetadata(undefined);
      expect(metadata).toBeDefined();
      expect(typeof metadata.bg).toBe("string");
      expect(typeof metadata.icon).toBe("string");
    });
  });

  describe("formatTaskDisplayDate", () => {
    it("should format valid date", () => {
      const formatted = formatTaskDisplayDate("2026-04-21");
      expect(formatted).toMatch(/\d{2}\s\w{3}/); // e.g., "21 Apr"
    });

    it("should return original string for invalid date", () => {
      const formatted = formatTaskDisplayDate("invalid-date");
      expect(formatted).toBe("invalid-date");
    });
  });

  describe("formatTaskDateTime", () => {
    it("should format date and time", () => {
      const formatted = formatTaskDateTime("2026-04-21", "09:00");
      expect(formatted).toContain("09:00");
      expect(formatted).toMatch(/\d{2}\s\w{3}/);
    });

    it("should format date only", () => {
      const formatted = formatTaskDateTime("2026-04-21");
      expect(formatted).toMatch(/\d{2}\s\w{3}/);
      expect(formatted).not.toContain("undefined");
    });
  });
});
