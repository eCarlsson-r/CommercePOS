// src/app/features/dashboard/pages/dashboard-page/dashboard-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

// Import our new components
import { StatsGridComponent } from '@/features/dashboard/components/stats-grid/stats-grid.component';
import { RecentSalesComponent } from '@/features/dashboard/components/recent-sales/recent-sales.component';
import { StockAlertComponent } from '@/features/dashboard/components/stock-alert/stock-alert.component';

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
export class DashboardPageComponent {}