import { useState, useMemo, useCallback } from "react";
import { AddTaskModalView } from "./AddTaskModal.view";
import { useTaskActions } from "@/features/tasks/hooks/useTaskActions";

import type {
  CreateTaskInput,
  TaskCategory,
  TaskPriority,
  TaskRecurrence,
} from "@/features/tasks/types/types";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultDate: string;
};

export const AddTaskModal = ({ open, onClose, defaultDate }: Props) => {
  const { addTask } = useTaskActions();

  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(defaultDate);

  // ✅ FIXED TYPES
  const [category, setCategory] = useState<TaskCategory | "">("");
  const [recurrence, setRecurrence] = useState<TaskRecurrence | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");

  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setLabel("");
    setNotes("");
    setDate(defaultDate);
    setCategory("");
    setRecurrence("");
    setPriority("");
    setLoading(false);
  }, [defaultDate]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim() || loading) return;

    setLoading(true);

    const payload: CreateTaskInput = {
      label: label.trim(),
      notes: notes || undefined,
      date,
      category: category || undefined,
      recurrence: recurrence || undefined,
      priority: priority || undefined,
    };

    addTask(payload);

    handleClose();
  }, [
    label,
    notes,
    date,
    category,
    recurrence,
    priority,
    loading,
    addTask,
    handleClose,
  ]);

  const canSave = label.trim().length > 0;

  const model = useMemo(() => ({
    open,
    label,
    notes,
    date,
    category,
    recurrence,
    priority,
    canSave,
    loading,
    onClose: handleClose,
    onSave: handleSubmit,
    onLabelChange: setLabel,
    onNotesChange: setNotes,
    onDateChange: setDate,
    onCategoryChange: setCategory,
    onRecurrenceChange: setRecurrence,
    onPriorityChange: setPriority,
  }), [
    open,
    label,
    notes,
    date,
    category,
    recurrence,
    priority,
    canSave,
    loading,
    handleClose,
    handleSubmit,
  ]);

  return <AddTaskModalView model={model} />;
};