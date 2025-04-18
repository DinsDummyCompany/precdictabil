'use client';

import { useState } from 'react';
import BillCard from '@/components/BillCard';
import BillForm from '@/components/BillForm';
import BillTimeline from '@/components/BillTimeline';
import { Bill } from '@/types/bill';
import { useBillStore } from '@/store/billStore';

export default function Home() {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const { bills, addBill, updateBill, deleteBill } = useBillStore();

  const handleAddBill = (newBill: Omit<Bill, 'id'>) => {
    addBill(newBill);
  };

  const handleDeleteBill = (id: string) => {
    deleteBill(id);
  };

  const handleEditBill = (updatedBill: Bill) => {
    updateBill(updatedBill);
    setEditingBill(null);
  };

  const startEditing = (bill: Bill) => {
    setEditingBill(bill);
  };

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          PredictaBill
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <BillForm 
              onSubmit={handleAddBill} 
              editingBill={editingBill}
              onEdit={handleEditBill}
            />
          </div>
          <div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Your Bills</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                {bills.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No bills added yet. Add your first bill to get started!
                  </p>
                ) : (
                  bills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onDelete={handleDeleteBill}
                      onEdit={() => startEditing(bill)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <BillTimeline bills={bills} />
      </div>
    </main>
  );
}
