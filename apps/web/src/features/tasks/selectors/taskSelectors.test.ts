import {

  selectTasksByDate,

  selectCompletedTasks,

  selectIncompleteTasks,

  selectTodayTasks,

  selectCompletedTodayTasks,

  selectIncompleteTodayTasks,

  selectUpcomingTasks,

  selectNextTask,

} from "./taskSelectors";

import type { Task } from "@/features/tasks/types/types";

const TODAY = "2026-05-02";

const mockTasks: Task[] = [

  { id: "1", label: "Today 1", date: TODAY, completed: false },

  { id: "2", label: "Today Done", date: TODAY, completed: true },

  { id: "3", label: "Tomorrow", date: "2026-05-03", completed: false },

  { id: "4", label: "Yesterday", date: "2026-05-01", completed: false },

];

describe("taskSelectors", () => {

  describe("selectTasksByDate", () => {

    it("returns tasks for a specific date", () => {

      const result = selectTasksByDate(mockTasks, TODAY);

      expect(result).toHaveLength(2);

      expect(result.every(t => t.date === TODAY)).toBe(true);

    });

  });

  describe("selectCompletedTasks", () => {

    it("returns only completed tasks", () => {

      const result = selectCompletedTasks(mockTasks);

      expect(result).toHaveLength(1);

      expect(result[0]?.completed).toBe(true);

    });

  });

  describe("selectIncompleteTasks", () => {

    it("returns only incomplete tasks", () => {

      const result = selectIncompleteTasks(mockTasks);

      expect(result).toHaveLength(3);

      expect(result.every(t => !t.completed)).toBe(true);

    });

  });

  describe("selectTodayTasks", () => {

    it("returns today's tasks", () => {

      const result = selectTodayTasks(mockTasks, TODAY);

      expect(result).toHaveLength(2);

    });

  });

  describe("selectCompletedTodayTasks", () => {

    it("returns completed tasks for today", () => {

      const result = selectCompletedTodayTasks(mockTasks, TODAY);

      expect(result).toHaveLength(1);

      expect(result[0]?.completed).toBe(true);

    });

  });

  describe("selectIncompleteTodayTasks", () => {

    it("returns incomplete tasks for today", () => {

      const result = selectIncompleteTodayTasks(mockTasks, TODAY);

      expect(result).toHaveLength(1);

      expect(result[0]?.completed).toBe(false);

    });

  });

  describe("selectUpcomingTasks", () => {

    it("returns future tasks", () => {

      const result = selectUpcomingTasks(mockTasks, TODAY);

      expect(result).toHaveLength(1);

      expect(result[0]?.date).toBe("2026-05-03");

    });

  });

  describe("selectNextTask", () => {

    it("returns first incomplete task for today", () => {

      const result = selectNextTask(mockTasks, TODAY);

      expect(result).not.toBeNull();

      expect(result?.label).toBe("Today 1");

    });

    it("returns null if no incomplete tasks", () => {

      const completedOnly: Task[] = [

        { id: "1", label: "Done", date: TODAY, completed: true },

      ];

      const result = selectNextTask(completedOnly, TODAY);

      expect(result).toBeNull();

    });

  });

});