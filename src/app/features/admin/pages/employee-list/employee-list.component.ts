import { EmployeeService } from '@/services/employee.service';
import { BranchService } from '@/services/branch.service';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { LucideAngularModule } from "lucide-angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [LucideAngularModule, CommonModule, FormsModule]
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  branchService = inject(BranchService);

  showDrawer = signal(false);
  branches = toSignal(this.branchService.getBranches()); 

  formData = { 
    name: '', 
    email: '', 
    password: '', 
    branch_id: null as number | null, 
    role: 'staff' 
  };

  // Automatically refresh employee list when the branch is switched in the header
  employees = toSignal(
    toObservable(this.branchService.selectedBranch).pipe(
      switchMap(branch => this.employeeService.getEmployees(branch?.id))
    ),
    { initialValue: [] }
  );

  saveEmployee() {
    this.employeeService.createEmployee(this.formData).subscribe(() => {
      this.showDrawer.set(false);
      this.formData = { name: '', email: '', password: '', branch_id: null, role: 'staff' };
    });
  }
}