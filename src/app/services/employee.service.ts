import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  branch_id: number;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/employees`;

  getEmployees(branchId?: number) {
    const url = branchId ? `${this.apiUrl}?branch_id=${branchId}` : this.apiUrl;
    return this.http.get<Employee[]>(url, { headers: this.getHeaders() });
  }

  createEmployee(data: Partial<Employee>) {
    return this.http.post<Employee>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateEmployee(id: number, data: Partial<Employee>) {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }
}