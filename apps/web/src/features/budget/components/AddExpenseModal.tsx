import { useState } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";

interface AddExpenseProps {
  open: boolean;
  onClose: () => void;
  onSave: (expense: { name: string; amount: number }) => void;
}

const AddExpense = ({ open, onClose, onSave }: AddExpenseProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const canSave = name.trim().length > 0 && parseFloat(amount) > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    setLoading(true);
    try {
      await onSave({ name: name.trim(), amount: parseFloat(amount) });
      setName("");
      setAmount("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetDialog open={open} title="Add Expense" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-32">

          {/* EXPENSE NAME */}
          <div>
            <label htmlFor="expense-name" className="sr-only">
              Expense name
            </label>
            <input
              id="expense-name"
              placeholder="Expense name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-muted/50 px-4 py-3 text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label htmlFor="expense-amount" className="sr-only">
              Amount
            </label>
            <input
              id="expense-amount"
              type="number"
              inputMode="decimal"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-muted/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

        </div>

        {/* STICKY CTA */}
        <div className="sticky bottom-0 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 bg-background">
          <button
            type="submit"
            disabled={!canSave || loading}
            className="
              w-full
              py-3
              rounded-xl
              text-on-primary
              font-medium
              bg-primary
              disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            "
            aria-label={loading ? "Adding expense" : "Add expense"}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>

      </form>
    </BottomSheetDialog>
  );
};

export default AddExpense;
