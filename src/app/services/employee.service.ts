import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Employee } from '@/models/employee.model';

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
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  offboard(id: number, data: { quit_date: string; reason: string }) {
    return this.http.put(`${this.apiUrl}/${id}/offboard`, data, { headers: this.getHeaders() });
  }
}