import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  tax_id: string;
  phone: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseApiService {
  private apiUrl = `${this.baseUrl}/suppliers`;

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createSupplier(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}