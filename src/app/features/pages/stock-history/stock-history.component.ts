import { Component, inject, signal } from '@angular/core';
import { StockHistoryService, StockLog } from '@/services/stock-history.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- 1. Import this
import { ProductService } from '@/services/product.service';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-history.component.html',
})
export class StockHistoryComponent {
  private historyService = inject(StockHistoryService);
  private productService = inject(ProductService);
  private branchService = inject(BranchService);
  
  history = signal<StockLog[]>([]);
  products = signal<any[]>([]);
  branches = signal<any[]>([]);
  selectedBranchId = 1; // Default to Medan
  selectedProductId = 0;

  refreshProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products.set(data);
    });
  }

  refreshBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches.set(data);
    });
  }

  ngOnInit() {
    this.refreshProducts();
    this.refreshBranches();
  }

  loadHistory() {
    if (!this.selectedProductId) return;
    
    this.historyService.getMovement(this.selectedBranchId, this.selectedProductId)
      .subscribe(data => this.history.set(data));
  }

  getTypeClass(type: string) {
    const types: any = {
      'sale': 'bg-blue-100 text-blue-600',
      'transfer': 'bg-purple-100 text-purple-600',
      'adjustment': 'bg-orange-100 text-orange-600',
      'return': 'bg-red-100 text-red-600'
    };
    return types[type] || 'bg-gray-100 text-gray-600';
  }
}