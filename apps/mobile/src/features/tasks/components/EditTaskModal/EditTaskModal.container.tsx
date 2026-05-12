import { EditTaskModalView, type EditTaskModalViewModel } from "./EditTaskModal.view";
import { useEditTaskForm } from "../../hooks/useEditTaskForm";
import type { Task } from "@/features/tasks/types/types";

interface Props {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updated: Task) => void;
  onDelete: () => void;
}

export const EditTaskModal = ({ open, onClose, task, onSave, onDelete }: Props) => {
  const form = useEditTaskForm({ open, task, onSave });

  if (!task) return null;

  const model: EditTaskModalViewModel = {
    open,
    onClose,
    onDelete,
    ...form,
  };

  return (
    <EditTaskModalView model={model} />
  );
};
