import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stock-card.component.html'
})

export class StockCardComponent {
  @Input() product: any = {
    name: 'Sample Item',
    price: 150000,
    stock: 5,
    min_stock: 10,
    image: null
  };

  // FIX: Added the missing array for the table
  stockLogs: any[] = [
    { date: new Date(), type: 'Stock In', quantity: 10, note: 'Initial Stock' }
  ];

  // FIX: Added the missing method for the button
  exportToPdf() {
    console.log('Exporting stock card to PDF...');
    // We can implement actual PDF logic later using jspdf
    window.print(); 
  }

  get isLowStock() {
    return this.product.stock <= this.product.min_stock;
  }
}