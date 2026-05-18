/**
 * ARCHITECTURE RULES:
 * - No filtering / sorting in UI
 * - No business logic in components  
 * - Use selectors or hooks
 */
import { useState } from "react";
import { useTaskActions } from "../hooks/useTaskActions";
import { useTaskDataByDate } from "../hooks/useTaskData";
import { CalendarStrip } from "../components/CalendarStrip";
import { TaskSections } from "../components/TaskSections";
import { FloatingAddButton } from "../components/FloatingAddButton";
import { AddTaskModal } from "../components/AddTaskModal/AddTaskModal.container";
import { getToday } from "@/shared/lib/date";

const TasksPage = () => {
  const { toggleTask } = useTaskActions();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showAddModal, setShowAddModal] = useState(false);

  const { tasks, incompleteTasks } = useTaskDataByDate(selectedDate);

  // Derived calculations for display
  const upcomingTasks = tasks.filter((t) => !t.completed && t.date > selectedDate);
  const completedTasksBefore = tasks.filter((t) => t.completed && t.date < selectedDate);

  return (
    <div className="flex flex-col h-full bg-background">
      <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="flex-1 overflow-y-auto pb-20">
        <TaskSections
          todayTasks={incompleteTasks}
          upcomingTasks={upcomingTasks}
          completedTasks={completedTasksBefore}
          onToggle={toggleTask}
        />
      </div>

      <FloatingAddButton onClick={() => setShowAddModal(true)} />

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default TasksPage;
