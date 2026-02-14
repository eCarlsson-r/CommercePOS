import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StockTransferPayload } from '@/models/stock-transfer.model';

@Injectable({ providedIn: 'root' })
export class StockService extends BaseApiService {

  private apiUrl = `${this.baseUrl}/stock-transfers`;

  getStocks(branchId?: number | null, categoryId?: number | null): Observable<any[]> {
    let params = new HttpParams();
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    if (categoryId) {
      params = params.set('category_id', categoryId.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/stocks`, { params });
  }

  getLowStock(branchId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    // Targets the /products/low-stock endpoint in Laravel
    return this.http.get<any[]>(`${this.baseUrl}/products/low-stock`, { params });
  }

  getMovements(branchId?: number): Observable<any[]> {
    const url = branchId 
      ? `${this.apiUrl}?branch_id=${branchId}` 
      : this.apiUrl;
      
    return this.http.get<any[]>(url);
  }

  // For the Audit View
  getStockAudit(productId: number, branchId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/stock/audit/${productId}/${branchId}`);
  }

  sendTransfer(payload: StockTransferPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  receiveTransfer(transferId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/receive`, { transfer_id: transferId });
  }

  getStockLogs(stockId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stocks/${stockId}`);
  }

  updateStock(stockId: number, data: { quantity: number, sale_price: number, purchase_price: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/stocks/${stockId}`, data);
  }
}