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
  editingEmployee = signal(0);
  showInactive = signal(false);
  
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
  
  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees.set(employees);
    });
  }

  filteredEmployees = computed(() => {
    if (!this.employees()) return [];
    return this.employees().filter(e => 
      this.showInactive() ? true : e.status === 'active'
    );
  });

  editEmployee(employee: any) {
    this.editingEmployee.set(employee.id);
    this.formData = {
      name: employee.name,
      branch_id: employee.branch_id,
      mobile: employee.phone,
      email: employee.email,
      join_date: employee.join_date,
      create_account: false,
      username: '',
      password: '',
      type: employee.type // 'admin' | 'staff'
    };
    this.showDrawer.set(true);
    // Smoothly scroll to the form if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
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
    this.editingEmployee.set(0);
  }

  saveEmployee() {
    const obs$ = this.editingEmployee() > 0
      ? this.employeeService.updateEmployee(this.editingEmployee(), this.formData)
      : this.employeeService.createEmployee(this.formData);

    obs$.subscribe(() => {
      this.cancelEdit();     // Clear form
      this.loadEmployees(); // Refresh list
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