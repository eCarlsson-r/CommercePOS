import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Supplier } from '@/models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/suppliers`;

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createSupplier(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateSupplier(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}