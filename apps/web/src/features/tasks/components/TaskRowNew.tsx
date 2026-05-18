/**
 * ARCHITECTURE RULES:
 * - No filtering / sorting in UI
 * - No business logic in components  
 * - Use selectors or hooks
 */
import type { Task } from "../types/types";
import { getTaskPriorityColor, formatTaskTime } from "../utils/taskUtils";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskRowNew = ({ task, onToggle }: Props) => {
  const timeText = formatTaskTime(task.time);

  return (
    <div className="flex items-center gap-3 h-12 px-3 py-2 rounded-lg hover:bg-muted hover:opacity-50 transition-colors">
      
      {/* Priority Indicator */}
      <div className={`
        w-2 h-2 rounded-full flex-shrink-0
        ${getTaskPriorityColor(task.priority)}
      `} />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="w-4 h-4 rounded border-2 border-border flex items-center justify-center flex-shrink-0"
      >
        {task.completed && (
          <div className="w-2 h-2 rounded-full bg-primary" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium truncate
            ${task.completed
              ? "line-through text-muted"
              : "text-foreground"
            }
          `}
        >
          {task.label}
        </p>
        
        {/* Subtitle */}
        {(task.time || task.category) && (
          <p className="text-xs text-muted truncate">
            {timeText}
            {task.time && task.category && " • "}
            {task.category}
          </p>
        )}
      </div>

      {/* Chevron */}
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <svg 
          className="w-3 h-3 text-muted" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>
    </div>
  );
};
