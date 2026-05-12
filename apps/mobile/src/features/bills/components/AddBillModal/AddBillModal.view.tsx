import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import { FormActions } from "@/components/ui/FormActions";
import { Field, ModalForm } from "@/components/ui/FormField";

type AddBillModalViewModel = {
  open: boolean;
  name: string;
  amount: string;
  date: string;
  canSave: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
};

type Props = {
  model: AddBillModalViewModel;
};

export const AddBillModalView = ({ model }: Props) => {
  return (
    <BottomSheetDialog open={model.open} title="Add Bill" onClose={model.onClose}>
      <ModalForm onSubmit={model.onSave}>
        <Field 
          id="add-bill-name" 
          label="Bill name" 
          autoFocus 
          placeholder="Bill name" 
          value={model.name} 
          onChange={(e) => model.onNameChange(e.target.value)} 
        />
        <Field 
          id="add-bill-amount" 
          label="Amount" 
          type="number" 
          inputMode="decimal" 
          placeholder="Amount" 
          value={model.amount} 
          onChange={(e) => model.onAmountChange(e.target.value)} 
        />
        <Field 
          id="add-bill-date" 
          label="Due date" 
          type="date" 
          value={model.date} 
          onChange={(e) => model.onDateChange(e.target.value)} 
        />
        <FormActions onCancel={model.onClose} disabled={!model.canSave} />
      </ModalForm>
    </BottomSheetDialog>
  );
};
