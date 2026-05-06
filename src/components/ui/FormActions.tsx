import { Button } from "@/components/ui/Button";

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
}

export const FormActions = ({
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  disabled = false,
}: FormActionsProps) => (
  <div className="flex gap-2 pt-2">
    <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
      {cancelLabel}
    </Button>
    <Button type="submit" variant="primary" fullWidth disabled={disabled}>
      {submitLabel}
    </Button>
  </div>
);
