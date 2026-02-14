import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { StockService } from '@/services/stock.service';
import { SettingsService } from '@/services/settings.service';
import { BranchService } from '@/services/branch.service';
import { BarcodeLabelComponent } from './components/barcode-label.component';

@Component({
  selector: 'app-price-coder',
  templateUrl: './price-coder.component.html',
  imports: [CommonModule, FormsModule, LucideAngularModule, BarcodeLabelComponent],
  standalone: true
})
export class PriceCoderComponent {
  private stockService = inject(StockService);
  private branchService = inject(BranchService);
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

  onSearch() {
    if (this.searchQuery.length < 2) return;
    this.stockService.getStocks().subscribe(all => {
      this.searchResults.set(
        all.filter(p => parseInt(p.branch_id) === this.branchService.selectedBranchId() && (p.product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.product.sku.includes(this.searchQuery)))
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