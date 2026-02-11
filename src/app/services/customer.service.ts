// src/app/core/services/customer.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Customer } from '@/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/customers`;

  getCustomers() {
    return this.http.get<Customer[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Search by mobile is essential for quick POS checkout
  findCustomer(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?q=${query}`, { headers: this.getHeaders() });
  }

  createCustomer(data: Partial<Customer>) {
    return this.http.post<Customer>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  getHistory(customerId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${customerId}/history`, { headers: this.getHeaders() });
  }
}