import { useState } from "react";
import { BottomSheetDialog } from "@/components/ui/BottomSheetDialog";
import type { ShoppingCategory } from "@/features/shopping/types/types";

interface AddShoppingItemProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: { name: string; category: ShoppingCategory; type: string; quantity: string }) => void;
  category: ShoppingCategory;
}

const itemTypes = ["Household", "Groceries"];

const AddShoppingItem = ({
  open,
  onClose,
  onSave,
  category,
}: AddShoppingItemProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const canSave = name.trim().length > 0 && type.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        category,
        type,
        quantity,
      });
      setName("");
      setType("");
      setQuantity("1");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetDialog open={open} title="Add Shopping Item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-32">

          {/* ITEM NAME */}
          <div>
            <label htmlFor="item-name" className="sr-only">
              Item name
            </label>
            <input
              id="item-name"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* CATEGORY + TYPE (same row) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted opacity-50 px-4 py-3 text-sm">
              {category}
            </div>
            <div>
              <label htmlFor="item-type" className="sr-only">
                Type
              </label>
              <select
                id="item-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Type</option>
                {itemTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <label htmlFor="item-quantity" className="sr-only">
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              inputMode="numeric"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl bg-muted opacity-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            aria-label={loading ? "Adding item" : "Add shopping item"}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>

      </form>
    </BottomSheetDialog>
  );
};

export default AddShoppingItem;
