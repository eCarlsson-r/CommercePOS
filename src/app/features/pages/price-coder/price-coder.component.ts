import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '@/services/product.service';
import { SettingsService } from '@/services/settings.service';

@Component({
  selector: 'app-price-coder',
  templateUrl: './price-coder.component.html',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  standalone: true
})
export class PriceCoderComponent {
  private productService = inject(ProductService);
  private settingsService = inject(SettingsService);
  searchQuery = '';
  searchResults = signal<any[]>([]);
  printQueue = signal<any[]>([]);
  isSettingsOpen = signal(false);
  tempKey = signal(''); // Bound to input

  updateKey() {
    if (this.tempKey().length !== 10) {
      return alert('Key must be exactly 10 characters.');
    }
  
    this.settingsService.updateSetting('cost_cipher_key', this.tempKey().toUpperCase())
      .subscribe(() => {
        this.isSettingsOpen.set(false);
        alert('Key updated successfully.');
      });
  }

  ngOnInit() {
    this.settingsService.loadSettings();
    this.tempKey.set(this.settingsService.getCipherKey());
  }

  generateCostCode(price: number): string {
    const key = this.settingsService.getCipherKey();
    // Map digits to the 10-letter key
    return price.toString().split('').map(digit => {
      const index = parseInt(digit);
      // If 0, it's the 10th letter (index 9), otherwise index digit-1
      return key[index === 0 ? 9 : index - 1];
    }).join('');
  }

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