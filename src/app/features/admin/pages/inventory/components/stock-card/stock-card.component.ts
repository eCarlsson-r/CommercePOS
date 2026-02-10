// src/app/shared/components/stock-card/stock-card.component.ts
import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './stock-card.component.html'
})
export class StockCardComponent {
  move = input<any>(); // Signal-based input
}