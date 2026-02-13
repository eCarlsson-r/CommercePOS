import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '@/services/product.service';
import { PurchaseService } from '@/services/purchase.service';
import { BranchService } from '@/services/branch.service';
import { SupplierService } from '@/services/supplier.service';
import { PurchaseReceiptComponent } from '../../components/purchase-receipt/purchase-receipt.component';

interface POItem {
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
}

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PurchaseReceiptComponent],
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
  purchaseOrders = signal<any[]>([]); // This holds your list data
  showDrawer = signal(false);
  showReceiptModal = signal(false);
  selectedPurchaseOrder = signal<any>(null);
  poItems = signal<POItem[]>([]);
  isSubmitting = signal(false);
  orderDate = signal<Date | null>(null);
  expectedDate = signal<Date | null>(null);
  
  // For the product search dropdown
  availableProducts = signal<any[]>([]);  
  availableSuppliers = signal<any[]>([]);
  availableBranches = signal<any[]>([]);
  searchTerm = '';
  searchResults = signal<any[]>([]);
  
  searchProducts() {
    if (this.searchTerm.length < 2) return;
    this.productService.getProducts().subscribe(all => {
      this.searchResults.set(
        all.filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.sku.includes(this.searchTerm))
      );
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadSuppliers();
    this.loadBranches();
    this.loadPurchases();
  }

  createNewPO() {
    this.showDrawer.set(true);
  }

  viewReceipt(po: any) {
    this.selectedPurchaseOrder.set(po);
    this.showReceiptModal.set(true);
  }

  cancelCreation() {
    this.showDrawer.set(false);
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

  loadPurchases() {
    this.purchaseService.getPurchaseOrders().subscribe(data => this.purchaseOrders.set(data));
  }

  addToBasket(product: any) {
    const existing = this.poItems().find(p => p.product_id === product.id);
    if (existing) {
      this.poItems.update(items => items.map(item => 
        item.product_id === product.id ? { ...item, quantity: item.quantity + 1, total_price: item.unit_price * (item.quantity + 1) } : item
      ));
    } else {
      this.poItems.update(items => [...items, {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unit_price: product.unit_price || 0,
        total_price: product.unit_price || 0 
      }]);
    }
    this.searchResults.set([]);
    this.searchTerm = '';
  }

  updateItem(productId: number, changes: Partial<POItem>) {
    this.poItems.update(items => items.map(item => 
      item.product_id === productId ? { ...item, ...changes } : item
    ));
  }

  removeItem(index: number) {
    this.poItems.update(items => items.filter((_, i) => i !== index));
  }

  grandTotal = computed(() => {
    return this.poItems().reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  });

  submitPO() {
    if (this.poItems().length === 0) return;

    this.isSubmitting.set(true);
    const payload = {
      supplier_id: this.selectedSupplierId(),
      branch_id: this.selectedBranchId(),
      order_date: this.orderDate(),
      expected_date: this.expectedDate(),
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