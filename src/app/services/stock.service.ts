import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StockTransferPayload {
  from_branch_id: number;
  to_branch_id: number;
  items: { product_id: number; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stock-transfers`;

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