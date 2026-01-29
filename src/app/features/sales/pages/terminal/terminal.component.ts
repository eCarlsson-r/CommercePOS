import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesFormComponent } from '../../components/sales-form/sales-form.component';
import { BranchService } from '@/services/branch.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, SalesFormComponent, LucideAngularModule],
  templateUrl: './terminal.component.html'
})
export class TerminalComponent {
  public branchService = inject(BranchService);
  
  // Terminal-specific states (e.g., Fullscreen mode, Shift status)
  isShiftOpen = signal(true);
  
  // Logic to handle "End of Sale" from the child sales-form
  onSaleComplete(event: any) {
    console.log('Sale processed for branch:', this.branchService.selectedBranchId());
    // Trigger receipt printing or reset form
    this.isShiftOpen.set(false);
  }
}