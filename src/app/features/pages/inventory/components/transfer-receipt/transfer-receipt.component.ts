import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-receipt',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './transfer-receipt.component.html'
})
export class TransferReceiptComponent {
  selectedTransfer = input<any>(); // Signal-based input

  get totalItems() {
    console.info(this.selectedTransfer());
    return this.selectedTransfer()?.items?.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) || 0;
  }
}