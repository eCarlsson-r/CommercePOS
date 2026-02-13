// src/app/features/inventory/components/stock-movement-drawer/stock-movement-drawer.component.ts
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@/services/product.service';
import { StockService } from '@/services/stock.service';
import { BranchService } from '@/services/branch.service';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-stock-movement-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
         (click)="onClose.emit()"></div>

    <div [class.translate-x-0]="isOpen" 
         [class.translate-x-full]="!isOpen"
         class="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out">
      
      <div class="p-6 h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-primary">Create Transfer</h2>
          <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form class="flex-1 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Branch</label>
              <select [(ngModel)]="from_branch_id" name="from_branch_id" class="w-full border p-3 rounded-xl outline-none">
                @for (b of branches(); track b.id) {
                  <option [value]="b.id">{{ b.name }}</option>
                }  
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Branch</label>
              <select [(ngModel)]="to_branch_id" name="to_branch_id" class="w-full border p-3 rounded-xl outline-none">
                @for (b of branches(); track b.id) {
                  <option [value]="b.id">{{ b.name }}</option>
                }  
              </select>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select [(ngModel)]="product_id" name="product_id" class="w-full border p-3 rounded-xl outline-none border-border focus:border-primary">
                @for (p of products(); track p.id) {
                  <option [value]="p.id">{{ p.name }}</option>
                }  
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" [(ngModel)]="quantity" name="quantity"
                class="w-16 p-2 bg-gray-50 border border-border rounded-xl text-center font-black text-primary">
            </div>  
            <button (click)="addItem()" class="text-green-400 hover:text-green-600">
              <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </form>

        <div class="space-y-2">
          @for (item of items(); track item.product_id) {
            <div class="flex items-center justify-between p-4 bg-white border border-border rounded-2xl">
              <div>
                <h5 class="font-bold text-sm">{{ item.name }}</h5>
                <p class="text-[10px] text-gray-400">Available: {{ item.max }}</p>
              </div>
              
              <div class="flex items-center gap-3">
                <input type="number" [(ngModel)]="item.quantity" name="item.quantity" [max]="item.max"
                      class="w-16 p-2 bg-gray-50 rounded-xl text-center font-black text-primary border-none">
                <button (click)="removeItem(item.product_id)" class="text-red-400 hover:text-red-600">
                  <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
          } @empty {
            <div class="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <p class="text-gray-400 text-sm">Search and add products to this transfer</p>
            </div>
          }
        </div>

        <button (click)="submitTransfer()" 
                class="w-full bg-primary text-white py-4 rounded-xl font-bold mt-auto">
          CONFIRM MOVEMENT
        </button>
      </div>
    </div>
  `
})
export class StockMovementDrawerComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private stockService = inject(StockService);
  private branchService = inject(BranchService);

  products = signal<any[]>([]);
  branches = signal<any[]>([]);

  product_id = signal<number | null>(null);
  from_branch_id = signal<number | null>(null);
  to_branch_id = signal<number | null>(null);
  quantity = signal<number | null>(null);
  items = signal<any[]>([]); // The "Cart" for this transfer

  ngOnInit() {
    this.from_branch_id.set(this.branchService.selectedBranchId() || 0);
    this.productService.getProducts().subscribe(data => this.products.set(data));
    this.branchService.getBranches().subscribe(data => this.branches.set(data));
  }

  removeItem(product_id: number) {
    this.items.update(prev => prev.filter(item => item.product_id !== product_id));
  }

  addItem() {
    const product = this.products().find(p => p.id == this.product_id());
    if (!product) return;

    // Logic: Prevent adding if the 'From' branch doesn't have enough stock
    if (product.current_stock <= 0) {
      alert('No stock available in source branch!');
      return;
    }

    this.items.update(prev => [
      ...prev,
      { 
        product_id: product.id, 
        name: product.name, 
        quantity: this.quantity() || 0, 
        max: product.current_stock // Store limit for validation
      }
    ]);
    this.quantity.set(null);
  }

  submitTransfer() {
    const payload = {
      user_id: this.authService.currentUser()?.id,
      from_branch_id: this.from_branch_id() || 0,
      to_branch_id: this.to_branch_id() || 0,
      items: this.items()
    };
    
    this.stockService.sendTransfer(payload).subscribe(() => {
      this.onClose.emit(); // Tell parent to refresh the list
    });
  }
}