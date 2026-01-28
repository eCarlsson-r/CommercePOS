export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  sale_price: number;
  purchase_price: number;
  quantity: number; // Current Stock
  min_stock: number;
  image_url?: string;
  category_id?: number;
}