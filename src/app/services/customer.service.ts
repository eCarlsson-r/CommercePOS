// src/app/core/services/customer.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Customer } from '@/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  getCustomers() {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // Search by phone is essential for quick POS checkout
  findCustomer(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?q=${query}`);
  }

  createCustomer(data: Partial<Customer>) {
    return this.http.post<Customer>(this.apiUrl, data);
  }

  getHistory(customerId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${customerId}/history`);
  }
}