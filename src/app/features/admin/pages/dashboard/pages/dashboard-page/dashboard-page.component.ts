// src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

// Import our new components
import { StatsGridComponent } from '@/features/admin/pages/dashboard/components/stats-grid/stats-grid.component';
import { RecentSalesComponent } from '@/features/admin/pages/dashboard/components/recent-sales/recent-sales.component';
import { StockAlertComponent } from '@/features/admin/pages/dashboard/components/stock-alert/stock-alert.component';
import { ReportService } from '@/services/report.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    StatsGridComponent,
    RecentSalesComponent,
    StockAlertComponent
  ],
  templateUrl: './dashboard-page.component.html'
})

export class DashboardPageComponent {
  private reportService = inject(ReportService);
  
  // Signal to hold revenue data for all 11 branches
  branchPerformance = signal<any[]>([]);
  totalNetworkRevenue = signal(0);

  ngOnInit() {
    this.loadNetworkStats();
  }

  loadNetworkStats() {
    // In a real app, you'd have an endpoint like getNetworkOverview()
    this.reportService.getNetworkOverview().subscribe(data => {
      this.branchPerformance.set(data.branches);
      this.totalNetworkRevenue.set(data.total);
    });
  }
}