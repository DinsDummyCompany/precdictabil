import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bill } from '@/types/bill';

// Validation functions
const validateBill = (bill: Omit<Bill, 'id'>): boolean => {
  if (!bill.name || bill.name.length > 100) return false;
  if (typeof bill.amount !== 'number' || bill.amount < 0) return false;
  if (!bill.date || isNaN(Date.parse(bill.date))) return false;
  if (!bill.category || !bill.frequency) return false;
  return true;
};

// Maximum number of bills to prevent excessive storage
const MAX_BILLS = 1000;

interface BillStore {
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
}

export const useBillStore = create<BillStore>()(
  persist(
    (set) => ({
      bills: [],
      addBill: (newBill) =>
        set((state) => {
          if (!validateBill(newBill)) {
            console.error('Invalid bill data');
            return state;
          }
          if (state.bills.length >= MAX_BILLS) {
            console.error('Maximum number of bills reached');
            return state;
          }
          return {
            bills: [
              ...state.bills,
              {
                ...newBill,
                id: Date.now().toString(),
              },
            ],
          };
        }),
      updateBill: (updatedBill) =>
        set((state) => {
          if (!validateBill(updatedBill)) {
            console.error('Invalid bill data');
            return state;
          }
          return {
            bills: state.bills.map((bill) =>
              bill.id === updatedBill.id ? updatedBill : bill
            ),
          };
        }),
      deleteBill: (id) =>
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        })),
    }),
    {
      name: 'bill-storage',
      // Add version to handle future migrations
      version: 1,
    }
  )
); 