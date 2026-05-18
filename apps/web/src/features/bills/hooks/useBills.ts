import { useBillsStore } from "../store/useBillsStore";
import type { Bill } from "../types/types";

export interface BillView {
  key: string;
  name: string;
  amount: string;
  index: number;
}

const toBillViews = (bills: Bill[]): BillView[] =>
  bills.map((bill, index) => ({
    key: String(bill.id),
    name: bill.name,
    amount: `$${bill.amount.toFixed(0)}`,
    index,
  }));

export const useBillViews = (): BillView[] => {
  const bills = useBillsStore((state) => state.bills);
  return toBillViews(bills);
};

export const useBills = () => {
  const bills = useBillsStore((state) => state.bills);
  const addBill = useBillsStore((state) => state.addBill);

  const billViews = toBillViews(bills);

  return {
    bills,
    billViews,
    actions: {
      addBill,
    },
  };
};
