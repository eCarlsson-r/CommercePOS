import { Component, inject, signal } from '@angular/core';
import { ReturnService } from '@/services/return.service';
import { ProductService } from '@/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SupplierService } from '@/services/supplier.service';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './returns.component.html'
})
export class ReturnsComponent {
  private returnService = inject(ReturnService);
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);

  // State
  activeTab = signal<'process' | 'history'>('process');
  basket = signal<any[]>([]); // Items being returned
  supplier_id = signal(1); // Usually auto-filled by user's branch
  reason = signal('');
  suppliers = signal<any[]>([]);
  returnHistory = signal<any[]>([]);

  ngOnInit() {
    this.supplierService.getSuppliers().subscribe(data => this.suppliers.set(data));
  }

  loadHistory() {
    this.activeTab.set('history');
    this.returnService.getReturns().subscribe(data => this.returnHistory.set(data));
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
      existing.quantity++;
    } else {
      this.basket.set([...current, {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        condition: 'good' // Default to restocking
      }]);
    }
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  submit() {
    const payload = {
      supplier_id: this.supplier_id(),
      reason: this.reason(),
      items: this.basket()
    };

    this.returnService.processReturn(payload).subscribe(() => {
      alert('Inventory Updated: Stock adjusted or Waste recorded.');
      this.basket.set([]);
      this.reason.set('');
    });
  }
}