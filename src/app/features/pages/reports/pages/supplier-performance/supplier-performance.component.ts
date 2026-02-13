import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReportService } from '@/services/report.service';

@Component({
  selector: 'app-supplier-performance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './supplier-performance.component.html'
})
export class SupplierPerformanceComponent {
  private reportService = inject(ReportService);
  performanceData = signal<any[]>([]);

  ngOnInit() {
    this.reportService.getSupplierPerformance().subscribe(data => {
      // Sort by defect rate descending to highlight problematic suppliers
      this.performanceData.set(data.sort((a, b) => b.defect_rate - a.defect_rate));
    });
  }
}