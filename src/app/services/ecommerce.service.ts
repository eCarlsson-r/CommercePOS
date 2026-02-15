import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class EcommerceService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/orders`;

  // Signal for real-time notification badge (e.g., "3 New Orders")
  newOrdersCount = signal(0);

  /**
   * Fetch orders based on status (new, processing, shipped, completed)
   * Also filters by branch if the user is not a Super Admin.
   */
  getOrders(status: string, branchId?: number): Observable<any[]> {
    let params = new HttpParams().set('status', status);
    if (branchId) params = params.set('branch_id', branchId.toString());

    return this.http.get<any[]>(`${this.apiUrl}`, { params });
  }

  /**
   * Update order status (e.g., from 'new' to 'processing')
   * This triggers the stock deduction logic in Laravel.
   */
  updateStatus(orderId: number, payload?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}`, payload);
  }
  
  /**
   * Polling method to check for new orders every 2 minutes
   */
  checkNewOrders() {
    this.getOrders('new').subscribe(orders => {
      this.newOrdersCount.set(orders.length);
    });
  }
}