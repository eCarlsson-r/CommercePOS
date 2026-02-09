// src/app/features/admin/pages/branch-management/branch-management.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService, Branch } from '@/services/branch.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './branch-management.component.html'
})
export class BranchManagementComponent {
  // Injecting our dynamic branch service
  public branchService = inject(BranchService);
  showDrawer = signal(false);
  formData = { name: '', address: '', phone: '', is_active: true };

  ngOnInit() {
    this.branchService.getBranches().subscribe();
  }

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

  saveBranch() {
    this.branchService.createBranch(this.formData).subscribe(() => {
      this.showDrawer.set(false);
      this.resetForm();
    });
  }

  resetForm() {
    this.formData = { name: '', address: '', phone: '', is_active: true };
  }
}