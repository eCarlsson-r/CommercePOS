import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface EODReport {
  branch_name: string;
  total_revenue: number;
  transaction_count: number;
  payment_methods: { method: string; total: number }[];
  top_products: { name: string; qty: number }[];
  low_stock_alerts: number;
}

export interface NetworkOverview {
  total: number;
  branches: {
    id: number;
    name: string;
    revenue: number;
    transaction_count: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ReportService extends BaseApiService {
  // This fetches the data for the chart we just built
  getFinancialOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/financial-overview`);
  }

  // 2. For the Stock Matrix (Inventory)
  getInventoryMatrix(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reports/inventory-matrix`);
  }

  getStockAudit(productId: number, branchId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/stock-audit`, {
      params: { product_id: productId, branch_id: branchId }
    });
  }

  getClosingReport(branchId: number, date: string) {
    return this.http.get<EODReport>(`${this.baseUrl}/reports/daily-closing`, {
      params: { branch_id: branchId, date: date }
    });
  }
}