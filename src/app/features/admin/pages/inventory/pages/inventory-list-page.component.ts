// src/app/features/inventory/pages/inventory-list-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { StockCardComponent } from '@/features/admin/pages/inventory/components/stock-card/stock-card.component';
import { CategoryService } from '@/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BranchService } from '@/services/branch.service';
import { StockService } from '@/services/stock.service';
import { map, startWith, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StockCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Inventory Assets</h1>
          <p class="text-sm text-muted-foreground">Manage and track your branch stock levels</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></lucide-icon>
          <input type="text" placeholder="Search by name or SKU..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none">
        </div>
        <select class="px-4 py-2 rounded-lg border border-border outline-none bg-white">
          <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (move of allMovements(); track move.id) {
          <app-stock-card [move]="move"></app-stock-card>
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
  
  categories = toSignal(this.categoryService.getCategories())();
  branches = toSignal(this.branchService.getBranches())();
  
  private refreshTrigger = new Subject<void>();

  allMovements = toSignal(
    this.refreshTrigger.pipe(
      startWith(null),
      switchMap(() => this.stockService.getMovements()),
      map((res: any) => {
        return Array.isArray(res) ? res : (res?.data || []);
      })
    ),
    { initialValue: [] }
  );
}