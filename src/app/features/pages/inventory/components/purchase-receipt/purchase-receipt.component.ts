import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-receipt',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, TranslateModule],
  templateUrl: './purchase-receipt.component.html'
})
export class PurchaseReceiptComponent {
  selectedPO = input<any>(); // Signal-based input

  get totalItems() {
    return this.selectedPO()?.items?.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) || 0;
  }
}