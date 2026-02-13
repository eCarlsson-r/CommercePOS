import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { EODReport, NetworkOverview } from '@/models/report.model';

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

  getSupplierPerformance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reports/supplier-performance`);
  }

  getBranchDailySummary(branchId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/daily-summary/${branchId}`);
  }

  getClosingReport(branchId: number, date: string): Observable<EODReport> {
    return this.http.get<EODReport>(`${this.baseUrl}/reports/daily-closing`, {
      params: { branch_id: branchId, date: date }
    });
  }

  getSalesReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/sales-report`, {
      params: { start_date: startDate, end_date: endDate }
    });
  }
}