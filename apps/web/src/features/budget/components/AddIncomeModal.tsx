import { useState } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import { FormActions } from "@/components/ui/FormActions";
import { Field, ModalForm } from "@/components/ui/FormField";

interface AddIncomeProps {
  open: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
}

const AddIncome = ({ open, onClose, onSave }: AddIncomeProps) => {
  const [amount, setAmount] = useState("");
  const canSave = Number(amount) > 0;

  return (
    <BottomSheetDialog open={open} onClose={onClose} title="Add Income">
      <ModalForm
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSave) return;
          onSave(Number(amount));
          setAmount("");
          onClose();
        }}
      >
        <Field
          id="add-income-amount"
          label="Income amount"
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Income amount"
        />

        <FormActions onCancel={onClose} submitLabel="Save Income" disabled={!canSave} />
      </ModalForm>
    </BottomSheetDialog>
  );
};

export default AddIncome;
