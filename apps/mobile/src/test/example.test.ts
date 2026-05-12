import { describe, expect, it, vi } from "vitest";
import { getBudgetSummary } from "@/features/budget/hooks/useBudget";
import { buildRecipeWorkflow } from "@/features/recipes/services/recipeWorkflow";
import { isTaskCompleted } from "@/features/tasks/domain/taskDomain";
import { formatDisplayDate } from "@/shared/lib/date";
import type { Task } from "@/features/tasks/types/types";

const tasks: Task[] = [
  { id: "1", label: "Today", date: "2026-04-21", completed: false, time: "09:00" },
  { id: "2", label: "Done", date: "2026-04-21", completed: true, time: "08:00" },
  { id: "3", label: "Upcoming", date: "2026-04-22", completed: false },
  { id: "4", label: "Yesterday", date: "2026-04-20", completed: false },
];

describe("selectors and workflows", () => {
  it("checks task completion", () => {
    expect(isTaskCompleted(tasks[0]!)).toBe(false);
    expect(isTaskCompleted(tasks[1]!)).toBe(true);
  });

  it("calculates budget summary", () => {
    expect(getBudgetSummary([{ id: "e1", name: "Coffee", amount: 5 }], 0).percentage).toBe(0);
  });

  it("builds recipe workflow with a date key", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-04-21T12:00:00"));
    expect(buildRecipeWorkflow({ name: "Pasta", ingredients: ["Tomatoes"] }).task.date).toBe("2026-04-21");
    vi.useRealTimers();
  });

  it("formats invalid dates defensively", () => {
    expect(formatDisplayDate("Today")).toBe("Today");
  });
});
