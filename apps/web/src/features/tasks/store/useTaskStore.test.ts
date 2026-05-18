import { useTasksStore } from "./useTasksStore";

describe("useTasksStore", () => {

  it("adds a task", () => {

    const { addTask } = useTasksStore.getState();

    addTask({ label: "Test", date: "2026-05-02" });

    const updated = useTasksStore.getState().tasks;

    expect(updated.length).toBe(1);

    expect(updated[0]?.label).toBe("Test");

  });

  it("toggles a task", () => {

    const store = useTasksStore.getState();

    store.addTask({ label: "Test", date: "2026-05-02" });

    const id = useTasksStore.getState().tasks[0]?.id;

    store.toggleTask(id!);

    const updated = useTasksStore.getState().tasks[0];

    expect(updated?.completed).toBe(true);

  });

});