import { ReportService } from '@/services/report.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { SettingsService } from '@/services/settings.service';
import { generateCostCode } from '@/utils/number';

@Component({
  selector: 'app-sales-a4',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './sales-a4.component.html',
})
export class SalesA4Component {
  private reportService = inject(ReportService);
  private settingsService = inject(SettingsService);
  branchName = signal<string>('All Branches');
  employeeName = signal<string>('All Employees');
  salesItems = signal<any[]>([]);
  totalQty = signal<number>(0);
  grandTotal = signal<number>(0);
  @Input() branchId: number = 0;
  @Input() employeeId: number = 0;
  startDate = signal<string>('');
  endDate = signal<string>('');
  reportDate = new Date();

  generateCostCode(price: number): string {
    return generateCostCode(price, this.settingsService);
  }

  resetReport() {
    this.salesItems.set([]);
    this.totalQty.set(0);
    this.grandTotal.set(0);
  }

  loadReportData(branchId: number, employeeId: number, startDate: string, endDate: string) {
    this.resetReport();
    this.startDate.set(startDate);
    this.endDate.set(endDate);
    this.reportService.getSalesReport(branchId, employeeId, startDate, endDate).subscribe({
      next: (res) => {
        res.forEach((sales: any) => {
          sales.items.forEach((item: any) => {
            this.salesItems.update(items => [...items, {
              id: item.id,
              sku: item.product.sku,
              name: item.product.name,
              purchase_price: item.purchase_price || 0,
              sale_price: Number(item.sale_price),
              quantity: Number(item.quantity),
              employee_name: sales.employee.name,
            }]);
            this.totalQty.update(q => q + Number(item.quantity));
          });
          this.grandTotal.update(total => total + Number(sales.grand_total));
        });
      }
    });
  }

  printReport() {
    window.print();
  }
}