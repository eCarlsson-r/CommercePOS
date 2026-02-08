// src/app/features/admin/pages/reports/pages/daily-closing/daily-closing.component.ts
import { Component, inject, signal } from '@angular/core';
import { ReportService } from '@/services/report.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-daily-closing',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './daily-closing.component.html'
})
export class DailyClosingComponent {
  private reportService = inject(ReportService);

  selectedBranch = signal(1); // Default to current branch
  selectedDate = signal(new Date().toISOString().split('T')[0]);
  reportData = signal<any>(null);

  fetchReport() {
    this.reportService.getClosingReport(this.selectedBranch(), this.selectedDate())
      .subscribe(data => this.reportData.set(data));
  }

  printReport() {
    window.print(); // Traditional POS thermal printer support
  }
}