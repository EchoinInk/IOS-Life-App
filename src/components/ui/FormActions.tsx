import { cn } from "@/shared/lib/cn";
import { Button } from "@/components/ui/Button";

type FormActionsProps = {
  onCancel: () => void;
  disabled?: boolean;
  submitLabel?: string;
  className?: string;
};

export const FormActions = ({ 
  onCancel, 
  disabled = false, 
  submitLabel = "Save", 
  className 
}: FormActionsProps) => {
  return (
    <div className={cn("flex gap-3 pt-2", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={disabled}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={disabled}
      >
        {submitLabel}
      </Button>
    </div>
  );
};
