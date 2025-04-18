import { Bill } from '@/types/bill';

interface BillCardProps {
  bill: Bill;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export default function BillCard({ bill, onDelete, onEdit }: BillCardProps) {
  return (
    <div className="bg-gray-700 rounded-lg shadow-md p-6 mb-4 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{bill.name}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-200">
              {bill.frequency}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-gray-300 flex items-center gap-2">
              <span className="w-20 text-sm text-gray-400">Category:</span>
              <span className="font-medium text-white">{bill.category}</span>
            </p>
            <p className="text-gray-300 flex items-center gap-2">
              <span className="w-20 text-sm text-gray-400">Date:</span>
              <span className="font-medium text-white">{new Date(bill.date).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-2xl font-bold text-white mb-4">
            ${bill.amount.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-md bg-blue-900 text-blue-200 hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(bill.id)}
              className="px-4 py-2 rounded-md bg-gray-600 text-gray-200 hover:bg-red-900 hover:text-red-200 transition-colors duration-200 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 