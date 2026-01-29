// src/app/features/admin/pages/branch-management/branch-management.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService, Branch } from '@/services/branch.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './branch-management.component.html'
})
export class BranchManagementComponent {
  // Injecting our dynamic branch service
  public branchService = inject(BranchService);

  // Local state for UI feedback
  isUpdating = signal(false);

  toggleBranchStatus(branch: Branch) {
    this.isUpdating.set(true);
    // In a real app, you'd call a branchService.update() method here
    // For now, we simulate a toggle
    branch.is_active = !branch.is_active;
    
    // Logic to sync with Laravel would go here
    setTimeout(() => this.isUpdating.set(false), 500);
  }
}