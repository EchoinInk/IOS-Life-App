import { useEffect, useState } from "react";
import type { Task, TaskCategory, TaskRecurrence, TaskPriority } from "../types/types";

interface UseEditTaskFormProps {
  open: boolean;
  task: Task | null;
  onSave: (updated: Task) => void;
}

export const useEditTaskForm = ({
  open,
  task,
  onSave,
}: UseEditTaskFormProps) => {
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<TaskCategory | "">("");
  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState<TaskRecurrence | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !task) return;
    setLabel(task.label);
    setNotes(task.notes ?? "");
    setCategory(task.category as TaskCategory | "");
    setDate(task.date);
    setRecurrence(task.recurrence as TaskRecurrence | "");
    setPriority(task.priority as TaskPriority | "");
  }, [open, task]);

  const canSave = label.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave || !task) return;
    setLoading(true);
    try {
      await onSave({
        ...task,
        label: label.trim(),
        notes: notes || undefined,
        date,
        recurrence: recurrence || undefined,
        category: category || undefined,
        priority: priority || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    label,
    notes,
    category,
    date,
    recurrence,
    priority,
    canSave,
    loading,
    onLabelChange: setLabel,
    onNotesChange: setNotes,
    onCategoryChange: setCategory,
    onDateChange: setDate,
    onRecurrenceChange: setRecurrence,
    onPriorityChange: setPriority,
    onSave: handleSubmit,
  };
};
