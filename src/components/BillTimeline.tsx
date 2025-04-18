import { Bill } from '@/types/bill';

interface BillTimelineProps {
  bills: Bill[];
}

export default function BillTimeline({ bills }: BillTimelineProps) {
  // Get the current date
  const currentDate = new Date();
  
  // Create an array of the next 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);
    return date;
  });

  // Calculate totals for each month including recurring bills
  const monthlyTotals = months.map(targetMonth => {
    let total = 0;
    
    bills.forEach(bill => {
      const billDate = new Date(bill.date);
      
      // Check if this is a one-time bill for this month
      if (bill.frequency === 'One-time') {
        if (billDate.getMonth() === targetMonth.getMonth() && 
            billDate.getFullYear() === targetMonth.getFullYear()) {
          total += bill.amount;
        }
        return;
      }

      // For recurring bills, calculate if they fall in this month
      const monthsDiff = (targetMonth.getFullYear() - billDate.getFullYear()) * 12 + 
                        (targetMonth.getMonth() - billDate.getMonth());

      if (monthsDiff < 0) return; // Skip if bill is in the past

      switch (bill.frequency) {
        case 'Weekly':
          total += bill.amount * 4; // Approximate 4 weeks per month
          break;
        case 'Fortnightly':
          total += bill.amount * 2; // 2 fortnights per month
          break;
        case 'Monthly':
          total += bill.amount;
          break;
        case 'Quarterly':
          if (monthsDiff % 3 === 0) {
            total += bill.amount;
          }
          break;
        case 'Yearly':
          if (monthsDiff % 12 === 0) {
            total += bill.amount;
          }
          break;
      }
    });

    return total;
  });

  // Find the maximum value for scaling
  const maxValue = Math.max(...monthlyTotals, 1);

  // Function to get color based on amount
  const getBarColor = (amount: number) => {
    const ratio = amount / maxValue;
    // RGB values for gradient from green to red
    const r = Math.round(46 + (239 - 46) * ratio);  // from rgb(46, 204, 113) to rgb(239, 68, 68)
    const g = Math.round(204 - (204 - 68) * ratio);
    const b = Math.round(113 - (113 - 68) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Monthly Bill Timeline</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-12 gap-4 h-64">
          {monthlyTotals.map((total, index) => {
            const heightPercent = Math.max((total / maxValue) * 100, 0);
            
            return (
              <div key={index} className="flex flex-col h-full">
                <div className="flex-grow flex items-end">
                  <div 
                    className="w-full transition-all duration-300"
                    style={{ 
                      height: `${heightPercent}%`,
                      backgroundColor: getBarColor(total)
                    }}
                  />
                </div>
                <div className="text-xs mt-2 text-center text-gray-600">
                  {months[index].toLocaleString('default', { month: 'short' })}
                </div>
                <div className="text-xs text-center text-gray-500">
                  ${total.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 