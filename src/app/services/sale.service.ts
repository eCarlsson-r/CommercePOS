// src/app/services/sale.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { BaseApiService } from '@/services/base-api.service';
import { Sale } from '@/models/sale.model';
import { BranchService } from '@/services/branch.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseApiService {
  private branchService = inject(BranchService);
  // Signals for state management
  recentSales = signal<Sale[]>([]);
  incomingOrders = signal<any[]>([]);
  loading = signal<boolean>(false);

  // Computed signal to calculate total revenue from recent sales
  todayRevenue = computed(() => 
    this.recentSales().reduce((acc, sale) => acc + Number(sale.grand_total), 0)
  );

  /**
   * Fetch the most recent sales for the dashboard
   */
  fetchRecentSales() {
    this.loading.set(true);
    return this.http.get<Sale[]>(`${this.baseUrl}/sales/recent`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.recentSales.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  getDashboardStats(branchId?: number) {
    const params = branchId ? { headers: this.getHeaders(), params: { branch_id: branchId.toString() } } : { headers: this.getHeaders() };
    return this.http.get<any>(`${this.baseUrl}/sales/stats`, params);
  }

  /**
   * Process a new POS transaction (Split Payments)
   */
  createSale(saleData: any) {
    return this.http.post<Sale>(`${this.baseUrl}/sales`, saleData, { headers: this.getHeaders() });
  }

  // Listening for new e-commerce orders via Polling or WebSockets
  fetchOnlineOrders() {
    const branchId = this.branchService.selectedBranchId();
    this.http.get<any[]>(`${this.baseUrl}/orders?branch_id=${branchId}`, { headers: this.getHeaders() })
      .subscribe(orders => this.incomingOrders.set(orders));
  }
}