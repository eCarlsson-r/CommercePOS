import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'; // Important import
import { BranchService } from '@/services/branch.service';
import { ProductService } from '@/services/product.service';
import { SaleService } from '@/services/sale.service';
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

  // 1. Convert the Observable to a Signal with a default empty array
  products = toSignal(toObservable(this.branchService.selectedBranch).pipe(
      switchMap(branch => this.productService.getProducts(branch?.id))
    ), { initialValue: [] });

  // Reactive calculation: Total Value = Sum of (Stock * Price)
  totalInventoryValue = computed(() => {
    if (this.products().length > 0) return this.products().reduce((acc, p) => 
      acc + (p.quantity * p.purchase_price), 0
    );
    return 0;
  });

  // Reactive count of low stock items
  lowStockCount = computed(() => 
    (this.products().length > 0) ? this.products().filter(p => p.quantity < 10).length : []
  );
  
  // You can add more signals for Today's Sales from SaleService
  // Count of sales fetched
  salesCount = computed(() => this.saleService.recentSales().length);
  // Total money earned today
  todayRevenue = this.saleService.todayRevenue;
}