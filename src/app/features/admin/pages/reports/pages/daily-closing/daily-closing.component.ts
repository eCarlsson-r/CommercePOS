// src/app/features/admin/pages/reports/pages/daily-closing/daily-closing.component.ts
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, EODReport } from '../../../../../../services/report.service';
import { BranchService } from '../../../../../../services/branch.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-daily-closing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './daily-closing.component.html'
})
export class DailyClosingComponent {
  private reportService = inject(ReportService);
  private branchService = inject(BranchService);

  // State
  report = signal<EODReport | null>(null);
  isLoading = signal(false);
  currentDate = signal(new Date().toISOString().split('T')[0]); // Default to today

  constructor() {
    // Automatically re-fetch report when the branch is switched in the sidebar/header
    effect(() => {
      const branchId = this.branchService.selectedBranchId();
      if (branchId) {
        this.fetchReport(branchId, this.currentDate());
      }
    });
  }

  async fetchReport(branchId: number, date: string) {
    this.isLoading.set(true);
    this.reportService.getClosingReport(branchId, date).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch EOD report', err);
        this.isLoading.set(false);
      }
    });
  }

  printReport() {
    window.print();
  }

  exportPDF() {
    // Logic for generating PDF (using libraries like jspdf or calling a Laravel PDF route)
    console.log('Exporting PDF for:', this.report()?.branch_name);
  }
}