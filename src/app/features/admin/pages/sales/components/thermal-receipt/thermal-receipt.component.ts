// src/app/features/sales/components/thermal-receipt/thermal-receipt.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thermal-receipt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="print-section" class="receipt-container text-xs font-mono p-4 w-[80mm] bg-white">
      <div class="text-center border-b pb-2 mb-2">
        <h2 class="text-lg font-bold italic">ZARD STORE</h2>
        <p>Jl. Store Brown No. 12, Medan</p>
      </div>

      <div class="mb-2">
        <p>Date: {{ today | date:'dd/MM/yy HH:mm' }}</p>
        <p>Cashier: {{ cashierName }}</p>
      </div>

      <div class="border-b mb-2">
        @for (item of items; track item.id) {
          <div class="flex justify-between">
            <span>{{ item.qty }}x {{ item.name }}</span>
            <span>{{ (item.qty * item.price) | currency:'IDR':'symbol':'1.0-0' }}</span>
          </div>
        }
      </div>

      <div class="flex justify-between font-bold text-sm">
        <span>TOTAL</span>
        <span>{{ total | currency:'IDR':'symbol':'1.0-0' }}</span>
      </div>

      <div class="text-center mt-4 border-t pt-2">
        <p>Thank you for shopping!</p>
      </div>
    </div>
  `,
  styles: [`
    @media screen { .receipt-container { display: none; } }
    @media print {
      body * { visibility: hidden; }
      #print-section, #print-section * { visibility: visible; }
      #print-section { position: absolute; left: 0; top: 0; width: 80mm; }
    }
  `]
})
export class ThermalReceiptComponent {
  @Input() items: any[] = [];
  @Input() total: number = 0;
  @Input() cashierName: string = 'Admin';
  today = new Date();
}