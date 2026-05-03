// src/app/features/sales/components/thermal-receipt/thermal-receipt.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-thermal-receipt',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div id="print-section" class="receipt-container text-xs font-mono p-4 w-[80mm] bg-white">
      <div class="text-center border-b pb-2 mb-2">
        <img src="/logo-full.png" alt="Logo" class="h-12 mx-auto mb-2" />
        <p class="uppercase">{{ branch.name }}</p>
        <p class="text-[9px]">{{ branch.address }}</p>
        <p class="text-[9px]">TELP: {{ branch.phone }}</p>
      </div>

      <div class="flex justify-between mb-1">
        <span>INV: {{ invoiceNo }}</span>
        <span>{{ today | date:'dd/MM/yy HH:mm' }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span>{{ 'receipt.cashier' | translate }}: {{ cashierName }}</span>
        <span>{{ activeCustomerName || ('receipt.guest' | translate) }}</span>
      </div>

      <div class="border-b border-dashed border-gray-400 my-2"></div>

      <div class="space-y-2">
        @for (item of items; track item.product_id) {
          <div class="flex justify-between">
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span>{{ (item.quantity * item.sale_price) | currency:'IDR':'Rp. ':'1.0-0' }}</span>
          </div>
        }
      </div>

      <div class="border-b border-dashed border-gray-400 my-2 pt-2"></div>

      <div class="space-y-1">
        <div class="flex justify-between">
          <span>{{ 'receipt.subtotal' | translate }}</span>
          <span>{{ subtotal | number }}</span>
        </div>

        @if (manualDiscount > 0) {
          <div class="flex justify-between italic">
            <span>{{ 'receipt.manualDiscount' | translate }}</span>
            <span>-{{ manualDiscount | number }}</span>
          </div>
        }

        @if (appliedPoints > 0) {
          <div class="flex justify-between text-green-700 italic">
            <span>{{ 'receipt.pointsRedeem' | translate }} ({{ appliedPoints }} pts)</span>
            <span>-{{ (appliedPoints * 100) | number }}</span>
          </div>
        }

        <div class="flex justify-between text-sm font-black pt-2">
          <span>{{ 'receipt.grandTotal' | translate }}</span>
          <span>Rp {{ total | number }}</span>
        </div>
      </div>

      <div class="border-b border-dashed border-gray-400 my-2"></div>

      <div class="space-y-1">
        @for (p of payments; track $index) {
          <div class="flex justify-between uppercase">
            <span>{{ 'receipt.paid' | translate }} [{{ p.payment_method }}]</span>
            <span>{{ p.amount_paid | number }}</span>
          </div>
        }
        @if (change > 0) {
          <div class="flex justify-between font-bold">
            <span>{{ 'receipt.change' | translate }}</span>
            <span>{{ change | number }}</span>
          </div>
        }
      </div>

      <div class="border-b border-dashed border-gray-400 my-2 pt-2"></div>

      <div class="text-center text-[10px] space-y-1 italic">
        @if (activeCustomerName) {
          <p>{{ 'receipt.newBalance' | translate }}: {{ customerNewBalance }} PTS</p>
        }
        <p class="font-bold uppercase mt-2">{{ 'receipt.thankYou' | translate }}</p>
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
  @Input() branch: any = {};
  @Input() cashierName: string = 'Admin';
  @Input() invoiceNo: string = '';
  @Input() appliedPoints: number = 0;
  @Input() manualDiscount: number = 0;
  @Input() customerNewBalance: number = 0;
  @Input() change: number = 0;
  @Input() payments: any[] = [];
  @Input() activeCustomerName: string = '';
  @Input() subtotal: number = 0;
  today = new Date();
}