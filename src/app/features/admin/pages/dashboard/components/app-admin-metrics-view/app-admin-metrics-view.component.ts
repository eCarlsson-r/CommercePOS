// src/app/features/admin/pages/dashboard/components/admin-metrics-view/admin-metrics-view.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-metrics-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-admin-metrics-view.component.html'
})
export class AdminMetricsViewComponent {
  // Using the new signal-based inputs
  revenue = input.required<number>();
  branchPerformance = input.required<any[]>();
}