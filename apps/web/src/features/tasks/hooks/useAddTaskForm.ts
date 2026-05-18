import { useEffect, useState } from "react";
import type { TaskCategory, TaskRecurrence, TaskPriority } from "../types/types";

interface UseAddTaskFormProps {
  open: boolean;
  defaultDate: string;
  onSave: (task: {
    label: string;
    date: string;
    recurrence?: TaskRecurrence;
    category?: TaskCategory;
    notes?: string;
    priority?: TaskPriority;
  }) => void;
  onClose: () => void;
}

export const useAddTaskForm = ({
  open,
  defaultDate,
  onSave,
  onClose,
}: UseAddTaskFormProps) => {
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [category, setCategory] = useState<TaskCategory | "">("");
  const [recurrence, setRecurrence] = useState<TaskRecurrence | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(defaultDate);
  }, [defaultDate, open]);

  const canSave = label.trim().length > 0;

  const reset = () => {
    setLabel("");
    setNotes("");
    setCategory("");
    setRecurrence("");
    setPriority("");
    setDate(defaultDate);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    setLoading(true);
    try {
      await onSave({
        label: label.trim(),
        date,
        category: category || undefined,
        recurrence: recurrence || undefined,
        notes: notes || undefined,
        priority: priority || undefined,
      });
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return {
    label,
    notes,
    date,
    category,
    recurrence,
    priority,
    canSave,
    loading,
    onLabelChange: setLabel,
    onNotesChange: setNotes,
    onDateChange: setDate,
    onCategoryChange: setCategory,
    onRecurrenceChange: setRecurrence,
    onPriorityChange: setPriority,
    onSave: handleSubmit,
  };
};
