import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  min_stock_alert: number;
  category_id: number;
  category?: Category;
  images?: ProductImage[];
  stocks?: ProductStock[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
}

export interface ProductStock {
  id: number;
  product_id: number;
  branch_id: number;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  min_stock_level: number;
}
