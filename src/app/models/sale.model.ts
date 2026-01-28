export interface Sale {
  id: number;
  invoice_number: string;
  customer_id?: number;
  employee_id: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  grand_total: number;
  created_at: string;
  
  // Relations
  items?: SaleItem[];
  payments?: SalePayment[];
}

export interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SalePayment {
  payment_method: string;
  amount_paid: number;
  bank_name?: string;
}