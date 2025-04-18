import { useState, useEffect } from 'react';
import { Bill, categories, frequencies } from '@/types/bill';

interface BillFormProps {
  onSubmit: (bill: Omit<Bill, 'id'>) => void;
  onEdit?: (bill: Bill) => void;
  editingBill: Bill | null;
}

interface FormErrors {
  name?: string;
  amount?: string;
  date?: string;
  category?: string;
  frequency?: string;
}

export default function BillForm({ onSubmit, onEdit, editingBill }: BillFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    category: categories[0],
    frequency: frequencies[2], // Default to Monthly
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Update form when editing bill changes
  useEffect(() => {
    if (editingBill) {
      setFormData({
        name: editingBill.name,
        amount: editingBill.amount.toString(),
        date: editingBill.date,
        category: editingBill.category,
        frequency: editingBill.frequency,
      });
    }
  }, [editingBill]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (isNaN(Date.parse(formData.date))) {
      newErrors.date = 'Please enter a valid date';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const billData = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      frequency: formData.frequency,
    };

    if (editingBill && onEdit) {
      onEdit({
        ...editingBill,
        ...billData,
      });
    } else {
      onSubmit(billData);
    }

    // Reset form
    setFormData({
      name: '',
      amount: '',
      date: '',
      category: categories[0],
      frequency: frequencies[2],
    });
    setErrors({});
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          {editingBill ? 'Edit Bill' : 'Add New Bill'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200`}
              required
              placeholder="Enter bill name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full pl-8 pr-4 py-2 rounded-md border ${
                  errors.amount ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200`}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.date ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200`}
              required
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof categories[number] })}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.category ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as typeof frequencies[number] })}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.frequency ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200`}
            >
              {frequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
            {errors.frequency && <p className="mt-1 text-sm text-red-500">{errors.frequency}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-4 rounded-md hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {editingBill ? 'Save Changes' : 'Add Bill'}
        </button>
      </form>
    </div>
  );
} 