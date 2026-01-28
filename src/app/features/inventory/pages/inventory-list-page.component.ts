// src/app/features/inventory/pages/inventory-list-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { StockCardComponent } from '@/features/inventory/components/stock-card/stock-card.component';

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
        <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
          Add Product
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></lucide-icon>
          <input type="text" placeholder="Search by name or SKU..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none">
        </div>
        <select class="px-4 py-2 rounded-lg border border-border outline-none bg-white">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Furniture</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (i of [1,2,3,4,5,6,7,8]; track i) {
          <app-stock-card></app-stock-card>
        }
      </div>
    </div>
  `
})
export class InventoryListPageComponent {}