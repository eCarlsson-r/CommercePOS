import { Component, inject, signal } from '@angular/core';
import { ReturnService } from '@/services/return.service';
import { ProductService } from '@/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SupplierService } from '@/services/supplier.service';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './returns.component.html'
})
export class ReturnsComponent {
  private returnService = inject(ReturnService);
  private branchService = inject(BranchService);
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);

  // State
  activeTab = signal<'process' | 'history'>('process');
  basket = signal<any[]>([]); // Items being returned
  supplier_id = signal(0); // Usually auto-filled by user's branch
  branch_id = signal(0); // Usually auto-filled by user's branch
  reason = signal('');
  suppliers = signal<any[]>([]);
  returnHistory = signal<any[]>([]);

  ngOnInit() {
    this.supplierService.getSuppliers().subscribe(data => this.suppliers.set(data));
  }

  loadHistory() {
    this.activeTab.set('history');
    this.returnService.getReturns().subscribe((res: any) => {
      this.returnHistory.set(res.data || res);
    });
  }
  
  // Search state
  searchQuery = '';
  searchResults = signal<any[]>([]);

  searchProducts() {
    if (this.searchQuery.length < 2) return;
    this.productService.getProducts().subscribe(all => {
      this.searchResults.set(
        all.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.sku.includes(this.searchQuery))
      );
    });
  }

  addToBasket(product: any) {
    const current = this.basket();
    const existing = current.find(i => i.product_id === product.id);
    
    if (existing) {
      this.basket.update(items => items.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price } 
          : item
      ));
    } else {
      const branchId = this.branchService.selectedBranchId() ?? 1;
      const stock = product.stocks?.find((s: any) => parseInt(s.branch_id) === branchId);
      const price = stock?.purchase_price ?? product.unit_price ?? 0;

      this.basket.update(items => [...items, {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unit_price: price,
        total_price: price,
        condition: 'good'
      }]);
    }
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  submit() {
    const payload = {
      supplier_id: this.supplier_id(),
      branch_id: this.branchService.selectedBranchId() ?? 1,
      reason: this.reason(),
      total_amount: this.basket().reduce((acc: number, item: any) => acc + item.quantity * item.unit_price, 0),
      items: this.basket()
    };

    this.returnService.processReturn(payload).subscribe(() => {
      alert('Inventory Updated: Stock adjusted or Waste recorded.');
      this.basket.set([]);
      this.reason.set('');
    });
  }
}