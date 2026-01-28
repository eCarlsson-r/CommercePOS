// src/app/features/inventory/components/stock-movement-drawer/stock-movement-drawer.component.ts
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@/services/product.service';
import { StockService } from '@/services/stock.service';
import { BranchService } from '@/services/branch.service';
import { StockTransferPayload, TransferItem } from '@/models/stock-transfer.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-stock-movement-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
         (click)="onClose.emit()"></div>

    <div [class.translate-x-0]="isOpen" 
         [class.translate-x-full]="!isOpen"
         class="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out">
      
      <div class="p-6 h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-store-brown">Create Transfer</h2>
          <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form [formGroup]="transferForm" class="flex-1 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select formControlName="product_id" class="w-full border p-3 rounded-xl outline-none border-border focus:border-store-brown">
              <option *ngFor="let p of products" [value]="p.id">{{ p.name }} (Stock: {{ p.quantity }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Branch</label>
              <input type="text" disabled value="Medan Main" class="w-full border p-3 rounded-xl bg-gray-50 text-gray-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Branch</label>
              <select formControlName="to_branch_id" class="w-full border p-3 rounded-xl outline-none">
                <option value="2">Binjai Store</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantity to Move</label>
            <input formControlName="quantity" type="number" class="w-full border p-3 rounded-xl outline-none">
          </div>
        </form>

        <button (click)="submitTransfer()" 
                class="w-full bg-store-brown text-white py-4 rounded-xl font-bold mt-auto">
          CONFIRM MOVEMENT
        </button>
      </div>
    </div>
  `
})
export class StockMovementDrawerComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private stockService = inject(StockService);
  private branchService = inject(BranchService);

  products = toSignal(toObservable(this.branchService.selectedBranch).pipe(
        switchMap(branch => this.productService.getProducts(branch?.id))
      ), { initialValue: [] })();

  // For the selection form
  transferForm = this.fb.group({
    product_id: [null, Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    to_branch_id: [null, Validators.required]
  });

  // The "Basket" of items
  itemsInBasket: { product_id: number; quantity: number; name: string }[] = [];

  addItem() {
    if (this.transferForm.invalid) return;

    const { product_id, quantity } = this.transferForm.value;
    const product = toSignal(this.productService.getProductById(Number(product_id)))();

    if (product) {
      this.itemsInBasket.push({
        product_id: product.id,
        quantity: Number(quantity),
        name: product.name
      });
      // Reset only product and quantity, keep the target branch
      this.transferForm.patchValue({ product_id: null, quantity: null });
    }
  }

  submitTransfer() {
    if (this.itemsInBasket.length === 0) return;

    const payload: StockTransferPayload = {
      from_branch_id: this.branchService.selectedBranch()?.id!,
      to_branch_id: Number(this.transferForm.value.to_branch_id),
      items: this.itemsInBasket.map(({product_id, quantity}) => ({product_id, quantity}))
    };

    this.stockService.sendTransfer(payload).subscribe(() => {
      this.itemsInBasket = [];
      this.onClose.emit();
      // This will trigger your Laravel store() and send the WebPush
    });
  }
}