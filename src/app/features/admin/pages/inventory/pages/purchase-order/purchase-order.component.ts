import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '@/services/product.service';
import { PurchaseService } from '@/services/purchase.service';
import { BranchService } from '@/services/branch.service';
import { SupplierService } from '@/services/supplier.service';

interface POItem {
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  cost_price: number;
}

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent {
  private productService = inject(ProductService);
  private purchaseService = inject(PurchaseService);
  private branchService = inject(BranchService);
  private supplierService = inject(SupplierService);

  // State
  selectedSupplierId = signal<number>(0); // Default to Medan Warehouse
  selectedBranchId = signal<number>(1); // Default to Medan Warehouse
  poItems = signal<POItem[]>([]);
  isSubmitting = signal(false);
  
  // For the product search dropdown
  availableProducts = signal<any[]>([]);  
  availableSuppliers = signal<any[]>([]);
  availableBranches = signal<any[]>([]);
  searchTerm = '';

  ngOnInit() {
    this.loadProducts();
    this.loadSuppliers();
    this.loadBranches();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.availableProducts.set(data));
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => this.availableSuppliers.set(data));
  }

  loadBranches() {
    this.branchService.getBranches().subscribe(data => this.availableBranches.set(data));
  }

  addItem(product: any) {
    const existing = this.poItems().find(p => p.product_id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.poItems.update(items => [...items, {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        cost_price: product.base_price // Default to base price, user can edit
      }]);
    }
  }

  removeItem(index: number) {
    this.poItems.update(items => items.filter((_, i) => i !== index));
  }

  grandTotal = computed(() => {
    return this.poItems().reduce((acc, item) => acc + (item.quantity * item.cost_price), 0);
  });

  submitPO() {
    if (this.poItems().length === 0) return;

    this.isSubmitting.set(true);
    const payload = {
      supplier_id: this.selectedSupplierId(),
      branch_id: this.selectedBranchId(),
      items: this.poItems(),
      total_amount: this.grandTotal()
    };

    this.purchaseService.createPurchase(payload).subscribe({
      next: () => {
        alert('Stock received and added to branch inventory!');
        this.poItems.set([]); // Reset form
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      }
    });
  }
}