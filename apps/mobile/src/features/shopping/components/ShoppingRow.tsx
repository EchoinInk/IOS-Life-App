import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { ListItemBase } from "@/components/ui/ListItemBase";
import { Label } from "@/components/ui/Text";

import type { ShoppingItem } from "@/features/shopping/types/types";

interface ShoppingRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
}

export const ShoppingRow = ({ item, onToggle }: ShoppingRowProps) => {
  return (
    <CheckboxRow
      checked={item.done}
      onToggle={() => onToggle(item.id)}
      className="
        rounded-lg
        px-2 py-2
        transition-[transform] duration-200
        active:scale-[0.98] motion-reduce:active:scale-100
      "
    >
      <ListItemBase
        label={
          <Label
            className={item.done ? "line-through opacity-50" : ""}
          >
            {item.name}
          </Label>
        }
      />
    </CheckboxRow>
  );
};