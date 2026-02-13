// src/app/features/pages/branch-management/branch-management.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '@/services/branch.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Branch } from '@/models/branch.model';

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
  action = signal("Create");
  formData = { name: '', address: '', phone: '', is_active: true };

  ngOnInit() {
    this.branchService.getBranches().subscribe();
  }

  // Local state for UI feedback
  isUpdating = signal(false);
  editingBranch = signal(0);

  toggleBranchStatus(branch: Branch) {
    this.isUpdating.set(true);
    // In a real app, you'd call a branchService.update() method here
    // For now, we simulate a toggle
    branch.is_active = !branch.is_active;
    
    // Logic to sync with Laravel would go here
    setTimeout(() => this.isUpdating.set(false), 500);
  }

  editBranch(branch: any) {
    this.action.set("Update");
    this.editingBranch.set(branch.id);
    this.formData = {
      name: branch.name,
      phone: branch.phone,
      address: branch.address,
      is_active: branch.is_active,
    };
    this.showDrawer.set(true);
    // Smoothly scroll to the form if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.showDrawer.set(false);
    this.action.set("Create");
    this.formData = { name: '', address: '', phone: '', is_active: true };
    this.editingBranch.set(0);
  }

  saveBranch() {
    const obs$ = this.editingBranch() > 0
      ? this.branchService.updateBranch(this.editingBranch(), this.formData)
      : this.branchService.createBranch(this.formData);

    obs$.subscribe(() => this.cancelEdit);
  }
}