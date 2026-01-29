import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '@/models/product.model';

export interface StockTransferPayload {
  from_branch_id: number;
  to_branch_id: number;
  items: { product_id: number; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stock-transfers`;

  getLowStock(branchId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    // Targets the /products/low-stock endpoint in Laravel
    return this.http.get<Product[]>(`${environment.apiUrl}/products/low-stock`, { params });
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