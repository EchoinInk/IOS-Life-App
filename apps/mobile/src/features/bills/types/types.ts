import type { EntityId } from "@/features/tasks/types/types";
import type { DateKey } from "@/shared/lib/date";

export interface Bill {
  id: EntityId;
  name: string;
  amount: number;
  date: DateKey;
}

export interface CreateBillInput {
  name: string;
  amount: number;
  date: DateKey;
}
