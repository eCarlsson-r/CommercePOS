import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { StockCardComponent } from '@/features/pages/inventory/components/stock-card/stock-card.component';
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
          <app-stock-card [stock]="stock" (onEdit)="openQuickEdit($event)"></app-stock-card>
        } @empty {
          @for (i of [1,2,3,4]; track $index) {
            <div class="bg-gray-50 h-48 rounded-3xl animate-pulse"></div>
          }
        }
      </div>

      <div *ngIf="editingStock()" class="fixed inset-0 z-100 flex justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" (click)="editingStock.set(null)"></div>
        
        <div class="relative w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right">
          <header class="flex justify-between items-center mb-10">
            <div>
              <h2 class="text-xl font-black uppercase text-gray-900">Quick Update</h2>
              <p class="text-xs text-gray-400 font-bold uppercase">{{ editingStock()?.product?.sku }}</p>
            </div>
            <button (click)="editingStock.set(null)" class="text-gray-400 hover:text-red-500 transition-colors">
              <lucide-icon name="x"></lucide-icon>
            </button>
          </header>

          <div class="flex gap-4 border-b border-gray-100 mb-6">
            <button (click)="activeTab.set('update')" 
              [class]="activeTab() === 'update' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'"
              class="pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all">
              Update Stock
            </button>
            <button (click)="activeTab.set('history')" 
              [class]="activeTab() === 'history' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'"
              class="pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all">
              History Log
            </button>
          </div>

          <div *ngIf="activeTab() === 'update'" class="space-y-6 animate-in fade-in">
            <div class="p-6 bg-gray-50 rounded-4xl border border-border">
              <label class="text-[10px] font-black text-gray-400 uppercase mb-3 block">Manual Stock Adjust</label>
              <div class="flex items-center gap-6">
                <input type="number" [(ngModel)]="editForm.quantity" 
                      class="w-full p-4 text-2xl font-black bg-white rounded-2xl border-none text-primary text-center">
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-gray-400 uppercase mb-2 block">New Sale Price (Rp)</label>
                <input type="number" [(ngModel)]="editForm.sale_price" 
                      class="w-full p-4 bg-gray-50 rounded-2xl border-none font-black text-gray-800">
              </div>
              <div>
                <label class="text-[10px] font-black text-gray-400 uppercase mb-2 block">Purchase Cost (Rp)</label>
                <input type="number" [(ngModel)]="editForm.purchase_price" 
                      class="w-full p-4 bg-gray-50 rounded-2xl border-none font-black text-gray-800">
              </div>
            </div>

            <button (click)="saveQuickEdit()" 
                    class="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Save Changes
            </button>
          </div>

          <div *ngIf="activeTab() === 'history'" class="space-y-4 animate-in slide-in-from-bottom-2">
            @for (log of stockLogs(); track log.id) {
              <div class="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
                <div class="flex gap-4 items-center">
                  <div [ngClass]="{
                    'bg-green-100 text-green-600': log.type === 'purchase',
                    'bg-red-100 text-red-600': log.type === 'sale',
                    'bg-blue-100 text-blue-600': log.type === 'transfer',
                    'bg-yellow-100 text-yellow-600': log.type === 'adjustment'
                  }" class="p-2 rounded-xl">
                    <lucide-icon [name]="log.type === 'purchase' ? 'plus' : (log.type === 'sale' ? 'minus' : (log.type === 'transfer' ? 'truck' : 'settings'))" class="w-4 h-4"></lucide-icon>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-800">{{ log.description }}</p>
                    <p class="text-[9px] text-gray-400 font-bold uppercase">{{ log.user_name }} • {{ log.created_at | date:'short' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-black" [class]="log.change > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ log.change > 0 ? '+' : '' }}{{ log.change }}
                  </p>
                  <p class="text-[8px] text-gray-300 font-bold">BAL: {{ log.balance_after }}</p>
                </div>
              </div>
            } @empty {
              <div class="text-center py-20 opacity-20">
                <lucide-icon name="history" class="w-12 h-12 mx-auto mb-2"></lucide-icon>
                <p class="text-xs font-black uppercase">No history found</p>
              </div>
            }
          </div>
        </div>
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
  editingStock = signal<any>(null);
  editForm = { quantity: 0, sale_price: 0, purchase_price: 0 };
  activeTab = signal<'update' | 'history'>('update');
  stockLogs = signal<any[]>([]);

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

  openQuickEdit(stock: any) {
    this.activeTab.set('update');
    this.editingStock.set(stock);
    this.editForm = {
      quantity: stock.quantity,
      sale_price: stock.sale_price,
      purchase_price: stock.purchase_price
    };

    this.stockService.getStockLogs(stock.id).subscribe(logs => {
      this.stockLogs.set(logs);
    });
  }

  saveQuickEdit() {
    const stockId = this.editingStock().id;
    this.stockService.updateStock(stockId, {
      quantity: this.editForm.quantity,
      sale_price: this.editForm.sale_price,
      purchase_price: this.editForm.purchase_price
    }).subscribe(() => {
      this.refresh(); // Refresh the list
      this.editingStock.set(null); // Close drawer
    });
  }
}