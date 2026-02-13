import { ReportService } from '@/services/report.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-a4',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './sales-a4.component.html',
})
export class SalesA4Component implements OnInit {
  private reportService = inject(ReportService);
  reportData: any;
  branchName = 'Binjai Supermall';
  startDate = '2026-02-01';
  endDate = '2026-02-28';
  today = new Date();

  ngOnInit() {
    this.loadReportData();
  }

  loadReportData() {
    this.reportService.getSalesReport(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.reportData = res;
      },
    });
  }

  printReport() {
    window.print();
  }
}