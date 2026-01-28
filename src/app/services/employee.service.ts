import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  branch_id: number;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/employees`;

  getEmployees(branchId?: number) {
    const url = branchId ? `${this.apiUrl}?branch_id=${branchId}` : this.apiUrl;
    return this.http.get<Employee[]>(url);
  }

  updateEmployee(id: number, data: Partial<Employee>) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}