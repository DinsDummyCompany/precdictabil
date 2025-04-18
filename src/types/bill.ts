export type Bill = {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: typeof categories[number];
  frequency: typeof frequencies[number];
};

export const categories = [
  'Power',
  'Water',
  'Gas',
  'Rent',
  'Insurance',
  'Health Insurance',
  'Internet',
  'Streaming Subscription',
  'Gym',
  'Subscriptions',
  'Loans',
  'Other'
] as const;

export const frequencies = [
  'Weekly',
  'Fortnightly',
  'Monthly',
  'Quarterly',
  'Yearly',
  'One-time'
] as const;

export type BillFrequency = typeof frequencies[number]; 