import { EmployeeService } from '@/services/employee.service';
import { BranchService } from '@/services/branch.service';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  employees = signal<any[]>([]);
  showInactive = signal(false);

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees(this.branchService.selectedBranch()?.id).subscribe(employees => {
      this.employees.set(employees);
    });
  }

  filteredEmployees = computed(() => {
    if (!this.employees()) return [];
    return this.employees().filter(e => 
      this.showInactive() ? true : e.status === 'active'
    );
  });

  formData = {
    name: '',
    branch_id: null,
    mobile: '',
    email: '',
    join_date: new Date().toISOString().split('T')[0],
    create_account: false,
    username: '',
    password: '',
    type: 'staff' // 'admin' | 'staff'
  };

  saveEmployee() {
    this.employeeService.createEmployee(this.formData).subscribe(() => {
      this.showDrawer.set(false);
      this.formData = {
        name: '',
        branch_id: null,
        mobile: '',
        email: '',
        join_date: new Date().toISOString().split('T')[0],
        create_account: false,
        username: '',
        password: '',
        type: 'staff'
      };
    });
  }

  confirmOffboard(employee: any) {
    const quitDate = new Date().toISOString().split('T')[0];
    const reason = prompt(`Reason for ${employee.name} leaving?`);

    if (reason !== null) {
      this.employeeService.offboard(employee.id, { quit_date: quitDate, reason })
        .subscribe(() => {
          this.loadEmployees();
          alert('Access has been terminated.');
        });
    }
  }
}