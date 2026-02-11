import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'; // Important import
import { BranchService } from '@/services/branch.service';
import { ProductService } from '@/services/product.service';
import { SaleService } from '@/services/sale.service';
import { StockService } from '@/services/stock.service';
import { ReturnService } from '@/services/return.service';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular'; // <--- Import this
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  templateUrl: './stats-grid.component.html',
  imports: [CurrencyPipe, LucideAngularModule]
})

export class StatsGridComponent {
  private branchService = inject(BranchService);
  private productService = inject(ProductService);
  private saleService = inject(SaleService);
  private stockService = inject(StockService);
  private returnService = inject(ReturnService);

  // 1. Convert the Observable to a Signal with a default empty array
  products = toSignal(toObservable(this.branchService.selectedBranch).pipe(
      switchMap(branch => this.productService.getProducts(branch?.id))
    ), { initialValue: [] });

  transfers = toSignal(this.stockService.getMovements(), { initialValue: [] });
  returns = toSignal(this.returnService.getReturns(), { initialValue: [] });

  // Reactive count of low stock items
  lowStockCount = computed(() => 
    (this.products().length > 0) ? this.products().filter(p => p.quantity < 10).length : 0
  );
  
  // Count of sales fetched
  salesCount = computed(() => this.saleService.recentSales().length);
  // Total money earned today
  todayRevenue = this.saleService.todayRevenue;

  pendingTransfers = computed(() => {
    const transfers = this.transfers();
    if (transfers.length > 0) return transfers.filter(t => t && t.status === 'M').length;
    return 0;
  });

  // Reactive calculation: Total Value = Sum of (Stock * Price)
  dailyWaste = computed(() => {
    return (this.returns()) ? this.returns().reduce((acc, p) => 
      acc + (p.quantity || 0 * p.purchase_price), 0
    ) : 0;
  });
}