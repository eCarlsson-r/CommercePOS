// src/app/features/dashboard/components/stock-alert.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '@/services/stock.service';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stock-alert',
  standalone: true,
  templateUrl: './stock-alert.component.html',
  imports: [CommonModule, LucideAngularModule, TranslateModule]
})
export class StockAlertComponent {
  private stockService = inject(StockService);

  // Automatic reactive filter: only items with stock < 10
  lowStockItems = toSignal(
    this.stockService.getLowStock(), 
    { initialValue: [] }
  );
}