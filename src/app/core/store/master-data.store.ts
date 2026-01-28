// src/app/core/store/master-data.store.ts
import { Injectable, signal, inject } from '@angular/core';
import { BranchService } from '@/services/branch.service';
import { EmployeeService } from '@/services/employee.service';
import { CategoryService } from '@/services/category.service';
import { SupplierService } from '@/services/supplier.service';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MasterDataStore {
  private branchService = inject(BranchService);
  private employeeService = inject(EmployeeService);
  private categoryService = inject(CategoryService);
  private supplierService = inject(SupplierService);

  // State Signals
  branches = signal<any[]>([]);
  employees = signal<any[]>([]);
  categories = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  isLoaded = signal(false);

  init() {
    // Fetch everything in parallel
    return forkJoin({
      branches: this.branchService.getBranches(),
      employees: this.employeeService.getEmployees(),
      categories: this.categoryService.getCategories(),
      suppliers: this.supplierService.getSuppliers()
    }).subscribe({
      next: (data) => {
        this.branches.set(data.branches);
        this.employees.set(data.employees);
        this.categories.set(data.categories);
        this.suppliers.set(data.suppliers);
        this.isLoaded.set(true);
      }
    });
  }
}