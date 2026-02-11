// src/app/features/admin/pages/inventory/pages/stock-matrix/stock-matrix.component.ts
import { ReportService } from '@/services/report.service'; // Adjust path as needed
import { SumStockPipe } from '@/shared/pipes/sum-stock.pipe';
import { inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock-matrix',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SumStockPipe],
  templateUrl: './stock-matrix.component.html'
})
export class StockMatrixComponent implements OnInit {
  private reportService = inject(ReportService); // Use your service here
  
  products = signal<any[]>([]);
  branches = signal<any[]>([]);
  isLoading = signal(true);
  
  ngOnInit() {
    this.loadMatrix();
  }
  

  loadMatrix() {
    this.isLoading.set(true);
    this.reportService.getInventoryMatrix().subscribe({
      next: (data: any) => {
        this.products.set(data);
        
        // Extract branches from the nested data
        const branchMap = new Map();
        data.forEach((p: any) => {
          p.stocks.forEach((s: any) => {
            branchMap.set(s.branch.id, s.branch.name);
          });
        });
        
        this.branches.set(
          Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }))
        );
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // Helper to find stock for a specific product at a specific branch
  getStock(product: any, branchId: number): number {
    const stock = product.stocks.find((s: any) => s.branch_id === branchId);
    return stock ? stock.quantity : 0;
  }

  exportToExcel() {
    // 1. Prepare the data rows
    const exportData = this.products().map(product => {
      const row: any = {
        'Product Name': product.name,
        'SKU': product.code,
        'Category': product.category?.name
      };

      // Create a column for every branch
      this.branches().forEach(branch => {
        row[branch.name] = this.getStock(product, branch.id);
      });

      return row;
    });

    // 2. Generate Worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Network Stock Matrix');

    // 3. Save File
    XLSX.writeFile(wb, `Stock_Matrix_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}       