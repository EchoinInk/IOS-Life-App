import type { Task } from "../types/types";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskRow = ({ task, onToggle }: Props) => {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50">

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="w-5 h-5 rounded-full border flex items-center justify-center"
      >
        {task.completed && (
          <div className="w-3 h-3 rounded-full bg-primary" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1">
        <p
          className={`text-base ${
            task.completed
              ? "line-through text-muted"
              : ""
          }`}
        >
          {task.label}
        </p>

        {(task.category || task.priority) && (
          <p className="text-xs text-muted">
            {task.category}
            {task.priority && ` • ${task.priority}`}
          </p>
        )}
      </div>
    </div>
  );
};