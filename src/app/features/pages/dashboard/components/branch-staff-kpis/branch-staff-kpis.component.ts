import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@/services/auth.service';
import { ReportService } from '@/services/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-staff-kpis',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './branch-staff-kpis.component.html'
})
export class BranchStaffKpisComponent {
  private auth = inject(AuthService);
  private reportService = inject(ReportService);
  private router = inject(Router);

  branchStats = signal({
    todaySales: 0,
    lowStockItems: 0,
    pendingDeliveries: 0,
    pendingReturns: 0
  });

  ngOnInit() {
    const branchId = this.auth.userBranchId();
    if (branchId) {
      this.reportService.getBranchDailySummary(branchId).subscribe(data => {
        this.branchStats.set(data);
      });
    }
  }

  navigateToInventory() {
    this.router.navigate(['/inventory'], { 
      queryParams: { filter: 'low-stock' } 
    });
  }
}