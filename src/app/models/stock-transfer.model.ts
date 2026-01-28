export interface TransferItem {
  product_id: number;
  quantity: number;
}

export interface StockTransferPayload {
  from_branch_id: number;
  to_branch_id: number;
  items: TransferItem[];
}