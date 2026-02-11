import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '@/services/product.service';

@Component({
  selector: 'app-price-coder',
  templateUrl: './price-coder.component.html',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  standalone: true
})
export class PriceCoderComponent {
  private productService = inject(ProductService);
  searchQuery = '';
  searchResults = signal<any[]>([]);
  printQueue = signal<any[]>([]);

  onSearch() {
    if (this.searchQuery.length < 2) return;
    this.productService.getProducts().subscribe(all => {
      this.searchResults.set(
        all.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.sku.includes(this.searchQuery))
      );
    });
  }

  addToQueue(product: any) {
    const existing = this.printQueue().find(p => p.id === product.id);
    if (existing) {
      existing.printQty++;
    } else {
      this.printQueue.update(prev => [...prev, { ...product, printQty: 1 }]);
    }
    this.searchResults.set([]);
    this.searchQuery = '';
  }

  removeFromQueue(id: number) {
    this.printQueue.update(prev => prev.filter(p => p.id !== id));
  }

  generateLabels() {
    // Navigate to the Label Generator view with the queue data
    // Or trigger the hidden Print component
    window.print();
  }
}