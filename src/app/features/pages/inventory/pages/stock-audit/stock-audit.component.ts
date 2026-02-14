import { Component, inject, signal } from '@angular/core';
import { ReportService } from '@/services/report.service';
import { ProductService } from '@/services/product.service';
import { BranchService } from '@/services/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stock-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './stock-audit.component.html'
})
export class StockAuditComponent {
  private reportService = inject(ReportService);
  private productService = inject(ProductService);
  private branchService = inject(BranchService);

  // Filters
  selectedProduct = signal<number | null>(null);
  selectedBranch = signal<number | null>(null);
  
  // Data
  auditLogs = signal<any[]>([]);
  products = signal<any[]>([]);
  branches = signal<any[]>([]);

  ngOnInit() {
    this.productService.getProducts().subscribe(p => this.products.set(p));
    this.branchService.getBranches().subscribe(b => this.branches.set(b));
  }

  fetchAudit() {
    if (!this.selectedProduct() || !this.selectedBranch()) return;
    
    this.reportService.getStockAudit(this.selectedProduct() || 0, this.selectedBranch() || 0)
      .subscribe(res => this.auditLogs.set(res));
  }
}