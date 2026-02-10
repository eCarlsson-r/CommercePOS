// src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

// Import our new components
import { StatsGridComponent } from '@/features/admin/pages/dashboard/components/stats-grid/stats-grid.component';
import { RecentSalesComponent } from '@/features/admin/pages/dashboard/components/recent-sales/recent-sales.component';
import { StockAlertComponent } from '@/features/admin/pages/dashboard/components/stock-alert/stock-alert.component';
import { ReportService } from '@/services/report.service';
import { AuthService } from '@/services/auth.service';
import { AdminMetricsViewComponent } from '@/features/admin/pages/dashboard/components/app-admin-metrics-view/app-admin-metrics-view.component';
import { BranchStaffKpisComponent } from '@/features/admin/pages/dashboard/components/branch-staff-kpis/branch-staff-kpis.component';
import { StockService } from '@/services/stock.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    StatsGridComponent,
    RecentSalesComponent,
    StockAlertComponent,
    AdminMetricsViewComponent,
    BranchStaffKpisComponent
  ],
  templateUrl: './dashboard-page.component.html'
})

export class DashboardPageComponent {
  private auth = inject(AuthService);
  private reportService = inject(ReportService);
  private stockService = inject(StockService);
  
  userRole = this.auth.userRole;
  userBranchId = this.auth.userBranchId;

  // Signal to hold revenue data for all 11 branches
  branchPerformance = signal<any[]>([]);
  totalNetworkRevenue = signal(0);
  userBranchName = computed(() => this.auth.currentUser()?.employee?.branch?.name || 'All Branches');

  ngOnInit() {
    this.loadNetworkStats();
  }

  loadNetworkStats() {
    this.reportService.getFinancialOverview().subscribe(data => {
      this.branchPerformance.set(data.branches);
      this.totalNetworkRevenue.set(data.total);
    });
  }
}