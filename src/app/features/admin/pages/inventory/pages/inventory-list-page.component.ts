import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { StockCardComponent } from '@/features/admin/pages/inventory/components/stock-card/stock-card.component';
import { CategoryService } from '@/services/category.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { BranchService } from '@/services/branch.service';
import { StockService } from '@/services/stock.service';
import { map, BehaviorSubject, switchMap, combineLatest } from 'rxjs';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StockCardComponent, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Inventory Assets</h1>
          <p class="text-sm text-muted-foreground">Manage and track your branch stock levels</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4">
        <div class="relative md:w-1/2 flex-1">
          <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></lucide-icon>
          <input [(ngModel)]="searchQuery" type="text" placeholder="Search by name or SKU..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none">
        </div>
        <div class="w-full md:w-1/2 flex gap-2">
          <select 
            [(ngModel)]="selectedCategory"
            class="w-full px-4 py-2 rounded-lg border border-border outline-none bg-white">
            <option [value]="0">All Categories</option>
            <option *ngFor="let c of categoryList()" [value]="c.id">{{ c.name }}</option>
          </select>
          <select 
            [(ngModel)]="selectedBranch"
            class="w-full px-4 py-2 rounded-lg border border-border outline-none bg-white">
            <option [value]="0">All Branches</option>
            <option *ngFor="let b of branchList()" [value]="b.id">{{ b.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stock of allStocks(); track stock.id) {
          <app-stock-card [stock]="stock"></app-stock-card>
        } @empty {
          @for (i of [1,2,3,4]; track $index) {
            <div class="bg-gray-50 h-48 rounded-3xl animate-pulse"></div>
          }
        }
      </div>
    </div>
  `
})
export class InventoryListPageComponent {
  private categoryService = inject(CategoryService);
  private branchService = inject(BranchService);
  private stockService = inject(StockService);
  
  categoryList = toSignal(this.categoryService.getCategories(), { initialValue: [] });
  branchList = toSignal(this.branchService.getBranches(), { initialValue: [] });
  searchQuery = signal<string>('');
  selectedBranch = signal<number>(this.branchService.selectedBranchId() || 0);
  selectedCategory = signal<number>(0);

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  private stockDataValue = toSignal(
    combineLatest([
      this.refreshTrigger,
      toObservable(this.selectedBranch),
      toObservable(this.selectedCategory)
    ]).pipe(
      switchMap(([_, branch, category]) => this.stockService.getStocks(branch || null, category || null)),
      map((res: any) => Array.isArray(res) ? res : (res?.data || []))
    ),
    { initialValue: [] }
  );

  allStocks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const data = this.stockDataValue();
    
    if (!query) return data;
    return data.filter((item: any) => 
      item.product.name.toLowerCase().includes(query) || 
      item.product.sku?.toLowerCase().includes(query) // Bonus: search by SKU too
    );
  });

  refresh() {
    this.refreshTrigger.next();
  }
}