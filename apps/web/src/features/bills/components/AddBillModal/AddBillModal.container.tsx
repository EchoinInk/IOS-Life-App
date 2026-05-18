import { useState, useCallback } from "react";
import { AddBillModalView } from "./AddBillModal.view";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (bill: { name: string; amount: number; date: string }) => void;
};

export const AddBillModal = ({ open, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const reset = useCallback(() => {
    setName("");
    setAmount("");
    setDate("");
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !parseFloat(amount) || !date) return;

    onSave({
      name: name.trim(),
      amount: parseFloat(amount),
      date,
    });

    handleClose();
  }, [name, amount, date, onSave, handleClose]);

  const canSave = name.trim().length > 0 && parseFloat(amount) > 0 && date.length > 0;

  const model = {
    open,
    name,
    amount,
    date,
    canSave,
    onClose: handleClose,
    onSave: handleSubmit,
    onNameChange: setName,
    onAmountChange: setAmount,
    onDateChange: setDate,
  };

  return <AddBillModalView model={model} />;
};
