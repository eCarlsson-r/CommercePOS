import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@/models/product.model';
import { BaseApiService } from './base-api.service';

export interface StockTransferPayload {
  from_branch_id: number;
  to_branch_id: number;
  items: { product_id: number; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class StockService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/stock-transfers`;

  getLowStock(branchId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    // Targets the /products/low-stock endpoint in Laravel
    return this.http.get<Product[]>(`${this.baseUrl}/products/low-stock`, { params });
  }

  getMovements(branchId?: number): Observable<any[]> {
    const url = branchId 
      ? `${this.apiUrl}?branch_id=${branchId}` 
      : this.apiUrl;
      
    return this.http.get<any[]>(url);
  }

  sendTransfer(payload: StockTransferPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  receiveTransfer(transferId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/receive`, { transfer_id: transferId });
  }
}