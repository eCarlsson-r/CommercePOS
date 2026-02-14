// src/app/shared/components/stock-card/stock-card.component.ts
import { Component, input, inject, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { generateCostCode } from '@/utils/number';
import { SettingsService } from '@/services/settings.service';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './stock-card.component.html'
})
export class StockCardComponent {
  private settingsService = inject(SettingsService);
  stock = input<any>();
  onEdit = output<any>();
  generateCostCode = (price: number) => generateCostCode(price, this.settingsService);
}