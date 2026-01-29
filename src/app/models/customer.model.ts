export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  points: number;
  total_spend: number;
  member_tier: 'Silver' | 'Gold' | 'Platinum';
}