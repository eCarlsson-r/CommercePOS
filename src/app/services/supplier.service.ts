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

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}