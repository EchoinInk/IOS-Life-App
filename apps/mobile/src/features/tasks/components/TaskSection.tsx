import type { Task } from "../types/types";
import { TaskRow } from "./TaskRow";

interface Props {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd?: () => void;
}

export const TaskSection = ({ title, tasks, onToggle, onAdd }: Props) => {
  return (
    <div className="space-y-2">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>

        {onAdd && (
          <button
            onClick={onAdd}
            className="text-xs text-primary"
          >
            + Add
          </button>
        )}
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <p className="text-xs text-muted">
          Nothing planned
        </p>
      ) : (
        tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  );
};