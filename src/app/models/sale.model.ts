export interface ActiveSale {
  branch_id: number;
  items: CartItem[];
  customer_id: number | null;
  customer_name?: string;
  appliedPoints: number;
  subtotal: number;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id?: number;
  employee_id: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  grand_total: number;
  branch_id: number;
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