export interface EODReport {
  branch_name: string;
  total_revenue: number;
  transaction_count: number;
  payment_methods: { method: string; total: number }[];
  top_products: { name: string; qty: number }[];
  low_stock_alerts: number;
}

export interface NetworkOverview {
  total: number;
  branches: {
    id: number;
    name: string;
    revenue: number;
    transaction_count: number;
  }[];
}
