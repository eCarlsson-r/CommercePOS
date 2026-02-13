import { ReportService } from '@/services/report.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { SettingsService } from '@/services/settings.service';

@Component({
  selector: 'app-purchase-a4',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './purchase-a4.component.html',
})
export class PurchaseA4Component {
  private reportService = inject(ReportService);
  private settingsService = inject(SettingsService);
  supplierName = signal<string>('All Suppliers');
  purchaseItems = signal<any[]>([]);
  totalOrders = signal<number>(0);
  totalSpend = signal<number>(0);
  @Input() supplierId: number = 0;
  branchSpend = signal<any[]>([]);
  startDate = signal<string>('');
  endDate = signal<string>('');
  reportDate = new Date();

  generateCostCode(price: number): string {
    const key = this.settingsService.getCipherKey(); // e.g., "REPUBLICAN"
    const digits = price.toString().split('');
    let result = '';
    
    for (let i = 0; i < digits.length; i++) {
      let count = 1;
      // Check if the next digits are the same
      while (i + 1 < digits.length && digits[i] === digits[i + 1]) {
        count++;
        i++;
      }

      const num = parseInt(digits[i]);
      const char = key[num === 0 ? 9 : num - 1];
      
      // If count > 1, append the character then the number of repeats
      result += count > 1 ? char + count : char;
    }
    
    return result;
  }

  resetReport() {
    this.purchaseItems.set([]);
    this.totalOrders.set(0);
    this.totalSpend.set(0);
    this.branchSpend.set([]);
  }

  loadReportData(supplierId: number, startDate: string, endDate: string) {
    this.resetReport();
    this.startDate.set(startDate);
    this.endDate.set(endDate);
    this.reportService.getPurchaseReport(supplierId, startDate, endDate).subscribe({
      next: (res) => {
        res.forEach((purchase: any) => {
          purchase.items.forEach((item: any) => {
            this.purchaseItems.update(items => [...items, {
              id: item.id,
              sku: item.product.sku,
              name: item.product.name,
              purchase_price: item.unit_price || 0,
              quantity: Number(item.quantity)
            }]);
          });

          this.branchSpend.update(branches => {
            const branch = branches.find(b => b.id === purchase.branch_id);
            if (branch) {
              branch.total += Number(purchase.total_amount);
            } else {
              branches.push({
                id: purchase.branch_id,
                name: purchase.branch?.name || 'Unknown Branch',
                total: Number(purchase.total_amount),
              });
            }
            return [...branches]; // Return a new array reference for signal reactivity
          });

          this.totalOrders.update(total => total + 1);
          this.totalSpend.update(total => total + Number(purchase.total_amount));
        });
      },
      complete: () => {
        // Use a timeout to ensure the browser has finished rendering 
        // the new signal data before showing the print dialog
        setTimeout(() => this.printReport(), 500);
      }
    });
  }

  printReport() {
    window.print();
  }
}