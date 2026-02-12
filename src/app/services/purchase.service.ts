import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class PurchaseService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/purchases`;

  createPurchase(data: {
    supplier_id: number;
    branch_id: number;
    items: { product_id: number; quantity: number; unit_price: number }[];
  }) {
    return this.http.post(this.apiUrl, data);
  }

  getPurchaseOrders() {
    return this.http.get<any[]>(this.apiUrl);
  }
}