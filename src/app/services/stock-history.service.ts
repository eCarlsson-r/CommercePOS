// src/app/services/stock-history.service.ts
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

export interface StockLog {
  id: number;
  reference_id: string;
  type: string;
  description: string;
  quantity_change: number;
  balance_after: number;
  created_at: string;
  user: { name: string };
}

@Injectable({ providedIn: 'root' })
export class StockHistoryService extends BaseApiService {
  getMovement(branchId: number, productId: number) {
    return this.http.get<StockLog[]>(`${this.baseUrl}/stocks/history`, {
      params: { branch_id: branchId, product_id: productId }
    });
  }
}