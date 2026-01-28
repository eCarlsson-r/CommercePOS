// src/app/features/dashboard/components/stock-alert.component.ts
import { Component, computed, inject } from '@angular/core';
import { ProductService } from '@/services/product.service';
import { LucideAngularModule } from 'lucide-angular'; // <--- Import this
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-stock-alert',
  standalone: true,
  templateUrl: './stock-alert.component.html',
  imports: [LucideAngularModule]
})
export class StockAlertComponent {
  private productService = inject(ProductService);

  // Automatic reactive filter: only items with stock < 10
  lowStockItems = toSignal(
    this.productService.getLowStock(), 
    { initialValue: [] }
  );

  onOrder(productId: number) {
    // Navigate to Procurement with product pre-selected
    console.log('Redirecting to PO for product:', productId);
  }
}